import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_ANON_KEY || '';

// Vi legger til innstillinger som skrur av Realtime for å unngå WebSocket-feilen
const supabase = (supabaseUrl && supabaseKey) ? createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false },
  realtime: { params: { eventsPerSecond: 0 } }
}) : null;

export async function saveToDatabase(property, analysis) {
  if (!supabase) return;

  try {
    const { data: prop, error: pError } = await supabase
      .from('properties')
      .upsert({ 
        url: property.url, 
        title: property.title,
        raw_data: property 
      }, { onConflict: 'url' })
      .select()
      .single();

    if (prop) {
      await supabase.from('analyses').insert({
        property_id: prop.id,
        summary: analysis.summary,
        estimated_market_price: analysis.estimated_market_price,
        red_flags: analysis.red_flags,
        investment_score: analysis.investment_score
      });
      console.log("✅ Lagret i Supabase!");
    }
  } catch (err) {
    console.error('Database-feil:', err.message);
  }
}
