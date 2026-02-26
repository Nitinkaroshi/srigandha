import { useState, useEffect } from 'react';
import Navbar from '../../components/public/Navbar';
import Footer from '../../components/public/Footer';
import Carousel from '../../components/public/Carousel';
import PageRenderer from '../../components/public/PageRenderer';
import WhatsAppButton from '../../components/public/WhatsAppButton';
import EventCard from '../../components/public/EventCard';
import { pagesAPI, settingsAPI, carouselAPI, eventsAPI } from '../../utils/api';
import config from '../../config/env';
import image1 from '../../assets/SKK_Sports_Event_2025.png';
import image2 from '../../assets/Srigandha_Kannada_shaale_registration_Web_banner_2.jpg';
import image3 from '../../assets/Srigandha_Teachers_Appreciation_Award.jpeg';

const MembershipPlans = () => {
  const plans = [
    {
      name: 'Single',
      price: 20,
      duration: '1 Year Membership',
      benefits: ['Discounted Event Tickets', 'Network With Members', 'Community Updates'],
    },
    {
      name: 'Family',
      price: 35,
      duration: '1 Year Membership',
      popular: true,
      benefits: ['Discounted Event Tickets', 'Network With Members', 'Community Updates', 'Family Coverage'],
    },
    {
      name: 'Life Time',
      price: 350,
      duration: 'One-Time Payment',
      benefits: ['Discounted Event Tickets', 'Network With Members', 'Community Updates', 'Lifetime Access'],
    },
  ];

  return (
    <section className="py-16 bg-gradient-to-b from-gray-100 to-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-gray-800">Become a Member Today</h2>
        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          Join the Srigandha Kannada Koota family and enjoy exclusive benefits while supporting our community.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`bg-white rounded-lg shadow-md p-8 text-center hover:shadow-xl transition-shadow ${plan.popular ? 'border-4 border-primary ring-2 ring-primary/20' : ''}`}
            >
              {plan.popular && (
                <div className="bg-primary text-white text-sm px-3 py-1 rounded-full inline-block mb-4">
                  POPULAR
                </div>
              )}
              <h3 className="text-2xl font-bold mb-4">{plan.name}</h3>
              <div className="text-4xl font-bold text-primary mb-4">${plan.price}</div>
              <p className="text-gray-600 mb-6">{plan.duration}</p>
              <ul className="text-left space-y-2 mb-8">
                {plan.benefits.map((benefit, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="text-green-500">&#10003;</span>
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
              <a
                href="https://www.mygumpu.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-secondary text-white px-8 py-3 rounded-md hover:bg-opacity-90 transition font-semibold w-full"
              >
                Register Now
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Home = () => {
  const [pageData, setPageData] = useState(null);
  const [settings, setSettings] = useState(null);
  const [carouselSlides, setCarouselSlides] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const defaultCarouselImages = [
    { src: image1, alt: 'SKK Sports Event 2025', caption: 'Join us for the SKK Sports Event 2025!' },
    { src: image2, alt: 'Kannada Shaale Registration', caption: 'Register now for Kannada Shaale' },
    { src: image3, alt: 'Teachers Appreciation Award', caption: 'Celebrating our dedicated teachers' }
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [pageRes, settingsRes, carouselRes, eventsRes] = await Promise.all([
        pagesAPI.getBySlug('home').catch(() => ({ data: null })),
        settingsAPI.get().catch(() => ({ data: null })),
        carouselAPI.getAll().catch(() => ({ data: [] })),
        eventsAPI.getAll('upcoming').catch(() => ({ data: [] })),
      ]);

      setPageData(pageRes.data);
      setSettings(settingsRes.data);
      setCarouselSlides(carouselRes.data);
      setUpcomingEvents(eventsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCarouselImages = () => {
    if (carouselSlides && carouselSlides.length > 0) {
      return carouselSlides.map(slide => ({
        src: `${config.baseUrl}${slide.image}`,
        alt: slide.title,
        caption: slide.caption
      }));
    }
    if (pageData && pageData.sections) {
      const carouselSection = pageData.sections.find(s => s.type === 'carousel');
      if (carouselSection && carouselSection.content.images) {
        return carouselSection.content.images;
      }
    }
    return defaultCarouselImages;
  };

  const renderPresidentMessage = () => {
    const pm = settings?.presidentMessage;
    if (!pm || !pm.message) return null;

    return (
      <section className="py-16 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-800">
            {pm.title || "President"}'s Message
          </h2>
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-12">
            {pm.photo && (
              <div className="flex-shrink-0">
                <div className="w-48 h-48 md:w-56 md:h-56 rounded-full overflow-hidden shadow-xl border-4 border-primary/20">
                  <img
                    src={`${config.baseUrl}${pm.photo}`}
                    alt={pm.name || 'President'}
                    className="w-full h-full object-cover"
                  />
                </div>
                {pm.name && (
                  <p className="text-center mt-4 font-semibold text-lg text-gray-800">{pm.name}</p>
                )}
                <p className="text-center text-sm text-primary font-medium">{pm.title || 'President'}</p>
              </div>
            )}
            <div className="flex-1">
              <div className="prose prose-lg max-w-none">
                <p className="text-gray-700 leading-relaxed text-lg whitespace-pre-line">{pm.message}</p>
              </div>
              {pm.messageKannada && (
                <div className="mt-6 p-4 bg-primary/5 rounded-lg border-l-4 border-primary">
                  <p
                    className="text-gray-700 leading-relaxed text-lg whitespace-pre-line"
                    style={{ fontFamily: "'Noto Sans Kannada', serif" }}
                  >
                    {pm.messageKannada}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    );
  };

  const renderSponsors = () => {
    const activeSponsors = settings?.sponsors?.filter(s => s.isActive)?.sort((a, b) => a.order - b.order);
    if (!activeSponsors || activeSponsors.length === 0) return null;

    return (
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-gray-800">
            Our Sponsors & Partners
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            We are grateful to our sponsors and partners who support our community initiatives.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8 items-center justify-items-center">
            {activeSponsors.map((sponsor) => (
              <a
                key={sponsor._id || sponsor.name}
                href={sponsor.url || '#'}
                target={sponsor.url ? '_blank' : '_self'}
                rel="noopener noreferrer"
                className="group flex flex-col items-center gap-3 p-4 rounded-lg hover:bg-white hover:shadow-md transition-all duration-300"
              >
                {sponsor.logo ? (
                  <img
                    src={`${config.baseUrl}${sponsor.logo}`}
                    alt={sponsor.name}
                    className="h-20 w-auto max-w-[160px] object-contain grayscale group-hover:grayscale-0 transition-all duration-300"
                  />
                ) : (
                  <div className="h-20 w-32 bg-gray-200 rounded-lg flex items-center justify-center">
                    <span className="text-gray-500 text-sm font-medium text-center px-2">{sponsor.name}</span>
                  </div>
                )}
                <span className="text-sm text-gray-600 font-medium text-center">{sponsor.name}</span>
              </a>
            ))}
          </div>
        </div>
      </section>
    );
  };

  const renderUpcomingEvents = () => {
    if (!upcomingEvents || upcomingEvents.length === 0) return null;

    return (
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-gray-800">
            Register for Upcoming Events
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Don't miss out on our exciting community events!
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {upcomingEvents.slice(0, 3).map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
          </div>
          <div className="text-center mt-10">
            <a
              href="/events"
              className="inline-block bg-primary text-white font-semibold px-8 py-3 rounded-md hover:bg-opacity-90 transition shadow-md hover:shadow-lg"
            >
              View All Events
            </a>
          </div>
        </div>
      </section>
    );
  };

  const renderDefaultContent = () => (
    <>
      {/* Featured Images Section */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
            Our Community in Action
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { src: '/gallery-1.png', alt: 'Cultural Event', title: 'Cultural Programs', desc: 'Experience the richness of Kannada culture through our events' },
              { src: '/gallery-2.png', alt: 'Community Gathering', title: 'Community Events', desc: 'Building connections and celebrating together' },
              { src: '/gallery-3.png', alt: 'Festival Celebration', title: 'Festivals & Celebrations', desc: 'Honoring traditions and creating memories' }
            ].map((item, i) => (
              <div key={i} className="relative group overflow-hidden rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300">
                <img src={item.src} alt={item.alt} className="w-full h-64 md:h-80 object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="text-white text-xl font-bold mb-2">{item.title}</h3>
                    <p className="text-white/90 text-sm">{item.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <a href="/gallery" className="inline-block bg-[#fecc01] text-gray-800 font-semibold px-8 py-3 rounded-md hover:bg-[#ffa726] transition-colors duration-300 shadow-md hover:shadow-lg">
              View Full Gallery
            </a>
          </div>
        </div>
      </section>

      {/* President's Message */}
      {renderPresidentMessage()}

      {/* Upcoming Events */}
      {renderUpcomingEvents()}

      {/* Membership Plans */}
      <MembershipPlans />

      {/* Sponsors */}
      {renderSponsors()}

      <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
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
            <section className="w-full relative">
              <Carousel images={getCarouselImages()} autoPlayInterval={5000} />
            </section>

            {/* Membership CTA Strip */}
            <section className="bg-gradient-to-r from-green-700 via-green-600 to-green-700 py-4">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6">
                <p className="text-white text-lg font-semibold text-center">
                  Join the Srigandha family — become a member today!
                </p>
                <a
                  href="https://www.mygumpu.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white text-green-700 font-bold px-6 py-2 rounded-full hover:bg-yellow-400 hover:text-gray-900 transition-all duration-300 shadow-md hover:shadow-lg text-sm whitespace-nowrap"
                >
                  Register for Membership
                </a>
              </div>
            </section>

            {pageData && pageData.isPublished && pageData.sections && pageData.sections.length > 0 ? (
              <>
                <PageRenderer sections={pageData.sections} />
                {renderPresidentMessage()}
                {renderUpcomingEvents()}
                <MembershipPlans />
                {renderSponsors()}
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
