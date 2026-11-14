import React, { useState } from 'react';
import { CONFIG } from '../data/siteData';
import { apiService } from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import { Loader } from '../components/common/Loader';
import PageHero from '../components/common/PageHero';

export const ContactView = ({ onNotify }) => {
  const { t, currentLang, localizePath } = useLanguage();
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
        onNotify('Could not submit message to server. Please contact our desk directly via WhatsApp (+91 98205 25200) or email sales@lotustubes.com.', 'danger');
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
            href={`tel:${(CONFIG.primaryPhone || '+91 98205 25200').replace(/\s+/g, '')}`}
            className="btn btn--outline inline-flex items-center gap-2"
          >
            <svg className="w-4 h-4 text-[#2D8CFF] shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            <span>Direct Phone: {CONFIG.primaryPhone || '+91 98205 25200'}</span>
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
                    href={`tel:${(CONFIG.primaryPhone || '+91 98205 25200').replace(/\s+/g, '')}`}
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
    </div>
  );
};

export default ContactView;
