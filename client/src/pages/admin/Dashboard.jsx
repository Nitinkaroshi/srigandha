import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../../components/admin/Sidebar';
import { eventsAPI, committeeAPI, galleryAPI, contactAPI } from '../../utils/api';

const Dashboard = () => {
  const [stats, setStats] = useState({
    events: 0,
    committee: 0,
    galleries: 0,
    messages: 0
  });
  const [loading, setLoading] = useState(true);

  // Check if we're on admin subdomain or using /admin path
  const isAdminDomain = window.location.hostname.startsWith('admin.');
  const basePrefix = isAdminDomain ? '' : '/admin';

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [events, committee, galleries, messages] = await Promise.all([
        eventsAPI.getAll(),
        committeeAPI.getAll(),
        galleryAPI.getAll(),
        contactAPI.getAll()
      ]);

      setStats({
        events: events.data.length,
        committee: committee.data.length,
        galleries: galleries.data.length,
        messages: messages.data.length
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <div className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

        {loading ? (
          <div className="text-center">Loading...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Total Events</p>
                  <p className="text-3xl font-bold text-primary">{stats.events}</p>
                </div>
                <div className="text-4xl">📅</div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Committee Members</p>
                  <p className="text-3xl font-bold text-secondary">{stats.committee}</p>
                </div>
                <div className="text-4xl">👥</div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Gallery Albums</p>
                  <p className="text-3xl font-bold text-accent">{stats.galleries}</p>
                </div>
                <div className="text-4xl">🖼️</div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Unread Messages</p>
                  <p className="text-3xl font-bold text-blue-600">{stats.messages}</p>
                </div>
                <div className="text-4xl">📨</div>
              </div>
            </div>
          </div>
        )}

        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Link
              to={`${basePrefix}/events`}
              className="bg-primary text-white p-4 rounded-lg hover:bg-opacity-90 transition text-center"
            >
              Manage Events
            </Link>
            <Link
              to={`${basePrefix}/committee`}
              className="bg-secondary text-white p-4 rounded-lg hover:bg-opacity-90 transition text-center"
            >
              Manage Committee
            </Link>
            <Link
              to={`${basePrefix}/gallery`}
              className="bg-accent text-white p-4 rounded-lg hover:bg-opacity-90 transition text-center"
            >
              Manage Gallery
            </Link>
            <Link
              to={`${basePrefix}/contact`}
              className="bg-blue-600 text-white p-4 rounded-lg hover:bg-opacity-90 transition text-center"
            >
              Manage Messages
            </Link>
          </div>
        </div>

        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-4">Welcome to Admin Panel</h2>
          <p className="text-gray-700">
            Use the sidebar to navigate through different sections. You can manage events,
            committee members, galleries, and site settings from here.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;