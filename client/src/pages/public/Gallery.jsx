import { useState, useEffect, useCallback, useRef } from 'react';
import Navbar from '../../components/public/Navbar';
import Footer from '../../components/public/Footer';
import Hero from '../../components/public/Hero';
import WhatsAppButton from '../../components/public/WhatsAppButton';
import { galleryAPI } from '../../utils/api';
import config from '../../config/env';

/* ───────────────── Lightbox Component ───────────────── */
const Lightbox = ({ images, currentIndex, onClose, onPrev, onNext, galleryTitle }) => {
  const touchStartX = useRef(null);
  const touchStartY = useRef(null);

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onPrev();
      if (e.key === 'ArrowRight') onNext();
    };
    window.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [onClose, onPrev, onNext]);

  // Touch / swipe handlers
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const dy = e.changedTouches[0].clientY - touchStartY.current;
    // Only swipe if horizontal movement is dominant
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 50) {
      if (dx > 0) onPrev();
      else onNext();
    }
    touchStartX.current = null;
    touchStartY.current = null;
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
      onClick={onClose}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 text-white bg-black/50 hover:bg-black/70 rounded-full w-10 h-10 flex items-center justify-center text-2xl transition-colors cursor-pointer"
      >
        &times;
      </button>

      {/* Counter */}
      <div className="absolute top-4 left-4 text-white/80 text-sm bg-black/50 px-3 py-1 rounded-full">
        {currentIndex + 1} / {images.length}
      </div>

      {/* Prev button */}
      <button
        onClick={(e) => { e.stopPropagation(); onPrev(); }}
        className="absolute left-2 md:left-4 z-10 text-white bg-black/40 hover:bg-black/70 rounded-full w-10 h-10 md:w-12 md:h-12 flex items-center justify-center text-xl md:text-2xl transition-colors cursor-pointer"
      >
        &#8249;
      </button>

      {/* Image */}
      <div className="max-w-[90vw] max-h-[85vh] flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
        <img
          src={`${config.baseUrl}${images[currentIndex].url}`}
          alt={`${galleryTitle} - ${currentIndex + 1}`}
          className="max-w-full max-h-[85vh] object-contain rounded-lg select-none"
          draggable={false}
        />
      </div>

      {/* Next button */}
      <button
        onClick={(e) => { e.stopPropagation(); onNext(); }}
        className="absolute right-2 md:right-4 z-10 text-white bg-black/40 hover:bg-black/70 rounded-full w-10 h-10 md:w-12 md:h-12 flex items-center justify-center text-xl md:text-2xl transition-colors cursor-pointer"
      >
        &#8250;
      </button>

      {/* Caption */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/70 text-sm bg-black/50 px-4 py-1.5 rounded-full">
        {galleryTitle}
      </div>
    </div>
  );
};

/* ───────────────── Gallery Page ───────────────── */
const Gallery = () => {
  const [galleries, setGalleries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lightbox, setLightbox] = useState({ open: false, galleryId: null, imageIndex: 0 });

  const fetchGalleries = useCallback(async () => {
    try {
      const response = await galleryAPI.getAll();
      const sortedGalleries = response.data.sort((a, b) =>
        new Date(b.eventDate) - new Date(a.eventDate)
      );
      setGalleries(sortedGalleries);
    } catch (error) {
      console.error('Error fetching galleries:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGalleries();
  }, [fetchGalleries]);

  const openLightbox = (galleryId, imageIndex) => {
    setLightbox({ open: true, galleryId, imageIndex });
  };

  const closeLightbox = () => {
    setLightbox({ open: false, galleryId: null, imageIndex: 0 });
  };

  const currentGallery = galleries.find(g => g._id === lightbox.galleryId);
  const currentImages = currentGallery?.images || [];

  const goNext = useCallback(() => {
    setLightbox(prev => ({
      ...prev,
      imageIndex: (prev.imageIndex + 1) % currentImages.length,
    }));
  }, [currentImages.length]);

  const goPrev = useCallback(() => {
    setLightbox(prev => ({
      ...prev,
      imageIndex: (prev.imageIndex - 1 + currentImages.length) % currentImages.length,
    }));
  }, [currentImages.length]);

  const getYoutubeEmbedUrl = (url) => {
    if (!url) return '';
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    if (match && match[2].length === 11) {
      return `https://www.youtube.com/embed/${match[2]}`;
    }
    return url;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <Hero title="Gallery" subtitle="Preserving memories of our cultural celebrations" />

      <main className="flex-grow py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="text-center text-xl">Loading galleries...</div>
          ) : galleries.length > 0 ? (
            <div className="space-y-16">
              {galleries.map((gallery, index) => (
                <div key={gallery._id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                  {/* Gallery Header */}
                  <div className="bg-gradient-to-r from-primary to-secondary p-6">
                    <h2 className="text-3xl font-bold text-white mb-2">
                      {gallery.title}
                    </h2>
                    {gallery.eventDate && (
                      <p className="text-white text-opacity-90">
                        {new Date(gallery.eventDate).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    )}
                  </div>

                  {/* Gallery Images */}
                  {gallery.images && gallery.images.length > 0 && (
                    <div className="p-6">
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                        {gallery.images.map((image, imgIndex) => (
                          <div
                            key={imgIndex}
                            className="relative group overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer aspect-square"
                            onClick={() => openLightbox(gallery._id, imgIndex)}
                          >
                            <img
                              src={`${config.baseUrl}${image.url}`}
                              alt={`${gallery.title} - Image ${imgIndex + 1}`}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                            {/* Hover overlay */}
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                              <svg className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                              </svg>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* YouTube Videos */}
                  {gallery.youtubeLinks && gallery.youtubeLinks.length > 0 && (
                    <div className="p-6 pt-0">
                      <h3 className="text-2xl font-bold mb-4">Videos</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {gallery.youtubeLinks.map((video, videoIndex) => (
                          <div key={videoIndex} className="space-y-2">
                            {video.title && (
                              <h4 className="font-semibold text-lg">{video.title}</h4>
                            )}
                            <div className="relative aspect-video rounded-lg overflow-hidden shadow-md">
                              <iframe
                                src={getYoutubeEmbedUrl(video.url)}
                                title={video.title || `Video ${videoIndex + 1}`}
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                className="w-full h-full"
                              ></iframe>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {index < galleries.length - 1 && (
                    <div className="h-px bg-gray-200"></div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center">
              <p className="text-xl text-gray-600">No galleries available yet.</p>
              <p className="text-gray-500 mt-2">Check back soon for photos from our events!</p>
            </div>
          )}
        </div>
      </main>

      {/* Lightbox */}
      {lightbox.open && currentImages.length > 0 && (
        <Lightbox
          images={currentImages}
          currentIndex={lightbox.imageIndex}
          onClose={closeLightbox}
          onPrev={goPrev}
          onNext={goNext}
          galleryTitle={currentGallery?.title || ''}
        />
      )}

      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Gallery;
