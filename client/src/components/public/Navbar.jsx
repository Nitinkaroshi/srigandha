import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { settingsAPI } from '../../utils/api';
import logo from '../../assets/SRIGANDHA_LOGO.png';
import headerTopBorder from '../../assets/header-top-br.png';
import headerBottomBorder from '../../assets/header-btm-br.png';
import karnatakaMap from '../../assets/karnataka-map.png';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [settings, setSettings] = useState(null);

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

  return (
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
              <a href="https://app.featsclub.com/membership.html?ps7Pa4IiKXQHQlCusbXFUTMLBH03" target="_blank" rel="noopener noreferrer" className="px-4 py-2 text-white hover:bg-green-600 transition font-medium">MEMBERSHIP</a>
            </div>
            <a
              href="https://app.featsclub.com/membership.html?ps7Pa4IiKXQHQlCusbXFUTMLBH03"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded font-bold transition"
            >
              BECOME A MEMBER
            </a>
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
            <a href="https://app.featsclub.com/membership.html?ps7Pa4IiKXQHQlCusbXFUTMLBH03" target="_blank" rel="noopener noreferrer" onClick={() => setIsOpen(false)} className="block px-3 py-2 text-white hover:bg-green-600 rounded-md font-medium">MEMBERSHIP</a>
            <a
              href="https://app.featsclub.com/membership.html?ps7Pa4IiKXQHQlCusbXFUTMLBH03"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setIsOpen(false)}
              className="block w-full px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md text-center font-bold"
            >
              BECOME A MEMBER
            </a>
          </div>
        </div>
      )}

      {/* Bottom Decorative Border */}
      <div className="w-full h-4 bg-repeat-x" style={{ backgroundImage: `url(${headerBottomBorder})` }}></div>
    </nav>
  );
};

export default Navbar;
