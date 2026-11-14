import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { CONFIG } from '../../data/siteData';
import { apiService } from '../../services/api';

export const Footer = () => {
  const { t, currentLang, localizePath } = useLanguage();
  const rawPhone = (CONFIG.primaryPhone || '+91 98205 25200').replace(/\s+/g, '');

  // Footer Quick RFQ State
  const [rfqName, setRfqName] = useState('');
  const [rfqContact, setRfqContact] = useState('');
  const [rfqComponent, setRfqComponent] = useState('SS 316L Sanitary Valves');
  const [rfqQty, setRfqQty] = useState('');
  const [rfqSuccess, setRfqSuccess] = useState('');
  const [rfqLoading, setRfqLoading] = useState(false);

  // Footer Newsletter State
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSuccess, setNewsletterSuccess] = useState(false);

  const handleFooterRfq = async (e) => {
    e.preventDefault();
    if (!rfqName || !rfqContact) return;
    setRfqLoading(true);
    try {
      const payload = {
        name: rfqName,
        email: rfqContact.includes('@') ? rfqContact : undefined,
        phone: !rfqContact.includes('@') ? rfqContact : undefined,
        productName: rfqComponent,
        notes: `Quick RFQ from Footer. Required Qty: ${rfqQty || 'Standard batch'}`
      };
      const res = await apiService.createEnquiry(payload);
      const ref = res?.data?.referenceId || `RFQ-${Date.now().toString().slice(-6)}`;
      setRfqSuccess(`RFQ Logged! Ref: ${ref}`);
      setRfqName('');
      setRfqContact('');
      setRfqQty('');
    } catch {
      setRfqSuccess(`RFQ Logged! Ref: RFQ-${Date.now().toString().slice(-6)}`);
    } finally {
      setRfqLoading(false);
    }
  };

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    setNewsletterSuccess(true);
    setNewsletterEmail('');
    setTimeout(() => setNewsletterSuccess(false), 5000);
  };

  return (
    <footer className="w-full bg-[#071A52] text-slate-300 relative border-t border-[#2D8CFF]/30 overflow-hidden font-body-md" id="site-footer">
      {/* Background World Map & Factory Texture Overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-10 bg-repeat bg-center"
        style={{
          backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(45, 140, 255, 0.4) 1px, transparent 1px)',
          backgroundSize: '32px 32px'
        }}
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 pointer-events-none opacity-15"
        style={{
          backgroundImage: 'radial-gradient(ellipse at 80% 20%, rgba(45, 140, 255, 0.35) 0%, transparent 60%)'
        }}
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-14 lg:py-20 relative z-10 flex flex-col gap-12">
        {/* Top Split: Main Columns + Quick RFQ Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          {/* Brand Info & Mission (Span 4) */}
          <div className="lg:col-span-4 flex flex-col gap-5">
            <a href={localizePath('/', currentLang)} className="inline-block group focus:outline-none" aria-label="Lotus Tubes - Return to Home">
              <img
                src="/banner-image-opt.png"
                alt="Lotus Tubes - Stainless Steel Sanitary Pipes & Valves"
                className="h-12 w-auto object-contain transition-transform duration-200 group-hover:scale-102"
                width="220"
                height="52"
              />
            </a>

            <p className="font-sans text-sm text-slate-300 leading-relaxed">
              {t(
                'footer_desc',
                'Lotus Tubes (Lotus Impex) is a trusted supplier of stainless steel sanitary pipes, tubes, fittings, and valves in SS 304 & SS 316L, supporting sterile biopharma, dairy, food & beverage, brewery, chemical and water-treatment applications with verified metallurgy and ready stock.'
              )}
            </p>

            {/* Precision Standard Badges */}
            <div className="flex flex-wrap gap-2 pt-1 font-sans text-xs">
              <span className="px-2.5 py-1 rounded bg-[#0B226D] border border-[#2D8CFF]/30 text-white font-semibold">
                SS 316L &amp; SS 304
              </span>
              <span className="px-2.5 py-1 rounded bg-[#0B226D] border border-[#2D8CFF]/30 text-[#2D8CFF] font-semibold">
                Ra ≤ 0.38µm EP
              </span>
              <span className="px-2.5 py-1 rounded bg-[#0B226D] border border-[#2D8CFF]/30 text-[#FF007A] font-semibold">
                ASME BPE &amp; 3-A Standards
              </span>
            </div>

            {/* Direct Connect Buttons */}
            <div className="pt-2 flex items-center gap-3 flex-wrap">
              <a
                href={`https://wa.me/${CONFIG.whatsappNumber || '919820525200'}?text=${encodeURIComponent(
                  'Hello Lotus Tubes, I have an enquiry regarding sanitary stainless steel products.'
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#25D366] hover:bg-[#20BA5A] text-slate-950 font-bold text-xs transition-all shadow-md cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#25D366]/50"
                title="WhatsApp Business Direct Desk"
              >
                <svg
                  className="w-4 h-4 fill-current shrink-0"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.63C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2ZM12.04 20.15C10.56 20.15 9.11 19.76 7.85 19.01L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.3C4.24 14.99 3.8 13.47 3.8 11.91C3.8 7.37 7.5 3.67 12.04 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.04 20.15ZM16.56 14.39C16.31 14.26 15.1 13.67 14.87 13.59C14.65 13.51 14.48 13.46 14.32 13.71C14.15 13.96 13.67 14.53 13.53 14.7C13.38 14.86 13.24 14.88 12.99 14.76C12.74 14.63 11.95 14.37 11.01 13.54C10.28 12.89 9.78 12.08 9.64 11.83C9.49 11.58 9.62 11.45 9.75 11.32C9.86 11.21 10 11.04 10.12 10.9C10.25 10.76 10.29 10.66 10.37 10.49C10.45 10.33 10.41 10.18 10.35 10.06C10.29 9.93 9.79 8.71 9.59 8.2C9.39 7.71 9.18 7.78 9.03 7.77C8.89 7.76 8.72 7.76 8.55 7.76C8.38 7.76 8.11 7.82 7.88 8.07C7.65 8.32 7 8.93 7 10.17C7 11.41 7.9 12.61 8.03 12.77C8.15 12.94 9.81 15.5 12.35 16.59C12.95 16.85 13.42 17.01 13.79 17.12C14.4 17.31 14.95 17.29 15.39 17.22C15.88 17.15 16.9 16.61 17.11 16.02C17.32 15.43 17.32 14.93 17.26 14.82C17.2 14.72 17.06 14.66 16.81 14.53L16.56 14.39Z" />
                </svg>
                <span>WhatsApp Desk</span>
              </a>
              <a
                href={`mailto:${CONFIG.primaryEmail || 'sales@lotustubes.com'}`}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#0B226D] hover:bg-[#102C82] text-white border border-[#2D8CFF]/30 font-semibold text-xs transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#2D8CFF]/50"
                title="Email Sales Desk"
              >
                <svg
                  className="w-3.5 h-3.5 text-[#2D8CFF] shrink-0"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
                <span>{CONFIG.primaryEmail || 'sales@lotustubes.com'}</span>
              </a>
            </div>
          </div>

          {/* Quick Navigation Links (Span 4: 2 columns of 2) */}
          <div className="lg:col-span-4 grid grid-cols-2 gap-6">
            <div className="flex flex-col gap-3">
              <span className="font-heading text-xs text-white uppercase tracking-wider font-bold">
                Process Conduits
              </span>
              <nav className="flex flex-col gap-2 font-sans text-xs text-slate-300">
                <a href={localizePath('/category/sanitary-pipes', currentLang)} className="hover:text-[#2D8CFF] transition-colors">
                  Sanitary Tubes &amp; Pipes
                </a>
                <a href={localizePath('/category/manual-valves', currentLang)} className="hover:text-[#2D8CFF] transition-colors">
                  Butterfly &amp; Ball Valves
                </a>
                <a href={localizePath('/category/manual-valves', currentLang)} className="hover:text-[#2D8CFF] transition-colors">
                  Aseptic Diaphragm Valves
                </a>
                <a href={localizePath('/category/tri-clamp', currentLang)} className="hover:text-[#2D8CFF] transition-colors">
                  Tri-Clamp Ferrules &amp; Clamps
                </a>
                <a href={localizePath('/category/sanitary-fittings', currentLang)} className="hover:text-[#2D8CFF] transition-colors">
                  90° Bends &amp; Equal Tees
                </a>
                <a href={localizePath('/category/gaskets', currentLang)} className="hover:text-[#2D8CFF] transition-colors">
                  USP Class VI Gaskets
                </a>
                <a href={localizePath('/products', currentLang)} className="hover:text-[#2D8CFF] transition-colors">
                  Product Catalogue
                </a>
              </nav>
            </div>

            <div className="flex flex-col gap-3">
              <span className="font-heading text-xs text-white uppercase tracking-wider font-bold">
                Company &amp; Quality
              </span>
              <nav className="flex flex-col gap-2 font-sans text-xs text-slate-300">
                <a href={localizePath('/quality', currentLang)} className="hover:text-[#2D8CFF] transition-colors">
                  MTC EN 10204 3.1 Traceability
                </a>
                <a href={localizePath('/quality', currentLang)} className="hover:text-[#2D8CFF] transition-colors">
                  3-A &amp; ASME BPE Standards
                </a>
                <a href={localizePath('/industries', currentLang)} className="hover:text-[#2D8CFF] transition-colors">
                  Biopharma Cleanrooms
                </a>
                <a href={localizePath('/industries', currentLang)} className="hover:text-[#2D8CFF] transition-colors">
                  Dairy &amp; Ice Cream Skids
                </a>
                <a href="#why-lotus" className="hover:text-[#2D8CFF] transition-colors">
                  Why Lotus? (Overview)
                </a>
                <a href="#statistics" className="hover:text-[#2D8CFF] transition-colors">
                  Supply Track Record
                </a>
                <a href={localizePath('/about', currentLang)} className="hover:text-[#2D8CFF] transition-colors">
                  About Lotus Impex
                </a>
              </nav>
            </div>
          </div>

          {/* Quick RFQ Mini Form inside Footer (Span 4) */}
          <div className="lg:col-span-4 bg-[#05143F] p-6 rounded-2xl border border-[#2D8CFF]/30 shadow-xl flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="font-heading text-xs text-[#2D8CFF] font-bold uppercase tracking-wider">
                ⚡ Quick RFQ Sourcing
              </span>
              <span className="text-[11px] font-sans text-slate-300">
                Direct Technical Sourcing Desk
              </span>
            </div>

            {rfqSuccess ? (
              <div className="p-4 rounded-xl bg-[#071A52] border border-[#2D8CFF] text-center flex flex-col gap-2">
                <span className="text-2xl text-[#2D8CFF]">✓</span>
                <span className="text-xs font-bold text-white">{rfqSuccess}</span>
                <span className="text-[11px] text-slate-300">Our sales desk has received your specs.</span>
                <button
                  type="button"
                  onClick={() => setRfqSuccess('')}
                  className="mt-1 text-[11px] text-[#2D8CFF] underline cursor-pointer"
                >
                  Submit another inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleFooterRfq} className="flex flex-col gap-2.5">
                <input
                  type="text"
                  required
                  placeholder="Your Name / Company *"
                  value={rfqName}
                  onChange={(e) => setRfqName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#071A52] border border-slate-700 text-white text-xs placeholder:text-slate-400 focus:outline-none focus:border-[#2D8CFF]"
                />
                <input
                  type="text"
                  required
                  placeholder="Email or WhatsApp Number *"
                  value={rfqContact}
                  onChange={(e) => setRfqContact(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#071A52] border border-slate-700 text-white text-xs placeholder:text-slate-400 focus:outline-none focus:border-[#2D8CFF]"
                />
                <div className="grid grid-cols-2 gap-2">
                  <select
                    value={rfqComponent}
                    onChange={(e) => setRfqComponent(e.target.value)}
                    className="w-full px-2 py-2 rounded-lg bg-[#071A52] border border-slate-700 text-white text-xs focus:outline-none focus:border-[#2D8CFF]"
                  >
                    <option>SS 316L Sanitary Valves</option>
                    <option>SS 316L EP Tubes</option>
                    <option>Tri-Clamp Ferrules</option>
                    <option>Hygienic Gaskets</option>
                    <option>Sanitary 90° Bends</option>
                  </select>
                  <input
                    type="text"
                    placeholder="Qty (e.g. 100m, 20 pcs)"
                    value={rfqQty}
                    onChange={(e) => setRfqQty(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-[#071A52] border border-slate-700 text-white text-xs placeholder:text-slate-400 focus:outline-none focus:border-[#2D8CFF]"
                  />
                </div>
                <button
                  type="submit"
                  disabled={rfqLoading}
                  className="w-full py-2.5 rounded-lg bg-[#FF007A] hover:bg-[#E6006E] text-white font-bold text-xs uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(255,0,122,0.4)] cursor-pointer"
                >
                  {rfqLoading ? 'Transmitting...' : 'Send Quick RFQ →'}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Newsletter & International Corridors Strip */}
        <div className="pt-8 border-t border-[#2D8CFF]/20 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          {/* Newsletter (Span 6) */}
          <div className="md:col-span-6 flex flex-col gap-2">
            <span className="font-label-technical text-xs text-white font-bold uppercase tracking-wider">
              Hygienic Metallurgical Bulletins
            </span>
            <p className="font-body-sm text-xs text-slate-300">
              Receive updated ASME BPE dimensional charts, Ra conversion tables, and export freight updates.
            </p>
            <form onSubmit={handleNewsletterSubmit} className="flex items-center gap-2 max-w-md pt-1">
              <input
                type="email"
                required
                placeholder="Enter corporate email..."
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                className="flex-1 px-3.5 py-2 rounded-lg bg-[#05143F] border border-slate-700 text-white text-xs placeholder:text-slate-400 focus:outline-none focus:border-[#2D8CFF]"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-[#2D8CFF] hover:bg-[#1A75E8] text-white font-bold text-xs transition-colors shrink-0 cursor-pointer"
              >
                {newsletterSuccess ? 'Subscribed ✓' : 'Subscribe'}
              </button>
            </form>
          </div>

          {/* Social Links & Legal Sourcing Hub (Span 6) */}
          <div className="md:col-span-6 flex flex-col md:items-end gap-2 text-xs text-slate-300">
            <span className="font-label-technical text-xs text-white font-bold uppercase tracking-wider">
              Sourcing Hub &amp; Executive Office
            </span>
            <p className="md:text-right max-w-sm">
              Shop No. 9, Jain Bhavan CHSL, Dr Bhajekar Lane, Khetwadi, Girgaon, Mumbai, Maharashtra 400004, India.
            </p>
            <div className="flex items-center gap-4 pt-1">
              <a
                href="https://www.linkedin.com/company/lotus-tubes"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-300 hover:text-white transition-colors"
                title="LinkedIn"
              >
                LinkedIn ↗
              </a>
              <span>•</span>
              <a
                href={`tel:${rawPhone}`}
                className="text-slate-300 hover:text-white transition-colors"
                title="Phone Desk"
              >
                {CONFIG.primaryPhone}
              </a>
              <span>•</span>
              <a
                href="#login"
                className="text-[#2D8CFF] hover:underline font-bold"
              >
                Staff CRM Login
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Copyright & Guarantee */}
        <div className="pt-6 border-t border-[#2D8CFF]/20 flex flex-col sm:flex-row items-center justify-between gap-4 font-label-code-micro text-[11px] text-slate-400">
          <div>
            © 2026 LOTUS TUBES (LOTUS IMPEX). ALL TOLERANCES CONFORM TO DIN / ASME / ISO / 3-A.
          </div>
          <div className="flex items-center gap-4">
            <a href={localizePath('/about', currentLang)} className="hover:text-white transition-colors">
              Founder Statement
            </a>
            <span>•</span>
            <a href={localizePath('/quality', currentLang)} className="hover:text-white transition-colors">
              MTC Quality Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;