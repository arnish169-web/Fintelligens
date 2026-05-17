import OpenAI from 'openai';
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function analyzeProperty(data) {
  if (process.env.USE_REAL_AI !== 'true') return mockAnalysis(data);

  const prompt = `Du er en norsk eiendomsekspert. 
  Analyser denne boligen og gi en komplett vurdering.
  
  DATA:
  Tittel: ${data.title}
  TG-Telling: TG1: ${data.tg_counts.tg1}, TG2: ${data.tg_counts.tg2}, TG3: ${data.tg_counts.tg3}
  Beskrivelse: ${data.description}
  Totalpris: ${data.total_price} kr

  Svar med JSON:
  {
    "summary": "kort oppsummering",
    "estimated_market_price": tall,
    "red_flags": ["flagg"],
    "investment_score": 0-100,
    "suggested_bid_strategy": "detaljert strategi",
    "tg_report": { "tg1": ${data.tg_counts.tg1}, "tg2": ${data.tg_counts.tg2}, "tg3": ${data.tg_counts.tg3} }
  }`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    response_format: { type: "json_object" }
  });

  return JSON.parse(response.choices[0].message.content);
}
