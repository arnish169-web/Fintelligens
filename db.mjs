import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_ANON_KEY || '';

const supabase = (supabaseUrl && supabaseKey) ? createClient(supabaseUrl, supabaseKey) : null;

export async function saveToDatabase(property, analysis) {
  if (!supabase) {
    console.log("Database-klient ikke konfigurert.");
    return;
  }

  try {
    // 1. Lagre bolig
    const { data: prop, error: pError } = await supabase
      .from('properties')
      .upsert({ 
        url: property.url, 
        title: property.title,
        raw_data: property 
      }, { onConflict: 'url' })
      .select()
      .single();

    if (pError) {
      console.error("Supabase Property Error:", pError.message);
      return;
    }

    // 2. Lagre analyse
    if (prop) {
      const { error: aError } = await supabase
        .from('analyses')
        .insert({
          property_id: prop.id,
          summary: analysis.summary,
          estimated_market_price: analysis.estimated_market_price,
          red_flags: analysis.red_flags,
          investment_score: analysis.investment_score
        });
      
      if (aError) {
        console.error("Supabase Analysis Error:", aError.message);
      } else {
        console.log("✅ Alt lagret suksessfullt!");
      }
    }
  } catch (err) {
    console.error('Database kræsjet:', err.message);
  }
}
