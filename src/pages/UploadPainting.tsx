import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { QRCodeSVG } from 'qrcode.react';

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
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadedArtId, setUploadedArtId] = useState<string>('');

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
      
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.onloadedmetadata = function() {
        window.URL.revokeObjectURL(video.src);
        if (video.duration > 120) { 
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (videoError || !formData.image) return;
    
    setIsUploading(true);

    try {
      // 1. Upload Image
      const imageExt = formData.image.name.split('.').pop();
      const imageName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${imageExt}`;
      
      const { error: imageError } = await supabase.storage
        .from('art-images')
        .upload(imageName, formData.image);

      if (imageError) throw imageError;

      const { data: { publicUrl: imageUrl } } = supabase.storage
        .from('art-images')
        .getPublicUrl(imageName);

      // 2. Upload Video (optional)
      let videoUrl = null;
      if (formData.video) {
        const videoExt = formData.video.name.split('.').pop();
        const videoFileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${videoExt}`;
        
        const { error: videoError } = await supabase.storage
          .from('art-images')
          .upload(videoFileName, formData.video);
          
        if (videoError) throw videoError;

        const { data: { publicUrl: vUrl } } = supabase.storage
          .from('art-images')
          .getPublicUrl(videoFileName);
        
        videoUrl = vUrl;
      }

      // 3. Insert into artworks table
      const { data: artData, error: dbError } = await supabase
        .from('artworks')
        .insert([{
          name: formData.name,
          artist: formData.artist,
          region: formData.region,
          description: formData.description,
          image_url: imageUrl,
          video_url: videoUrl
        }])
        .select()
        .single();

      if (dbError) throw dbError;

      setUploadedArtId(artData.id);
      setUploadSuccess(true);
    } catch (error: any) {
      console.error('Upload error:', error);
      alert('Error uploading artwork: ' + error.message);
    } finally {
      setIsUploading(false);
    }
  };

  if (uploadSuccess) {
    const artUrl = `${window.location.origin}/painting/${uploadedArtId}`;
    
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-ivory min-h-screen pt-32 pb-16 flex items-center justify-center"
      >
        <div className="bg-white rounded-2xl shadow-xl border border-saffron/20 p-10 text-center max-w-md w-full mx-4">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <h2 className="text-3xl font-yatra text-indigo mb-4">Artwork Uploaded!</h2>
          <p className="text-indigo/70 mb-8">Your artwork has been successfully published to the gallery.</p>
          
          <div className="bg-gray-50 p-6 rounded-xl inline-block mb-8 border border-gray-100">
            <QRCodeSVG value={artUrl} size={200} />
            <p className="text-sm text-gray-500 mt-4 font-medium">Scan to view artwork</p>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => navigate('/painting')}
              className="w-full bg-saffron text-white py-3 rounded-lg font-medium hover:bg-saffron/90 transition-colors"
            >
              Go to Gallery
            </button>
            <button
              onClick={() => {
                setUploadSuccess(false);
                setFormData({
                  name: '', artist: '', region: '', minPrice: '', maxPrice: '', description: '', image: null, video: null
                });
                setPreviewImage(null);
              }}
              className="w-full bg-indigo/5 text-indigo py-3 rounded-lg font-medium hover:bg-indigo/10 transition-colors"
            >
              Upload Another
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

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
                disabled={isUploading}
                className="w-full bg-saffron text-white py-3 rounded-lg font-medium text-lg hover:bg-saffron/90 transition-colors shadow-lg disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isUploading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Uploading...
                  </>
                ) : (
                  'Submit Art for Sale'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </motion.div>
  );
}
