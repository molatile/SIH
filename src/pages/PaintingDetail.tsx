import { useParams, Link, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import { useEffect, useState } from 'react';
import emailjs from '@emailjs/browser';
import paintings from '../data/painting.json';

emailjs.init("ds9LeL17vIjJXdim4");

export default function PaintingDetail() {
  const { id } = useParams<{ id: string }>();
  const paintingIndex = paintings.findIndex(p => p.id === id);
  const painting = paintings[paintingIndex];
  const [currentUrl, setCurrentUrl] = useState('');
  const [isBuyModalOpen, setIsBuyModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '', email: '', phone: '', address: '', city: '', pincode: ''
  });
  const [orderStatus, setOrderStatus] = useState<'idle' | 'loading' | 'success'>('idle');

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setOrderStatus('loading');

    console.log("ENV VARS:");
    console.log("VITE_EMAILJS_SERVICE_ID:", import.meta.env.VITE_EMAILJS_SERVICE_ID);
    console.log("VITE_EMAILJS_BUYER_TEMPLATE_ID:", import.meta.env.VITE_EMAILJS_BUYER_TEMPLATE_ID);
    console.log("VITE_EMAILJS_OWNER_TEMPLATE_ID:", import.meta.env.VITE_EMAILJS_OWNER_TEMPLATE_ID);
    console.log("VITE_EMAILJS_PUBLIC_KEY:", import.meta.env.VITE_EMAILJS_PUBLIC_KEY);

    const orderId = 'SAN-' + Math.floor(100000 + Math.random() * 900000);
    const templateParams = {
      order_id: orderId,
      item_name: painting.name,
      buyer_name: formData.fullName,
      buyer_email: formData.email,
      phone: formData.phone,
      address: formData.address,
      city: formData.city,
      pincode: formData.pincode,
    };

    try {
      console.log('Sending BUYER email:', {
        serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID,
        templateId: import.meta.env.VITE_EMAILJS_BUYER_TEMPLATE_ID,
        params: JSON.stringify(templateParams),
        publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      });
      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_BUYER_TEMPLATE_ID,
        templateParams,
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      );
      
      console.log('Sending OWNER email:', {
        serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID,
        templateId: import.meta.env.VITE_EMAILJS_OWNER_TEMPLATE_ID,
        params: JSON.stringify(templateParams),
        publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      });
      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_OWNER_TEMPLATE_ID,
        templateParams,
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      );
      setOrderStatus('success');
    } catch (error: any) {
      console.error('Failed to send email:', error);
      console.error('Error text:', error.text);
      setOrderStatus('idle');
      alert('Failed to place order. Please try again.');
    }
  };

  useEffect(() => {
    setCurrentUrl(`https://sih-two-lyart.vercel.app/painting/${id}`);
  }, [id]);

  if (!painting) {
    return <Navigate to="/painting" />;
  }

  const prevPainting = paintingIndex > 0 ? paintings[paintingIndex - 1] : paintings[paintings.length - 1];
  const nextPainting = paintingIndex < paintings.length - 1 ? paintings[paintingIndex + 1] : paintings[0];

  return (
    <motion.div
      key={id}
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="bg-ivory min-h-screen pt-32 pb-16"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation */}
        <div className="flex justify-between items-center mb-8">
          <Link to="/painting" className="text-saffron hover:text-gold transition font-medium flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
            All Paintings
          </Link>
          <div className="flex gap-6">
            <Link to={`/painting/${prevPainting.id}`} className="text-indigo hover:text-saffron transition font-medium flex items-center">
              &larr; Previous
            </Link>
            <Link to={`/painting/${nextPainting.id}`} className="text-indigo hover:text-saffron transition font-medium flex items-center">
              Next &rarr;
            </Link>
          </div>
        </div>

        {/* Hero Image */}
        <div className="rounded-3xl overflow-hidden shadow-2xl mb-12 h-[50vh] md:h-[60vh] relative group">
          <img 
            src={painting.image} 
            alt={painting.name} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-indigo/90 via-indigo/40 to-transparent flex items-end">
            <div className="p-8 md:p-12">
              <h1 className="text-5xl md:text-7xl font-yatra text-ivory mb-4">{painting.name}</h1>
              <div className="flex items-center text-gold text-xl font-medium">
                <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                {painting.region}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-10">
            <section>
              <h2 className="text-4xl font-yatra text-indigo mb-6 flex items-center">
                <span className="bg-saffron w-2 h-8 mr-3 rounded-full"></span>
                About the Art
              </h2>
              <div className="prose prose-lg text-indigo/80 whitespace-pre-line leading-relaxed">
                {painting.description}
              </div>
            </section>

            <section>
              <h2 className="text-4xl font-yatra text-indigo mb-6 flex items-center">
                <span className="bg-saffron w-2 h-8 mr-3 rounded-full"></span>
                Concept & Meaning
              </h2>
              <div className="bg-white p-8 rounded-2xl shadow-sm border-l-4 border-saffron relative overflow-hidden">
                <div className="absolute -right-4 -top-4 opacity-5">
                  <svg width="100" height="100" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L15 8H21L16 13L18 20L12 16L6 20L8 13L3 8H9L12 2Z"/></svg>
                </div>
                <p className="text-xl text-indigo italic relative z-10">
                  "{painting.concept}"
                </p>
              </div>
            </section>
            
            {/* Video Placeholder */}
            <section>
              <h2 className="text-4xl font-yatra text-indigo mb-6 flex items-center">
                <span className="bg-saffron w-2 h-8 mr-3 rounded-full"></span>
                Art in Motion
              </h2>
              <div className="aspect-video bg-indigo/5 rounded-2xl border-2 border-dashed border-indigo/20 flex flex-col items-center justify-center text-indigo/50 relative overflow-hidden group">
                <div className="absolute inset-0 bg-indigo/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-16 h-16 bg-saffron rounded-full flex items-center justify-center text-ivory">
                    <svg className="w-8 h-8 ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                  </div>
                </div>
                <svg className="w-20 h-20 mb-4 opacity-40 group-hover:opacity-0 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="font-yatra text-2xl group-hover:opacity-0 transition-opacity">Video Documentary Coming Soon</p>
                <p className="text-sm mt-2 font-mono opacity-60 group-hover:opacity-0 transition-opacity">{painting.video}</p>
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <div className="bg-white p-8 rounded-3xl shadow-xl border border-orange-100 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gold/10 rounded-bl-full"></div>
              <h3 className="text-3xl font-yatra text-indigo mb-8">Key Details</h3>
              
              <div className="space-y-6 relative z-10">
                <div className="border-b border-indigo/10 pb-4">
                  <h4 className="text-xs uppercase tracking-widest text-saffron font-bold mb-2">Artist / Community</h4>
                  <p className="text-indigo font-medium text-lg">{painting.artist}</p>
                </div>
                
                <div className="border-b border-indigo/10 pb-4">
                  <h4 className="text-xs uppercase tracking-widest text-saffron font-bold mb-2">Origin</h4>
                  <p className="text-indigo font-medium text-lg">{painting.origin}</p>
                </div>
                
                <div>
                  <h4 className="text-xs uppercase tracking-widest text-saffron font-bold mb-2">Materials Used</h4>
                  <p className="text-indigo font-medium text-lg">{painting.materials}</p>
                </div>
              </div>
              <button
                onClick={() => setIsBuyModalOpen(true)}
                className="mt-8 w-full bg-saffron hover:bg-gold text-white font-yatra text-xl py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 relative z-10 block text-center"
              >
                Buy This Art
              </button>
            </div>

            <div className="bg-indigo text-ivory p-8 rounded-3xl shadow-xl text-center flex flex-col items-center">
              <h3 className="text-2xl font-yatra mb-6 text-gold">Scan to Share</h3>
              <div className="bg-white p-4 rounded-2xl inline-block mb-6 shadow-inner">
                {currentUrl && (
                  <QRCodeSVG 
                    value={currentUrl} 
                    size={180}
                    fgColor="#1A1464"
                    bgColor="#FFFFFF"
                    level="Q"
                  />
                )}
              </div>
              <p className="text-sm text-ivory/80 leading-relaxed">
                Scan this QR code with your phone to carry this artwork and its story with you.
              </p>
            </div>
          </div>
        </div>
        
      </div>

      {/* Buy Modal / Drawer */}
      <AnimatePresence>
        {isBuyModalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsBuyModalOpen(false)}
              className="fixed inset-0 bg-indigo/60 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-x-0 bottom-0 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-md bg-ivory rounded-t-3xl md:rounded-3xl shadow-2xl z-50 p-6 md:p-8 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-yatra text-indigo flex items-center">
                  <span className="bg-saffron w-2 h-6 mr-3 rounded-full block"></span>
                  Buy {painting.name}
                </h2>
                <button onClick={() => setIsBuyModalOpen(false)} className="text-indigo/50 hover:text-saffron transition-colors">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
              </div>

              {orderStatus === 'success' ? (
                <div className="text-center py-8">
                  <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                  </div>
                  <h3 className="text-2xl font-yatra text-indigo mb-2">Order Placed!</h3>
                  <p className="text-indigo/70">Check your email for confirmation.</p>
                </div>
              ) : (
                <form onSubmit={handlePlaceOrder} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-indigo mb-1">Full Name</label>
                    <input required type="text" name="fullName" value={formData.fullName} onChange={e => setFormData({ ...formData, fullName: e.target.value })} className="w-full bg-white border border-indigo/20 rounded-xl px-4 py-2 text-indigo focus:outline-none focus:border-saffron focus:ring-1 focus:ring-saffron transition-colors" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-indigo mb-1">Email</label>
                    <input required type="email" name="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="w-full bg-white border border-indigo/20 rounded-xl px-4 py-2 text-indigo focus:outline-none focus:border-saffron focus:ring-1 focus:ring-saffron transition-colors" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-indigo mb-1">Phone Number</label>
                    <input required type="tel" name="phone" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} className="w-full bg-white border border-indigo/20 rounded-xl px-4 py-2 text-indigo focus:outline-none focus:border-saffron focus:ring-1 focus:ring-saffron transition-colors" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-indigo mb-1">Delivery Address</label>
                    <textarea required name="address" value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} className="w-full bg-white border border-indigo/20 rounded-xl px-4 py-2 text-indigo focus:outline-none focus:border-saffron focus:ring-1 focus:ring-saffron transition-colors" rows={2} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-indigo mb-1">City</label>
                      <input required type="text" name="city" value={formData.city} onChange={e => setFormData({ ...formData, city: e.target.value })} className="w-full bg-white border border-indigo/20 rounded-xl px-4 py-2 text-indigo focus:outline-none focus:border-saffron focus:ring-1 focus:ring-saffron transition-colors" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-indigo mb-1">Pincode</label>
                      <input required type="text" name="pincode" value={formData.pincode} onChange={e => setFormData({ ...formData, pincode: e.target.value })} className="w-full bg-white border border-indigo/20 rounded-xl px-4 py-2 text-indigo focus:outline-none focus:border-saffron focus:ring-1 focus:ring-saffron transition-colors" />
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-xl border border-indigo/10 flex flex-col items-center justify-center mt-6 shadow-inner">
                    <img src="/payment-qr.png" alt="UPI QR Code" className="w-32 h-32 mb-2 object-contain" />
                    <p className="text-sm font-bold text-indigo">Scan to Pay</p>
                  </div>

                  <button 
                    type="submit" 
                    disabled={orderStatus === 'loading'}
                    className="w-full bg-saffron hover:bg-gold text-white font-yatra text-xl py-3 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed mt-2 block text-center"
                  >
                    {orderStatus === 'loading' ? 'Processing...' : 'Place Order'}
                  </button>
                </form>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
