import { useState, useEffect, useCallback } from 'react';
import Navbar from '../../components/public/Navbar';
import Footer from '../../components/public/Footer';
import Hero from '../../components/public/Hero';
import EventCard from '../../components/public/EventCard';
import WhatsAppButton from '../../components/public/WhatsAppButton';
import { eventsAPI } from '../../utils/api';

const Events = () => {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    try {
      const response = await eventsAPI.getAll(activeTab);
      setEvents(response.data);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <Hero title="Events" subtitle="Join us in celebrating our culture" />

      <main className="flex-grow py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center mb-8">
            <a
              href="https://app.featsclub.com/event-ticket.html?ps7Pa4IiKXQHQlCusbXFUTMLBH03/PZhnH4QeWTmFLRlIOp3V"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-red-600 hover:bg-red-700 text-white text-lg font-bold px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition transform hover:-translate-y-1 flex items-center space-x-3 animate-bounce"
            >
              <span>🎟️</span>
              <span>Register Now for Upcoming Event</span>
            </a>
          </div>

          <div className="flex justify-center flex-wrap gap-4 mb-12">
            <button
              onClick={() => setActiveTab('upcoming')}
              className={`px-6 py-3 rounded-md font-semibold transition ${activeTab === 'upcoming'
                ? 'bg-primary text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
            >
              Upcoming Events
            </button>
            <button
              onClick={() => setActiveTab('past')}
              className={`px-6 py-3 rounded-md font-semibold transition ${activeTab === 'past'
                ? 'bg-primary text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
            >
              Past Events
            </button>
          </div>

          {loading ? (
            <div className="text-center text-xl">Loading events...</div>
          ) : events.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {events.map((event) => (
                <EventCard key={event._id} event={event} />
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-600">
              <p className="text-xl">No {activeTab} events at the moment.</p>
              <p className="mt-2">Check back soon for updates!</p>
            </div>
          )}
        </div>
      </main>

      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Events;