import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  // Check if we're on admin subdomain or using /admin path
  const isAdminDomain = window.location.hostname.startsWith('admin.');
  const basePrefix = isAdminDomain ? '' : '/admin';

  const handleLogout = () => {
    logout();
    navigate(isAdminDomain ? '/login' : '/admin/login');
  };

  const menuItems = [
    { path: isAdminDomain ? '/' : '/admin', label: 'Dashboard', icon: '📊' },
    { path: `${basePrefix}/pages`, label: 'Pages', icon: '📄' },
    { path: `${basePrefix}/carousel`, label: 'Carousel', icon: '🎠' },
    { path: `${basePrefix}/events`, label: 'Events', icon: '📅' },
    { path: `${basePrefix}/committee`, label: 'Committee', icon: '👥' },
    { path: `${basePrefix}/gallery`, label: 'Gallery', icon: '🖼️' },
    { path: `${basePrefix}/bookings`, label: 'Bookings', icon: '🎟️' },
    { path: `${basePrefix}/members`, label: 'Members', icon: '🤝' },
    { path: `${basePrefix}/contact`, label: 'Messages', icon: '📨' },
    { path: `${basePrefix}/settings`, label: 'Settings', icon: '⚙️' },
    { path: `${basePrefix}/profile`, label: 'Profile', icon: '👤' },
  ];

  return (
    <div className="bg-gray-900 text-white w-64 min-h-screen p-4">
      <div className="mb-8">
        <h2 className="text-2xl font-bold">Admin Panel</h2>
        <p className="text-gray-400 text-sm mt-1">{user?.username}</p>
      </div>

      <nav className="space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition ${location.pathname === item.path
              ? 'bg-primary text-white'
              : 'text-gray-300 hover:bg-gray-800'
              }`}
          >
            <span className="text-xl">{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      <button
        onClick={handleLogout}
        className="w-full mt-8 flex items-center space-x-3 px-4 py-3 rounded-lg bg-red-600 hover:bg-red-700 transition"
      >
        <span className="text-xl">🚪</span>
        <span>Logout</span>
      </button>
    </div>
  );
};

export default Sidebar;