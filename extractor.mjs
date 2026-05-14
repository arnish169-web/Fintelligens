import { chromium } from 'playwright';

export async function extractFinnAd(url) {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  try {
    console.log("🕸️ Skraper Finn.no...");
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
    
    // Lukker cookie-boks hvis den dukker opp
    try {
      const cookieButton = page.locator('button:has-text("Godta alle"), button:has-text("OK")');
      if (await cookieButton.isVisible()) await cookieButton.click();
    } catch (e) {}

    const data = {
      url: url,
      title: await page.locator('h1').first().innerText().catch(() => 'Boligannonse'),
      price_asking: await extractValue(page, ["Prisantydning", "Totalpris"]),
      total_price: await extractValue(page, ["Totalpris", "Prisantydning"]),
      area: await extractValue(page, ["Bruksareal", "Primærrom", "m²"]),
      type: await extractSpec(page, "Boligtype"),
      description: await page.locator('section[aria-label="Beskrivelse"], .import-decoration').innerText().catch(() => ''),
      images: []
    };

    console.log(`📊 Funnet data: ${data.title}, Pris: ${data.total_price}, Areal: ${data.area}`);
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

async function extractSpec(page, label) {
  try {
    return await page.locator(`dt:has-text("${label}") + dd`).first().innerText();
  } catch (e) {
    return "Ikke oppgitt";
  }
}
