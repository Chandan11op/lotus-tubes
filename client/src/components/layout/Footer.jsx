import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { CONFIG } from '../../data/siteData';

export const Footer = () => {
  const { t, currentLang, localizePath } = useLanguage();
  const rawPhone = (CONFIG.primaryPhone || '+91 98205 25200').replace(/\s+/g, '');

  return (
    <footer className="site-footer bg-slate-950 text-slate-300 relative border-t border-slate-800/80 overflow-hidden" id="site-footer">
      {/* Decorative ambient metallic background gradient */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-25"
        style={{
          backgroundImage: 'radial-gradient(circle at 15% 20%, rgba(2, 132, 199, 0.18) 0%, transparent 45%), radial-gradient(circle at 85% 80%, rgba(224, 75, 124, 0.12) 0%, transparent 50%)'
        }}
        aria-hidden="true"
      />

      {/* Industrial Dispatch & Standards Ticker Bar */}
      <div className="border-b border-slate-800 bg-slate-900/90 py-3.5 backdrop-blur-md relative z-10">
        <div className="site-container flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span className="font-semibold text-slate-200 tracking-wide uppercase">
              Mumbai Business Desk:
            </span>
            <span className="text-slate-400 hidden sm:inline">
              Product availability and delivery timelines confirmed per enquiry
            </span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">Product Range:</span>
            <span className="px-2 py-0.5 rounded bg-slate-800 text-sky-400 font-mono text-[11px] border border-slate-700/80">SS 304 / SS 316L</span>
            <span className="px-2 py-0.5 rounded bg-slate-800 text-sky-400 font-mono text-[11px] border border-slate-700/80">EP / MP Finishes</span>
            <span className="px-2 py-0.5 rounded bg-slate-800 text-sky-400 font-mono text-[11px] border border-slate-700/80">Sanitary Fittings</span>
            <span className="px-2 py-0.5 rounded bg-slate-800 text-sky-400 font-mono text-[11px] border border-slate-700/80">Hygienic Valves</span>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="site-container py-14 sm:py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">

          {/* Col 1: Brand & Sourcing Statement (Cols 1-4) */}
          <div className="lg:col-span-4 flex flex-col justify-between space-y-6">
            <div>
              <a href={localizePath('/', currentLang)} className="inline-block group mb-5" aria-label="Lotus Tubes - Return to Home">
                <img
                  src="/banner-image.png"
                  alt="Lotus Tubes - Stainless Steel Sanitary Pipes & Valves"
                  className="h-14 sm:h-16 w-auto object-contain transition-transform duration-300 group-hover:scale-102"
                  width="240"
                  height="64"
                />
              </a>

              <p className="text-sm text-slate-400 leading-relaxed max-w-sm mb-6">
                {t(
                  'footer_desc',
                  'Lotus Tubes supplies stainless steel sanitary pipes, tubes, fittings and valves in SS 304 and SS 316L for pharmaceutical, dairy, food and beverage, brewery, chemical and water-treatment applications. Product specifications and documentation are confirmed against each enquiry.'
                )}
              </p>

              {/* Direct Metallurgy Badges */}
              <div className="flex flex-wrap gap-2 mb-6">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-[11px] font-mono font-medium text-slate-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-400"></span> SS 316L &amp; SS 304
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-[11px] font-mono font-medium text-slate-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> EP &amp; MP Finishes
                </span>
                
              </div>
            </div>

            {/* Social & Contact Channels */}
            <div className="pt-2">
              <div className="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-3">
                Direct Channels &amp; Verification
              </div>
              <div className="flex items-center gap-3">
                <a
                  href="https://www.linkedin.com/company/lotus-tubes"
                  className="w-10 h-10 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-sky-600 hover:border-sky-500 transition-all duration-200"
                  title="LinkedIn Official Company Profile"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Lotus Tubes LinkedIn Profile"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.64a1.64 1.64 0 1 0 0 3.28 1.64 1.64 0 0 0 0-3.28z" />
                  </svg>
                </a>
                <a
                  href={`https://wa.me/${CONFIG.whatsappNumber}?text=Hello%20Lotus%20Tubes%2C%20I%20have%20an%20enquiry%20regarding%20sanitary%20stainless%20steel%20products.`}
                  className="w-10 h-10 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-emerald-400 hover:text-white hover:bg-emerald-600 hover:border-emerald-500 transition-all duration-200"
                  title="WhatsApp Business Direct Desk"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="WhatsApp Business Desk"
                >
                  <span className="text-base">💬</span>
                </a>
                <a
                  href={`mailto:${'sales' + '@' + 'lotustubes.com'}`}
                  className="w-10 h-10 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-sky-400 hover:text-white hover:bg-sky-600 hover:border-sky-500 transition-all duration-200"
                  title="Email Sales Engineering"
                  aria-label="Email Sales Desk"
                >
                  <span className="text-base">✉️</span>
                </a>
                <a
                  href={`tel:${rawPhone}`}
                  className="w-10 h-10 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-amber-400 hover:text-white hover:bg-amber-600 hover:border-amber-500 transition-all duration-200"
                  title="Call Lotus Tubes Direct"
                  aria-label="Direct Phone Line"
                >
                  <span className="text-base">📞</span>
                </a>
              </div>
            </div>
          </div>

          {/* Col 2: Sanitary Product Catalog (Cols 5-7) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-xs font-mono font-bold tracking-widest text-sky-400 uppercase">
              {t('footer_col_products', 'Sanitary Product Suites')}
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>
                <a href={localizePath('/category/sanitary-pipes', currentLang)} className="hover:text-white transition-colors flex items-center gap-1.5 group">
                  <span className="text-sky-500 opacity-60 group-hover:opacity-100 transition-opacity">›</span>
                  Sanitary Pipes &amp; Tubes
                </a>
              </li>
              <li>
                <a href={localizePath('/category/sanitary-fittings', currentLang)} className="hover:text-white transition-colors flex items-center gap-1.5 group">
                  <span className="text-sky-500 opacity-60 group-hover:opacity-100 transition-opacity">›</span>
                  Sanitary Bends, Tees &amp; Reducers
                </a>
              </li>
              <li>
                <a href={localizePath('/category/tri-clamp', currentLang)} className="hover:text-white transition-colors flex items-center gap-1.5 group">
                  <span className="text-sky-500 opacity-60 group-hover:opacity-100 transition-opacity">›</span>
                  Tri-Clamp Ferrules, Clamps &amp; Blanks
                </a>
              </li>
              <li>
                <a href={localizePath('/category/gaskets', currentLang)} className="hover:text-white transition-colors flex items-center gap-1.5 group">
                  <span className="text-sky-500 opacity-60 group-hover:opacity-100 transition-opacity">›</span>
                  USP Class VI &amp; FDA Sanitary Gaskets
                </a>
              </li>
              <li>
                <a href={localizePath('/category/manual-valves', currentLang)} className="hover:text-white transition-colors flex items-center gap-1.5 group">
                  <span className="text-sky-500 opacity-60 group-hover:opacity-100 transition-opacity">›</span>
                  Hygienic Butterfly &amp; Ball Valves
                </a>
              </li>
              <li>
                <a href={localizePath('/category/pneumatic-valves', currentLang)} className="hover:text-white transition-colors flex items-center gap-1.5 group">
                  <span className="text-sky-500 opacity-60 group-hover:opacity-100 transition-opacity">›</span>
                  Aseptic Diaphragm &amp; Control Valves
                </a>
              </li>
              <li>
                <a href={localizePath('/category/tank-cleaning', currentLang)} className="hover:text-white transition-colors flex items-center gap-1.5 group">
                  <span className="text-sky-500 opacity-60 group-hover:opacity-100 transition-opacity">›</span>
                  Rotary CIP Tank Cleaning Spray Balls
                </a>
              </li>
              <li>
                <a href={localizePath('/category/custom-assemblies', currentLang)} className="hover:text-white transition-colors flex items-center gap-1.5 group">
                  <span className="text-sky-500 opacity-60 group-hover:opacity-100 transition-opacity">›</span>
                  Custom Fabrication &amp; Hygienic Spools
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Industries & Technical Standards (Cols 8-9) */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-xs font-mono font-bold tracking-widest text-sky-400 uppercase">
              {t('footer_col_industries', 'Sectors & Standards')}
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li><a href={localizePath('/industries', currentLang)} className="hover:text-white transition-colors">{t('ind_pharma', 'Biopharma Processing')}</a></li>
              <li><a href={localizePath('/industries', currentLang)} className="hover:text-white transition-colors">{t('ind_dairy', 'Dairy & Milk Processing')}</a></li>
              <li><a href={localizePath('/industries', currentLang)} className="hover:text-white transition-colors">{t('ind_food', 'Food & Beverage Skids')}</a></li>
              <li><a href={localizePath('/industries', currentLang)} className="hover:text-white transition-colors">{t('ind_brew', 'Breweries & Distilleries')}</a></li>
              <li><a href={localizePath('/industries', currentLang)} className="hover:text-white transition-colors">{t('ind_water', 'WFI High-Purity Water')}</a></li>
              <li className="pt-2 border-t border-slate-800/80">
                <a href={localizePath('/quality', currentLang)} className="hover:text-white text-xs font-semibold text-slate-300 transition-colors block">
                  Material Test Certificates (3.1)
                </a>
              </li>
              <li>
                <a href={localizePath('/resources', currentLang)} className="hover:text-white text-xs font-semibold text-slate-300 transition-colors block">
                  Dimensional Specification Charts
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Quality Assurance & Corporate Policies */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-xs font-mono font-bold tracking-widest text-sky-400 uppercase">
              Policies &amp; Compliance
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>
                <a href={localizePath('/quality', currentLang)} className="hover:text-white transition-colors flex items-center gap-1.5 group">
                  <span className="text-sky-500 opacity-60 group-hover:opacity-100 transition-opacity">›</span>
                  Quality Assurance Policy
                </a>
              </li>
              <li>
                <a href={localizePath('/contact', currentLang)} className="hover:text-white transition-colors flex items-center gap-1.5 group">
                  <span className="text-sky-500 opacity-60 group-hover:opacity-100 transition-opacity">›</span>
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href={localizePath('/contact', currentLang)} className="hover:text-white transition-colors flex items-center gap-1.5 group">
                  <span className="text-sky-500 opacity-60 group-hover:opacity-100 transition-opacity">›</span>
                  Terms of Supply
                </a>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* Bottom Bar: Copyright & Compliance */}
      <div className="border-t border-slate-800/80 bg-slate-950/90 py-6 relative z-10">
        <div className="site-container flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p className="text-center md:text-left">
            &copy; <span>{new Date().getFullYear()}</span> Lotus Tubes.{' '}
            <span className="text-slate-400">All rights reserved. Precision Stainless Steel Sanitary Engineering.</span>
          </p>

          <div className="flex items-center gap-4 flex-wrap justify-center text-slate-400">
            <a href={localizePath('/quality', currentLang)} className="hover:text-white transition-colors">Quality Assurance Policy</a>
            <span className="text-slate-700">•</span>
            <a href={localizePath('/contact', currentLang)} className="hover:text-white transition-colors">Privacy Policy</a>
            <span className="text-slate-700">•</span>
            <a href={localizePath('/contact', currentLang)} className="hover:text-white transition-colors">Terms of Supply</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
