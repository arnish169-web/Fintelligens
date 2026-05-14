import express from 'express';
import cors from 'cors';
import { extractFinnAd } from './extractor.mjs';
import { analyzeProperty } from './ai_analyzer.mjs';
import { saveToDatabase } from './db.mjs';

const app = express();
app.use(cors()); // Dette åpner døren for Chrome-utvidelsen din
app.use(express.json());

app.post('/analyze', async (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: 'URL is required' });

  try {
    console.log(`Analyzing: ${url}`);
    const propertyData = await extractFinnAd(url);
    const analysis = await analyzeProperty(propertyData);
    await saveToDatabase(propertyData, analysis);
    res.json({ property: propertyData, analysis });
  } catch (error) {
    console.error('Analysis failed:', error);
    res.status(500).json({ error: 'Failed to analyze property' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT}`));
