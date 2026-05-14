import { chromium } from 'playwright';

export async function extractFinnAd(url) {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  try {
    console.log("🕸️ Starter avansert skraping...");
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
    
    // Håndter cookie-boks
    try {
      await page.locator('button:has-text("Godta alle"), button:has-text("OK")').first().click({timeout: 2000});
    } catch (e) {}

    // 1. Hent grunnleggende info fra Finn
    const address = await page.locator('h1 + p, [data-testid="ad-location"]').first().innerText().catch(() => '');
    const title = await page.locator('h1').first().innerText().catch(() => 'Boligannonse');
    const totalPrice = await extractValue(page, ["Totalpris", "Prisantydning"]);
    const area = await extractValue(page, ["Bruksareal", "Primærrom", "BRA-i"]);
    const description = await page.locator('section[aria-label="Beskrivelse"]').innerText().catch(() => '');

    // 2. SMART-FUNKSJON: Finn siste salg i nabolaget (Sjekker Virdi i bakgrunnen)
    let neighborhoodData = "Ingen historiske salgsdata funnet akkurat nå.";
    try {
        console.log(`🔍 Sjekker salgshistorikk for: ${address}`);
        const virdiUrl = `https://www.virdi.no/bolig/${address.replace(/\s+/g, '-')}`;
        const virdiPage = await browser.newPage();
        await virdiPage.goto(virdiUrl, { waitUntil: 'domcontentloaded', timeout: 5000 }).catch(() => {});
        
        // Vi prøver å finne estimert verdi eller siste salgspris på Virdi
        const virdiEstimate = await virdiPage.locator('text=/Verdivurdering|Siste salg/i').first().innerText().catch(() => '');
        if (virdiEstimate) {
            neighborhoodData = `Basert på markedshistorikk for ${address}: ${virdiEstimate}`;
        }
        await virdiPage.close();
    } catch (e) {
        console.log("Nabolagsdata-oppslag feilet (hoppes over)");
    }

    const data = {
      url: url,
      address: address,
      title: title,
      total_price: totalPrice,
      area: area,
      description: description,
      neighborhood_history: neighborhoodData // Vi sender dette til AI-en!
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
