import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { CONFIG } from '../../data/siteData';
import { apiService } from '../../services/api';
import { isTypographyCustomizerEnabled } from '../../utils/typography';
import TypographyCustomizer from '../common/TypographyCustomizer';

export const Footer = ({ onOpenTypography }) => {
  const { t, currentLang, localizePath } = useLanguage();
  const rawPhone = (CONFIG.primaryPhone || '+91 9867304316').replace(/\s+/g, '');
  const waNumber = (CONFIG.whatsapp || '919867304316').replace(/\D/g, '');
  const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(
    'Hi Lotus Tubes, I need assistance choosing the right sanitary stainless steel products.'
  )}`;

  // Typography Customizer State
  const [isTypographyOpen, setIsTypographyOpen] = useState(false);
  const showTypographyPreview = isTypographyCustomizerEnabled();

  return (
    <footer className="w-full bg-[#081D5B] text-slate-200 relative border-t border-white/10 overflow-hidden font-sans" id="site-footer">
      {/* Background World Map & Grid Texture */}
      <div
        className="absolute inset-0 pointer-events-none opacity-10 bg-repeat bg-center"
        style={{
          backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.3) 1px, transparent 1px)',
          backgroundSize: '28px 28px'
        }}
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-12 lg:py-16 relative z-10 flex flex-col gap-10">
        {/* Figma Approved Top Action Strip: Consultation & Help Desk */}
        <div className="pb-8 border-b border-white/15 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <a href={localizePath('/', currentLang)} className="inline-block group focus:outline-none" aria-label="Lotus Tubes - Return to Home">
              <img
                src="/banner-image-opt.png"
                alt="Lotus Tubes - Stainless Steel Sanitary Pipes & Valves"
                className="h-10 sm:h-12 w-auto object-contain transition-transform duration-200 group-hover:scale-102 brightness-110"
                width="200"
                height="48"
              />
            </a>
          </div>

          <div className="text-center md:text-left flex-1 max-w-2xl px-2">
            <h4 className="text-sm sm:text-base font-bold text-white mb-1">
              Do not know how to choose the right products?
            </h4>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Our professional sales engineers are here to consult and help you to offer with suitable solutions.
            </p>
          </div>

          <div className="shrink-0 flex items-center gap-3">
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-[#E93984] to-[#FC63A7] hover:from-[#D81B60] hover:to-[#E93984] text-white text-xs font-bold uppercase tracking-wider shadow-lg transition-all cursor-pointer"
            >
              <span>ASK FOR HELP</span>
              <span>↗</span>
            </a>
          </div>
        </div>

        {/* Figma Approved 4-Column Structured Footer Content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10 text-xs">
          {/* Column 1: Recommended Products */}
          <div className="flex flex-col gap-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white border-b border-white/15 pb-2">
              RECOMMENDED PRODUCTS
            </h3>
            <ul className="flex flex-col gap-2 text-slate-300">
              <li>
                <a href={localizePath('/products?q=DIN+11851', currentLang)} className="hover:text-white transition-colors">
                  DIN 11851 Nut
                </a>
              </li>
              <li>
                <a href={localizePath('/products?q=DIN+11851+bend', currentLang)} className="hover:text-white transition-colors">
                  DIN 11851 Male-Male Bend
                </a>
              </li>
              <li>
                <a href={localizePath('/products?q=DIN+11851+aerator', currentLang)} className="hover:text-white transition-colors">
                  DIN 11851 Nut Aerator Tube
                </a>
              </li>
              <li>
                <a href={localizePath('/products?q=DIN+11851+tee', currentLang)} className="hover:text-white transition-colors">
                  DIN 11851 Male T
                </a>
              </li>
              <li>
                <a href={localizePath('/products?q=DIN+11851+liner+bend', currentLang)} className="hover:text-white transition-colors">
                  DIN 11851 Male-Liner Bend
                </a>
              </li>
              <li>
                <a href={localizePath('/products?q=DIN+11851+reducer', currentLang)} className="hover:text-white transition-colors">
                  DIN 11851 Male Reducer
                </a>
              </li>
              <li>
                <a href={localizePath('/products?q=DIN+11851+liner+male+reducer', currentLang)} className="hover:text-white transition-colors">
                  DIN 11851 Liner-Male Reducer
                </a>
              </li>
              <li>
                <a href={localizePath('/products?q=DIN+11851+liner+reducer', currentLang)} className="hover:text-white transition-colors">
                  DIN 11851 Liner Reducer
                </a>
              </li>
            </ul>
          </div>

          {/* Column 2: Hot Products */}
          <div className="flex flex-col gap-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white border-b border-white/15 pb-2">
              HOT PRODUCTS
            </h3>
            <ul className="flex flex-col gap-2 text-slate-300">
              <li>
                <a href={localizePath('/product/ss-sanitary-butterfly-valve', currentLang)} className="hover:text-white transition-colors">
                  3A DIN SMS Sanitary Dairy &amp; Milk Pneumatic Actuator Butterfly Valve
                </a>
              </li>
              <li>
                <a href={localizePath('/product/pneumatic-sanitary-ball-valve', currentLang)} className="hover:text-white transition-colors">
                  DN50 Sanitary Ball Valves for Beer &amp; Beverage Industry
                </a>
              </li>
              <li>
                <a href={localizePath('/product/ss-316l-diaphragm-valve', currentLang)} className="hover:text-white transition-colors">
                  Clamp End Diaphragm Valves with Pneumatic Actuator
                </a>
              </li>
              <li>
                <a href={localizePath('/product/ss-3-piece-ball-valve-tc-end', currentLang)} className="hover:text-white transition-colors">
                  Hygienic 3-Piece Stainless Steel Encapsulated Ball Valve
                </a>
              </li>
              <li>
                <a href={localizePath('/product/ss-316l-ep-pipe', currentLang)} className="hover:text-white transition-colors">
                  SS 316L Electro Polished Sanitary Pipe (Ra ≤ 0.38µm)
                </a>
              </li>
              <li>
                <a href={localizePath('/product/ss-tri-clamp-ferrule', currentLang)} className="hover:text-white transition-colors">
                  SS Tri-Clamp Ferrules &amp; Heavy Duty Sanitary Clamps
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Product Categories */}
          <div className="flex flex-col gap-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white border-b border-white/15 pb-2">
              PRODUCT CATEGORIES
            </h3>
            <ul className="flex flex-col gap-2 text-slate-300">
              <li>
                <a href={localizePath('/category/manual-valves', currentLang)} className="hover:text-white transition-colors">
                  Sanitary Valves
                </a>
              </li>
              <li>
                <a href={localizePath('/category/sanitary-fittings', currentLang)} className="hover:text-white transition-colors">
                  Sanitary Fittings
                </a>
              </li>
              <li>
                <a href={localizePath('/category/tri-clamp', currentLang)} className="hover:text-white transition-colors">
                  Sanitary Hose Fittings &amp; Tri-Clamps
                </a>
              </li>
              <li>
                <a href={localizePath('/category/tank-accessories', currentLang)} className="hover:text-white transition-colors">
                  Sanitary Tank Accessories &amp; Spray Balls
                </a>
              </li>
              <li>
                <a href={localizePath('/category/sanitary-pipes', currentLang)} className="hover:text-white transition-colors">
                  Sanitary Tubes &amp; Pipes (EP / MP)
                </a>
              </li>
              <li>
                <a href={localizePath('/category/accessories', currentLang)} className="hover:text-white transition-colors">
                  Sanitary Pumps &amp; Sight Glasses
                </a>
              </li>
              <li>
                <a href={localizePath('/category/custom-products', currentLang)} className="hover:text-white transition-colors">
                  Customized Hygienic Products
                </a>
              </li>
              <li>
                <a href={localizePath('/category/gaskets', currentLang)} className="hover:text-white transition-colors">
                  Sanitary Gaskets (Silicone / EPDM / PTFE)
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact Us */}
          <div className="flex flex-col gap-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white border-b border-white/15 pb-2">
              CONTACT US
            </h3>
            <div className="flex flex-col gap-2.5 text-slate-300">
              <div className="flex items-start gap-2">
                <span className="text-[#FC63A7] text-sm shrink-0">📍</span>
                <span>
                  Office: Shop No. 9, Jain Bhavan CHSL, Dr Bhajekar Lane, Khetwadi, Girgaon, Mumbai, Maharashtra 400004, India
                </span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-[#FC63A7] text-sm shrink-0">🏭</span>
                <span>
                  Supply Hub: Mumbai Industrial Zone, Maharashtra, India
                </span>
              </div>
              <div className="flex items-center gap-2 pt-1">
                <span className="text-[#FC63A7] text-sm shrink-0">📞</span>
                <a href={`tel:${rawPhone}`} className="hover:text-white transition-colors font-medium">
                  {CONFIG.primaryPhone || '+91 9867304316'}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[#25D366] text-sm shrink-0">💬</span>
                <a href={waUrl} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors font-medium">
                  WhatsApp: +91 9867304316
                </a>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[#FC63A7] text-sm shrink-0">✉️</span>
                <a href={`mailto:${CONFIG.primaryEmail || 'sales@lotustubes.com'}`} className="hover:text-white transition-colors font-medium">
                  {CONFIG.primaryEmail || 'sales@lotustubes.com'}
                </a>
              </div>
              <div className="pt-2">
                <a
                  href="#login"
                  className="inline-flex items-center gap-1.5 text-[11px] text-[#FC63A7] hover:underline font-semibold"
                >
                  <span>Staff &amp; Client CRM Portal</span>
                  <span>→</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Copyright Bar */}
        <div className="pt-6 border-t border-white/15 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-400">
          <div>
            Copyright © 2026 Lotus Impex (Lotus Tubes). All Rights Reserved.
          </div>
          <div className="flex items-center gap-4 flex-wrap">
            <a href={localizePath('/about', currentLang)} className="hover:text-white transition-colors">
              About Us
            </a>
            <span>•</span>
            <a href={localizePath('/quality', currentLang)} className="hover:text-white transition-colors">
              Quality Assurance
            </a>
            <span>•</span>
            <a href={localizePath('/contact', currentLang)} className="hover:text-white transition-colors">
              Contact Us
            </a>
            {showTypographyPreview && (
              <>
                <span>•</span>
                <button
                  type="button"
                  onClick={onOpenTypography || (() => setIsTypographyOpen(true))}
                  className="inline-flex items-center gap-1.5 text-slate-400 hover:text-[#FC63A7] transition-colors cursor-pointer bg-transparent border-0 p-0 text-[11px]"
                  title="Website Typography Customizer"
                >
                  <span>Typography</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Fallback local modal if onOpenTypography not provided */}
      {!onOpenTypography && showTypographyPreview && (
        <TypographyCustomizer
          isOpen={isTypographyOpen}
          onClose={() => setIsTypographyOpen(false)}
        />
      )}
    </footer>
  );
};

export default Footer;
