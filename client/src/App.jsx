import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastContainer } from 'react-toastify';
import ErrorBoundary from './components/common/ErrorBoundary';
import ScrollToTop from './components/common/ScrollToTop';
import 'react-toastify/dist/ReactToastify.css';

import Home from './pages/public/Home';
import About from './pages/public/About';
import Events from './pages/public/Events';
import Committee from './pages/public/Committee';
import Gallery from './pages/public/Gallery';
import Contact from './pages/public/Contact';

import Login from './pages/admin/Login';
import ForgotPassword from './pages/admin/ForgotPassword';
import ResetPassword from './pages/admin/ResetPassword';
import Dashboard from './pages/admin/Dashboard';
import Profile from './pages/admin/Profile';
import ManagePages from './pages/admin/ManagePages';
import ManageCarousel from './pages/admin/ManageCarousel';
import ManageEvents from './pages/admin/ManageEvents';
import ManageCommittee from './pages/admin/ManageCommittee';
import ManageGallery from './pages/admin/ManageGallery';
import ManageSettings from './pages/admin/ManageSettings';
import ManageContact from './pages/admin/ManageContact';

import ProtectedRoute from './pages/public/ProtectedRoute';

function App() {
  const isAdminDomain = window.location.hostname.startsWith('admin.');

  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <ScrollToTop />
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
          <Routes>
            {isAdminDomain ? (
              <>
                <Route path="/login" element={<Login />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                <Route path="/pages" element={<ProtectedRoute><ManagePages /></ProtectedRoute>} />
                <Route path="/carousel" element={<ProtectedRoute><ManageCarousel /></ProtectedRoute>} />
                <Route path="/events" element={<ProtectedRoute><ManageEvents /></ProtectedRoute>} />
                <Route path="/committee" element={<ProtectedRoute><ManageCommittee /></ProtectedRoute>} />
                <Route path="/gallery" element={<ProtectedRoute><ManageGallery /></ProtectedRoute>} />
                <Route path="/contact" element={<ProtectedRoute><ManageContact /></ProtectedRoute>} />
                <Route path="/settings" element={<ProtectedRoute><ManageSettings /></ProtectedRoute>} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </>
            ) : (
              <>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/events" element={<Events />} />
                <Route path="/committee" element={<Committee />} />
                <Route path="/gallery" element={<Gallery />} />
                <Route path="/contact" element={<Contact />} />

                {/* Admin routes accessible via /admin path */}
                <Route path="/admin/login" element={<Login />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/admin" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="/admin/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                <Route path="/admin/pages" element={<ProtectedRoute><ManagePages /></ProtectedRoute>} />
                <Route path="/admin/carousel" element={<ProtectedRoute><ManageCarousel /></ProtectedRoute>} />
                <Route path="/admin/events" element={<ProtectedRoute><ManageEvents /></ProtectedRoute>} />
                <Route path="/admin/committee" element={<ProtectedRoute><ManageCommittee /></ProtectedRoute>} />
                <Route path="/admin/gallery" element={<ProtectedRoute><ManageGallery /></ProtectedRoute>} />
                <Route path="/admin/contact" element={<ProtectedRoute><ManageContact /></ProtectedRoute>} />
                <Route path="/admin/settings" element={<ProtectedRoute><ManageSettings /></ProtectedRoute>} />

                <Route path="*" element={<Navigate to="/" replace />} />
              </>
            )}
          </Routes>
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;