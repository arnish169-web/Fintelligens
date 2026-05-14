import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_ANON_KEY || ''
);

export async function saveToDatabase(property, analysis) {
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
    console.log("⚠️ Database-nøkler mangler i Render Environment!");
    return;
  }

  try {
    console.log("💾 Prøver å lagre bolig i database...");
    
    // 1. Lagre eller oppdater boligen
    const { data: prop, error: pError } = await supabase
      .from('properties')
      .upsert({ 
        url: property.url, 
        title: property.title,
        price_asking: property.price_asking,
        area_total: parseFloat(property.area) || 0,
        raw_data: property 
      }, { onConflict: 'url' })
      .select()
      .single();

    if (pError) {
      console.error("❌ Feil ved lagring av property:", pError.message);
      return;
    }

    // 2. Lagre analysen koblet til boligen
    if (prop) {
      const { error: aError } = await supabase
        .from('analyses')
        .insert({
          property_id: prop.id,
          summary: analysis.summary,
          estimated_market_price: analysis.estimated_market_price,
          red_flags: analysis.red_flags,
          investment_score: analysis.investment_score,
          bidding_strategy: analysis.suggested_bid_strategy || ""
        });

      if (aError) {
        console.error("❌ Feil ved lagring av analyse:", aError.message);
      } else {
        console.log("✅ Alt lagret i Supabase!");
      }
    }
  } catch (err) {
    console.error('💥 Uventet feil i db.mjs:', err.message);
  }
}
