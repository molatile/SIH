import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export default function UploadPainting() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    artist: '',
    region: '',
    minPrice: '',
    maxPrice: '',
    description: '',
    image: null as File | null,
    video: null as File | null,
  });

  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [videoError, setVideoError] = useState<string>('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData((prev) => ({ ...prev, image: file }));
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Basic check for video length using a video element (approximate without backend)
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.onloadedmetadata = function() {
        window.URL.revokeObjectURL(video.src);
        if (video.duration > 120) { // 2 minutes = 120 seconds
          setVideoError('Video must be under 2 minutes.');
          setFormData((prev) => ({ ...prev, video: null }));
        } else {
          setVideoError('');
          setFormData((prev) => ({ ...prev, video: file }));
        }
      }
      video.src = URL.createObjectURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (videoError) return;
    
    // Here you would typically send the data to your backend
    console.log('Submitting art data:', formData);
    alert('Art uploaded successfully for selling!');
    navigate('/painting');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="bg-ivory min-h-screen pt-32 pb-16"
    >
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-xl border border-saffron/20 p-8">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-yatra text-indigo mb-2">Upload Your Art</h1>
            <p className="text-indigo/70">Share your Indian art with the world and start selling.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-indigo mb-2">Art Title</label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-saffron/30 rounded-lg focus:ring-2 focus:ring-saffron focus:border-transparent outline-none"
                  placeholder="e.g. Divine Krishna"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-indigo mb-2">Artist Name</label>
                <input
                  type="text"
                  name="artist"
                  required
                  value={formData.artist}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-saffron/30 rounded-lg focus:ring-2 focus:ring-saffron focus:border-transparent outline-none"
                  placeholder="Your name"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-indigo mb-2">Region/Origin</label>
              <input
                type="text"
                name="region"
                required
                value={formData.region}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-saffron/30 rounded-lg focus:ring-2 focus:ring-saffron focus:border-transparent outline-none"
                placeholder="e.g. Maharashtra, Bihar"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-indigo mb-2">Min Price Range (₹)</label>
                <input
                  type="number"
                  name="minPrice"
                  required
                  value={formData.minPrice}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-saffron/30 rounded-lg focus:ring-2 focus:ring-saffron focus:border-transparent outline-none"
                  placeholder="1000"
                  min="0"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-indigo mb-2">Max Price Range (₹)</label>
                <input
                  type="number"
                  name="maxPrice"
                  required
                  value={formData.maxPrice}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-saffron/30 rounded-lg focus:ring-2 focus:ring-saffron focus:border-transparent outline-none"
                  placeholder="5000"
                  min="0"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-indigo mb-2">Art Details / Description</label>
              <textarea
                name="description"
                required
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-2 border border-saffron/30 rounded-lg focus:ring-2 focus:ring-saffron focus:border-transparent outline-none"
                placeholder="Describe your art, materials used, inspiration..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border-2 border-dashed border-saffron/40 rounded-xl p-6 text-center hover:bg-saffron/5 transition-colors">
                <label className="cursor-pointer block">
                  <span className="block text-sm font-medium text-indigo mb-2">Upload Art Image</span>
                  <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" required />
                  <div className="bg-indigo text-white px-4 py-2 rounded-lg inline-block hover:bg-indigo/90">
                    Choose Image
                  </div>
                  {formData.image && <p className="mt-2 text-sm text-green-600 font-medium">Selected: {formData.image.name}</p>}
                </label>
              </div>

              <div className="border-2 border-dashed border-saffron/40 rounded-xl p-6 text-center hover:bg-saffron/5 transition-colors">
                <label className="cursor-pointer block">
                  <span className="block text-sm font-medium text-indigo mb-2">Upload Video Clip (Max 2 mins)</span>
                  <input type="file" accept="video/*" onChange={handleVideoChange} className="hidden" />
                  <div className="bg-indigo text-white px-4 py-2 rounded-lg inline-block hover:bg-indigo/90">
                    Choose Video
                  </div>
                  {formData.video && <p className="mt-2 text-sm text-green-600 font-medium">Selected: {formData.video.name}</p>}
                  {videoError && <p className="mt-2 text-sm text-red-500 font-medium">{videoError}</p>}
                </label>
              </div>
            </div>

            {previewImage && (
              <div className="mt-4">
                <p className="text-sm font-medium text-indigo mb-2">Image Preview</p>
                <img src={previewImage} alt="Preview" className="w-full max-h-64 object-contain rounded-lg border border-saffron/20" />
              </div>
            )}

            <div className="pt-6">
              <button
                type="submit"
                className="w-full bg-saffron text-white py-3 rounded-lg font-medium text-lg hover:bg-saffron/90 transition-colors shadow-lg"
              >
                Submit Art for Sale
              </button>
            </div>
          </form>
        </div>
      </div>
    </motion.div>
  );
}
