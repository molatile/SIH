import { useState, useEffect } from 'react';
import { ComposableMap, Geographies, Geography, ZoomableGroup } from 'react-simple-maps';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { geoCentroid } from 'd3-geo';
import languagesData from '../data/languages.json';

const geoUrl = '/india-states.json';

interface Language {
  id: string;
  name: string;
  state: string;
  speakers: string;
  scriptSample: string;
  description: string;
}

const Languages = () => {
  const [selectedLanguage, setSelectedLanguage] = useState<Language | null>(null);
  const [position, setPosition] = useState({ coordinates: [82.5, 22.5] as [number, number], zoom: 1 });
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleGeographyClick = (geo: any) => {
    const stateName = geo.properties.name || geo.properties['hc-key'];
    // Find if we have a language for this state
    const language = languagesData.find((lang) => lang.state === stateName);
    
    if (language) {
      setSelectedLanguage(language);
    } else {
      // Just a fallback to show state name if no specific language is matched
      setSelectedLanguage({
        id: stateName,
        name: `Languages of ${stateName}`,
        state: stateName,
        speakers: 'Varies',
        scriptSample: '...',
        description: 'Explore the diverse languages spoken in this region.'
      });
    }

    const centroid = geoCentroid(geo);
    // Move to the clicked state and zoom in
    setPosition({ coordinates: centroid as [number, number], zoom: 2.5 });
  };

  const isMobile = windowWidth < 768;

  return (
    <div className="pt-24 min-h-screen flex flex-col md:flex-row relative bg-ivory overflow-hidden">
      {/* Map Section */}
      <div className={`w-full transition-all duration-500 ease-in-out ${selectedLanguage && !isMobile ? 'md:w-2/3' : 'md:w-full'} flex items-center justify-center p-4 min-h-[50vh]`}>
        <div className="w-full h-[60vh] md:h-[80vh] bg-indigo/5 rounded-3xl overflow-hidden border border-indigo/10 shadow-lg relative">
          <h2 className="absolute top-6 left-1/2 -translate-x-1/2 text-2xl md:text-3xl font-yatra text-indigo z-10 whitespace-nowrap bg-ivory/80 px-6 py-2 rounded-full backdrop-blur-sm border border-indigo/10">
            Linguistic Map of India
          </h2>
          <ComposableMap
            projection="geoMercator"
            projectionConfig={{
              scale: 1000,
              center: [82.5, 22.5] // Center of India
            }}
            className="w-full h-full outline-none"
          >
            <ZoomableGroup 
              zoom={position.zoom} 
              center={position.coordinates} 
              onMoveEnd={(position) => setPosition(position)}
              filterZoomEvent={(evt: any) => {
                return evt.type === 'wheel' ? false : true; // disable scroll zoom if you want
              }}
            >
              <Geographies geography={geoUrl}>
                {({ geographies }) =>
                  geographies.map((geo) => {
                    const stateName = geo.properties.name || geo.properties['hc-key'];
                    const isSelected = selectedLanguage?.state === stateName;
                    
                    return (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        onClick={() => handleGeographyClick(geo)}
                        style={{
                          default: {
                            fill: isSelected ? '#E8720C' : '#1A1464',
                            fillOpacity: isSelected ? 1 : 0.1,
                            stroke: '#1A1464',
                            strokeWidth: 0.5,
                            outline: 'none',
                          },
                          hover: {
                            fill: '#E8720C',
                            fillOpacity: 0.8,
                            stroke: '#1A1464',
                            strokeWidth: 1,
                            outline: 'none',
                            cursor: 'pointer'
                          },
                          pressed: {
                            fill: '#E8720C',
                            outline: 'none',
                          },
                        }}
                        className="transition-colors duration-300"
                      />
                    );
                  })
                }
              </Geographies>
            </ZoomableGroup>
          </ComposableMap>
        </div>
      </div>

      {/* Info Panel Section */}
      <AnimatePresence>
        {selectedLanguage && (
          <motion.div
            initial={{ opacity: 0, x: isMobile ? 0 : 300, y: isMobile ? 300 : 0 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, x: isMobile ? 0 : 300, y: isMobile ? 300 : 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className={`${isMobile ? 'w-full fixed bottom-0 left-0 z-50 rounded-t-3xl border-t' : 'w-1/3 static border-l'} bg-ivory border-indigo/10 shadow-2xl overflow-y-auto`}
            style={{ maxHeight: isMobile ? '70vh' : 'auto' }}
          >
            <div className="p-8 relative min-h-full flex flex-col">
              <button 
                onClick={() => {
                  setSelectedLanguage(null);
                  setPosition({ coordinates: [82.5, 22.5], zoom: 1 });
                }}
                className="absolute top-6 right-6 text-indigo/60 hover:text-saffron transition-colors"
                aria-label="Close panel"
              >
                <X size={24} />
              </button>

              <div className="mb-2">
                <span className="text-saffron font-medium uppercase tracking-wider text-sm">
                  {selectedLanguage.state}
                </span>
              </div>
              
              <h3 className="text-5xl font-yatra text-indigo mb-6">
                {selectedLanguage.name}
              </h3>

              <div className="flex items-center gap-4 mb-8">
                <div className="bg-indigo/5 p-4 rounded-xl flex-1 text-center border border-indigo/10">
                  <p className="text-sm text-indigo/70 mb-1">Speakers</p>
                  <p className="text-xl font-bold text-indigo">{selectedLanguage.speakers}</p>
                </div>
                <div className="bg-saffron/10 p-4 rounded-xl flex-1 text-center border border-saffron/20">
                  <p className="text-sm text-saffron mb-1">Script</p>
                  <p className="text-3xl text-saffron">{selectedLanguage.scriptSample}</p>
                </div>
              </div>

              <div className="prose prose-indigo mb-10">
                <p className="text-lg leading-relaxed text-indigo/80">
                  {selectedLanguage.description}
                </p>
              </div>

              <div className="mt-auto space-y-4 pt-8">
                <button className="w-full btn-primary py-4 text-lg font-medium shadow-md">
                  Learn {selectedLanguage.name}
                </button>
                <button className="w-full btn-secondary py-4 text-lg font-medium">
                  Contribute
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Languages;
