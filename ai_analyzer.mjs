import OpenAI from 'openai';
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function analyzeProperty(data) {
  if (process.env.USE_REAL_AI !== 'true') return mockAnalysis(data);

  try {
    const prompt = `Du er en kynisk og profesjonell norsk eiendomsinvestor. 
    Analyser denne boligen og gi en strategi som sparer kjøperen for mest mulig penger.

    DATA:
    Tittel: ${data.title}
    Adresse: ${data.address}
    Totalpris: ${data.total_price} kr
    Areal: ${data.area} m2
    Historikk i området: ${data.neighborhood_history}
    Beskrivelse: ${data.description}

    DIN OPPGAVE:
    1. Vurder om boligen er overpriset basert på m2-pris og nabolagsdata.
    2. Finn svakheter (mange dager på markedet, oppussingsbehov, fellesgjeld).
    3. Gi en UNIK budstrategi basert på om det er "kjøpers" eller "selgers" marked for denne boligen.
    
    Svar med JSON: 
    { 
      "summary": "Kort og ærlig vurdering", 
      "estimated_market_price": tall, 
      "red_flags": ["spesifikk ting 1", "spesifikk ting 2"], 
      "investment_score": 0-100,
      "suggested_bid_strategy": "En detaljert plan (f.eks: 'Is i magen, boligen har ligget lenge. Start 400k under og øk med små steg.')"
    }`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" }
    });

    const result = JSON.parse(response.choices[0].message.content);
    return result;

  } catch (error) {
    console.error("AI-feil:", error.message);
    return mockAnalysis(data);
  }
}

function mockAnalysis(data) {
  return { 
    summary: "Boligen virker ok, men vi trenger OpenAI for full analyse.", 
    estimated_market_price: data.total_price, 
    red_flags: ["Kunne ikke sjekke detaljer"], 
    investment_score: 50, 
    suggested_bid_strategy: "Vær forsiktig i budrunden." 
  };
}
