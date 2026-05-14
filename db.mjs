import { createClient } from '@supabase/supabase-js';
import ws from 'ws';

const supabase = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_ANON_KEY || '',
  {
    realtime: {
      transport: ws
    },
    auth: {
      persistSession: false
    }
  }
);

export async function getExistingAnalysis(url) {
  try {
    const { data } = await supabase
      .from('properties')
      .select('*, analyses(*)')
      .eq('url', url)
      .maybeSingle();
    
    if (data && data.analyses && data.analyses.length > 0) {
      return { property: data, analysis: data.analyses[0] };
    }
  } catch (e) {
    console.error("Cache-sjekk feilet:", e.message);
  }
  return null;
}

export async function saveToDatabase(property, analysis) {
  try {
    const { data: prop } = await supabase
      .from('properties')
      .upsert({ 
        url: property.url, 
        title: property.title, 
        raw_data: property 
      }, { onConflict: 'url' })
      .select().single();

    if (prop) {
      await supabase.from('analyses').insert({
        property_id: prop.id,
        summary: analysis.summary,
        estimated_market_price: analysis.estimated_market_price,
        red_flags: analysis.red_flags,
        investment_score: analysis.investment_score
      });
      console.log("✅ Lagret i database");
    }
  } catch (err) {
    console.error('DB-lagring feilet:', err.message);
  }
}
