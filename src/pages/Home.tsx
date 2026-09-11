import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Map, Palette, MessageCircle, Calendar, Utensils, Music, Shirt } from 'lucide-react';

const CATEGORIES = [
  { name: 'Dance', path: '/dance', icon: Music, desc: 'Discover classical and folk dances of India.', img: '/dance-tumbnail.jpg' },
  { name: 'Painting', path: '/painting', icon: Palette, desc: 'Explore traditional arts and vibrant paintings.', img: '/art/pattachitra-odisha.jpeg' },
  { name: 'Languages', path: '/languages', icon: MessageCircle, desc: 'Dive into the linguistic diversity of India.', img: '/language-thumbnail.jpg' },
  { name: 'Food', path: '/food', icon: Utensils, desc: 'Taste the rich and diverse flavors across regions.', img: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&q=80&w=800' },
  { name: 'Clothes', path: '/clothes', icon: Shirt, desc: 'Discover the vibrant textiles and traditional attire.', img: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&q=80&w=800' },
  { name: 'Festivals', path: '/festivals', icon: Calendar, desc: 'Celebrate the vibrant festivals of the subcontinent.', img: '/festival-thumbnail.jpg' },
];

export default function Home() {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 1000], [0, 300]);
  const opacity = useTransform(scrollY, [0, 500], [1, 0]);

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <motion.div 
          className="absolute inset-0 z-0"
          style={{ y: y1 }}
        >
          <div className="absolute inset-0 bg-indigo/40 z-10" />
          <img 
            src="https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&q=80&w=2000" 
            alt="Taj Mahal" 
            className="w-full h-full object-cover"
          />
        </motion.div>

        <motion.div 
          className="relative z-10 text-center px-4 max-w-4xl mx-auto"
          style={{ opacity }}
        >
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-7xl lg:text-8xl text-ivory mb-6 font-yatra drop-shadow-lg"
          >
            Discover the Soul of <span className="text-saffron">India</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg md:text-2xl text-ivory/90 mb-10 font-light drop-shadow-md"
          >
            A journey through diverse cultures, rich history, and breathtaking landscapes.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <Link to="/languages" className="btn-primary text-lg inline-flex items-center gap-2">
              Start Exploring <Map className="w-5 h-5" />
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Categories Section */}
      <section className="py-24 bg-ivory">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl text-indigo mb-4">Experience India</h2>
            <div className="w-24 h-1 bg-saffron mx-auto rounded-full" />
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {CATEGORIES.map((cat, index) => (
              <motion.div
                key={cat.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link to={cat.path} className="block group">
                  <div className="relative rounded-2xl overflow-hidden aspect-[4/3] card-hover bg-white">
                    <div className="absolute inset-0 bg-indigo/20 group-hover:bg-indigo/10 transition-colors z-10" />
                    <img 
                      src={cat.img} 
                      alt={cat.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 z-20 p-6 flex flex-col justify-end bg-gradient-to-t from-indigo/90 via-indigo/40 to-transparent">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-saffron rounded-full text-ivory">
                          <cat.icon className="w-6 h-6" />
                        </div>
                        <h3 className="text-2xl text-ivory font-yatra">{cat.name}</h3>
                      </div>
                      <p className="text-ivory/80 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                        {cat.desc}
                      </p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Insight Section */}
      <section className="py-24 bg-indigo text-ivory relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-saffron/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gold/10 rounded-full blur-3xl" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl md:text-5xl font-yatra mb-6 leading-tight">
                A Symphony of <span className="text-saffron">Colors</span> and Traditions
              </h2>
              <p className="text-lg text-ivory/80 mb-8 font-light leading-relaxed">
                India is not just a country; it's a tapestry of diverse cultures, woven together by a shared history and a vibrant present. From the snow-capped Himalayas in the north to the sun-kissed beaches in the south, every region offers a unique flavor, a distinct language, and an unforgettable experience.
              </p>
              <Link to="/about" className="btn-secondary inline-block">
                Learn More
              </Link>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="aspect-square rounded-full overflow-hidden border-4 border-saffron/30 relative">
                <img 
                  src="https://images.unsplash.com/photo-1596526131083-e8c633c948d2?auto=format&fit=crop&q=80&w=1000" 
                  alt="Indian Classical Dance" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-saffron p-6 rounded-2xl shadow-xl">
                <h4 className="font-yatra text-2xl text-ivory mb-1">5000+</h4>
                <p className="text-ivory/90 text-sm">Years of History</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
