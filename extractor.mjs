import { chromium } from 'playwright';

export async function extractFinnAd(url) {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  try {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
    
    // Grunnleggende data
    const address = await page.locator('h1 + p, [data-testid="ad-location"]').first().innerText().catch(() => '');
    const description = await page.locator('section[aria-label="Beskrivelse"]').innerText().catch(() => '');
    const pageContent = await page.content();

    // TG-SJEKK (Søker etter Tilstandsgrader i hele teksten)
    const tg2_count = (pageContent.match(/TG\s?2|Tilstandsgrad\s?2/gi) || []).length;
    const tg3_count = (pageContent.match(/TG\s?3|Tilstandsgrad\s?3/gi) || []).length;

    const data = {
      url,
      address,
      title: await page.locator('h1').first().innerText().catch(() => 'Bolig'),
      total_price: await extractValue(page, ["Totalpris", "Prisantydning"]),
      area: await extractValue(page, ["Bruksareal", "Primærrom"]),
      description: description,
      tg_summary: `Funnet ${tg2_count} stk TG2 og ${tg3_count} stk TG3 i annonsen.`
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
