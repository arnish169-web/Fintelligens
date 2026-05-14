import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_ANON_KEY || ''
);

export async function saveToDatabase(property, analysis) {
  if (!process.env.SUPABASE_URL) {
    console.log("Database-nøkler mangler.");
    return;
  }

  try {
    // 1. Lagre boligen
    const { data: prop, error: pError } = await supabase
      .from('properties')
      .upsert({ 
        url: property.url || '', 
        title: property.title || 'Ukjent bolig',
        raw_data: property 
      }, { onConflict: 'url' })
      .select()
      .single();

    if (pError) throw pError;

    // 2. Lagre analysen
    if (prop) {
      const { error: aError } = await supabase
        .from('analyses')
        .insert({
          property_id: prop.id,
          summary: analysis.summary || '',
          estimated_market_price: analysis.estimated_market_price || 0,
          red_flags: analysis.red_flags || [],
          investment_score: analysis.investment_score || 0
        });
      if (aError) throw aError;
      console.log("✅ Lagret i database!");
    }
  } catch (err) {
    console.error('❌ Database-feil:', err.message);
  }
}
