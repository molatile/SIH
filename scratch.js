import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function main() {
  const { data, error } = await supabase
    .from('artworks')
    .select('*')
    .limit(1);
    
  if (error) {
    console.error('Error fetching artworks:', error);
  } else {
    console.log('Artworks data:', data);
    if (data && data.length > 0) {
      console.log('Columns:', Object.keys(data[0]));
    } else {
      console.log('No rows returned to infer columns.');
      // Let's get columns from postgres schema if possible
      const { data: cols } = await supabase.rpc('get_columns');
      console.log('RPC columns (if any):', cols);
    }
  }
}

main();
