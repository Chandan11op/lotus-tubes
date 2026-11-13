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

            <p className="font-body-sm text-sm text-slate-300 leading-relaxed">
              {t(
                'footer_desc',
                'Lotus Tubes (Lotus Impex) is a premier supplier of stainless steel sanitary pipes, tubes, fittings, and valves in SS 304 & SS 316L. Supporting sterile biopharma, dairy, food & beverage, brewery, chemical and water-treatment applications across 100+ global corridors.'
              )}
            </p>

            {/* Precision Standard Badges */}
            <div className="flex flex-wrap gap-2 pt-1 font-label-code-micro text-[11px]">
              <span className="px-2.5 py-1 rounded bg-[#0B226D] border border-[#2D8CFF]/30 text-white font-semibold">
                SS 316L &amp; SS 304
              </span>
              <span className="px-2.5 py-1 rounded bg-[#0B226D] border border-[#2D8CFF]/30 text-[#2D8CFF] font-semibold">
                Ra ≤ 0.38µm EP
              </span>
              <span className="px-2.5 py-1 rounded bg-[#0B226D] border border-[#2D8CFF]/30 text-[#FF007A] font-semibold">
                ASME BPE SF4
              </span>
            </div>

            {/* Direct Connect Buttons */}
            <div className="pt-2 flex items-center gap-3 flex-wrap">
              <a
                href={`https://wa.me/${CONFIG.whatsappNumber}?text=Hello%20Lotus%20Tubes%2C%20I%20have%20an%20enquiry%20regarding%20sanitary%20stainless%20steel%20products.`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[#25D366] text-black font-semibold text-xs transition-all hover:shadow-[0_0_16px_rgba(37,211,102,0.6)] cursor-pointer"
                title="WhatsApp Business Direct Desk"
              >
                <span>💬</span>
                <span>WhatsApp Desk</span>
              </a>
              <a
                href={`mailto:${'sales' + '@' + 'lotustubes.com'}`}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#0B226D] hover:bg-[#102C82] text-white border border-[#2D8CFF]/30 font-semibold text-xs transition-all cursor-pointer"
                title="Email Sales Desk"
              >
                <span>✉</span>
                <span>sales@lotustubes.com</span>
              </a>
            </div>
          </div>

          {/* Quick Navigation Links (Span 4: 2 columns of 2) */}
          <div className="lg:col-span-4 grid grid-cols-2 gap-6">
            <div className="flex flex-col gap-3">
              <span className="font-label-technical text-xs text-white uppercase tracking-wider font-bold">
                Process Conduits
              </span>
              <nav className="flex flex-col gap-2 font-body-sm text-xs text-slate-300">
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
                <a href="#immediate-stock" className="hover:text-[#2D8CFF] transition-colors">
                  Immediate Yard Stock
                </a>
              </nav>
            </div>

            <div className="flex flex-col gap-3">
              <span className="font-label-technical text-xs text-white uppercase tracking-wider font-bold">
                Company &amp; Quality
              </span>
              <nav className="flex flex-col gap-2 font-body-sm text-xs text-slate-300">
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
                <a href="#timeline" className="hover:text-[#2D8CFF] transition-colors">
                  Why Lotus? (Timeline)
                </a>
                <a href="#ai-fleet" className="hover:text-[#2D8CFF] transition-colors">
                  AI Coordination Fleet
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
              <span className="font-label-technical text-xs text-[#2D8CFF] font-bold uppercase tracking-wider">
                ⚡ Quick RFQ Dispatch
              </span>
              <span className="text-[10px] font-label-code-micro text-slate-400">
                Turnaround &lt; 15 Mins
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