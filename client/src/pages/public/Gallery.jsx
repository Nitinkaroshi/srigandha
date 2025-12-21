import { useState, useEffect, useCallback } from 'react';
import Navbar from '../../components/public/Navbar';
import Footer from '../../components/public/Footer';
import Hero from '../../components/public/Hero';
import WhatsAppButton from '../../components/public/WhatsAppButton';
import { galleryAPI } from '../../utils/api';
import config from '../../config/env';

const Gallery = () => {
  const [galleries, setGalleries] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchGalleries = useCallback(async () => {
    try {
      const response = await galleryAPI.getAll();
      // Sort by event date descending (most recent first)
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

  const getYoutubeEmbedUrl = (url) => {
    if (!url) return '';

    // Extract video ID from various YouTube URL formats
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
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {gallery.images.map((image, imgIndex) => (
                          <div
                            key={imgIndex}
                            className="relative group overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300"
                          >
                            <img
                              src={`${config.baseUrl}${image.url}`}
                              alt={`${gallery.title} - Image ${imgIndex + 1}`}
                              className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                            />
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

                  {/* Divider between galleries (except last one) */}
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

      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Gallery;
