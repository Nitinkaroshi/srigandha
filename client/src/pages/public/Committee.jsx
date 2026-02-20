import { useState, useEffect } from 'react';
import Navbar from '../../components/public/Navbar';
import Footer from '../../components/public/Footer';
import Hero from '../../components/public/Hero';
import WhatsAppButton from '../../components/public/WhatsAppButton';
import { committeeAPI } from '../../utils/api';
import config from '../../config/env';

const Committee = () => {
  const [activeTab, setActiveTab] = useState('current');
  const [currentMembers, setCurrentMembers] = useState([]);
  const [previousMembers, setPreviousMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCommitteeMembers();
  }, []);

  const fetchCommitteeMembers = async () => {
    try {
      const response = await committeeAPI.getAll();
      const allMembers = response.data;

      // Separate current and previous members
      const current = allMembers.filter(m => m.type === 'current').sort((a, b) => a.order - b.order);
      const previous = allMembers.filter(m => m.type === 'previous').sort((a, b) => a.order - b.order);

      setCurrentMembers(current);
      setPreviousMembers(previous);
    } catch (error) {
      console.error('Error fetching committee members:', error);
    } finally {
      setLoading(false);
    }
  };

  // Group previous members by term
  const groupedPreviousMembers = previousMembers.reduce((acc, member) => {
    const term = member.term;
    if (!acc[term]) {
      acc[term] = [];
    }
    acc[term].push(member);
    return acc;
  }, {});

  // Sort terms in descending order
  const sortedTerms = Object.keys(groupedPreviousMembers).sort((a, b) => b.localeCompare(a));

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <Hero title="Committee" subtitle="Meet our dedicated team" />

      <main className="flex-grow py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Tab Navigation */}
          <div className="flex justify-center flex-wrap gap-4 mb-12">
            <button
              onClick={() => setActiveTab('current')}
              className={`px-6 py-3 rounded-md font-semibold transition ${activeTab === 'current'
                  ? 'bg-[#fecc01] text-gray-900'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
            >
              Board of Trustees
            </button>
            <button
              onClick={() => setActiveTab('previous')}
              className={`px-6 py-3 rounded-md font-semibold transition ${activeTab === 'previous'
                  ? 'bg-[#fecc01] text-gray-900'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
            >
              Previous Committees
            </button>
          </div>

          {/* Current Committee - Board of Trustees */}
          {activeTab === 'current' && (
            <div>
              {loading ? (
                <div className="text-center text-xl">Loading committee members...</div>
              ) : currentMembers.length > 0 ? (
                <>
                  <h2 className="text-3xl font-bold text-center mb-8">Board of Trustees</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                    {currentMembers.map((member) => (
                      <div key={member._id} className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-xl transition-shadow">
                        {member.photo ? (
                          <img
                            src={`${config.baseUrl}${member.photo}`}
                            alt={member.name}
                            className="w-32 h-32 mx-auto mb-4 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-32 h-32 mx-auto mb-4 bg-gradient-to-br from-[#fecc01] to-[#ffa726] rounded-full flex items-center justify-center">
                            <span className="text-5xl text-white">👤</span>
                          </div>
                        )}
                        <h3 className="text-lg font-bold mb-2 text-gray-800">{member.name}</h3>
                        <p className="text-sm text-gray-600">{member.role}</p>
                        {member.email && (
                          <p className="text-xs text-gray-500 mt-2">{member.email}</p>
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="mt-8 text-center text-gray-600">
                    <p className="text-sm">Tax ID: 59-3527606</p>
                  </div>
                </>
              ) : (
                <div className="text-center text-gray-600">
                  <p className="text-xl">No current committee members available.</p>
                </div>
              )}
            </div>
          )}

          {/* Previous Committees */}
          {activeTab === 'previous' && (
            <div className="space-y-12">
              {loading ? (
                <div className="text-center text-xl">Loading previous committees...</div>
              ) : sortedTerms.length > 0 ? (
                <>
                  {sortedTerms.map((term, idx) => (
                    <div key={idx} className="bg-white rounded-lg shadow-md p-8">
                      <h2 className="text-2xl font-bold text-center mb-6 text-[#fecc01] border-b-2 border-[#fecc01] pb-3">
                        Committee {term}
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {groupedPreviousMembers[term].map((member) => (
                          <div key={member._id} className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                            {member.photo ? (
                              <img
                                src={`${config.baseUrl}${member.photo}`}
                                alt={member.name}
                                className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                              />
                            ) : (
                              <div className="w-12 h-12 bg-gradient-to-br from-[#fecc01] to-[#ffa726] rounded-full flex items-center justify-center flex-shrink-0">
                                <span className="text-2xl text-white">👤</span>
                              </div>
                            )}
                            <div className="ml-4">
                              <h3 className="font-bold text-gray-800">{member.name}</h3>
                              <p className="text-sm text-gray-600">{member.role}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </>
              ) : (
                <div className="text-center text-gray-600">
                  <p className="text-xl">No previous committee members available.</p>
                </div>
              )}
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
