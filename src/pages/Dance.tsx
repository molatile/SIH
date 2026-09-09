import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, type PanInfo } from 'framer-motion';
import { X, Play, MapPin, ChevronUp, ChevronDown } from 'lucide-react';
import danceData from '../data/dance.json';

interface Dance {
  id: number;
  name: string;
  state: string;
  video: string;
}

const DanceCard = ({ dance, onClick, isMobile }: { dance: Dance, onClick: () => void, isMobile: boolean }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleMouseEnter = () => {
    if (!isMobile && videoRef.current) {
      videoRef.current.play().catch(e => console.log('Video play failed:', e));
    }
  };

  const handleMouseLeave = () => {
    if (!isMobile && videoRef.current) {
      videoRef.current.pause();
    }
  };

  return (
    <motion.div
      whileHover={!isMobile ? { scale: 1.03 } : {}}
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="bg-ivory border border-indigo/10 rounded-2xl overflow-hidden shadow-md cursor-pointer group card-hover relative flex flex-col"
    >
      <div className="aspect-video bg-indigo/5 relative overflow-hidden">
        <video 
          ref={videoRef}
          src={`${dance.video}#t=0.1`}
          muted 
          loop 
          playsInline
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-indigo/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Play className="text-white w-12 h-12" fill="currentColor" />
        </div>
      </div>
      <div className="p-4 md:p-6 text-center bg-white flex-1">
        <h3 className="text-2xl font-yatra text-indigo mb-1">{dance.name}</h3>
        <p className="text-saffron font-medium">{dance.state}</p>
      </div>
    </motion.div>
  );
};

const Dance = () => {
  const [selectedDance, setSelectedDance] = useState<Dance | null>(null);
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth < 768 : false);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleNext = () => {
    if (!selectedDance) return;
    const currentIndex = danceData.findIndex(d => d.id === selectedDance.id);
    if (currentIndex < danceData.length - 1) {
      setDirection(1);
      setSelectedDance(danceData[currentIndex + 1]);
    }
  };

  const handlePrev = () => {
    if (!selectedDance) return;
    const currentIndex = danceData.findIndex(d => d.id === selectedDance.id);
    if (currentIndex > 0) {
      setDirection(-1);
      setSelectedDance(danceData[currentIndex - 1]);
    }
  };

  const handleDragEnd = (_e: any, info: PanInfo) => {
    const threshold = 50;
    if (info.offset.y < -threshold || info.offset.x < -threshold) {
      handleNext();
    } else if (info.offset.y > threshold || info.offset.x > threshold) {
      handlePrev();
    }
  };

  const swipeVariants = {
    enter: (direction: number) => ({
      y: direction > 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.9,
    }),
    center: {
      z: 1,
      y: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction: number) => ({
      z: 0,
      y: direction < 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.9,
    })
  };

  return (
    <div className="pt-24 pb-12 min-h-screen bg-ivory">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl md:text-6xl font-yatra text-indigo mb-4">Dances of India</h1>
            <div className="w-24 h-1 bg-saffron mx-auto rounded-full mb-6" />
            <p className="text-lg text-indigo/70 max-w-2xl mx-auto">
              Experience the vibrant rhythms and colorful expressions of traditional Indian dance forms.
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {danceData.map((dance, index) => (
            <motion.div
              key={dance.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <DanceCard 
                dance={dance} 
                onClick={() => setSelectedDance(dance)}
                isMobile={isMobile}
              />
            </motion.div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selectedDance && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-6 bg-black/95 backdrop-blur-xl"
            onClick={() => setSelectedDance(null)}
          >
            <button
              onClick={() => setSelectedDance(null)}
              className="absolute top-6 right-6 z-[60] bg-white/10 hover:bg-white/20 text-white p-3 rounded-full backdrop-blur-md transition-all"
              aria-label="Close modal"
            >
              <X size={24} />
            </button>

            <div 
              className="relative w-full h-full sm:h-[85vh] sm:max-h-[850px] sm:max-w-[420px] sm:rounded-[2rem] overflow-hidden bg-black shadow-2xl sm:border border-white/10 flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <AnimatePresence initial={false} custom={direction}>
                <motion.div
                  key={selectedDance.id}
                  custom={direction}
                  variants={swipeVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  drag="y"
                  dragConstraints={{ top: 0, bottom: 0 }}
                  dragElastic={0.2}
                  onDragEnd={handleDragEnd}
                  className="absolute inset-0 w-full h-full flex flex-col cursor-grab active:cursor-grabbing bg-black"
                >
                  <video 
                    src={selectedDance.video}
                    autoPlay
                    loop
                    playsInline
                    className="w-full h-full object-contain sm:object-cover"
                  />
                  
                  <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none" />

                  <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 text-white pointer-events-none">
                    <h2 className="text-3xl md:text-4xl font-yatra mb-2 drop-shadow-md">{selectedDance.name}</h2>
                    <div className="flex items-center gap-2 text-white/80 font-medium">
                      <MapPin size={18} className="text-saffron" />
                      <span className="text-lg">{selectedDance.state}</span>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              <div className="absolute right-4 bottom-8 flex flex-col gap-4 z-[55]">
                <button 
                  onClick={(e) => { e.stopPropagation(); handlePrev(); }}
                  className="bg-black/40 hover:bg-black/60 p-3 rounded-full backdrop-blur-sm text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                  disabled={danceData.findIndex(d => d.id === selectedDance.id) === 0}
                >
                  <ChevronUp size={24} />
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); handleNext(); }}
                  className="bg-black/40 hover:bg-black/60 p-3 rounded-full backdrop-blur-sm text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                  disabled={danceData.findIndex(d => d.id === selectedDance.id) === danceData.length - 1}
                >
                  <ChevronDown size={24} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dance;
