import { useParams, Navigate } from 'react-router-dom';
import paintings from '../data/painting.json';

export default function ArtViewer() {
  const { id } = useParams<{ id: string }>();
  const painting = paintings.find(p => p.id === id);

  if (!painting) {
    return <Navigate to="/painting" />;
  }

  const handleBuy = () => {
    // Navigate to full details page to handle buying, or handle buying here?
    // User requested: "A "Buy This Art" button at the bottom"
    // Since this is a viewer, let's direct them to the main painting page or just show an alert for now if buying is complex.
    // The main painting detail page has the full buy flow.
    window.location.href = `/painting/${id}`;
  };

  return (
    <div className="bg-ivory min-h-screen font-sans selection:bg-saffron/30">
      {/* Hero Image */}
      <div className="w-full h-[55vh] relative">
        <img 
          src={painting.image} 
          alt={painting.name} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-indigo/95 via-indigo/40 to-transparent flex items-end">
          <div className="p-6 w-full">
            <h1 className="text-4xl font-yatra text-ivory mb-2 leading-tight">{painting.name}</h1>
            <div className="flex items-center text-gold text-sm font-medium mb-1">
              <svg className="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
              {painting.region}
            </div>
            <div className="flex items-center text-ivory/80 text-sm">
              <svg className="w-4 h-4 mr-1.5 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
              {painting.artist}
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-8 pb-32">
        
        {/* Key Details */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-indigo/5 space-y-6">
          <div>
            <h3 className="text-xs uppercase tracking-widest text-saffron font-bold mb-2 flex items-center">
              <span className="w-1 h-3 bg-saffron rounded-full mr-2"></span>
              Origin
            </h3>
            <p className="text-indigo/80 text-sm leading-relaxed">{painting.origin}</p>
          </div>
          <div>
            <h3 className="text-xs uppercase tracking-widest text-saffron font-bold mb-2 flex items-center">
              <span className="w-1 h-3 bg-saffron rounded-full mr-2"></span>
              Concept
            </h3>
            <p className="text-indigo/80 text-sm leading-relaxed">{painting.concept}</p>
          </div>
          <div>
            <h3 className="text-xs uppercase tracking-widest text-saffron font-bold mb-2 flex items-center">
              <span className="w-1 h-3 bg-saffron rounded-full mr-2"></span>
              Materials
            </h3>
            <p className="text-indigo/80 text-sm leading-relaxed">{painting.materials}</p>
          </div>
        </div>

        {/* Video Player */}
        <div className="space-y-3">
          <h3 className="text-xs uppercase tracking-widest text-indigo font-bold ml-1">Documentary</h3>
          <div className="w-full aspect-video bg-indigo rounded-2xl flex items-center justify-center relative overflow-hidden shadow-inner">
            <div className="text-ivory/60 flex flex-col items-center p-4 text-center">
               <svg className="w-10 h-10 mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="font-yatra text-lg tracking-wide text-gold">Video Coming Soon</p>
                <p className="text-[10px] opacity-50 mt-2 font-mono truncate w-full max-w-[200px]">{painting.video}</p>
            </div>
          </div>
        </div>
        
      </div>

      {/* Fixed Bottom Action */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-ivory via-ivory/95 to-transparent pt-12 pb-6">
        <button 
          onClick={handleBuy}
          className="w-full bg-saffron text-white font-yatra text-xl py-4 rounded-2xl shadow-xl hover:bg-gold transition-colors active:scale-95 flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
          </svg>
          Buy This Art
        </button>
      </div>
    </div>
  );
}
