import { chromium } from 'playwright';

export async function extractFinnAd(url) {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  try {
    console.log("🕸️ Starter smart skraping av Finn.no...");
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
    
    // Lukker cookie-boks
    try {
      const cookieButton = page.locator('button:has-text("Godta alle"), button:has-text("OK")');
      if (await cookieButton.isVisible()) await cookieButton.click();
    } catch (e) {}

    // SMART AREAL-SJEKK: Vi leter etter alle mulige merkelapper Finn bruker
    const areaLabels = ["Bruksareal", "Internt bruksareal", "P-rom", "Primærrom", "BRA", "BRA-i"];
    let foundArea = "0";

    for (const label of areaLabels) {
      try {
        // Vi leter etter en merkelapp (dt) som inneholder ordet, og henter verdien (dd) ved siden av
        const text = await page.locator(`dt:has-text("${label}") + dd`).first().innerText();
        if (text && text.length > 0) {
          foundArea = text.replace(/[^0-9]/g, ''); // Beholder bare tallene
          if (parseInt(foundArea) > 0) {
            console.log(`✅ Fant areal (${label}): ${foundArea} m²`);
            break; // Vi fant det!
          }
        }
      } catch (e) {}
    }

    const data = {
      url: url,
      title: await page.locator('h1').first().innerText().catch(() => 'Boligannonse'),
      price_asking: await extractValue(page, ["Prisantydning", "Totalpris", "Pris"]),
      total_price: await extractValue(page, ["Totalpris", "Prisantydning"]),
      area: foundArea,
      type: await extractSpec(page, "Boligtype"),
      description: await page.locator('section[aria-label="Beskrivelse"], .import-decoration, #description').innerText().catch(() => ''),
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

async function extractSpec(page, label) {
  try {
    return await page.locator(`dt:has-text("${label}") + dd`).first().innerText();
  } catch (e) {
    return "Ikke oppgitt";
  }
}
