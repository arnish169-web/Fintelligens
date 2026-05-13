import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_ANON_KEY || ''
);

export async function saveToDatabase(property, analysis) {
  if (!process.env.SUPABASE_URL) return;

  const { data: prop, error: pError } = await supabase
    .from('properties')
    .upsert({ url: property.url, title: property.title, raw_data: property }, { onConflict: 'url' })
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
  }
}
