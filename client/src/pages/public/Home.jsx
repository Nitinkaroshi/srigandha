import { useState, useEffect } from 'react';
import Navbar from '../../components/public/Navbar';
import Footer from '../../components/public/Footer';
import Carousel from '../../components/public/Carousel';
import PageRenderer from '../../components/public/PageRenderer';
import WhatsAppButton from '../../components/public/WhatsAppButton';
import { pagesAPI, settingsAPI, carouselAPI, membersAPI, memberAuthAPI } from '../../utils/api';
import { useMemberAuth } from '../../context/MemberAuthContext';
import { toast } from 'sonner';
import config from '../../config/env';
import image1 from '../../assets/SKK_Sports_Event_2025.png';
import image2 from '../../assets/Srigandha_Kannada_shaale_registration_Web_banner_2.jpg';
import image3 from '../../assets/Srigandha_Teachers_Appreciation_Award.jpeg';

const MembershipPlans = ({ plans, portalUrl }) => {
  const { member, isMemberAuthenticated, isActiveMember, isGuestMember, refreshProfile } = useMemberAuth();
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    city: '',
    state: '',
    zip: '',
    paymentMethod: 'online',
    notes: ''
  });

  // Auto-fill form for logged-in members
  useEffect(() => {
    if (isMemberAuthenticated && member) {
      setFormData((prev) => ({
        ...prev,
        name: member.name || prev.name,
        email: member.email || prev.email,
        phone: member.phone || prev.phone,
        city: member.address?.city || prev.city,
        state: member.address?.state || prev.state,
        zip: member.address?.zip || prev.zip,
      }));
    }
  }, [isMemberAuthenticated, member]);

  const handleRegister = (planName) => {
    if (submitted) return;
    setSelectedPlan(selectedPlan === planName ? null : planName);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      // If logged in as guest member, use the registerPlan API
      if (isMemberAuthenticated && isGuestMember) {
        await memberAuthAPI.registerPlan({ plan: selectedPlan });
        await refreshProfile();
        toast.success('Membership application submitted! We will review it shortly.');
        setSubmitted(true);
        setSelectedPlan(null);
      } else {
        // For non-logged-in users, use the public registration
        await membersAPI.register({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          address: { city: formData.city, state: formData.state, zip: formData.zip },
          plan: selectedPlan,
          paymentMethod: formData.paymentMethod,
          notes: formData.notes
        });
        toast.success('Membership registration submitted! We will review and confirm shortly.');
        setSubmitted(true);
        setSelectedPlan(null);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Determine what to show for each plan's action button
  const renderPlanAction = (plan) => {
    // Active member - show badge
    if (isMemberAuthenticated && isActiveMember) {
      return (
        <span className="bg-green-100 text-green-800 px-4 py-3 rounded-md text-sm font-medium">
          Active Member
        </span>
      );
    }
    // Pending member - show under review
    if (isMemberAuthenticated && member?.status === 'pending') {
      return (
        <span className="bg-yellow-100 text-yellow-800 px-4 py-3 rounded-md text-sm font-medium">
          Under Review
        </span>
      );
    }
    // Guest or not logged in - show register button
    if (!submitted) {
      return (
        <button
          onClick={() => handleRegister(plan.name)}
          className="bg-secondary text-white px-6 py-3 rounded-md hover:bg-opacity-90 transition"
        >
          {selectedPlan === plan.name ? 'Cancel' : 'Register Here'}
        </button>
      );
    }
    return (
      <span className="bg-green-100 text-green-800 px-4 py-3 rounded-md text-sm font-medium">
        Registered
      </span>
    );
  };

  return (
    <section className="bg-gray-100 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-12">Membership Plans</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`bg-white rounded-lg shadow-md p-8 text-center ${plan.popular ? 'border-4 border-primary' : ''}`}
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
                  <li key={i}>&#10003; {benefit}</li>
                ))}
              </ul>

              <div className="flex flex-wrap gap-2 justify-center">
                {plan.registrationLink && (
                  <a
                    href={plan.registrationLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-primary text-white px-6 py-3 rounded-md hover:bg-opacity-90 transition"
                  >
                    Register & Pay
                  </a>
                )}
                {renderPlanAction(plan)}
              </div>

              {selectedPlan === plan.name && (
                <form onSubmit={handleSubmit} className="mt-6 space-y-3 border-t pt-4 text-left">
                  {isMemberAuthenticated && (
                    <div className="bg-blue-50 text-blue-700 text-xs px-3 py-2 rounded-md mb-2">
                      Signed in as {member?.name || member?.email} - form auto-filled
                    </div>
                  )}
                  <input
                    type="text"
                    required
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                  <input
                    type="email"
                    required
                    placeholder="Email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                  <input
                    type="tel"
                    required
                    placeholder="Phone Number"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <input
                      type="text"
                      placeholder="City"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                    <input
                      type="text"
                      placeholder="State"
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                    <input
                      type="text"
                      placeholder="ZIP"
                      value={formData.zip}
                      onChange={(e) => setFormData({ ...formData, zip: e.target.value })}
                      className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                  <select
                    value={formData.paymentMethod}
                    onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-primary"
                  >
                    <option value="online">Online Payment</option>
                    <option value="zelle">Zelle</option>
                    <option value="check">Check</option>
                    <option value="cash">Cash</option>
                    <option value="other">Other</option>
                  </select>
                  <textarea
                    placeholder="Any notes (optional)"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    rows="2"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-primary text-white py-2 rounded-md hover:bg-opacity-90 transition text-sm disabled:opacity-50"
                  >
                    {submitting ? 'Submitting...' : 'Submit Registration'}
                  </button>
                </form>
              )}
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

      const [pageRes, settingsRes, carouselRes] = await Promise.all([
        pagePromise,
        settingsPromise,
        carouselPromise
      ]);

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

  // President's Message section
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

  // Sponsors section
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

      {/* Sponsors */}
      {renderSponsors()}

      {settings?.membershipPlans && settings.membershipPlans.length > 0 && (
        <MembershipPlans plans={settings.membershipPlans} portalUrl={settings.membershipPortalUrl} />
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
                <PageRenderer sections={pageData.sections} />
                {renderPresidentMessage()}
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
