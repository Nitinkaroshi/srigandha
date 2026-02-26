import { useState, useEffect } from 'react';
import Navbar from '../../components/public/Navbar';
import Footer from '../../components/public/Footer';
import Hero from '../../components/public/Hero';
import WhatsAppButton from '../../components/public/WhatsAppButton';
import { committeeAPI } from '../../utils/api';
import config from '../../config/env';

const tabs = [
  { key: 'current', label: 'Board of Trustees' },
  { key: 'executive', label: 'Executive Committee' },
  { key: 'previous', label: 'Past Committee' },
];

const MemberCard = ({ member }) => (
  <div className="flex flex-col items-center p-4">
    {member.photo ? (
      <img
        src={`${config.baseUrl}${member.photo}`}
        alt={member.name}
        className="w-24 h-24 rounded-full object-cover shadow-md"
      />
    ) : (
      <div className="w-24 h-24 bg-gradient-to-br from-[#fecc01] to-[#ffa726] rounded-full flex items-center justify-center shadow-md">
        <span className="text-4xl text-white">&#128100;</span>
      </div>
    )}
    <h3 className="mt-3 text-sm font-semibold text-gray-800 text-center">{member.name}</h3>
  </div>
);

const Committee = () => {
  const [activeTab, setActiveTab] = useState('current');
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCommitteeMembers();
  }, []);

  const fetchCommitteeMembers = async () => {
    try {
      const response = await committeeAPI.getAll();
      setMembers(response.data);
    } catch (error) {
      console.error('Error fetching committee members:', error);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredMembers = () => {
    return members
      .filter(m => m.type === activeTab)
      .sort((a, b) => a.order - b.order);
  };

  // Group previous members by term
  const getPreviousGrouped = () => {
    const previous = members.filter(m => m.type === 'previous').sort((a, b) => a.order - b.order);
    const grouped = previous.reduce((acc, member) => {
      const term = member.term || 'Unknown';
      if (!acc[term]) acc[term] = [];
      acc[term].push(member);
      return acc;
    }, {});
    const sortedTerms = Object.keys(grouped).sort((a, b) => b.localeCompare(a));
    return { grouped, sortedTerms };
  };

  const renderMembers = () => {
    if (loading) {
      return <div className="text-center text-xl py-12">Loading committee members...</div>;
    }

    if (activeTab === 'previous') {
      const { grouped, sortedTerms } = getPreviousGrouped();
      if (sortedTerms.length === 0) {
        return <p className="text-center text-gray-600 text-xl py-12">No past committee members available.</p>;
      }
      return (
        <div className="space-y-10">
          {sortedTerms.map((term) => (
            <div key={term} className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold text-center mb-6 text-primary border-b-2 border-primary pb-3">
                Committee {term}
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 justify-items-center">
                {grouped[term].map((member) => (
                  <MemberCard key={member._id} member={member} />
                ))}
              </div>
            </div>
          ))}
        </div>
      );
    }

    const filtered = getFilteredMembers();
    if (filtered.length === 0) {
      return <p className="text-center text-gray-600 text-xl py-12">No committee members available.</p>;
    }

    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 justify-items-center">
        {filtered.map((member) => (
          <MemberCard key={member._id} member={member} />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <Hero title="Committee" subtitle="Meet our dedicated team" />

      <main className="flex-grow py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Tab Navigation */}
          <div className="flex justify-center flex-wrap gap-4 mb-12">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-6 py-3 rounded-md font-semibold transition ${
                  activeTab === tab.key
                    ? 'bg-primary text-gray-900 shadow-md'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Members Grid */}
          {renderMembers()}

          {activeTab === 'current' && (
            <div className="mt-8 text-center text-gray-600">
              <p className="text-sm">Tax ID: 59-3527606</p>
            </div>
          )}
        </div>
      </main>

      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Committee;
