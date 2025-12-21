import { useState, useEffect } from 'react';
import Navbar from '../../components/public/Navbar';
import Footer from '../../components/public/Footer';
import Hero from '../../components/public/Hero';
import PageRenderer from '../../components/public/PageRenderer';
import WhatsAppButton from '../../components/public/WhatsAppButton';
import { pagesAPI } from '../../utils/api';
import logo from '../../assets/SRIGANDHA_LOGO.png';

const About = () => {
  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetchPageData();
  }, []);

  const fetchPageData = async () => {
    try {
      const response = await pagesAPI.getBySlug('about');
      setPageData(response.data);
      setError(false);
    } catch (error) {
      console.error('Error fetching about page:', error);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  // Fallback content if page not found in database
  const renderFallbackContent = () => (
    <>
      <Hero title="About Us" subtitle="Srigandha Kannada Koota of Florida" />

      <main className="flex-grow py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-center mb-16">
            <img
              src={logo}
              alt="Srigandha Logo"
              className="w-48 md:w-64 h-auto mb-8 md:mb-0 md:mr-12 animate-fade-in"
            />
            <div className="prose prose-lg max-w-none">
              <h2 className="text-3xl font-bold mb-4 text-primary">Our Story</h2>
              <p className="text-gray-700 leading-relaxed text-lg">
                In the year 1992, a small group of Kannadigas in Florida had a big aspiration.
                Their goal was to unite all the Kannadigas of Florida and promote the rich culture of Karnataka.
                The main intent was to pass on the tradition of Karnataka to the next generation growing up in America,
                and to instill in them, an awareness of their roots. They named this organization “ಶ್ರೀಗಂಧ” (Srigandha)
                in honor of the fragrant Sandalwood tree of Karnataka.
              </p>
            </div>
          </div>

          <div className="mb-16">
            <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">Our Journey Through History</h2>
            <div className="relative border-l-4 border-primary ml-6 md:ml-12 space-y-12">

              {/* November 1992 */}
              <div className="relative pl-8 md:pl-12">
                <div className="absolute -left-3 bg-white border-4 border-primary rounded-full w-6 h-6 mt-1.5"></div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">November 1992 – The Beginning (Orlando)</h3>
                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
                  <ul className="list-disc ml-5 text-gray-700 space-y-2">
                    <li>Held at Radisson Inn, Orlando.</li>
                    <li>Cultural program presented by local talent of all ages.</li>
                    <li>Women’s session and Youth session.</li>
                    <li>Authentic and tasty Karnataka food.</li>
                    <li>An evening with music and dance lead by a DJ.</li>
                  </ul>
                  <div className="mt-4 bg-yellow-50 p-4 rounded-md">
                    <h4 className="font-semibold text-primary mb-2">Founding Leadership</h4>
                    <p className="text-sm text-gray-700">
                      Renuka Ramappa (First President), Nalini Mruthyunjaya, Viju Prakash, Indira Sastry, Gopal Hegde,
                      Revathi Iyengar, Leela Vaidya, Vasundhara Iyengar, Mangala Kumar, Kala Seshadri, Ponamma Vasudev,
                      Jyothi Srinath, Shobha Shastry, Sandhya Srinivasan, Keshava Babu, and K.V. Sundaresh.
                    </p>
                  </div>
                </div>
              </div>

              {/* May 1994 */}
              <div className="relative pl-8 md:pl-12">
                <div className="absolute -left-3 bg-white border-4 border-primary rounded-full w-6 h-6 mt-1.5"></div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">May 1994 – Orlando</h3>
                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
                  <p className="text-gray-700 mb-2">Radisson Inn, Orlando.</p>
                  <ul className="list-disc ml-5 text-gray-700 space-y-1">
                    <li>Cultural activities and sumptuous food.</li>
                    <li><strong>Sri Sant Keshava Das</strong>, an iconic Harikatha Daasaru from Bangalore addressed the gathering.</li>
                  </ul>
                </div>
              </div>

              {/* November 1995 */}
              <div className="relative pl-8 md:pl-12">
                <div className="absolute -left-3 bg-white border-4 border-primary rounded-full w-6 h-6 mt-1.5"></div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">November 1995 – West Palm Beach</h3>
                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
                  <p className="text-gray-700">
                    The children of prior years, now in their teens, participated enthusiastically in many activities.
                    The fundamental desire of the adults seemed to be achieving its goal.
                  </p>
                </div>
              </div>

              {/* May 1997 */}
              <div className="relative pl-8 md:pl-12">
                <div className="absolute -left-3 bg-white border-4 border-primary rounded-full w-6 h-6 mt-1.5"></div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">May 1997 – Tampa</h3>
                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
                  <p className="text-gray-700 mb-2">India Cultural Center, Tampa.</p>
                  <ul className="list-disc ml-5 text-gray-700 space-y-1">
                    <li>Cultural show and indoor games.</li>
                    <li>Youth sessions, group meetings and talks on health awareness by volunteer health specialists.</li>
                  </ul>
                </div>
              </div>

              {/* November 1998 */}
              <div className="relative pl-8 md:pl-12">
                <div className="absolute -left-3 bg-white border-4 border-primary rounded-full w-6 h-6 mt-1.5"></div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">November 1998 – Orlando</h3>
                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
                  <p className="text-gray-700 mb-2">It was a two-day get together.</p>
                  <ul className="list-disc ml-5 text-gray-700 space-y-1">
                    <li><strong>Manjula Gururaj</strong> and party performed with their orchestra.</li>
                    <li><strong>Yashawant Sardeshpande</strong> and troop performed a hilarious drama “All the best”.</li>
                    <li>Mimicry by Dayanand and Kannada Bhavagethae by Puttur Narasimha Nayak.</li>
                  </ul>
                  <p className="mt-2 text-primary font-medium">Nijakku Habba!</p>
                </div>
              </div>

              {/* September 2000 */}
              <div className="relative pl-8 md:pl-12">
                <div className="absolute -left-3 bg-white border-4 border-primary rounded-full w-6 h-6 mt-1.5"></div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">September 2000 – Tampa</h3>
                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
                  <p className="text-gray-700 mb-2">Hindu Temple Hall, Tampa.</p>
                  <ul className="list-disc ml-5 text-gray-700 space-y-1">
                    <li><strong>Yakshagana:</strong> Performed by artists from Karnataka.</li>
                    <li><strong>Kavya Chitra:</strong> Fusion of poetry and art. As the poet composed his poetry on the spot, the artist painted the picture. Paintings were sold to the highest bidder.</li>
                  </ul>
                </div>
              </div>

              {/* April 2002 */}
              <div className="relative pl-8 md:pl-12">
                <div className="absolute -left-3 bg-white border-4 border-primary rounded-full w-6 h-6 mt-1.5"></div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">April 2002 – Fort Lauderdale</h3>
                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
                  <p className="text-gray-700 mb-2">Marriott Hotel.</p>
                  <ul className="list-disc ml-5 text-gray-700 space-y-1">
                    <li>Cultural program in the Shiva Vishnu temple.</li>
                    <li>Evening cruise on the Atlantic.</li>
                    <li>Outdoor Masala Dosa party in a park the next day.</li>
                  </ul>
                </div>
              </div>

              {/* September 2004 */}
              <div className="relative pl-8 md:pl-12">
                <div className="absolute -left-3 bg-white border-4 border-primary rounded-full w-6 h-6 mt-1.5"></div>
                <h3 className="text-2xl font-bold text-primary mb-2">September 2004 – 3rd World Kannada Convention</h3>
                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 ring-2 ring-primary/20">
                  <p className="text-gray-700 leading-relaxed mb-3">
                    <strong>Srigandha and AKKA</strong> hosted this prestigious convention at the luxurious Gaylord Palms Resort in Orlando.
                  </p>
                  <p className="text-gray-700">
                    It was a great success despite a major hurricane. It began with the Merevanigae of Sri Krishnadevaraya
                    and displayed the glory of the Vijayanagara Empire. The talent and exhibits were stupendous.
                  </p>
                </div>
              </div>

              {/* 2004 - 2012 */}
              <div className="relative pl-8 md:pl-12">
                <div className="absolute -left-3 bg-white border-4 border-primary rounded-full w-6 h-6 mt-1.5"></div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">2004 – 2012: The Golden Era</h3>
                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
                  <ul className="list-disc ml-5 text-gray-700 space-y-2">
                    <li>Honored many artists, authors, dramatists, and musicians.</li>
                    <li><strong>Master Hirannaiah</strong> graced Srigandha with performances.</li>
                    <li>Dances of India by the Natya Institute of Kathak and Choreography.</li>
                    <li>Major festivals like Shankranthi, Ugadi, Ganesha Chaturthi and Deepavali celebrated annually.</li>
                    <li>Community engagement with FIA Tampa Bay, picnics, and charitable support.</li>
                  </ul>
                </div>
              </div>

              {/* May 2012 */}
              <div className="relative pl-8 md:pl-12">
                <div className="absolute -left-3 bg-white border-4 border-primary rounded-full w-6 h-6 mt-1.5"></div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">May 2012 – Tampa</h3>
                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
                  <p className="text-gray-700">
                    Musical concert presented by noted Kannada playback singers <strong>Ajay Warrier</strong> and <strong>Divya Raghavan</strong> at the Hindu Temple Hall.
                  </p>
                </div>
              </div>

              {/* 2013 - 20th Anniversary */}
              <div className="relative pl-8 md:pl-12">
                <div className="absolute -left-3 bg-white border-4 border-primary rounded-full w-6 h-6 mt-1.5"></div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">2013: 20th Anniversary Celebration</h3>
                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
                  <p className="text-gray-700 mb-2 font-medium">Srigandha Camp at Lake Louisa State Park near Orlando.</p>
                  <ul className="list-disc ml-5 text-gray-700 space-y-1">
                    <li>Celebrated the 20th anniversary with grandeur.</li>
                    <li>Comedy by famous comedian <strong>Sri Yashavanth Sardeshpande</strong>.</li>
                    <li>Music by Ajay Warrier and variety entertainment by local artists.</li>
                  </ul>
                </div>
              </div>

              {/* 2014 - 2018 Highlights */}
              <div className="relative pl-8 md:pl-12">
                <div className="absolute -left-3 bg-white border-4 border-primary rounded-full w-6 h-6 mt-1.5"></div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">2014 - 2018: Recent Highlights</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                    <span className="text-primary font-bold block mb-1">2014</span>
                    <p className="text-sm text-gray-700">Mruthyunjaya Doddawade Sangeetha Sanje & Hasya by Smt. Sudha Beragur.</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                    <span className="text-primary font-bold block mb-1">2015</span>
                    <p className="text-sm text-gray-700"><strong>Mukyamantri Chandru</strong> performed his famous drama along with local artists.</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                    <span className="text-primary font-bold block mb-1">2016</span>
                    <p className="text-sm text-gray-700">Ugadi celebration with music by Smt. Ratnamala Prakash.</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                    <span className="text-primary font-bold block mb-1">2017</span>
                    <p className="text-sm text-gray-700">Music concert by Smt. Manjula Gururaj and Sri Badri Prasad.</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                    <span className="text-primary font-bold block mb-1">Jan 2018</span>
                    <p className="text-sm text-gray-700">Sankranthi celebration and election of new office bearers.</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                    <span className="text-primary font-bold block mb-1">Apr 2018</span>
                    <p className="text-sm text-gray-700">Ugadi celebration and music concert by Smt. Sunita and Smt. Anita Anantaswamy.</p>
                  </div>
                </div>
              </div>

              {/* Silver Jubilee 2018 */}
              <div className="relative pl-8 md:pl-12">
                <div className="absolute -left-3 bg-white border-4 border-primary rounded-full w-6 h-6 mt-1.5"></div>
                <div className="bg-gradient-to-r from-yellow-100 to-yellow-50 p-8 rounded-xl border border-yellow-200 shadow-md">
                  <h3 className="text-3xl font-bold text-primary mb-4">🏆 Silver Jubilee (Sept 2018)</h3>
                  <p className="text-gray-800 text-lg italic leading-relaxed">
                    "On this distinguished occasion, let us all get together as one Kannada Kutumba, to celebrate the memories of yesterday, the joys of today and the hopes of tomorrow."
                  </p>
                </div>
              </div>

            </div>
          </div>

          <div className="prose prose-lg max-w-none mb-16">
            <h2 className="text-3xl font-bold mb-6 text-center text-primary">Our Objectives</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-sm border-t-4 border-secondary hover:shadow-md transition">
                <div className="text-3xl mb-3">🤝</div>
                <p className="font-medium text-gray-800">
                  To provide a forum for literary, cultural, educational, sports, community service and recreational activities for the members.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border-t-4 border-secondary hover:shadow-md transition">
                <div className="text-3xl mb-3">📅</div>
                <p className="font-medium text-gray-800">
                  To coordinate activities of interest to the members and the community.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border-t-4 border-secondary hover:shadow-md transition">
                <div className="text-3xl mb-3">🕉️</div>
                <p className="font-medium text-gray-800">
                  To promote the awareness of Kannada language and the cultural heritage of Karnataka.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border-t-4 border-secondary hover:shadow-md transition">
                <div className="text-3xl mb-3">💝</div>
                <p className="font-medium text-gray-800">
                  To raise, solicit, and receive funds and donations to support the activities of the organization.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl p-8 md:p-12 text-center">
            <h3 className="text-2xl md:text-3xl font-bold mb-4 text-gray-800">Join Our Community</h3>
            <p className="text-gray-700 mb-8 max-w-2xl mx-auto text-lg">
              Become a life member or renew your annual membership to support our initiatives and be part of our growing family.
            </p>
            <a
              href="https://widgets.mygumpu.com/memberships/signup/?sid=9"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-primary text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-opacity-90 hover:scale-105 transition transform shadow-lg"
            >
              Become a Member
            </a>
          </div>
        </div>
      </main>
    </>
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {loading ? (
        <div className="flex-grow flex items-center justify-center">
          <div className="text-xl">Loading...</div>
        </div>
      ) : error || !pageData || !pageData.isPublished ? (
        renderFallbackContent()
      ) : (
        <main className="flex-grow">
          <PageRenderer sections={pageData.sections} />
        </main>
      )}

      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default About;
