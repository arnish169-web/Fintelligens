import { createClient } from '@supabase/supabase-js';

let supabase = null;

// Sjekker om vi har de nødvendige nøklene før vi starter
if (process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY) {
  try {
    supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
    console.log("Supabase-klient initialisert.");
  } catch (err) {
    console.error("Kunne ikke starte Supabase-klient:", err.message);
  }
} else {
  console.log("Supabase-nøkler mangler eller er ufullstendige i Environment Variables.");
}

export async function saveToDatabase(property, analysis) {
  if (!supabase) {
    console.log("Database-lagring hoppet over: Supabase er ikke koblet til.");
    return;
  }

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

    if (pError) throw pError;

    if (prop) {
      const { error: aError } = await supabase.from('analyses').insert({
        property_id: prop.id,
        summary: analysis.summary,
        estimated_market_price: analysis.estimated_market_price,
        red_flags: analysis.red_flags,
        investment_score: analysis.investment_score
      });
      if (aError) throw aError;
      console.log("Analyse lagret i databasen.");
    }
  } catch (err) {
    console.error('Database-feil:', err.message);
  }
}
