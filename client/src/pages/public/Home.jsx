import { useState, useEffect } from 'react';
import Navbar from '../../components/public/Navbar';
import Footer from '../../components/public/Footer';
import Carousel from '../../components/public/Carousel';
import EventCard from '../../components/public/EventCard';
import PageRenderer from '../../components/public/PageRenderer';
import WhatsAppButton from '../../components/public/WhatsAppButton';
import { eventsAPI, pagesAPI, settingsAPI, carouselAPI } from '../../utils/api';
import config from '../../config/env';
import image1 from '../../assets/SKK_Sports_Event_2025.png';
import image2 from '../../assets/Srigandha_Kannada_shaale_registration_Web_banner_2.jpg';
import image3 from '../../assets/Srigandha_Teachers_Appreciation_Award.jpeg';

const Home = () => {
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [pageData, setPageData] = useState(null);
  const [settings, setSettings] = useState(null);
  const [carouselSlides, setCarouselSlides] = useState([]);
  const [loading, setLoading] = useState(true);

  // Default carousel images - used as fallback
  const defaultCarouselImages = [
    {
      src: image1,
      alt: 'SKK Sports Event 2025',
      caption: 'Join us for the SKK Sports Event 2025!'
    },
    {
      src: image2,
      alt: 'Kannada Shaale Registration',
      caption: 'Register now for Kannada Shaale'
    },
    {
      src: image3,
      alt: 'Teachers Appreciation Award',
      caption: 'Celebrating our dedicated teachers'
    }
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch events, page data, settings, and carousel in parallel
      const eventsPromise = eventsAPI.getAll('upcoming').catch(err => {
        console.error('Error fetching events:', err);
        return { data: [] };
      });

      const pagePromise = pagesAPI.getBySlug('home').catch(err => {
        console.error('Error fetching home page:', err);
        return { data: null };
      });

      const settingsPromise = settingsAPI.get().catch(err => {
        console.error('Error fetching settings:', err);
        return { data: null };
      });

      const carouselPromise = carouselAPI.getAll().catch(err => {
        console.error('Error fetching carousel:', err);
        return { data: [] };
      });

      const [eventsRes, pageRes, settingsRes, carouselRes] = await Promise.all([
        eventsPromise,
        pagePromise,
        settingsPromise,
        carouselPromise
      ]);

      setUpcomingEvents(eventsRes.data.slice(0, 3));
      setPageData(pageRes.data);
      setSettings(settingsRes.data);
      setCarouselSlides(carouselRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Get carousel images - prioritize API data, then page data, then defaults
  const getCarouselImages = () => {
    // First, check if we have carousel slides from API
    if (carouselSlides && carouselSlides.length > 0) {
      const images = carouselSlides.map(slide => ({
        src: `${config.baseUrl}${slide.image}`,
        alt: slide.title,
        caption: slide.caption
      }));
      return images;
    }

    // Second, check page data sections
    if (pageData && pageData.sections) {
      const carouselSection = pageData.sections.find(s => s.type === 'carousel');
      if (carouselSection && carouselSection.content.images) {
        return carouselSection.content.images;
      }
    }

    // Finally, return default images
    return defaultCarouselImages;
  };

  // Render default home page content as fallback
  const renderDefaultContent = () => (
    <>
      {/* Featured Images Section */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
            Our Community in Action
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Image 1 */}
            <div className="relative group overflow-hidden rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300">
              <img
                src="/gallery-1.png"
                alt="Cultural Event"
                className="w-full h-64 md:h-80 object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-white text-xl font-bold mb-2">Cultural Programs</h3>
                  <p className="text-white/90 text-sm">
                    Experience the richness of Kannada culture through our events
                  </p>
                </div>
              </div>
            </div>

            {/* Image 2 */}
            <div className="relative group overflow-hidden rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300">
              <img
                src="/gallery-2.png"
                alt="Community Gathering"
                className="w-full h-64 md:h-80 object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-white text-xl font-bold mb-2">Community Events</h3>
                  <p className="text-white/90 text-sm">
                    Building connections and celebrating together
                  </p>
                </div>
              </div>
            </div>

            {/* Image 3 */}
            <div className="relative group overflow-hidden rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300">
              <img
                src="/gallery-3.png"
                alt="Festival Celebration"
                className="w-full h-64 md:h-80 object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-white text-xl font-bold mb-2">Festivals & Celebrations</h3>
                  <p className="text-white/90 text-sm">
                    Honoring traditions and creating memories
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* View More Button */}
          <div className="text-center mt-8">
            <a
              href="/gallery"
              className="inline-block bg-[#fecc01] text-gray-800 font-semibold px-8 py-3 rounded-md hover:bg-[#ffa726] transition-colors duration-300 shadow-md hover:shadow-lg"
            >
              View Full Gallery
            </a>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Upcoming Events</h2>

          {loading ? (
            <div className="text-center">Loading...</div>
          ) : upcomingEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {upcomingEvents.map((event) => (
                <EventCard key={event._id} event={event} />
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-600">No upcoming events at the moment.</p>
          )}

          <div className="text-center mt-8">
            <a
              href="/events"
              className="inline-block bg-primary text-white px-8 py-3 rounded-md hover:bg-opacity-90 transition"
            >
              View All Events
            </a>
          </div>
        </div>
      </section>

      {settings?.membershipPlans && settings.membershipPlans.length > 0 && (
        <section className="bg-gray-100 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12">Membership Plans</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {settings.membershipPlans.map((plan, index) => (
                <div
                  key={index}
                  className={`bg-white rounded-lg shadow-md p-8 text-center ${plan.popular ? 'border-4 border-primary' : ''
                    }`}
                >
                  {plan.popular && (
                    <div className="bg-primary text-white text-sm px-3 py-1 rounded-full inline-block mb-4">
                      POPULAR
                    </div>
                  )}
                  <h3 className="text-2xl font-bold mb-4">{plan.name}</h3>
                  <div className="text-4xl font-bold text-primary mb-4">${plan.price}</div>
                  <p className="text-gray-600 mb-6">{plan.duration}</p>
                  <ul className="text-left space-y-2 mb-6">
                    {plan.benefits && plan.benefits.map((benefit, i) => (
                      <li key={i}>✓ {benefit}</li>
                    ))}
                  </ul>
                  <a
                    href={plan.registrationLink || 'https://widgets.mygumpu.com/memberships/signup/?sid=9'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block bg-primary text-white px-6 py-3 rounded-md hover:bg-opacity-90 transition"
                  >
                    Register
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">About Srigandha Kannada Koota</h2>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto mb-8">
            Srigandha Kannada Koota of Florida is a non-profit organization dedicated to
            preserving and promoting Kannada culture, language, and traditions among
            Kannada-speaking people in Florida.
          </p>
          <a
            href="/about"
            className="inline-block bg-secondary text-white px-8 py-3 rounded-md hover:bg-opacity-90 transition"
          >
            Learn More About Us
          </a>
        </div>
      </section>
    </>
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="text-xl">Loading...</div>
          </div>
        ) : (
          <>
            {/* Always show carousel at the top */}
            <section className="w-full">
              <Carousel images={getCarouselImages()} autoPlayInterval={5000} />
            </section>

            {pageData && pageData.isPublished && pageData.sections && pageData.sections.length > 0 ? (
              <>
                {/* Render custom page sections from admin */}
                <PageRenderer sections={pageData.sections} />

                {/* Always show upcoming events */}
                <section className="py-16">
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-center mb-12">Upcoming Events</h2>

                    {upcomingEvents.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {upcomingEvents.map((event) => (
                          <EventCard key={event._id} event={event} />
                        ))}
                      </div>
                    ) : (
                      <p className="text-center text-gray-600">No upcoming events at the moment.</p>
                    )}

                    <div className="text-center mt-8">
                      <a
                        href="/events"
                        className="inline-block bg-primary text-white px-8 py-3 rounded-md hover:bg-opacity-90 transition"
                      >
                        View All Events
                      </a>
                    </div>
                  </div>
                </section>
              </>
            ) : (
              renderDefaultContent()
            )}
          </>
        )}
      </main>

      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Home;
