import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function check() {
  const { data, count, error } = await supabase
    .from('artworks')
    .select('id, name', { count: 'exact' });
  console.log(`Total count: ${count}`);
  console.log(data);
}
check();
