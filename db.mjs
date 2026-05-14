import { createClient } from '@supabase/supabase-js';
import ws from 'ws';

const supabase = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_ANON_KEY || '',
  {
    auth: { persistSession: false },
    global: { fetch: (...args) => fetch(...args) }
  }
);

// Funksjon for å sjekke om vi allerede har analysert boligen (HURTIG-MODUS)
export async function getExistingAnalysis(url) {
  try {
    const { data, error } = await supabase
      .from('properties')
      .select('*, analyses(*)')
      .eq('url', url)
      .single();
    
    if (data && data.analyses && data.analyses.length > 0) {
      console.log("🚀 Fant lagret analyse – hopper over skraping!");
      return { property: data, analysis: data.analyses[0] };
    }
  } catch (e) {}
  return null;
}

export async function saveToDatabase(property, analysis) {
  try {
    const { data: prop } = await supabase
      .from('properties')
      .upsert({ url: property.url, title: property.title, raw_data: property }, { onConflict: 'url' })
      .select().single();

    if (prop) {
      await supabase.from('analyses').insert({
        property_id: prop.id,
        summary: analysis.summary,
        estimated_market_price: analysis.estimated_market_price,
        red_flags: analysis.red_flags,
        investment_score: analysis.investment_score
      });
    }
  } catch (err) { console.error('DB lagring feilet:', err.message); }
}
