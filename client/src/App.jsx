import React, { useState, useEffect } from 'react';
import { useLanguage } from './context/LanguageContext';
import { extractLangFromPath, localizePath } from './i18n/index.js';
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
import ChatWithUs from './components/chat/ChatWithUs';
import FloatingWhatsApp from './components/common/FloatingWhatsApp';
import ErrorBoundary from './components/common/ErrorBoundary';
import { RouteProgressBar } from './components/common/Loader';
import { initAnalytics, trackPageView } from './utils/analytics';

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
  'account',
  'crm',
  'login',
  'register'
];

export const App = () => {
  const { currentLang, setCurrentLang, t, isRTL } = useLanguage();

  const parseCurrentLocation = () => {
    // 1. Prioritize hash if it matches an actual known route or subroute (e.g. #login, #register, #account, #crm/quotations)
    const rawHash = (window.location.hash || '').replace(/^#\/?/, '');
    if (rawHash) {
      const { lang, cleanPath } = extractLangFromPath('/' + rawHash);
      const parts = cleanPath.replace(/^\//, '').split('/');
      const potentialRoute = parts[0] || '';
      if (KNOWN_ROUTES.includes(potentialRoute)) {
        return { lang: lang || 'en', route: potentialRoute, param: parts[1] || '' };
      }
    }
    // 2. Otherwise inspect clean path route (e.g. /about, /products, /contact, /login)
    const pathname = (window.location.pathname || '').replace(/^\/?/, '');
    if (pathname && pathname !== 'index.html') {
      const { lang, cleanPath } = extractLangFromPath('/' + pathname);
      const parts = cleanPath.replace(/^\//, '').split('/');
      return { lang: lang || 'en', route: parts[0] || 'home', param: parts[1] || '' };
    }
    return { lang: 'en', route: 'home', param: '' };
  };

  const [currentLoc, setCurrentLoc] = useState(parseCurrentLocation);
  const [isNavigating, setIsNavigating] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [enquiryProduct, setEnquiryProduct] = useState(null);
  const [toasts, setToasts] = useState([]);

  // Client-side domain migration redirect safeguard & Google Analytics initialization
  useEffect(() => {
    initAnalytics();

    if (typeof window !== 'undefined' && window.location) {
      const hostname = window.location.hostname;
      if (hostname.includes('vercel.app')) {
        const target = `https://lotustubes.com${window.location.pathname}${window.location.search}${window.location.hash}`;
        window.location.replace(target);
      }
    }
  }, []);

  useEffect(() => {
    let navTimer = null;
    const handleLocationChange = () => {
      setIsNavigating(true);
      const parsed = parseCurrentLocation();
      setCurrentLoc(parsed);
      if (parsed.lang && parsed.lang !== currentLang) {
        setCurrentLang(parsed.lang);
      }
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
        const { lang: linkLang, cleanPath } = extractLangFromPath(href);
        let targetHref = href;
        if (linkLang === 'en' && currentLang !== 'en') {
          targetHref = localizePath(cleanPath, currentLang);
        }
        window.history.pushState({}, '', targetHref);
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
  }, [currentLang, setCurrentLang]);

  const { route, param } = currentLoc;

  // Dynamic Technical SEO & Schema.org JSON-LD structured data injection
  useEffect(() => {
    let title = t('seo_home_title', 'Lotus Tubes | SS Sanitary Pipes, Fittings & Valves');
    let description = t('seo_home_desc', 'Lotus Tubes supplies SS 304 and SS 316L stainless steel sanitary pipes, tubes, fittings, tri-clamp components and hygienic valves for hygienic process industries.');
    let productData = null;
    let itemList = null;
    let breadcrumbs = [{ name: t('nav_home', 'Home'), path: '/' }];

    if (route === 'products') {
      title = t('seo_products_title', 'Sanitary Stainless Steel Catalogue | Pipes, Valves & Fittings | Lotus Tubes');
      description = t('seo_products_desc', 'Explore Lotus Tubes comprehensive range of SS 304 and SS 316L sanitary pipes, electropolished tubing, Tri-Clamp fittings, and hygienic valves.');
      breadcrumbs.push({ name: t('nav_products', 'Products'), path: '/products' });
      itemList = PRODUCTS.map((p) => ({
        name: p.name,
        url: `/product/${p.slug || p.id}`
      }));
    } else if (route === 'product' && param) {
      const found = PRODUCTS.find((p) => p.slug === param || p.id === param);
      if (found) {
        title = `${found.name} (${found.material}) - ${t('nav_products', 'Sanitary Specifications')} | Lotus Tubes`;
        description = found.overview || `${found.name} in ${found.material} with hygienic finish for pharmaceutical and food process applications.`;
        if (description.length > 160) {
          description = description.substring(0, 157) + '...';
        }
        productData = found;
        breadcrumbs.push({ name: t('nav_products', 'Products'), path: '/products' });
        if (found.categorySlug && found.category) {
          breadcrumbs.push({ name: found.category, path: `/category/${found.categorySlug}` });
        }
        breadcrumbs.push({ name: found.name, path: `/product/${found.slug || found.id}` });
      }
    } else if (route === 'category' && param) {
      const catName = param.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
      title = `${catName} | ${t('nav_products', 'Sanitary Stainless Steel Components')} | Lotus Tubes`;
      description = `Certified sanitary ${catName} in high purity SS 304 and SS 316L grades with Ra < 0.4µm surface finish for pharmaceutical and food process lines.`;
      breadcrumbs.push({ name: t('nav_products', 'Products'), path: '/products' });
      breadcrumbs.push({ name: catName, path: `/category/${param}` });
      const catProducts = PRODUCTS.filter((p) => p.categorySlug === param || p.category?.toLowerCase() === catName.toLowerCase());
      if (catProducts.length > 0) {
        itemList = catProducts.map((p) => ({
          name: p.name,
          url: `/product/${p.slug || p.id}`
        }));
      }
    } else if (route === 'about') {
      title = t('seo_about_title', 'About Lotus Tubes | Stainless Steel Sanitary Specialists Mumbai');
      description = t('seo_about_desc', 'Lotus Tubes delivers high-precision stainless steel sanitary tubes and components from Girgaon, Mumbai to pharmaceutical and food process leaders worldwide.');
      breadcrumbs.push({ name: t('nav_about', 'About Us'), path: '/about' });
    } else if (route === 'industries' || route === 'industry') {
      title = t('seo_industries_title', 'Process Industries We Serve | Lotus Tubes Sanitary Solutions');
      description = t('seo_industries_desc', 'Hygienic stainless steel piping, fittings, and valves engineered for pharmaceutical, biotech, dairy, food & beverage, and high-purity water systems.');
      breadcrumbs.push({ name: t('nav_industries', 'Industries'), path: '/industries' });
    } else if (route === 'quality') {
      title = t('seo_quality_title', 'Quality Assurance & Mill Test Certification | Lotus Tubes');
      description = t('seo_quality_desc', 'Every Lotus Tubes sanitary product complies with ASTM A270, ASME BPE, and 3-A standards. Verified with EN 10204 3.1 MTR inspection certification.');
      breadcrumbs.push({ name: t('nav_quality', 'Quality Assurance'), path: '/quality' });
    } else if (route === 'resources') {
      title = t('seo_resources_title', 'Engineering Resources & Technical Datasheets | Lotus Tubes');
      description = t('seo_resources_desc', 'Download sanitary stainless steel dimensional charts, ASTM A270 specifications, and electropolished surface roughness conversion tables.');
      breadcrumbs.push({ name: t('nav_resources', 'Resources'), path: '/resources' });
    } else if (route === 'contact') {
      title = t('seo_contact_title', 'Contact Lotus Tubes | Girgaon Mumbai Sales Office');
      description = t('seo_contact_desc', 'Connect with Lotus Tubes engineering sales team in Mumbai for sanitary tubes, customized fittings, and valve requirements. Call +91 98205 25200.');
      breadcrumbs.push({ name: t('nav_contact', 'Contact'), path: '/contact' });
    } else if (route === 'quote') {
      title = t('seo_quote_title', 'Request a Formal B2B Quotation | Lotus Tubes');
      description = t('seo_quote_desc', 'Submit your Bill of Quantities (BOQ) for instant review and competitive quotation on SS 304 and SS 316L sanitary pipes, fittings, and valves.');
      breadcrumbs.push({ name: t('nav_quote', 'Request Quote'), path: '/quote' });
    } else if (route === 'login') {
      title = 'Customer Account Sign In | Lotus Tubes Secure Portal';
      description = 'Secure login portal for Lotus Tubes customer accounts and staff workspace management.';
      breadcrumbs.push({ name: 'Secure Portal', path: '/#login' });
    } else if (route === 'register') {
      title = 'Create Customer Account | Lotus Tubes Secure Portal';
      description = 'Register for a verified Lotus Tubes customer account to track quotation inquiries, billing, and order dispatches.';
      breadcrumbs.push({ name: 'Register Account', path: '/#register' });
    } else if (route === 'account') {
      title = 'Customer Account & Quotation History | Lotus Tubes';
      description = 'View your active quotation inquiries, track dispatch status, and download EN 10204 3.1 material test certificates for Lotus Tubes orders.';
      breadcrumbs.push({ name: 'Customer Account', path: '/account' });
    } else if (route === 'crm') {
      const crmTitles = {
        dashboard: 'Executive Dashboard | Staff CRM | Lotus Tubes',
        enquiries: 'Client Enquiries & Resolution | Staff CRM | Lotus Tubes',
        quotations: 'Quotation Management & RFQs | Staff CRM | Lotus Tubes',
        customers: 'Customer Directory & Accounts | Staff CRM | Lotus Tubes',
        tasks: 'Operational Tasks & Workflow | Staff CRM | Lotus Tubes',
        products: 'Product Master Catalogue | Staff CRM | Lotus Tubes',
        videos: 'Video Assets & Facility Media | Staff CRM | Lotus Tubes',
        staff: 'Staff Roles & Permissions | Staff CRM | Lotus Tubes',
        reports: 'Sales Analytics & Reports | Staff CRM | Lotus Tubes',
        seo: 'Technical SEO Audit & Search Console | Staff CRM | Lotus Tubes',
        'ai-operations': 'AI Operations & Dispatch Approvals | Staff CRM | Lotus Tubes',
        'agent-ananya': 'Ananya Mehta | Quotations & Sales Coordination | Staff CRM',
        'agent-riya': 'Riya Shah | Commercial Billing & Invoicing | Staff CRM',
        'agent-neha': 'Neha Desai | Client Resolution & Inquiries | Staff CRM',
        'agent-arjun': 'Arjun Yadav | Operations & Live Concierge | Staff CRM'
      };
      title = crmTitles[param] || 'Lotus Tubes Staff CRM & Operations Portal';
      description = 'Internal operational management system for Lotus Tubes customer enquiries, quotations, pipeline, and staff RBAC.';
    } else if (!KNOWN_ROUTES.includes(route)) {
      title = '404 - Page Not Found | Lotus Tubes Sanitary Solutions';
      description = 'The requested sanitary stainless steel specification, product catalogue page, or resource could not be found.';
      breadcrumbs.push({ name: 'Not Found', path: `/${route}` });
    }

    const currentPath = route === 'home' ? '/' : `/${route}${param ? `/${param}` : ''}`;

    updatePageSEO({
      title,
      description,
      path: currentPath,
      lang: currentLang,
      productData,
      itemList,
      breadcrumbs,
      noindex: route === 'crm' || route === 'account'
    });

    trackPageView(currentPath, title);
  }, [route, param, currentLang]);

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

  const isCRM = route === 'crm' || route === 'login' || route === 'register';

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
    <div id="app" className={`app-root ${isRTL ? 'app-root--rtl' : ''}`}>
        {/* Top Viewport Route Transition Indicator */}
        <RouteProgressBar isNavigating={isNavigating} />
        {isCRM ? (
          <CRMView
            subroute={route === 'register' ? 'register' : (param || (route === 'login' ? 'login' : 'dashboard'))}
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
            {route !== 'home' && <PreFooterBanner onOpenEnquiry={handleOpenEnquiry} />}

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

        {/* Floating Customer Help Widgets (Strictly Public Website Pages Only — Hidden on Login, Register & CRM) */}
        {!isCRM && (
          <>
            <FloatingWhatsApp />
            <ChatWithUs />
          </>
        )}
      </div>
  );
};

export default App;
