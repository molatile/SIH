import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import localPaintings from '../data/painting.json';

export default function Painting() {
  const [paintings, setPaintings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchArtworks() {
      try {
        const { data, error } = await supabase
          .from('artworks')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching artworks:', error);
          setPaintings(localPaintings);
          return;
        }

        if (data && data.length > 0) {
          // Format supabase data to match expected structure if needed
          const formattedData = data.map(art => ({
            id: art.id,
            name: art.name,
            region: art.region,
            image: art.image_url || art.image,
            concept: art.concept || art.description?.substring(0, 100) + '...',
          }));
          
          // Show database items first, then local ones (if they aren't already in DB)
          // To avoid duplicates if DB was seeded with local json, we just use DB.
          // But to be safe, let's just use DB data, and if you want to mix them:
          // In this case, I will just use DB data, but if it's less than local (meaning it wasn't fully seeded), I'll append local ones that aren't in DB.
          
          // Let's assume DB has all of them if length >= localPaintings.length
          // Or just mix them. Let's merge them for now, assuming local IDs are strings like "dhokra-art" and DB IDs are UUIDs.
          const dbIds = new Set(data.map(d => d.id));
          const localOnly = localPaintings.filter(p => !dbIds.has(p.id));
          
          setPaintings([...formattedData, ...localOnly]);
        } else {
          setPaintings(localPaintings);
        }
      } catch (err) {
        console.error('Error:', err);
        setPaintings(localPaintings);
      } finally {
        setLoading(false);
      }
    }

    fetchArtworks();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="bg-ivory min-h-screen pt-32 pb-16"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-yatra text-indigo mb-4">Traditional Indian Art Forms</h1>
          <p className="text-indigo/80 max-w-2xl mx-auto text-lg mb-8">
            Discover the vibrant colors, intricate patterns, and ancient stories preserved in India's diverse painting and craft traditions.
          </p>
          <Link to="/painting/upload" className="inline-block bg-saffron text-white px-8 py-3 rounded-full font-medium hover:bg-saffron/90 transition-colors shadow-lg">
            Upload Your Art
          </Link>
        </div>
        
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-12 h-12 border-4 border-saffron border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {paintings.map((art) => (
              <Link key={art.id} to={`/painting/${art.id}`} className="group block h-full">
                <motion.div
                  whileHover={{ y: -10 }}
                  className="bg-white rounded-2xl overflow-hidden shadow-lg border border-saffron/20 h-full flex flex-col"
                >
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={art.image}
                      alt={art.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 bg-gray-100"
                    />
                    {/* Hover Teaser */}
                    <div className="absolute inset-0 bg-indigo/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-6 text-center">
                      <p className="text-ivory font-medium text-sm leading-relaxed transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                        {art.concept}
                      </p>
                    </div>
                  </div>
                  
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-2xl font-yatra text-indigo mb-2">{art.name}</h3>
                      <div className="flex items-center text-saffron font-medium text-sm">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                        </svg>
                        {art.region}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
