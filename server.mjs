import express from 'express';
import cors from 'cors';
import { extractFinnAd } from './extractor.mjs';
import { analyzeProperty } from './ai_analyzer.mjs';
import { saveToDatabase, getExistingAnalysis } from './db.mjs';

const app = express();
app.use(cors());
app.use(express.json());

app.post('/analyze', async (req, res) => {
  const { url } = req.body;
  
  // 1. Sjekk om vi har den fra før (tar < 1 sek!)
  const cached = await getExistingAnalysis(url);
  if (cached) return res.json(cached);

  try {
    // 2. Hvis ikke, gjør den tunge jobben
    const propertyData = await extractFinnAd(url);
    const analysis = await analyzeProperty(propertyData);
    
    // Send svar med en gang (ikke vent på lagring)
    res.json({ property: propertyData, analysis });
    
    // Lagre i bakgrunnen
    saveToDatabase(propertyData, analysis);
  } catch (error) {
    res.status(500).json({ error: 'Feilet' });
  }
});

app.listen(process.env.PORT || 3000, '0.0.0.0');
