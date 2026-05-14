import { chromium } from 'playwright';

export async function extractFinnAd(url) {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  try {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
    
    // Lukker cookie-boks
    try {
      const cookieButton = page.locator('button:has-text("Godta alle"), button:has-text("OK")');
      if (await cookieButton.isVisible()) await cookieButton.click();
    } catch (e) {}

    // Henter adresse (Viktig for Kartverket-oppslag senere)
    const address = await page.locator('h1 + p, [data-testid="ad-location"]').first().innerText().catch(() => '');

    const data = {
      url: url,
      address: address,
      title: await page.locator('h1').first().innerText().catch(() => 'Boligannonse'),
      price_asking: await extractValue(page, ["Prisantydning", "Totalpris"]),
      total_price: await extractValue(page, ["Totalpris", "Prisantydning"]),
      area: await extractValue(page, ["Bruksareal", "Primærrom", "BRA-i"]),
      description: await page.locator('section[aria-label="Beskrivelse"], .import-decoration').innerText().catch(() => ''),
    };

    console.log(`🏠 Adresse funnet: ${address}`);
    return data;
  } finally {
    await browser.close();
  }
}

async function extractValue(page, labels) {
  for (const label of labels) {
    try {
      const text = await page.locator(`dt:has-text("${label}") + dd`).first().innerText();
      if (text) return text.replace(/[^0-9]/g, '');
    } catch (e) {}
  }
  return "0";
}
