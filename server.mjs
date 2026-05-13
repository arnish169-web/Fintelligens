import express from 'express';
import { extractFinnAd } from './extractor.mjs';
import { analyzeProperty } from './ai_analyzer.mjs';
import { saveToDatabase } from './db.mjs';

const app = express();
app.use(express.json());

app.post('/analyze', async (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: 'URL is required' });

  try {
    console.log(`Analyzing: ${url}`);
    
    // 1. Skrap data fra Finn.no
    const propertyData = await extractFinnAd(url);
    
    // 2. Kjør AI-analyse
    const analysis = await analyzeProperty(propertyData);
    
    // 3. Lagre i Supabase (valgfritt)
    await saveToDatabase(propertyData, analysis);
    
    // 4. Send svar tilbake til Extension
    res.json({ property: propertyData, analysis });
  } catch (error) {
    console.error('Analysis failed:', error);
    res.status(500).json({ error: 'Failed to analyze property' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
