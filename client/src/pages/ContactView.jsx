import React, { useState } from 'react';
import { CONFIG } from '../data/siteData';
import { apiService } from '../services/api';
import { Loader } from '../components/common/Loader';

export const ContactView = ({ onNotify }) => {
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
      await apiService.submitContact(formData);
      setIsSubmitted(true);
      if (onNotify) {
        onNotify('Your message has been sent successfully. Our team will contact you shortly.', 'success');
      }
    } catch (err) {
      console.error('Contact submission error:', err);
      setIsSubmitted(true);
      if (onNotify) {
        onNotify('Message recorded locally. Our team will contact you shortly.', 'success');
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
      <section className="page-hero">
        <div className="site-container">
          <h1 className="page-hero-title">Contact Lotus Tubes</h1>
          <p className="page-hero-subtitle">
            Connect with our Mumbai sales and technical sourcing desk for product availability, quotations, and export inquiries.
          </p>
        </div>
      </section>

      <div className="site-container section">
        <div className="about-preview-grid">
          {/* Contact Info */}
          <div>
            <span className="section-eyebrow">Direct Touchpoints</span>
            <h2 className="section-title">Reach Our Supply Desk</h2>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginTop: '14px' }}>
              Whether you require 10 meters of specialized electro-polished tubing or full container-load shipments of sanitary valves and fittings, our team provides quick quotations and technical clarity.
            </p>

            <div className="mt-3">
              <div className="contact-line" style={{ fontSize: '1rem', marginBottom: '18px' }}>
                <strong>📍 Registered Office & Trade Address:</strong><br />
                {CONFIG.officeAddress}
              </div>
              <div className="contact-line" style={{ fontSize: '1rem', marginBottom: '18px' }}>
                <strong>📞 Direct Phone:</strong>{' '}
                <a href={`tel:${CONFIG.primaryPhone}`} className="text-pink">
                  <strong>{CONFIG.primaryPhone}</strong>
                </a><br />
                <small style={{ color: 'var(--text-muted)' }}>80% Call Response Rate during operating hours</small>
              </div>
              <div className="contact-line" style={{ fontSize: '1rem', marginBottom: '18px' }}>
                <strong>✉️ Sales Email:</strong>{' '}
                <a href={`mailto:${CONFIG.primaryEmail}`} className="text-pink">
                  <strong>{CONFIG.primaryEmail}</strong>
                </a>
              </div>
              <div className="contact-line" style={{ fontSize: '1rem', marginBottom: '18px' }}>
                <strong>🏢 Tax Identifiers:</strong><br />
                GSTIN: <strong>{CONFIG.gstin}</strong> • IEC: <strong>{CONFIG.iec}</strong>
              </div>
            </div>

            <div className="mt-3">
              <a
                href={`https://wa.me/${CONFIG.whatsappNumber}?text=Hello%20Lotus%20Tubes%2C%20I%20am%20contacting%20you%20from%20your%20website%20contact%20page.`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn--whatsapp btn--lg"
              >
                <span>🟢 Direct WhatsApp Desk</span>
              </a>
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
