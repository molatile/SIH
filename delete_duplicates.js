import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function cleanup() {
  // Fetch all artworks
  const { data: artworks, error: fetchError } = await supabase
    .from('artworks')
    .select('id, name, created_at');

  if (fetchError) {
    console.error('Error fetching artworks:', fetchError);
    return;
  }
  
  console.log(`Total rows before cleanup: ${artworks.length}`);

  // Group by name
  const nameGroups = {};
  for (const art of artworks) {
    if (!nameGroups[art.name]) nameGroups[art.name] = [];
    nameGroups[art.name].push(art);
  }

  const idsToDelete = [];
  
  for (const [name, arts] of Object.entries(nameGroups)) {
    if (arts.length > 1) {
      // Sort by created_at (ascending) to find the oldest
      // We will keep the first one (oldest) and delete the rest
      arts.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
      for (let i = 1; i < arts.length; i++) {
        idsToDelete.push(arts[i].id);
      }
    }
  }

  console.log(`Found ${idsToDelete.length} duplicates to delete.`);

  if (idsToDelete.length > 0) {
    // Delete in batches or one by one
    for (const id of idsToDelete) {
      const { error: deleteError } = await supabase
        .from('artworks')
        .delete()
        .eq('id', id);
      if (deleteError) {
        console.error(`Error deleting id ${id}:`, deleteError);
      }
    }
    console.log('Deletion complete.');
  }

  // Confirm row count
  const { count, error: countError } = await supabase
    .from('artworks')
    .select('*', { count: 'exact', head: true });
    
  if (countError) {
    console.error('Error counting artworks:', countError);
  } else {
    console.log(`Total rows after cleanup: ${count}`);
  }
}

cleanup();
