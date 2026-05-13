import { chromium } from 'playwright';

export async function extractFinnAd(url) {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  try {
    await page.goto(url, { waitUntil: 'domcontentloaded' });
    
    // Håndter cookie-samtykke
    const cookieButton = await page.getByRole('button', { name: /Godta alle/i }).or(page.getByRole('button', { name: /OK/i }));
    if (await cookieButton.isVisible()) await cookieButton.click();

    const data = {
      title: await page.locator('h1').first().innerText().catch(() => 'Ingen tittel'),
      price_asking: await extractPrice(page, 'Prisantydning'),
      total_price: await extractPrice(page, 'Totalpris'),
      area: await extractSpec(page, 'Bruksareal'),
      type: await extractSpec(page, 'Boligtype'),
      description: await page.locator('section[aria-label="Beskrivelse"]').innerText().catch(() => ''),
      images: await page.locator('img[src*="finncdn"]').evaluateAll(imgs => imgs.map(img => img.src).slice(0, 5))
    };

    return data;
  } finally {
    await browser.close();
  }
}

async function extractPrice(page, label) {
  const text = await page.locator(`dt:has-text("${label}") + dd`).innerText().catch(() => '0');
  return parseFloat(text.replace(/[^0-9]/g, '')) || 0;
}

async function extractSpec(page, label) {
  return await page.locator(`dt:has-text("${label}") + dd`).innerText().catch(() => 'Ikke oppgitt');
}
