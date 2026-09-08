import { Link } from 'react-router-dom';
import { Compass, Mail, Share2, MessageSquareShare } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-indigo text-ivory pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4 group">
              <Compass className="w-8 h-8 text-saffron transition-transform group-hover:rotate-45" />
              <span className="text-2xl font-yatra tracking-wider text-ivory">
                IncredibleIndia
              </span>
            </Link>
            <p className="text-ivory/80 mb-6 max-w-md">
              Discover the rich heritage, vibrant culture, diverse languages, and stunning landscapes of India. A journey through a land of endless possibilities.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="p-2 bg-ivory/10 rounded-full hover:bg-saffron transition-colors">
                <Share2 className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 bg-ivory/10 rounded-full hover:bg-saffron transition-colors">
                <MessageSquareShare className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 bg-ivory/10 rounded-full hover:bg-saffron transition-colors">
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-yatra text-xl text-saffron mb-4">Explore</h4>
            <ul className="space-y-3">
              <li><Link to="/states" className="text-ivory/80 hover:text-saffron transition-colors">States</Link></li>
              <li><Link to="/history" className="text-ivory/80 hover:text-saffron transition-colors">History</Link></li>
              <li><Link to="/arts" className="text-ivory/80 hover:text-saffron transition-colors">Arts & Culture</Link></li>
              <li><Link to="/languages" className="text-ivory/80 hover:text-saffron transition-colors">Languages</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-yatra text-xl text-saffron mb-4">More</h4>
            <ul className="space-y-3">
              <li><Link to="/festivals" className="text-ivory/80 hover:text-saffron transition-colors">Festivals</Link></li>
              <li><Link to="/cuisine" className="text-ivory/80 hover:text-saffron transition-colors">Cuisine</Link></li>
              <li><a href="#" className="text-ivory/80 hover:text-saffron transition-colors">About Us</a></li>
              <li><a href="#" className="text-ivory/80 hover:text-saffron transition-colors">Contact</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-ivory/20 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-ivory/60 text-sm">
            © {new Date().getFullYear()} IncredibleIndia. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-ivory/60">
            <a href="#" className="hover:text-saffron transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-saffron transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
