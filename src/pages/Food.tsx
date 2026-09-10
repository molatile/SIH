import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Info, BookOpen, Lightbulb, Star } from 'lucide-react';
import foodData from '../data/food.json';

interface FoodItem {
  id: string;
  name: string;
  region: string;
  image: string;
  info: string;
  history: string;
  trivia: string;
  funFact: string;
}

export default function Food() {
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);

  return (
    <div className="pt-24 pb-12 min-h-screen bg-ivory">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl md:text-6xl font-yatra text-indigo mb-4">Culinary Heritage</h1>
            <div className="w-24 h-1 bg-saffron mx-auto rounded-full mb-6" />
            <p className="text-lg text-indigo/70 max-w-2xl mx-auto">
              Taste the rich, diverse flavors and aromatic spices of India's iconic dishes.
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {foodData.map((food, index) => (
            <motion.div
              key={food.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div
                onClick={() => setSelectedFood(food)}
                className="bg-white border border-indigo/10 rounded-2xl overflow-hidden shadow-md cursor-pointer group card-hover relative flex flex-col h-full transition-all hover:shadow-xl"
              >
                <div className="aspect-[4/3] bg-indigo/5 relative overflow-hidden">
                  <img
                    src={food.image}
                    alt={food.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-indigo/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <span className="bg-white/20 backdrop-blur-md text-white px-6 py-2 rounded-full font-medium tracking-wide border border-white/30 shadow-lg">
                      View Recipe & History
                    </span>
                  </div>
                </div>
                <div className="p-6 text-center bg-white flex-1 flex flex-col justify-center">
                  <h3 className="text-2xl font-yatra text-indigo mb-2">{food.name}</h3>
                  <p className="text-saffron font-medium flex items-center justify-center gap-1">
                    <MapPin size={16} /> {food.region}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selectedFood && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm"
            onClick={() => setSelectedFood(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-4xl max-h-[90vh] bg-ivory rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedFood(null)}
                className="absolute top-4 right-4 z-20 bg-black/40 hover:bg-black/60 text-white md:text-indigo md:bg-white/50 md:hover:bg-white/80 p-2 rounded-full backdrop-blur-md transition-all shadow-lg"
                aria-label="Close modal"
              >
                <X size={24} />
              </button>

              <div className="md:w-2/5 h-64 md:h-auto relative shrink-0">
                <img
                  src={selectedFood.image}
                  alt={selectedFood.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent md:hidden" />
                <div className="absolute bottom-4 left-4 right-4 md:hidden text-white">
                  <h2 className="text-3xl font-yatra mb-1 drop-shadow-md">{selectedFood.name}</h2>
                  <p className="flex items-center gap-1 text-white/90 text-sm">
                    <MapPin size={16} className="text-saffron" /> {selectedFood.region}
                  </p>
                </div>
              </div>

              <div className="md:w-3/5 p-6 md:p-8 overflow-y-auto custom-scrollbar bg-ivory">
                <div className="hidden md:block mb-8 border-b border-indigo/10 pb-4">
                  <h2 className="text-4xl font-yatra text-indigo mb-2">{selectedFood.name}</h2>
                  <p className="flex items-center gap-1 text-saffron font-medium">
                    <MapPin size={18} /> {selectedFood.region}
                  </p>
                </div>

                <div className="space-y-6">
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                    className="bg-white p-5 rounded-2xl shadow-sm border border-indigo/5"
                  >
                    <h4 className="flex items-center gap-2 text-lg font-semibold text-indigo mb-2">
                      <Info size={20} className="text-saffron" /> About
                    </h4>
                    <p className="text-indigo/80 leading-relaxed">{selectedFood.info}</p>
                  </motion.div>

                  <motion.div 
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                    className="bg-white p-5 rounded-2xl shadow-sm border border-indigo/5"
                  >
                    <h4 className="flex items-center gap-2 text-lg font-semibold text-indigo mb-2">
                      <BookOpen size={20} className="text-saffron" /> History
                    </h4>
                    <p className="text-indigo/80 leading-relaxed">{selectedFood.history}</p>
                  </motion.div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                      className="bg-indigo/5 p-5 rounded-2xl border border-indigo/10"
                    >
                      <h4 className="flex items-center gap-2 text-md font-semibold text-indigo mb-2">
                        <Lightbulb size={18} className="text-saffron" /> Trivia
                      </h4>
                      <p className="text-sm text-indigo/80 leading-relaxed">{selectedFood.trivia}</p>
                    </motion.div>

                    <motion.div 
                      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                      className="bg-saffron/10 p-5 rounded-2xl border border-saffron/20"
                    >
                      <h4 className="flex items-center gap-2 text-md font-semibold text-saffron mb-2">
                        <Star size={18} className="text-indigo" /> Fun Fact
                      </h4>
                      <p className="text-sm text-indigo/80 leading-relaxed">{selectedFood.funFact}</p>
                    </motion.div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
