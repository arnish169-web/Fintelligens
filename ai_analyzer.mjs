import OpenAI from 'openai';
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function analyzeProperty(data) {
  if (process.env.USE_REAL_AI !== 'true') return mockAnalysis(data);

  const prompt = `Du er en norsk byggsakkyndig og eiendomsanalytiker. 
  Analyser denne boligen med fokus på tilstand:
  
  DATA:
  Tittel: ${data.title}
  TG-status: ${data.tg_summary}
  Beskrivelse: ${data.description}
  Totalpris: ${data.total_price} kr

  OPPGAVE:
  1. Hvis det er TG3, er dette kritiske feil (røde flagg).
  2. Hvis det er mange TG2, vurder om prisen bør prutes ned.
  3. Gi en investeringsscore basert på forholdet mellom pris og teknisk tilstand.

  Svar med JSON:
  {
    "summary": "kort teknisk vurdering",
    "estimated_market_price": tall,
    "red_flags": ["spesifikk TG-feil her"],
    "investment_score": 0-100,
    "suggested_bid_strategy": "strategi basert på TG-feilene"
  }`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    response_format: { type: "json_object" }
  });

  return JSON.parse(response.choices[0].message.content);
}
