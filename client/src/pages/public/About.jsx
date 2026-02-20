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

  const renderFallbackContent = () => (
    <>
      <Hero title="About Us" subtitle="Srigandha Kannada Koota of Florida" />

      <main className="flex-grow py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Intro with Logo */}
          <div className="flex flex-col md:flex-row items-center justify-center mb-16">
            <img
              src={logo}
              alt="Srigandha Logo"
              className="w-48 md:w-64 h-auto mb-8 md:mb-0 md:mr-12 animate-fade-in"
            />
            <div className="prose prose-lg max-w-none">
              <h2 className="text-3xl font-bold mb-4 text-primary">Srigandha Kannada Koota</h2>
              <p
                className="text-xl text-primary font-semibold mb-4 italic"
                style={{ fontFamily: "'Noto Sans Kannada', serif" }}
              >
                "&#x0C95;&#x0CA8;&#x0CCD;&#x0CA8;&#x0CA1;&#x0CBF;&#x0C97;&#x0CB0;&#x0CC1; &#x0C92;&#x0C82;&#x0CA6;&#x0CBE;&#x0CA6;&#x0CBE;&#x0C97; &#x0C8E;&#x0CB2;&#x0CCD;&#x0CB2;&#x0CC6;&#x0CA1;&#x0CC6; &#x0C95;&#x0CB0;&#x0CCD;&#x0CA8;&#x0CBE;&#x0C9F;&#x0C95;&#x0CB5;&#x0CC7;"
              </p>
              <p className="text-gray-600 italic mb-4">
                When Kannadigas unite, the spirit of Karnataka lives wherever they stand.
              </p>
              <p className="text-gray-700 leading-relaxed text-lg">
                Srigandha Kannada Koota of Florida is a <strong>beacon of Kannada identity, culture, and community</strong> &mdash; a non-profit organization dedicated to preserving, nurturing, and celebrating the <strong>language, traditions, and values of Karnataka</strong> among Kannadigas living in Florida and beyond.
              </p>
              <p className="text-gray-700 leading-relaxed text-lg mt-4">
                Founded in <strong>1992</strong>, Srigandha was born from a powerful realization shared by a small group of visionaries: that distance from the homeland should never mean distance from one&rsquo;s roots, that language must be spoken to survive, and that culture must be lived to endure.
              </p>
              <p className="text-gray-700 leading-relaxed text-lg mt-4">
                The organization was named <strong>&ldquo;&#x0CB6;&#x0CCD;&#x0CB0;&#x0CC0;&#x0C97;&#x0C82;&#x0CA7; (Srigandha)&rdquo;</strong>, after the sacred sandalwood tree of Karnataka &mdash; renowned for its fragrance, strength, and longevity. Just like sandalwood, Srigandha represents a heritage that grows quietly yet leaves a lasting presence, enriching everything around it.
              </p>
            </div>
          </div>

          {/* Our Origins */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Our Origins: A Dream Takes Shape</h2>
            <div className="bg-white p-8 rounded-lg shadow-md border border-gray-100">
              <p className="text-gray-700 leading-relaxed text-lg mb-4">
                In the early 1990s, as Kannada families began settling across Florida, there arose a shared longing &mdash; for familiar festivals, for Kannada conversations, for traditions that reminded them of home. In response to this need, Srigandha Kannada Koota was formed as a unifying platform to bring Kannadigas together and ensure that <strong>Karnataka&rsquo;s cultural legacy would continue to flourish on American soil</strong>.
              </p>
              <p className="text-gray-700 leading-relaxed text-lg mb-4">
                The first Srigandha gathering in <strong>November 1992 in Orlando</strong> set the tone for what the organization would become: a warm, inclusive space where elders, youth, artists, families, and professionals came together to celebrate Kannada culture through music, dance, literature, food, and fellowship.
              </p>
              <p className="text-gray-700 leading-relaxed text-lg font-medium text-primary">
                What started as a single event soon became a movement.
              </p>
            </div>
          </div>

          {/* Growth & Cultural Stewardship */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">A Journey of Growth and Cultural Stewardship</h2>
            <div className="bg-white p-8 rounded-lg shadow-md border border-gray-100">
              <p className="text-gray-700 leading-relaxed text-lg mb-4">
                Over the decades, Srigandha has grown steadily &mdash; both in size and in purpose. From Orlando to Tampa, West Palm Beach to Fort Lauderdale, the organization expanded its reach, hosting events that reflected the <strong>diversity and richness of Karnataka&rsquo;s traditions</strong>.
              </p>
              <p className="text-gray-700 leading-relaxed text-lg mb-4">
                Srigandha became known not only for its celebrations, but for its commitment to <strong>quality, authenticity, and community involvement</strong>. Cultural programs featured a blend of local talent and renowned artists from Karnataka, while youth and women&rsquo;s sessions created spaces for dialogue, learning, and leadership.
              </p>
              <div className="bg-gradient-to-r from-primary/10 to-secondary/10 p-6 rounded-lg mt-6">
                <p className="text-gray-700 leading-relaxed text-lg">
                  A defining chapter in Srigandha&rsquo;s history came in <strong>2004</strong>, when the organization, along with AKKA, co-hosted the <strong>3rd World Kannada Convention</strong> at the Gaylord Palms Resort in Orlando. Despite formidable challenges, the convention stood as a proud testament to global Kannada unity &mdash; showcasing the grandeur of Karnataka&rsquo;s history, arts, and intellectual heritage on an international stage.
                </p>
              </div>
            </div>
          </div>

          {/* Preserving the Past */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Preserving the Past, Empowering the Present</h2>
            <div className="bg-white p-8 rounded-lg shadow-md border border-gray-100">
              <p className="text-gray-700 leading-relaxed text-lg mb-6">
                From <strong>2004 through 2018</strong>, Srigandha entered a period of remarkable cultural impact. During these years, the organization:
              </p>
              <ul className="space-y-3 mb-6">
                {[
                  'Celebrated all major Kannada festivals annually, including Ugadi, Sankranthi, Kannada Rajyotsava, Ganesh Chaturthi, and Deepavali',
                  'Honored legendary Kannada artists, musicians, dramatists, authors, and scholars',
                  'Hosted performances and programs that ranged from classical to contemporary',
                  'Strengthened bonds through picnics, sports events, youth activities, and charitable initiatives',
                  'Collaborated with multicultural organizations across the Tampa Bay region'
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-gray-700 text-lg">
                    <span className="text-primary mt-1 flex-shrink-0">&#10003;</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <div className="bg-gradient-to-r from-yellow-100 to-yellow-50 p-6 rounded-xl border border-yellow-200">
                <p className="text-gray-800 text-lg leading-relaxed">
                  In <strong>2018</strong>, Srigandha proudly marked its <strong>Silver Jubilee &mdash; 25 years of service, culture, and community</strong> &mdash; a milestone that reflected not just longevity, but relevance, trust, and impact.
                </p>
              </div>
            </div>
          </div>

          {/* Our Purpose */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold mb-8 text-center text-primary">Our Purpose and Principles</h2>
            <p className="text-gray-700 text-lg text-center mb-8">
              Srigandha Kannada Koota exists to serve a purpose larger than events alone. Our guiding objectives are to:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { icon: '&#x1F3AD;', text: 'Preserve and promote the Kannada language and Karnataka\'s cultural heritage' },
                { icon: '&#x1F3A4;', text: 'Provide a vibrant platform for cultural, literary, educational, sports, and community service activities' },
                { icon: '&#x1F91D;', text: 'Foster a strong sense of belonging, identity, and pride among Kannadigas' },
                { icon: '&#x1F31F;', text: 'Inspire the next generation to embrace their roots with confidence' },
                { icon: '&#x1F30D;', text: 'Build bridges between Karnataka and the global Kannada diaspora' },
                { icon: '&#x2696;&#xFE0F;', text: 'Operate with integrity, transparency, and volunteer-driven leadership' }
              ].map((item, i) => (
                <div key={i} className="bg-white p-6 rounded-lg shadow-sm border-t-4 border-secondary hover:shadow-md transition">
                  <div className="text-3xl mb-3" dangerouslySetInnerHTML={{ __html: item.icon }} />
                  <p className="font-medium text-gray-800">{item.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Community */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">A Community Built by People</h2>
            <div className="bg-white p-8 rounded-lg shadow-md border border-gray-100">
              <p className="text-gray-700 leading-relaxed text-lg mb-4">
                Srigandha is powered entirely by its people &mdash; volunteers who give their time, talent, and heart to serve the community. Guided by an elected executive committee, the organization thrives on <strong>collective leadership, inclusivity, and shared responsibility</strong>.
              </p>
              <p className="text-gray-700 leading-relaxed text-lg mb-4">
                Families, elders, youth, artists, professionals, and students all play a role in shaping Srigandha. Every program, celebration, and initiative is a reflection of community ownership and participation.
              </p>
              <p className="text-gray-700 leading-relaxed text-lg font-medium">
                Our strength lies not in structures or stages, but in <strong>relationships built over decades</strong> and renewed with every gathering.
              </p>
            </div>
          </div>

          {/* Looking Ahead */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Looking Ahead: Carrying the Flame Forward</h2>
            <div className="bg-white p-8 rounded-lg shadow-md border border-gray-100">
              <p className="text-gray-700 leading-relaxed text-lg mb-6">
                As Srigandha moves into the future, our commitment remains unwavering &mdash; to <strong>honor tradition while embracing change</strong>. We continue to focus on:
              </p>
              <ul className="space-y-3 mb-6">
                {[
                  'Expanding cultural and educational initiatives',
                  'Deepening youth engagement and leadership',
                  'Strengthening community connections',
                  'Adapting to the evolving needs of a growing Kannada diaspora'
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-gray-700 text-lg">
                    <span className="text-primary mt-1 flex-shrink-0">&#10003;</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <div className="text-center mt-8">
                <p className="text-gray-700 text-lg italic mb-2">Because culture is not something we simply remember.</p>
                <p className="text-gray-700 text-lg italic mb-2">It is something we <strong>practice, protect, and pass on</strong>.</p>
                <p className="text-gray-700 text-lg italic">
                  And as long as Kannadigas come together under the banner of Srigandha,
                </p>
                <p className="text-primary text-xl font-bold mt-2">Karnataka will always have a home in Florida.</p>
              </div>
            </div>
          </div>

          {/* Join CTA */}
          <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl p-8 md:p-12 text-center">
            <h3 className="text-2xl md:text-3xl font-bold mb-4 text-gray-800">Be a Part of the Legacy</h3>
            <p className="text-gray-700 mb-2 text-lg">We invite you to join us &mdash;</p>
            <p className="text-gray-700 mb-2 text-lg">to celebrate with us, to serve with us, and to grow with us.</p>
            <p className="text-gray-700 mb-8 max-w-2xl mx-auto text-lg">
              Become a <strong>member of Srigandha Kannada Koota of Florida</strong> and be part of a living legacy that connects generations through language, culture, and community.
            </p>
            <a
              href="/contact"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-primary text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-opacity-90 hover:scale-105 transition transform shadow-lg"
            >
              Become a Member
            </a>
            <div className="mt-8 text-gray-600 text-sm">
              <p className="font-semibold">Srigandha Kannada Koota of Florida</p>
              <p>Promoting Kannada culture and heritage in Florida</p>
              <p className="mt-1">Tax ID: 59-3527606</p>
            </div>
            <p
              className="mt-4 text-primary font-bold text-xl"
              style={{ fontFamily: "'Noto Sans Kannada', serif" }}
            >
              &#x0CB8;&#x0CBF;&#x0CB0;&#x0CBF;&#x0C97;&#x0CA8;&#x0CCD;&#x0CA8;&#x0CA1;&#x0C82; &#x0C97;&#x0CC6;&#x0CB2;&#x0CCD;&#x0C97;&#x0CC6;, &#x0CB8;&#x0CBF;&#x0CB0;&#x0CBF;&#x0C97;&#x0CA8;&#x0CCD;&#x0CA8;&#x0CA1;&#x0C82; &#x0CAC;&#x0CBE;&#x0CB3;&#x0CCD;&#x0C97;&#x0CC6;
            </p>
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
