import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function analyzeProperty(data) {
  if (process.env.USE_REAL_AI !== 'true') {
    return mockAnalysis(data);
  }

  const prompt = `Du er en norsk eiendomsekspert. Analyser denne boligen:
    Tittel: ${data.title}
    Pris: ${data.total_price} kr
    Areal: ${data.area}
    Beskrivelse: ${data.description}
    
    Svar med JSON: { "summary": "...", "estimated_market_price": 0, "red_flags": [], "investment_score": 0-100 }`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [{ role: "user", content: prompt }],
    response_format: { type: "json_object" }
  });

  return JSON.parse(response.choices[0].message.content);
}

function mockAnalysis(data) {
  return {
    summary: "Dette er en demovurdering. Aktiver OpenAI for ekte analyse.",
    estimated_market_price: data.total_price,
    red_flags: ["Demo-modus: Ingen ekte sjekk utført"],
    investment_score: 50
  };
}
