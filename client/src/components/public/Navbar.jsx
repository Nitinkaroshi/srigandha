import { Link } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { settingsAPI } from '../../utils/api';
import { useMemberAuth } from '../../context/MemberAuthContext';
import { toast } from 'sonner';
import logo from '../../assets/SRIGANDHA_LOGO.png';
import headerTopBorder from '../../assets/header-top-br.png';
import headerBottomBorder from '../../assets/header-btm-br.png';
import karnatakaMap from '../../assets/karnataka-map.png';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [settings, setSettings] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef(null);
  const { member, isMemberAuthenticated, loginWithGoogle, logout } = useMemberAuth();

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await settingsAPI.get();
        setSettings(response.data);
      } catch (error) {
        console.error('Error fetching settings:', error);
      }
    };
    fetchSettings();
  }, []);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleGoogleSuccess = async (credentialResponse) => {
    const result = await loginWithGoogle(credentialResponse.credential);
    if (result.success) {
      const name = result.member?.name;
      toast.success(`Welcome${name ? ', ' + name : ''}!`);
      setShowLoginModal(false);
    } else {
      toast.error(result.message || 'Sign-in failed. Please try again.');
    }
  };

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    toast.success('Signed out successfully');
  };

  const getMemberInitial = () => {
    if (member?.name) return member.name.charAt(0).toUpperCase();
    if (member?.email) return member.email.charAt(0).toUpperCase();
    return 'M';
  };

  const getStatusBadge = () => {
    if (!member) return null;
    const statusColors = {
      active: 'bg-green-500',
      pending: 'bg-yellow-500',
      guest: 'bg-gray-400',
      expired: 'bg-red-500',
    };
    return statusColors[member.status] || 'bg-gray-400';
  };

  const renderAuthButton = () => {
    if (isMemberAuthenticated) {
      return (
        <div className="relative" ref={userMenuRef}>
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center space-x-2 bg-white/20 hover:bg-white/30 text-white px-3 py-2 rounded-lg transition"
          >
            {member?.avatar ? (
              <img src={member.avatar} alt="" className="h-8 w-8 rounded-full" referrerPolicy="no-referrer" />
            ) : (
              <div className="h-8 w-8 rounded-full bg-red-600 flex items-center justify-center text-white font-bold text-sm">
                {getMemberInitial()}
              </div>
            )}
            <span className="hidden lg:inline text-sm font-medium max-w-[120px] truncate">
              {member?.name || 'Member'}
            </span>
            <span className={`h-2.5 w-2.5 rounded-full ${getStatusBadge()}`}></span>
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl z-50 py-2 border">
              <div className="px-4 py-3 border-b">
                <p className="text-sm font-semibold text-gray-800 truncate">{member?.name || 'Member'}</p>
                <p className="text-xs text-gray-500 truncate">{member?.email}</p>
                <span className={`inline-block mt-1 text-xs px-2 py-0.5 rounded-full text-white ${getStatusBadge()}`}>
                  {member?.status === 'active' ? 'Active Member' :
                   member?.status === 'pending' ? 'Pending Approval' :
                   member?.status === 'guest' ? 'Guest' : member?.status}
                </span>
              </div>
              <Link
                to="/member/dashboard"
                onClick={() => setShowUserMenu(false)}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                My Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      );
    }

    return (
      <button
        onClick={() => setShowLoginModal(true)}
        className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded font-bold transition flex items-center space-x-2"
      >
        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
        </svg>
        <span>LOGIN / MEMBERSHIP</span>
      </button>
    );
  };

  const renderMobileAuthButton = () => {
    if (isMemberAuthenticated) {
      return (
        <div className="space-y-1">
          <Link
            to="/member/dashboard"
            onClick={() => setIsOpen(false)}
            className="block px-3 py-2 text-white hover:bg-green-600 rounded-md font-medium"
          >
            MY DASHBOARD
          </Link>
          <button
            onClick={() => { handleLogout(); setIsOpen(false); }}
            className="block w-full text-left px-3 py-2 text-red-200 hover:bg-green-600 rounded-md font-medium"
          >
            SIGN OUT
          </button>
        </div>
      );
    }

    return (
      <button
        onClick={() => { setShowLoginModal(true); setIsOpen(false); }}
        className="block w-full px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md text-center font-bold"
      >
        LOGIN / MEMBERSHIP
      </button>
    );
  };

  return (
    <>
      <nav className="sticky top-0 z-50 bg-white shadow-lg">
        {/* Top Decorative Border */}
        <div className="w-full h-4 bg-repeat-x" style={{ backgroundImage: `url(${headerTopBorder})` }}></div>

        {/* Main Header Section */}
        <div className="bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-400">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between py-3">
              {/* Logo and Title Section */}
              <div className="flex items-center space-x-4">
                <Link to="/" className="flex-shrink-0">
                  <img
                    src={logo}
                    alt="Srigandha Logo"
                    className="h-20 w-20 md:h-24 md:w-24"
                  />
                </Link>
                <div className="hidden md:block">
                  <h1 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-800" style={{ fontFamily: "'Noto Sans Kannada', serif" }}>
                    ಶ್ರೀಗಂಧ ಕನ್ನಡ ಕೂಟ ಫ್ಲೋರಿಡಾ
                  </h1>
                  <h2 className="text-lg lg:text-2xl font-semibold text-green-800">
                    Srigandha Kannada Koota of Florida
                  </h2>
                </div>
              </div>

              {/* Karnataka Map - Desktop Only */}
              <div className="hidden lg:block">
                <img
                  src={karnatakaMap}
                  alt="Karnataka"
                  className="h-24 w-auto"
                />
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="md:hidden text-gray-700 hover:text-gray-900 focus:outline-none"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {isOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>

            {/* Mobile Title - Below Logo */}
            <div className="md:hidden pb-3">
              <h1 className="text-xl font-bold text-gray-800" style={{ fontFamily: "'Noto Sans Kannada', serif" }}>
                ಶ್ರೀಗಂಧ ಕನ್ನಡ ಕೂಟ ಫ್ಲೋರಿಡಾ
              </h1>
              <h2 className="text-sm font-semibold text-green-700">
                Srigandha Kannada Koota of Florida
              </h2>
            </div>
          </div>
        </div>

        {/* Navigation Menu - Desktop */}
        <div className="hidden md:block bg-green-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between py-2 min-h-[3rem]">
              <div className="flex space-x-1">
                <Link to="/" className="px-4 py-2 text-white hover:bg-green-600 transition font-medium">HOME</Link>
                <Link to="/about" className="px-4 py-2 text-white hover:bg-green-600 transition font-medium">ABOUT US</Link>
                <Link to="/events" className="px-4 py-2 text-white hover:bg-green-600 transition font-medium">EVENTS</Link>
                <Link to="/committee" className="px-4 py-2 text-white hover:bg-green-600 transition font-medium">COMMITTEE</Link>
                <Link to="/gallery" className="px-4 py-2 text-white hover:bg-green-600 transition font-medium">GALLERY</Link>
                <Link to="/contact" className="px-4 py-2 text-white hover:bg-green-600 transition font-medium">CONTACT US</Link>
              </div>
              {renderAuthButton()}
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden bg-green-700">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link to="/" onClick={() => setIsOpen(false)} className="block px-3 py-2 text-white hover:bg-green-600 rounded-md font-medium">HOME</Link>
              <Link to="/about" onClick={() => setIsOpen(false)} className="block px-3 py-2 text-white hover:bg-green-600 rounded-md font-medium">ABOUT US</Link>
              <Link to="/events" onClick={() => setIsOpen(false)} className="block px-3 py-2 text-white hover:bg-green-600 rounded-md font-medium">EVENTS</Link>
              <Link to="/committee" onClick={() => setIsOpen(false)} className="block px-3 py-2 text-white hover:bg-green-600 rounded-md font-medium">COMMITTEE</Link>
              <Link to="/gallery" onClick={() => setIsOpen(false)} className="block px-3 py-2 text-white hover:bg-green-600 rounded-md font-medium">GALLERY</Link>
              <Link to="/contact" onClick={() => setIsOpen(false)} className="block px-3 py-2 text-white hover:bg-green-600 rounded-md font-medium">CONTACT US</Link>
              {renderMobileAuthButton()}
            </div>
          </div>
        )}

        {/* Bottom Decorative Border */}
        <div className="w-full h-4 bg-repeat-x" style={{ backgroundImage: `url(${headerBottomBorder})` }}></div>
      </nav>

      {/* Google Sign-In Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4" onClick={() => setShowLoginModal(false)}>
          <div className="bg-white rounded-xl p-8 max-w-md w-full shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="text-center mb-6">
              <img src={logo} alt="Srigandha" className="h-16 w-16 mx-auto mb-3" />
              <h2 className="text-2xl font-bold text-gray-800">Welcome</h2>
              <p className="text-gray-600 mt-1">Sign in to access member benefits</p>
            </div>

            <div className="flex justify-center mb-6">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => toast.error('Google sign-in failed. Please try again.')}
                size="large"
                width="300"
                text="signin_with"
                shape="rectangular"
              />
            </div>

            <div className="text-center text-sm text-gray-500 space-y-2">
              <p>Sign in with your Google account to:</p>
              <ul className="text-left max-w-xs mx-auto space-y-1">
                <li className="flex items-center gap-2">
                  <span className="text-green-500">&#10003;</span> Get discounted event tickets
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">&#10003;</span> Auto-fill registration forms
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">&#10003;</span> Manage your membership
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">&#10003;</span> Track your event bookings
                </li>
              </ul>
            </div>

            <button
              onClick={() => setShowLoginModal(false)}
              className="mt-6 w-full text-center text-gray-500 hover:text-gray-700 text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
