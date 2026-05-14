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
  if (!url) return res.status(400).json({ error: 'URL mangler' });

  try {
    // 1. LYNKJAPP SJEKK: Har vi gjort dette før?
    const cached = await getExistingAnalysis(url);
    if (cached) {
      console.log("🚀 Bruker lagret analyse");
      return res.json(cached);
    }

    // 2. Hvis ikke, kjør full analyse
    console.log("🔍 Ny analyse starter...");
    const propertyData = await extractFinnAd(url);
    const analysis = await analyzeProperty(propertyData);
    
    // Send svar til brukeren med en gang
    res.json({ property: propertyData, analysis });
    
    // Lagre til DB i bakgrunnen (brukeren slipper å vente)
    saveToDatabase(propertyData, analysis);

  } catch (error) {
    console.error('Analyse feilet:', error.message);
    res.status(500).json({ error: 'Kunne ikke analysere boligen' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => console.log(`Server kjører på port ${PORT}`));
