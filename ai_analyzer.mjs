import OpenAI from 'openai';
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function analyzeProperty(data) {
  if (process.env.USE_REAL_AI !== 'true') return mockAnalysis(data);

  try {
    const prompt = `Du er en norsk eiendomsekspert. Analyser denne boligen:
      Tittel: ${data.title}
      Adresse: ${data.address}
      Totalpris: ${data.total_price} kr
      Areal: ${data.area} m2
      Nabolagshistorikk: ${data.neighborhood_history}
      Beskrivelse: ${data.description}
      
      OPPGAVE: 
      1. Vurder om prisen er god sammenlignet med nabolagshistorikken.
      2. Gi en konkret budstrategi (f.eks "By 200k under").
      
      Svar med JSON: 
      { 
        "summary": "kort vurdering", 
        "estimated_market_price": tall, 
        "red_flags": ["flagg"], 
        "investment_score": 0-100,
        "suggested_bid_strategy": "Veldig spesifikk strategi basert på pris og historikk"
      }`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" }
    });

    return JSON.parse(response.choices[0].message.content);
  } catch (error) {
    return mockAnalysis(data);
  }
}

function mockAnalysis(data) {
  return { summary: "Test", estimated_market_price: 5000000, red_flags: [], investment_score: 70, suggested_bid_strategy: "By under." };
}
