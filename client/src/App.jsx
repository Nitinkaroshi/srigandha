import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider } from './context/AuthContext';
import { MemberAuthProvider } from './context/MemberAuthContext';
import { Toaster } from 'sonner';
import ErrorBoundary from './components/common/ErrorBoundary';
import ScrollToTop from './components/common/ScrollToTop';
import config from './config/env';

// Public pages - lazy loaded
const Home = lazy(() => import('./pages/public/Home'));
const About = lazy(() => import('./pages/public/About'));
const Events = lazy(() => import('./pages/public/Events'));
const Committee = lazy(() => import('./pages/public/Committee'));
const Gallery = lazy(() => import('./pages/public/Gallery'));
const Contact = lazy(() => import('./pages/public/Contact'));
const MemberDashboard = lazy(() => import('./pages/public/MemberDashboard'));

// Admin pages - lazy loaded
const Login = lazy(() => import('./pages/admin/Login'));
const ForgotPassword = lazy(() => import('./pages/admin/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/admin/ResetPassword'));
const Dashboard = lazy(() => import('./pages/admin/Dashboard'));
const Profile = lazy(() => import('./pages/admin/Profile'));
const ManagePages = lazy(() => import('./pages/admin/ManagePages'));
const ManageCarousel = lazy(() => import('./pages/admin/ManageCarousel'));
const ManageEvents = lazy(() => import('./pages/admin/ManageEvents'));
const ManageCommittee = lazy(() => import('./pages/admin/ManageCommittee'));
const ManageGallery = lazy(() => import('./pages/admin/ManageGallery'));
const ManageSettings = lazy(() => import('./pages/admin/ManageSettings'));
const ManageContact = lazy(() => import('./pages/admin/ManageContact'));
const ManageBookings = lazy(() => import('./pages/admin/ManageBookings'));
const ManageMembers = lazy(() => import('./pages/admin/ManageMembers'));

import ProtectedRoute from './pages/public/ProtectedRoute';

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-xl text-gray-600">Loading...</div>
  </div>
);

function App() {
  const isAdminDomain = window.location.hostname.startsWith('admin.');

  return (
    <ErrorBoundary>
      <GoogleOAuthProvider clientId={config.googleClientId}>
        <AuthProvider>
          <MemberAuthProvider>
            <Router>
          <ScrollToTop />
          <Toaster position="top-right" richColors closeButton duration={3000} />
          <Suspense fallback={<PageLoader />}>
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
                  <Route path="/bookings" element={<ProtectedRoute><ManageBookings /></ProtectedRoute>} />
                  <Route path="/members" element={<ProtectedRoute><ManageMembers /></ProtectedRoute>} />
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
                  <Route path="/member/dashboard" element={<MemberDashboard />} />

                  {/* Admin routes accessible via /admin path */}
                  <Route path="/admin/login" element={<Login />} />
                  <Route path="/admin/forgot-password" element={<ForgotPassword />} />
                  <Route path="/admin/reset-password" element={<ResetPassword />} />
                  <Route path="/admin" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                  <Route path="/admin/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                  <Route path="/admin/pages" element={<ProtectedRoute><ManagePages /></ProtectedRoute>} />
                  <Route path="/admin/carousel" element={<ProtectedRoute><ManageCarousel /></ProtectedRoute>} />
                  <Route path="/admin/events" element={<ProtectedRoute><ManageEvents /></ProtectedRoute>} />
                  <Route path="/admin/committee" element={<ProtectedRoute><ManageCommittee /></ProtectedRoute>} />
                  <Route path="/admin/gallery" element={<ProtectedRoute><ManageGallery /></ProtectedRoute>} />
                  <Route path="/admin/contact" element={<ProtectedRoute><ManageContact /></ProtectedRoute>} />
                  <Route path="/admin/bookings" element={<ProtectedRoute><ManageBookings /></ProtectedRoute>} />
                  <Route path="/admin/members" element={<ProtectedRoute><ManageMembers /></ProtectedRoute>} />
                  <Route path="/admin/settings" element={<ProtectedRoute><ManageSettings /></ProtectedRoute>} />

                  <Route path="*" element={<Navigate to="/" replace />} />
                </>
              )}
            </Routes>
          </Suspense>
            </Router>
          </MemberAuthProvider>
        </AuthProvider>
      </GoogleOAuthProvider>
    </ErrorBoundary>
  );
}

export default App;
