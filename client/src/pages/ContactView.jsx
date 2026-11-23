import React, { useState } from 'react';
import { CONFIG } from '../data/siteData';
import { apiService } from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import { Loader } from '../components/common/Loader';
import PageHero from '../components/common/PageHero';

export const ContactView = ({ onNotify }) => {
  const { t, currentLang, localizePath } = useLanguage();
  const rawPhone = (CONFIG.primaryPhone || '+91 9867304316').replace(/\s+/g, '');
  const waNumber = (CONFIG.whatsapp || CONFIG.whatsappNumber || '919867304316').replace(/\D/g, '');

  // 1. Owner Profile (First Landscape Card)
  const owner = {
    id: 'owner',
    name: 'Chirag Shah',
    department: 'Owner',
    role: 'Owner & Managing Director',
    photo: '/assets/images/team/Owner.png',
    email: 'sales@lotustubes.com',
    phone: CONFIG.primaryPhone || '+91 9867304316',
    summary: 'Continuing more than 35 years of authentic family business lineage in Girgaon, Mumbai (Est. 1989), Chirag Shah leads Lotus Tubes with uncompromising commitment to metallurgical precision, customer trust, and verified EN 10204 3.1 certification. Personally oversees strategic mill drawing partnerships, large-scale pharmaceutical supply contracts, and executive client relationships across India and worldwide.',
    whatTheyDo: 'Executive direction, strategic mill supply partnerships, enterprise contract execution, and client relationship excellence.',
    directPhone: `tel:${rawPhone}`,
    directWa: `https://wa.me/${waNumber}?text=${encodeURIComponent('Hello Chirag Sir, I would like to consult on high-purity sanitary stainless steel products.')}`,
    directEmail: 'mailto:sales@lotustubes.com?subject=Direct%20Consultation%20for%20Chirag%20Shah%20-%20Lotus%20Tubes'
  };

  // 2. Line 1 Agents (Sales & Purchase)
  const agentRow1 = [
    {
      id: 'anjali-pandey',
      name: 'Anjali Pandey',
      department: 'Sales',
      departmentBadge: 'SALES DESK',
      role: 'Sales & Technical Quotations Lead',
      email: 'anjalipandey@lotustubes.com',
      photo: '/assets/images/team/anjali-pandey.png',
      whatTheyDo: 'Handles client RFQs, provides instant price quotations for SS 304 & SS 316L sanitary tubes, valves, and fittings, and assists customers with technical sizing and ASTM/DIN/BPE standard compliance.',
      directAction: `https://wa.me/${waNumber}?text=${encodeURIComponent('Hello Anjali, I would like to request an official quotation.')}`,
      actionLabel: 'WhatsApp RFQ',
      emailAction: 'mailto:anjalipandey@lotustubes.com?subject=Quotation%20Request%20-%20Lotus%20Tubes'
    },
    {
      id: 'riya-shah',
      name: 'Riya Shah',
      department: 'Purchase',
      departmentBadge: 'PURCHASE DESK',
      role: 'Purchase & Material Procurement Specialist',
      email: 'sales@lotustubes.com',
      photo: '/assets/images/team/riya-shah.png',
      whatTheyDo: 'Manages raw material sourcing, mill partner relations, stock replenishment, and vendor verification for premium raw stainless steel alloys and certified forgings.',
      directAction: 'mailto:sales@lotustubes.com?subject=Purchase%20%26%20Raw%20Material%20Inquiry',
      actionLabel: 'Email Desk',
      waAction: `https://wa.me/${waNumber}?text=${encodeURIComponent('Hello Riya, I have an inquiry regarding raw material procurement.')}`
    }
  ];

  // 3. Line 2 Agents (R&D & QC)
  const agentRow2 = [
    {
      id: 'neha-desai',
      name: 'Neha Desai',
      department: 'R&D',
      departmentBadge: 'R&D DESK',
      role: 'Research & Development (R&D) Lead',
      email: 'sales@lotustubes.com',
      photo: '/assets/images/team/neha-desai.png',
      whatTheyDo: 'Focuses on high-purity hygienic design, surface roughness optimization (Ra ≤ 0.25 µm), CIP/SIP cleanability analysis, and bespoke customer CAD/fabrication development.',
      directAction: 'mailto:sales@lotustubes.com?subject=R%26D%20Technical%20Consultation',
      actionLabel: 'R&D Consult',
      waAction: `https://wa.me/${waNumber}?text=${encodeURIComponent('Hello Neha, I would like to consult on R&D hygienic design.')}`
    },
    {
      id: 'arjun-yadav',
      name: 'Arjun Yadav',
      department: 'QC',
      departmentBadge: 'QC DESK',
      role: 'Quality Control & Metallurgy (QC) Inspector',
      email: 'sales@lotustubes.com',
      photo: '/assets/images/team/arjun-yadav.png',
      whatTheyDo: 'Oversees 100% material inspection, PMI spectroscopic testing, boroscopic weld inspection, pressure testing, and EN 10204 3.1 Mill Test Certificate (MTC) verification.',
      directAction: `https://wa.me/${waNumber}?text=${encodeURIComponent('Hello Arjun, I have a query regarding Mill Test Certificates & QC reports.')}`,
      actionLabel: 'QC Verification',
      emailAction: 'mailto:sales@lotustubes.com?subject=QC%20%26%20MTC%20Inspection%20Query'
    }
  ];

  // Interactive Hover/Click state for Line 1 and Line 2
  const [activeRow1Agent, setActiveRow1Agent] = useState(null);
  const [activeRow2Agent, setActiveRow2Agent] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'Quotation Request',
    message: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Full name is required';
    if (!formData.email.trim() || !/^\S+@\S+\.\S+$/.test(formData.email)) {
      errs.email = 'Valid business email is required';
    }
    if (!formData.phone.trim() || formData.phone.length < 7) {
      errs.phone = 'Valid phone number is required';
    }
    if (!formData.message.trim() || formData.message.length < 5) {
      errs.message = 'Please provide your requirements (minimum 5 characters)';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoading) return;
    if (!validate()) return;

    setIsLoading(true);

    try {
      const res = await apiService.submitContact({ ...formData, language: currentLang });
      if (res?.success !== false) {
        setIsSubmitted(true);
        if (onNotify) {
          onNotify('Your message has been sent successfully. Our team will contact you shortly.', 'success');
        }
      } else {
        throw new Error(res?.message || 'Server did not acknowledge message.');
      }
    } catch (err) {
      console.error('Contact submission error:', err);
      if (onNotify) {
        onNotify('Could not submit message to server. Please contact our desk directly via WhatsApp (+91 9867304316) or email sales@lotustubes.com.', 'danger');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    const fieldName = id.replace('contact-', '');
    setFormData((prev) => ({ ...prev, [fieldName]: value }));
    if (errors[fieldName]) {
      setErrors((prev) => ({ ...prev, [fieldName]: null }));
    }
  };

  return (
    <div>
      <PageHero
        image="/assets/images/hero/hero-contact-calling-team-office.jpg"
        badge="Mumbai Sales & Sourcing Desk"
        title="Connect with Lotus Tubes Specialists"
        subtitle="Rapid RFQ Turnaround & Technical Sourcing Assistance"
        description="Reach our central Mumbai sourcing office for ready stock status, custom fabrication drawings, test certificates, and global export inquiries."
        stats={[
          { value: 'Prompt RFQ', label: 'Quotation Support' },
          { value: 'Mumbai', label: 'Central Warehouse' },
          { value: 'WhatsApp', label: 'Instant Desk Support' },
          { value: 'Pan-India', label: 'Ready Stock Dispatch' }
        ]}
        actions={[
          <a
            key="whatsapp"
            href={`https://wa.me/${CONFIG.whatsappNumber}?text=Hello%20Lotus%20Tubes%2C%20I%20would%20like%20to%20enquire%20about%20sanitary%20stainless%20steel%20products.`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn--whatsapp inline-flex items-center gap-2"
          >
            <svg className="w-4 h-4 fill-white shrink-0" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12.031 2C6.496 2 2 6.494 2 12.029c0 1.947.556 3.766 1.521 5.309L2.001 22.5l5.35-1.488a9.97 9.97 0 0 0 4.68 1.168h.005c5.532 0 10.029-4.494 10.029-10.029C22.065 6.494 17.568 2 12.031 2zm5.836 14.199c-.244.688-1.42 1.314-1.956 1.398-.518.082-1.189.117-3.415-.805-2.85-1.18-4.686-4.08-4.83-4.269-.143-.19-1.144-1.522-1.144-2.903 0-1.381.724-2.062.981-2.343.257-.282.56-.352.748-.352.187 0 .374.002.538.01.174.009.408-.066.638.486.235.565.803 1.957.874 2.1.07.143.118.31.024.497-.094.19-.142.308-.282.473-.141.166-.296.37-.424.497-.141.141-.288.295-.124.577.164.281.729 1.203 1.564 1.947 1.074.957 1.979 1.253 2.261 1.393.282.14.448.117.613-.07.165-.188.704-.822.892-1.104.188-.282.376-.235.634-.141.258.094 1.64.773 1.922.914.282.141.47.211.539.329.07.117.07.68-.174 1.368z"/>
            </svg>
            <span>WhatsApp Priority Desk</span>
          </a>,
          <a
            key="call"
            href={`tel:${(CONFIG.primaryPhone || '+91 9867304316').replace(/\s+/g, '')}`}
            className="btn btn--outline inline-flex items-center gap-2"
          >
            <svg className="w-4 h-4 text-[#2D8CFF] shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            <span>Direct Phone: {CONFIG.primaryPhone || '+91 9867304316'}</span>
          </a>
        ]}
      />

      <div className="site-container section">
        <div className="about-preview-grid">
          {/* Contact Info */}
          <div>
            <span className="section-eyebrow">Direct Touchpoints</span>
            <h2 className="section-title">Reach Our Supply Desk</h2>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginTop: '14px' }}>
              Whether you require 10 meters of specialized electro-polished tubing or full container-load shipments of sanitary valves and fittings, our team provides quick quotations and technical clarity.
            </p>

            <div className="flex flex-col gap-4 mt-6">
              {/* Address Card */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/90 shadow-sm flex items-start gap-3.5">
                <div className="p-2.5 rounded-lg bg-white border border-slate-200 text-[#071A52] shrink-0">
                  <svg className="w-5 h-5 text-[#2D8CFF]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold font-mono uppercase tracking-wider text-slate-500">Registered Office &amp; Sourcing Hub</span>
                  <span className="text-sm font-semibold text-[#071A52] mt-0.5 leading-relaxed">{CONFIG.officeAddress}</span>
                </div>
              </div>

              {/* Phone Card */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/90 shadow-sm flex items-start gap-3.5">
                <div className="p-2.5 rounded-lg bg-white border border-slate-200 text-[#071A52] shrink-0">
                  <svg className="w-5 h-5 text-[#2D8CFF]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold font-mono uppercase tracking-wider text-slate-500">Direct Phone Desk</span>
                  <a
                    href={`tel:${(CONFIG.primaryPhone || '+91 9867304316').replace(/\s+/g, '')}`}
                    className="text-base font-bold text-[#071A52] hover:text-[#2D8CFF] transition-colors mt-0.5"
                  >
                    {CONFIG.primaryPhone}
                  </a>
                  <span className="text-xs text-slate-500 mt-0.5">Mon – Sat: 9:30 AM – 7:00 PM IST</span>
                </div>
              </div>

              {/* Email Card */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/90 shadow-sm flex items-start gap-3.5">
                <div className="p-2.5 rounded-lg bg-white border border-slate-200 text-[#071A52] shrink-0">
                  <svg className="w-5 h-5 text-[#2D8CFF]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold font-mono uppercase tracking-wider text-slate-500">Sales &amp; Quotation Email</span>
                  <a
                    href={`mailto:${CONFIG.primaryEmail || 'sales@lotustubes.com'}`}
                    className="text-base font-bold text-[#071A52] hover:text-[#2D8CFF] transition-colors mt-0.5"
                  >
                    {CONFIG.primaryEmail}
                  </a>
                  <span className="text-xs text-slate-500 mt-0.5">Prompt technical review of bill of quantities</span>
                </div>
              </div>

              {/* Tax Identifiers Card */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/90 shadow-sm flex items-start gap-3.5">
                <div className="p-2.5 rounded-lg bg-white border border-slate-200 text-[#071A52] shrink-0">
                  <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold font-mono uppercase tracking-wider text-slate-500">Verified Business Registrations</span>
                  <span className="text-sm font-semibold text-[#071A52] mt-0.5">
                    GSTIN: <strong>{CONFIG.gstin}</strong> &bull; IEC: <strong>{CONFIG.iec}</strong>
                  </span>
                </div>
              </div>

              {/* Modern WhatsApp Desk CTA */}
              <div className="pt-2">
                <a
                  href={`https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent('Hello Lotus Tubes, I am contacting you from your website contact page regarding stainless steel sanitary pipes and fittings.')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-3 px-6 py-3.5 rounded-xl text-sm font-bold text-white bg-[#25D366] hover:bg-[#1EBE5D] transition-all shadow-md hover:shadow-lg cursor-pointer"
                >
                  <svg className="w-5 h-5 fill-white shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12.031 2C6.496 2 2 6.494 2 12.029c0 1.947.556 3.766 1.521 5.309L2.001 22.5l5.35-1.488a9.97 9.97 0 0 0 4.68 1.168h.005c5.532 0 10.029-4.494 10.029-10.029C22.065 6.494 17.568 2 12.031 2zm5.836 14.199c-.244.688-1.42 1.314-1.956 1.398-.518.082-1.189.117-3.415-.805-2.85-1.18-4.686-4.08-4.83-4.269-.143-.19-1.144-1.522-1.144-2.903 0-1.381.724-2.062.981-2.343.257-.282.56-.352.748-.352.187 0 .374.002.538.01.174.009.408-.066.638.486.235.565.803 1.957.874 2.1.07.143.118.31.024.497-.094.19-.142.308-.282.473-.141.166-.296.37-.424.497-.141.141-.288.295-.124.577.164.281.729 1.203 1.564 1.947 1.074.957 1.979 1.253 2.261 1.393.282.14.448.117.613-.07.165-.188.704-.822.892-1.104.188-.282.376-.235.634-.141.258.094 1.64.773 1.922.914.282.141.47.211.539.329.07.117.07.68-.174 1.368z"/>
                  </svg>
                  <span>Connect with WhatsApp Desk Specialist</span>
                </a>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="form-card" style={{ position: 'relative' }}>
            <h3 style={{ fontFamily: 'var(--font-heading)', color: 'var(--deep-navy)', marginBottom: '16px' }}>
              Send Us a Message
            </h3>

            {isSubmitted ? (
              <div className="form-success-box" style={{ display: 'block', padding: '24px' }}>
                <div className="success-icon">✓</div>
                <h4>Thank You for Contacting Us!</h4>
                <p>
                  Your message has been safely received by our sales and technical team. We will review your requirements and respond promptly.
                </p>
                <button
                  type="button"
                  className="btn btn--secondary mt-3"
                  onClick={() => {
                    setIsSubmitted(false);
                    setFormData({
                      name: '',
                      email: '',
                      phone: '',
                      subject: 'Quotation Request',
                      message: ''
                    });
                  }}
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form id="public-contact-form" onSubmit={handleSubmit} noValidate>
                <div className="form-group">
                  <label htmlFor="contact-name">
                    Full Name <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    id="contact-name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Your full name"
                  />
                  {errors.name && <span className="field-error" style={{ color: '#EF4444', fontSize: '12px' }}>{errors.name}</span>}
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="contact-email">
                      Email Address <span className="required">*</span>
                    </label>
                    <input
                      type="email"
                      id="contact-email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="name@company.com"
                    />
                    {errors.email && <span className="field-error" style={{ color: '#EF4444', fontSize: '12px' }}>{errors.email}</span>}
                  </div>
                  <div className="form-group">
                    <label htmlFor="contact-phone">
                      Phone Number <span className="required">*</span>
                    </label>
                    <input
                      type="tel"
                      id="contact-phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      placeholder="+91 99999 99999"
                    />
                    {errors.phone && <span className="field-error" style={{ color: '#EF4444', fontSize: '12px' }}>{errors.phone}</span>}
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="contact-subject">Inquiry Subject</label>
                  <select
                    id="contact-subject"
                    value={formData.subject}
                    onChange={handleChange}
                  >
                    <option value="Quotation Request">Product Quotation Request</option>
                    <option value="Technical Documentation">Technical Specification / MTC Query</option>
                    <option value="Export Inquiry">Export Sourcing Inquiry</option>
                    <option value="Vendor Registration">Vendor Registration / Supply Partner</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="contact-message">
                    Requirements & Quantities <span className="required">*</span>
                  </label>
                  <textarea
                    id="contact-message"
                    rows={4}
                    value={formData.message}
                    onChange={handleChange}
                    required
                    placeholder="Specify sizes, quantities, delivery destination..."
                  ></textarea>
                  {errors.message && <span className="field-error" style={{ color: '#EF4444', fontSize: '12px' }}>{errors.message}</span>}
                </div>

                <button
                  type="submit"
                  className="btn btn--primary btn--block btn--lg"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader variant="button" size="sm" color="#FFFFFF" label="Sending message..." />
                  ) : (
                    <span>Send Message &rarr;</span>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* ========================================================
          OUR TEAM & TECHNICAL SPECIALISTS SECTION
          (Exclusively on Contact Page as per Specification)
          ======================================================== */}
      <section className="w-full py-16 sm:py-20 bg-slate-50 border-t border-slate-200" id="team-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Heading */}
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
            <div className="inline-block px-3.5 py-1 rounded-full bg-pink-100 text-[#E93984] text-xs font-bold uppercase tracking-wider mb-3">
              Executive Leadership &amp; Operational Team
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-[#0C225E] tracking-tight">
              Connect Directly with Our Department Specialists
            </h2>
            <p className="mt-3 text-slate-600 text-xs sm:text-sm leading-relaxed">
              Direct access to our dedicated team across Owner Management, Sales, Purchase, R&amp;D, and Quality Control.
            </p>
          </div>

          {/* ========================================================
              CARD 1: OWNER LANDSCAPE CARD (DISPLAYED FIRST)
              ======================================================== */}
          <div className="mb-14">
            <div className="bg-gradient-to-br from-[#071A52] via-[#0C225E] to-[#142A68] text-white rounded-3xl p-6 sm:p-8 lg:p-10 shadow-2xl border border-slate-700/60 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-96 h-96 bg-[#E93984]/10 rounded-full blur-3xl pointer-events-none" />
              
              <div className="flex flex-col lg:flex-row items-center lg:items-stretch gap-8 relative z-10">
                {/* Owner Photo Stage */}
                <div className="w-full sm:w-64 lg:w-72 shrink-0 flex flex-col items-center">
                  <div className="relative w-52 sm:w-60 lg:w-full aspect-[4/5] rounded-2xl overflow-hidden border-2 border-[#E93984]/60 shadow-2xl bg-slate-900 group-hover:border-[#E93984] transition-all duration-300">
                    <img
                      src={owner.photo}
                      alt={`${owner.name} - ${owner.role}`}
                      className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                      width="288"
                      height="360"
                      loading="lazy"
                    />
                    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent p-3 text-center">
                      <span className="inline-block px-3.5 py-1 rounded-full bg-[#E93984] text-white text-[11px] font-bold uppercase tracking-wider shadow-sm">
                        OWNER
                      </span>
                    </div>
                  </div>
                </div>

                {/* Owner Details & Direct Touchpoints */}
                <div className="flex-1 flex flex-col justify-between text-left">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className="px-3 py-1 rounded-full bg-pink-500/20 text-pink-300 border border-pink-400/30 text-[11px] font-mono font-bold uppercase tracking-wider">
                        Chief Executive Direction
                      </span>
                      <span className="px-3 py-1 rounded-full bg-white/10 text-slate-200 text-[11px] font-mono">
                        Family Enterprise Est. 1989
                      </span>
                      <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[11px] font-bold">
                        ● Available
                      </span>
                    </div>

                    <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
                      {owner.name}
                    </h3>
                    <div className="text-sm sm:text-base font-semibold text-pink-400 mt-1 mb-4">
                      {owner.role} • Lotus Tubes (Girgaon, Mumbai)
                    </div>

                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-3xl mb-6">
                      {owner.summary}
                    </p>

                    {/* Operational Coordinates */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                      <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs">
                        <span className="text-slate-400 block font-mono text-[10px] uppercase">Central Stocking Hub</span>
                        <strong className="text-white">Girgaon, Mumbai • 24-48h Pan-India &amp; Global Dispatch</strong>
                      </div>
                      <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs">
                        <span className="text-slate-400 block font-mono text-[10px] uppercase">Quality Assurance Oversight</span>
                        <strong className="text-white">100% EN 10204 3.1 MTC Traceability &amp; Sizing</strong>
                      </div>
                    </div>
                  </div>

                  {/* Direct Action Touchpoints */}
                  <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-white/10">
                    <a
                      href={owner.directPhone}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-[#0C225E] hover:bg-slate-100 font-bold text-xs transition-all shadow-md"
                    >
                      <span>📞 Direct Phone: {owner.phone}</span>
                    </a>
                    <a
                      href={owner.directWa}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold text-xs transition-all shadow-md"
                    >
                      <span>🟢 WhatsApp Direct Desk</span>
                    </a>
                    <a
                      href={owner.directEmail}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 transition-all"
                    >
                      <span>✉️ Email: {owner.email}</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ========================================================
              CARDS 2-5: 4 AGENTS IN 2 LINES (2x2 GRID)
              Interactive Hover & Click Landscape Expansion (Seedhe Growth Style)
              ======================================================== */}
          <div className="space-y-8">
            
            {/* ---------------------------------------------------- */}
            {/* LINE 1: SALES & PURCHASE (Anjali Pandey & Riya Shah) */}
            {/* ---------------------------------------------------- */}
            <div
              className="relative transition-all duration-300"
              onMouseLeave={() => setActiveRow1Agent(null)}
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#0C225E] flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#E93984]" />
                  Line 1 • Sales &amp; Procurement Departments
                </span>
                <span className="text-[11px] text-slate-400">Hover or click to expand agent profile</span>
              </div>

              {!activeRow1Agent ? (
                /* Default 2-in-a-line view */
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {agentRow1.map((agent) => (
                    <div
                      key={agent.id}
                      onClick={() => setActiveRow1Agent(agent.id)}
                      onMouseEnter={() => setActiveRow1Agent(agent.id)}
                      className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm hover:shadow-xl hover:border-[#E93984] transition-all duration-300 cursor-pointer group flex flex-col justify-between text-center"
                    >
                      <div>
                        <div className="relative w-36 h-36 rounded-2xl overflow-hidden mx-auto mb-4 border-2 border-slate-200 group-hover:border-[#E93984] group-hover:scale-105 transition-all shadow-md bg-slate-50">
                          <img
                            src={agent.photo}
                            alt={agent.name}
                            className="w-full h-full object-cover object-top"
                            loading="lazy"
                            width="144"
                            height="144"
                          />
                        </div>
                        <span className="inline-block px-3 py-0.5 rounded-full bg-[#0C225E] text-white text-[10px] font-bold uppercase tracking-wider mb-2">
                          {agent.departmentBadge}
                        </span>
                        <h4 className="text-lg font-bold text-slate-900 group-hover:text-[#E93984] transition-colors">
                          {agent.name}
                        </h4>
                        <div className="text-xs text-slate-500 font-medium mb-3">
                          {agent.role}
                        </div>
                        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                          {agent.whatTheyDo}
                        </p>
                      </div>
                      <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-center gap-1.5 text-xs font-bold text-[#E93984]">
                        <span>View Details &amp; Touchpoints</span>
                        <span>&rarr;</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                /* Expanded Landscape View with other member below */
                (() => {
                  const activeAgent = agentRow1.find((a) => a.id === activeRow1Agent) || agentRow1[0];
                  const otherAgent = agentRow1.find((a) => a.id !== activeRow1Agent) || agentRow1[1];
                  return (
                    <div>
                      {/* Active Agent Expanded Landscape Card */}
                      <div className="bg-white rounded-3xl border-2 border-[#E93984] p-6 sm:p-8 shadow-2xl transition-all duration-500 ease-out">
                        <div className="flex flex-col sm:flex-row items-center sm:items-stretch gap-6 sm:gap-8">
                          {/* Agent Photo */}
                          <div className="w-44 sm:w-52 h-52 sm:h-60 rounded-2xl overflow-hidden border-2 border-[#E93984] shadow-lg shrink-0 bg-slate-50">
                            <img
                              src={activeAgent.photo}
                              alt={activeAgent.name}
                              className="w-full h-full object-cover object-top"
                              width="208"
                              height="240"
                            />
                          </div>

                          {/* Agent Expanded Details */}
                          <div className="flex-1 flex flex-col justify-between text-left">
                            <div>
                              <div className="flex items-center justify-between gap-3 mb-2">
                                <span className="inline-block px-3 py-1 rounded-full bg-pink-50 text-[#E93984] border border-pink-200 text-xs font-bold uppercase tracking-wider">
                                  {activeAgent.departmentBadge}
                                </span>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setActiveRow1Agent(null);
                                  }}
                                  className="text-xs text-slate-400 hover:text-slate-700 font-medium px-2 py-1 rounded hover:bg-slate-100 transition-colors"
                                  title="Collapse details"
                                >
                                  ✕ Close View
                                </button>
                              </div>

                              <h4 className="text-2xl sm:text-3xl font-black text-[#0C225E] tracking-tight">
                                {activeAgent.name}
                              </h4>
                              <div className="text-sm font-semibold text-slate-600 mb-2">
                                {activeAgent.role}
                              </div>

                              <div className="mb-3">
                                <a
                                  href={`mailto:${activeAgent.email}`}
                                  className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-sky-700 bg-sky-50 hover:bg-sky-100 px-3 py-1 rounded-lg border border-sky-200 transition-colors"
                                >
                                  <span>✉️ {activeAgent.email}</span>
                                </a>
                              </div>

                              <div className="text-xs sm:text-sm text-slate-700 bg-slate-50 p-4 rounded-2xl border border-slate-200/80 leading-relaxed mb-4">
                                <span className="font-bold text-slate-900 block mb-1">Department Focus &amp; Responsibilities:</span>
                                {activeAgent.whatTheyDo}
                              </div>
                            </div>

                            {/* Direct Actions */}
                            <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-slate-100">
                              <a
                                href={activeAgent.directAction}
                                target={activeAgent.directAction.startsWith('http') ? '_blank' : '_self'}
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#E93984] hover:bg-[#D81B60] text-white font-bold text-xs shadow-md transition-all cursor-pointer"
                              >
                                <span>{activeAgent.actionLabel}</span>
                                <span>&rarr;</span>
                              </a>
                              {activeAgent.emailAction && (
                                <a
                                  href={activeAgent.emailAction}
                                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-all"
                                >
                                  <span>✉️ Direct Email</span>
                                </a>
                              )}
                              {activeAgent.waAction && (
                                <a
                                  href={activeAgent.waAction}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold text-xs transition-all"
                                >
                                  <span>🟢 WhatsApp Desk</span>
                                </a>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Sibling Member moved below */}
                      <div
                        onClick={() => setActiveRow1Agent(otherAgent.id)}
                        onMouseEnter={() => setActiveRow1Agent(otherAgent.id)}
                        className="mt-4 w-full bg-white hover:bg-pink-50/50 rounded-2xl border border-slate-200 hover:border-[#E93984] p-4 flex items-center justify-between cursor-pointer transition-all shadow-sm group"
                      >
                        <div className="flex items-center gap-4">
                          <img
                            src={otherAgent.photo}
                            alt={otherAgent.name}
                            className="w-12 h-12 rounded-xl object-cover object-top border border-slate-200 group-hover:border-[#E93984]"
                            width="48"
                            height="48"
                          />
                          <div className="text-left">
                            <span className="text-[10px] font-bold text-[#0C225E] uppercase tracking-wider block">
                              {otherAgent.departmentBadge}
                            </span>
                            <strong className="text-sm text-slate-900 group-hover:text-[#E93984] transition-colors">
                              {otherAgent.name}
                            </strong>
                            <span className="text-xs text-slate-500 ml-2">({otherAgent.role})</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-xs font-bold text-[#E93984]">
                          <span>Switch to {otherAgent.name}</span>
                          <span>&rarr;</span>
                        </div>
                      </div>
                    </div>
                  );
                })()
              )}
            </div>

            {/* ---------------------------------------------------- */}
            {/* LINE 2: R&D & QC (Neha Desai & Arjun Yadav)         */}
            {/* ---------------------------------------------------- */}
            <div
              className="relative transition-all duration-300 pt-4"
              onMouseLeave={() => setActiveRow2Agent(null)}
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#0C225E] flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#2D8CFF]" />
                  Line 2 • R&amp;D &amp; Quality Control Metallurgy Departments
                </span>
                <span className="text-[11px] text-slate-400">Hover or click to expand agent profile</span>
              </div>

              {!activeRow2Agent ? (
                /* Default 2-in-a-line view */
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {agentRow2.map((agent) => (
                    <div
                      key={agent.id}
                      onClick={() => setActiveRow2Agent(agent.id)}
                      onMouseEnter={() => setActiveRow2Agent(agent.id)}
                      className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm hover:shadow-xl hover:border-[#2D8CFF] transition-all duration-300 cursor-pointer group flex flex-col justify-between text-center"
                    >
                      <div>
                        <div className="relative w-36 h-36 rounded-2xl overflow-hidden mx-auto mb-4 border-2 border-slate-200 group-hover:border-[#2D8CFF] group-hover:scale-105 transition-all shadow-md bg-slate-50">
                          <img
                            src={agent.photo}
                            alt={agent.name}
                            className="w-full h-full object-cover object-top"
                            loading="lazy"
                            width="144"
                            height="144"
                          />
                        </div>
                        <span className="inline-block px-3 py-0.5 rounded-full bg-[#0C225E] text-white text-[10px] font-bold uppercase tracking-wider mb-2">
                          {agent.departmentBadge}
                        </span>
                        <h4 className="text-lg font-bold text-slate-900 group-hover:text-[#2D8CFF] transition-colors">
                          {agent.name}
                        </h4>
                        <div className="text-xs text-slate-500 font-medium mb-3">
                          {agent.role}
                        </div>
                        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                          {agent.whatTheyDo}
                        </p>
                      </div>
                      <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-center gap-1.5 text-xs font-bold text-[#2D8CFF]">
                        <span>View Details &amp; Touchpoints</span>
                        <span>&rarr;</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                /* Expanded Landscape View with other member below */
                (() => {
                  const activeAgent = agentRow2.find((a) => a.id === activeRow2Agent) || agentRow2[0];
                  const otherAgent = agentRow2.find((a) => a.id !== activeRow2Agent) || agentRow2[1];
                  return (
                    <div>
                      {/* Active Agent Expanded Landscape Card */}
                      <div className="bg-white rounded-3xl border-2 border-[#2D8CFF] p-6 sm:p-8 shadow-2xl transition-all duration-500 ease-out">
                        <div className="flex flex-col sm:flex-row items-center sm:items-stretch gap-6 sm:gap-8">
                          {/* Agent Photo */}
                          <div className="w-44 sm:w-52 h-52 sm:h-60 rounded-2xl overflow-hidden border-2 border-[#2D8CFF] shadow-lg shrink-0 bg-slate-50">
                            <img
                              src={activeAgent.photo}
                              alt={activeAgent.name}
                              className="w-full h-full object-cover object-top"
                              width="208"
                              height="240"
                            />
                          </div>

                          {/* Agent Expanded Details */}
                          <div className="flex-1 flex flex-col justify-between text-left">
                            <div>
                              <div className="flex items-center justify-between gap-3 mb-2">
                                <span className="inline-block px-3 py-1 rounded-full bg-blue-50 text-[#2D8CFF] border border-blue-200 text-xs font-bold uppercase tracking-wider">
                                  {activeAgent.departmentBadge}
                                </span>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setActiveRow2Agent(null);
                                  }}
                                  className="text-xs text-slate-400 hover:text-slate-700 font-medium px-2 py-1 rounded hover:bg-slate-100 transition-colors"
                                  title="Collapse details"
                                >
                                  ✕ Close View
                                </button>
                              </div>

                              <h4 className="text-2xl sm:text-3xl font-black text-[#0C225E] tracking-tight">
                                {activeAgent.name}
                              </h4>
                              <div className="text-sm font-semibold text-slate-600 mb-2">
                                {activeAgent.role}
                              </div>

                              <div className="mb-3">
                                <a
                                  href={`mailto:${activeAgent.email}`}
                                  className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-sky-700 bg-sky-50 hover:bg-sky-100 px-3 py-1 rounded-lg border border-sky-200 transition-colors"
                                >
                                  <span>✉️ {activeAgent.email}</span>
                                </a>
                              </div>

                              <div className="text-xs sm:text-sm text-slate-700 bg-slate-50 p-4 rounded-2xl border border-slate-200/80 leading-relaxed mb-4">
                                <span className="font-bold text-slate-900 block mb-1">Department Focus &amp; Responsibilities:</span>
                                {activeAgent.whatTheyDo}
                              </div>
                            </div>

                            {/* Direct Actions */}
                            <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-slate-100">
                              <a
                                href={activeAgent.directAction}
                                target={activeAgent.directAction.startsWith('http') ? '_blank' : '_self'}
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#0C225E] hover:bg-[#142A68] text-white font-bold text-xs shadow-md transition-all cursor-pointer"
                              >
                                <span>{activeAgent.actionLabel}</span>
                                <span>&rarr;</span>
                              </a>
                              {activeAgent.emailAction && (
                                <a
                                  href={activeAgent.emailAction}
                                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-all"
                                >
                                  <span>✉️ Direct Email</span>
                                </a>
                              )}
                              {activeAgent.waAction && (
                                <a
                                  href={activeAgent.waAction}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold text-xs transition-all"
                                >
                                  <span>🟢 WhatsApp Desk</span>
                                </a>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Sibling Member moved below */}
                      <div
                        onClick={() => setActiveRow2Agent(otherAgent.id)}
                        onMouseEnter={() => setActiveRow2Agent(otherAgent.id)}
                        className="mt-4 w-full bg-white hover:bg-blue-50/50 rounded-2xl border border-slate-200 hover:border-[#2D8CFF] p-4 flex items-center justify-between cursor-pointer transition-all shadow-sm group"
                      >
                        <div className="flex items-center gap-4">
                          <img
                            src={otherAgent.photo}
                            alt={otherAgent.name}
                            className="w-12 h-12 rounded-xl object-cover object-top border border-slate-200 group-hover:border-[#2D8CFF]"
                            width="48"
                            height="48"
                          />
                          <div className="text-left">
                            <span className="text-[10px] font-bold text-[#0C225E] uppercase tracking-wider block">
                              {otherAgent.departmentBadge}
                            </span>
                            <strong className="text-sm text-slate-900 group-hover:text-[#2D8CFF] transition-colors">
                              {otherAgent.name}
                            </strong>
                            <span className="text-xs text-slate-500 ml-2">({otherAgent.role})</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-xs font-bold text-[#2D8CFF]">
                          <span>Switch to {otherAgent.name}</span>
                          <span>&rarr;</span>
                        </div>
                      </div>
                    </div>
                  );
                })()
              )}
            </div>

          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactView;
