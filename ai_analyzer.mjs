import OpenAI from 'openai';

const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || 'no-key' 
});

export async function analyzeProperty(data) {
  // Sjekker om vi skal bruke ekte AI eller bare test-data
  if (process.env.USE_REAL_AI !== 'true') {
    return mockAnalysis(data);
  }

  try {
    const prompt = `Du er en norsk eiendomsekspert. Analyser denne boligen:
      Tittel: ${data.title}
      Pris: ${data.total_price} kr
      Areal: ${data.area}
      Beskrivelse: ${data.description}
      
      Svar med JSON: { 
        "summary": "2-3 setninger om boligen", 
        "estimated_market_price": tall, 
        "price_confidence": 0.0-1.0,
        "red_flags": ["flagg 1", "flagg 2"], 
        "investment_score": 0-100 
      }`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" }
    });

    return JSON.parse(response.choices[0].message.content);
  } catch (error) {
    console.error("AI Analysis failed, falling back to mock:", error.message);
    return mockAnalysis(data);
  }
}

function mockAnalysis(data) {
  return {
    summary: "Dette er en test-analyse for " + (data.title || "denne boligen") + ". For ekte AI-analyse må du legge inn en OpenAI-nøkkel i Render.",
    estimated_market_price: data.total_price || 0,
    price_confidence: 0.9,
    red_flags: [
      "DEMO: Ingen ekte sjekk utført ennå",
      "Sjekk alltid tilstandsrapporten selv"
    ],
    investment_score: 80
  };
}
