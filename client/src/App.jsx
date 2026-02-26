import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import ErrorBoundary from './components/common/ErrorBoundary';
import ScrollToTop from './components/common/ScrollToTop';

const Home = lazy(() => import('./pages/public/Home'));
const About = lazy(() => import('./pages/public/About'));
const Events = lazy(() => import('./pages/public/Events'));
const Committee = lazy(() => import('./pages/public/Committee'));
const Gallery = lazy(() => import('./pages/public/Gallery'));
const Contact = lazy(() => import('./pages/public/Contact'));

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-xl text-gray-600">Loading...</div>
  </div>
);

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <ScrollToTop />
        <Toaster position="top-right" richColors closeButton duration={3000} />
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/events" element={<Events />} />
            <Route path="/committee" element={<Committee />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
