import React, { useState, useEffect } from 'react';
import { LanguageProvider } from './context/LanguageContext';
import TopBar from './components/layout/TopBar';
import Navbar from './components/layout/Navbar';
import MobileDrawer from './components/layout/MobileDrawer';
import Breadcrumbs from './components/layout/Breadcrumbs';
import PreFooterBanner from './components/layout/PreFooterBanner';
import Footer from './components/layout/Footer';
import SearchModal from './components/modals/SearchModal';
import QuickEnquiryModal from './components/modals/QuickEnquiryModal';
import VideoModal from './components/modals/VideoModal';
import Toast from './components/common/Toast';
import ScrollToTop from './components/common/ScrollToTop';

// Page Views
import HomeView from './pages/HomeView';
import ProductsView from './pages/ProductsView';
import CategoryView from './pages/CategoryView';
import ProductDetailView from './pages/ProductDetailView';
import IndustriesView from './pages/IndustriesView';
import AboutView from './pages/AboutView';
import QualityView from './pages/QualityView';
import ResourcesView from './pages/ResourcesView';
import BlogView from './pages/BlogView';
import ContactView from './pages/ContactView';
import QuoteView from './pages/QuoteView';
import CRMView from './pages/crm/CRMView';

export const App = () => {
  const [currentHash, setCurrentHash] = useState(() => window.location.hash || '#home');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [enquiryProduct, setEnquiryProduct] = useState(null);
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash || '#home';
      setCurrentHash(hash);
      window.scrollTo(0, 0);
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const addToast = (message, type = 'info') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const dismissToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Parse hash route and param
  const cleanHash = currentHash.replace(/^#\/?/, '') || 'home';
  const parts = cleanHash.split('/');
  const route = parts[0] || 'home';
  const param = parts[1] || '';

  const isCRM = route === 'crm';

  const handleOpenEnquiry = (product) => {
    setEnquiryProduct(product);
  };

  const handleCloseEnquiry = () => {
    setEnquiryProduct(null);
  };

  return (
    <LanguageProvider>
      <div id="app" className="app-root">
        {isCRM ? (
          <CRMView
            subroute={param || 'dashboard'}
            onNotify={addToast}
            onOpenQuickEnquiry={handleOpenEnquiry}
          />
        ) : (
          <div id="public-shell" className="public-shell">
            {/* Accessible Skip Link */}
            <a href="#main-content" className="skip-link">
              Skip to main content
            </a>

            {/* Top Utility Bar */}
            <TopBar />

            {/* Main Header / Navbar */}
            <Navbar
              onOpenSearch={() => setIsSearchOpen(true)}
              onToggleMobile={() => setIsMobileOpen(true)}
            />

            {/* Mobile Navigation Drawer */}
            <MobileDrawer
              isOpen={isMobileOpen}
              onClose={() => setIsMobileOpen(false)}
            />

            {/* Breadcrumbs Bar */}
            <Breadcrumbs route={route} param={param} />

            {/* Main Content Area */}
            <main id="main-content" className="main-content" role="main">
              {route === 'home' && (
                <HomeView
                  onOpenEnquiry={handleOpenEnquiry}
                  onOpenVideo={() => setIsVideoOpen(true)}
                />
              )}
              {route === 'products' && (
                <ProductsView onOpenEnquiry={handleOpenEnquiry} />
              )}
              {route === 'category' && (
                <CategoryView slug={param} onOpenEnquiry={handleOpenEnquiry} />
              )}
              {route === 'product' && (
                <ProductDetailView slug={param} onOpenEnquiry={handleOpenEnquiry} />
              )}
              {route === 'industries' && (
                <IndustriesView slug={param} onOpenEnquiry={handleOpenEnquiry} />
              )}
              {route === 'industry' && (
                <IndustriesView slug={param} onOpenEnquiry={handleOpenEnquiry} />
              )}
              {route === 'about' && <AboutView />}
              {route === 'quality' && (
                <QualityView onOpenVideo={() => setIsVideoOpen(true)} />
              )}
              {route === 'resources' && <ResourcesView onNotify={addToast} />}
              {route === 'blog' && <BlogView slug={param} />}
              {route === 'contact' && <ContactView onNotify={addToast} />}
              {route === 'quote' && <QuoteView onNotify={addToast} />}
            </main>

            {/* Dual Split Pre-Footer Action Banner */}
            <PreFooterBanner />

            {/* Global Public Footer */}
            <Footer />
          </div>
        )}

        {/* Global Overlays & Modals */}
        <SearchModal
          isOpen={isSearchOpen}
          onClose={() => setIsSearchOpen(false)}
        />

        <QuickEnquiryModal
          isOpen={!!enquiryProduct}
          onClose={handleCloseEnquiry}
          product={enquiryProduct}
          onSuccess={(ref) => addToast(`Quotation logged! Ref: ${ref}`, 'success')}
        />

        <VideoModal
          isOpen={isVideoOpen}
          onClose={() => setIsVideoOpen(false)}
        />

        {/* Toast Notifications */}
        <Toast toasts={toasts} onDismiss={dismissToast} />

        {/* Scroll-to-Top Button */}
        <ScrollToTop />
      </div>
    </LanguageProvider>
  );
};

export default App;
