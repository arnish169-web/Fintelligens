function mockAnalysis(data) {
  return {
    summary: "Dette er en test-oppsummering for " + (data.title || "boligen") + ". For ekte analyse, legg inn OpenAI-nøkkel.",
    estimated_market_price: data.total_price || 5000000,
    price_confidence: 0.8,
    red_flags: [
      { type: "demo", description: "Dette er et eksempel på et rødt flagg." },
      { type: "demo", description: "Boligen ser fin ut i denne testen." }
    ],
    investment_score: 75,
    pros: ["Bra beliggenhet", "Mye lys"],
    cons: ["Litt dyr", "Trenger maling"],
    suggested_bid_strategy: "By litt under prisantydning i starten."
  };
}
