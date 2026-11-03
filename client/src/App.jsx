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
import ErrorBoundary from './components/common/ErrorBoundary';
import { RouteProgressBar } from './components/common/Loader';

// Page Views
import HomeView from './pages/HomeView';
import ProductsView from './pages/ProductsView';
import CategoryView from './pages/CategoryView';
import ProductDetailView from './pages/ProductDetailView';
import IndustriesView from './pages/IndustriesView';
import AboutView from './pages/AboutView';
import QualityView from './pages/QualityView';
import ResourcesView from './pages/ResourcesView';
import ContactView from './pages/ContactView';
import QuoteView from './pages/QuoteView';
import CRMView from './pages/crm/CRMView';
import CustomerAccountView from './pages/CustomerAccountView';
import NotFoundView from './pages/NotFoundView';
import { PRODUCTS } from './data/siteData';
import { updatePageSEO } from './utils/seo';

const KNOWN_ROUTES = [
  'home',
  'products',
  'category',
  'product',
  'industries',
  'industry',
  'about',
  'quality',
  'resources',
  'contact',
  'quote',
  'account'
];

export const App = () => {
  const parseCurrentLocation = () => {
    // 1. Prioritize hash if explicitly present (e.g. #product/ss-316l-ep-pipe)
    const hash = (window.location.hash || '').replace(/^#\/?/, '');
    if (hash) {
      const parts = hash.split('/');
      return { route: parts[0] || 'home', param: parts[1] || '' };
    }
    // 2. Otherwise inspect clean path route (e.g. /product/ss-316l-ep-pipe)
    const pathname = (window.location.pathname || '').replace(/^\/?/, '');
    if (pathname && pathname !== 'index.html') {
      const parts = pathname.split('/');
      return { route: parts[0] || 'home', param: parts[1] || '' };
    }
    return { route: 'home', param: '' };
  };

  const [currentLoc, setCurrentLoc] = useState(parseCurrentLocation);
  const [isNavigating, setIsNavigating] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [enquiryProduct, setEnquiryProduct] = useState(null);
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    let navTimer = null;
    const handleLocationChange = () => {
      setIsNavigating(true);
      setCurrentLoc(parseCurrentLocation());
      window.scrollTo(0, 0);
      if (navTimer) clearTimeout(navTimer);
      navTimer = setTimeout(() => {
        setIsNavigating(false);
      }, 350);
    };

    const handleLinkClick = (e) => {
      const anchor = e.target.closest('a');
      if (!anchor) return;
      const href = anchor.getAttribute('href');
      if (
        href &&
        href.startsWith('/') &&
        !href.startsWith('//') &&
        !anchor.hasAttribute('download') &&
        anchor.target !== '_blank'
      ) {
        if (
          href.endsWith('.html') ||
          href.endsWith('.xml') ||
          href.endsWith('.pdf') ||
          href.endsWith('.png') ||
          href.endsWith('.jpg') ||
          href.startsWith('/assets/')
        ) {
          return;
        }
        e.preventDefault();
        window.history.pushState({}, '', href);
        handleLocationChange();
      }
    };

    window.addEventListener('hashchange', handleLocationChange);
    window.addEventListener('popstate', handleLocationChange);
    document.addEventListener('click', handleLinkClick);

    return () => {
      window.removeEventListener('hashchange', handleLocationChange);
      window.removeEventListener('popstate', handleLocationChange);
      document.removeEventListener('click', handleLinkClick);
    };
  }, []);

  const { route, param } = currentLoc;

  // Dynamic Technical SEO & Schema.org JSON-LD structured data injection
  useEffect(() => {
    let title = 'Lotus Tubes | SS Sanitary Pipes, Fittings & Valves';
    let description = 'Lotus Tubes supplies SS 316L and SS 304 sanitary pipe, ASTM A270 fittings, tri-clamp components, and valves for pharmaceutical and hygienic process lines.';
    let productData = null;
    let breadcrumbs = [{ name: 'Home', path: '/' }];

    if (route === 'products') {
      title = 'Sanitary Stainless Steel Catalogue | Pipes, Valves & Fittings | Lotus Tubes';
      description = 'Explore Lotus Tubes comprehensive range of SS 304 and SS 316L sanitary pipes, electropolished tubing, Tri-Clamp fittings, and hygienic valves.';
      breadcrumbs.push({ name: 'Products', path: '/products' });
    } else if (route === 'product' && param) {
      const found = PRODUCTS.find((p) => p.slug === param || p.id === param);
      if (found) {
        title = `${found.name} (${found.material}) - Sanitary Specifications | Lotus Tubes`;
        description = found.overview || `${found.name} in ${found.material} with hygienic finish for pharmaceutical and food process applications.`;
        if (description.length > 160) {
          description = description.substring(0, 157) + '...';
        }
        productData = found;
        breadcrumbs.push({ name: 'Products', path: '/products' });
        breadcrumbs.push({ name: found.name, path: `/product/${found.slug || found.id}` });
      }
    } else if (route === 'category' && param) {
      const catName = param.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
      title = `${catName} | Sanitary Stainless Steel Components | Lotus Tubes`;
      description = `Certified sanitary ${catName} in high purity SS 304 and SS 316L grades with Ra < 0.4µm surface finish for pharmaceutical and food process lines.`;
      breadcrumbs.push({ name: 'Categories', path: '/products' });
      breadcrumbs.push({ name: catName, path: `/category/${param}` });
    } else if (route === 'about') {
      title = 'About Lotus Tubes | Stainless Steel Sanitary Specialists Mumbai';
      description = 'Lotus Tubes delivers high-precision stainless steel sanitary tubes and components from Girgaon, Mumbai to pharmaceutical and food process leaders worldwide.';
      breadcrumbs.push({ name: 'About Us', path: '/about' });
    } else if (route === 'industries' || route === 'industry') {
      title = 'Process Industries We Serve | Lotus Tubes Sanitary Solutions';
      description = 'Hygienic stainless steel piping, fittings, and valves engineered for pharmaceutical, biotech, dairy, food & beverage, and high-purity water systems.';
      breadcrumbs.push({ name: 'Industries', path: '/industries' });
    } else if (route === 'quality') {
      title = 'Quality Assurance & Mill Test Certification | Lotus Tubes';
      description = 'Every Lotus Tubes sanitary product complies with ASTM A270, ASME BPE, and 3-A standards. Verified with EN 10204 3.1 MTR inspection certification.';
      breadcrumbs.push({ name: 'Quality Assurance', path: '/quality' });
    } else if (route === 'resources') {
      title = 'Engineering Resources & Technical Datasheets | Lotus Tubes';
      description = 'Download sanitary stainless steel dimensional charts, ASTM A270 specifications, and electropolished surface roughness conversion tables.';
      breadcrumbs.push({ name: 'Resources', path: '/resources' });
    } else if (route === 'contact') {
      title = 'Contact Lotus Tubes | Girgaon Mumbai Sales Office';
      description = 'Connect with Lotus Tubes engineering sales team in Mumbai for sanitary tubes, customized fittings, and valve requirements. Call +91 98205 25200.';
      breadcrumbs.push({ name: 'Contact', path: '/contact' });
    } else if (route === 'quote') {
      title = 'Request a Formal B2B Quotation | Lotus Tubes';
      description = 'Submit your Bill of Quantities (BOQ) for instant review and competitive quotation on SS 304 and SS 316L sanitary pipes, fittings, and valves.';
      breadcrumbs.push({ name: 'Request Quote', path: '/quote' });
    } else if (route === 'account') {
      title = 'Customer Account & Quotation History | Lotus Tubes';
      description = 'View your active quotation inquiries, track dispatch status, and download EN 10204 3.1 material test certificates for Lotus Tubes orders.';
      breadcrumbs.push({ name: 'Customer Account', path: '/account' });
    } else if (route === 'crm') {
      title = 'Lotus Tubes Staff CRM & Operations Portal';
      description = 'Internal operational management system for Lotus Tubes customer enquiries, quotations, pipeline, and staff RBAC.';
    } else if (!KNOWN_ROUTES.includes(route)) {
      title = '404 - Page Not Found | Lotus Tubes Sanitary Solutions';
      description = 'The requested sanitary stainless steel specification, product catalogue page, or resource could not be found.';
      breadcrumbs.push({ name: 'Not Found', path: `/${route}` });
    }

    updatePageSEO({
      title,
      description,
      path: route === 'home' ? '/' : `/${route}${param ? `/${param}` : ''}`,
      productData,
      breadcrumbs,
      noindex: route === 'crm' || route === 'account'
    });
  }, [route, param]);

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

  const isCRM = route === 'crm' || route === 'login';

  const handleOpenEnquiry = (product, productName) => {
    if (typeof product === 'string') {
      const found = PRODUCTS.find((p) => p.id === product || p.slug === product);
      setEnquiryProduct(found || { id: product, name: productName || product });
    } else {
      setEnquiryProduct(product);
    }
  };

  const handleCloseEnquiry = () => {
    setEnquiryProduct(null);
  };

  return (
    <LanguageProvider>
      <div id="app" className="app-root">
        {/* Top Viewport Route Transition Indicator */}
        <RouteProgressBar isNavigating={isNavigating} />
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
              onOpenEnquiry={handleOpenEnquiry}
            />

            {/* Breadcrumbs Bar */}
            <Breadcrumbs route={route} param={param} />

            {/* Main Content Area */}
            <main id="main-content" className="main-content" role="main">
              <ErrorBoundary>
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
                {route === 'about' && <AboutView onOpenEnquiry={handleOpenEnquiry} />}
                {route === 'quality' && (
                  <QualityView onOpenVideo={() => setIsVideoOpen(true)} />
                )}
                {route === 'resources' && <ResourcesView onNotify={addToast} />}
                {route === 'contact' && <ContactView onNotify={addToast} />}
                {route === 'quote' && <QuoteView onNotify={addToast} />}
                {route === 'account' && <CustomerAccountView onNotify={addToast} />}
                {!KNOWN_ROUTES.includes(route) && (
                  <NotFoundView onOpenEnquiry={handleOpenEnquiry} />
                )}
              </ErrorBoundary>
            </main>

            {/* Dual Split Pre-Footer Action Banner */}
            <PreFooterBanner onOpenEnquiry={handleOpenEnquiry} />

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
