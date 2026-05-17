import { chromium } from 'playwright';

export async function extractFinnAd(url) {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  try {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
    
    // Finn adresse og beskrivelse
    const address = await page.locator('h1 + p, [data-testid="ad-location"]').first().innerText().catch(() => '');
    const description = await page.locator('section[aria-label="Beskrivelse"]').innerText().catch(() => '');
    const pageContent = await page.content();

    // NØYAKTIG TELLING AV TG (Regex som fanger TG1, TG 1, Tilstandsgrad 1 osv)
    const countTG = (grade) => {
      const regex = new RegExp(`(TG|Tilstandsgrad)\\s?${grade}`, 'gi');
      return (pageContent.match(regex) || []).length;
    };

    const tgData = {
      tg1: countTG(1),
      tg2: countTG(2),
      tg3: countTG(3)
    };

    const data = {
      url,
      address,
      title: await page.locator('h1').first().innerText().catch(() => 'Bolig'),
      total_price: await extractValue(page, ["Totalpris", "Prisantydning"]),
      area: await extractValue(page, ["Bruksareal", "Primærrom"]),
      description: description,
      tg_counts: tgData // Sender tallene til AI-en
    };

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
