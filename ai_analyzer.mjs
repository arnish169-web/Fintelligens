import OpenAI from 'openai';
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function analyzeProperty(data) {
  if (process.env.USE_REAL_AI !== 'true') return mockAnalysis(data);

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini", // MYE RASKERE!
      messages: [{ role: "user", content: `Analyser bolig: ${JSON.stringify(data)}. Svar med JSON: { "summary": "...", "estimated_market_price": 0, "red_flags": [], "investment_score": 0-100 }` }],
      response_format: { type: "json_object" }
    });
    return JSON.parse(response.choices[0].message.content);
  } catch (error) {
    return mockAnalysis(data);
  }
}

function mockAnalysis(data) {
  return { summary: "Test", estimated_market_price: 0, red_flags: [], investment_score: 50 };
}
