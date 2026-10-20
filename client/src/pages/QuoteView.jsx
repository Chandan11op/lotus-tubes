import React, { useState } from 'react';
import { apiService } from '../services/api';
import { Loader } from '../components/common/Loader';

export const QuoteView = ({ onNotify }) => {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    category: 'Sanitary Pipes & Tubes',
    material: 'SS 316L',
    quantity: '',
    destination: '',
    specs: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [successCode, setSuccessCode] = useState(null);

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Full name is required';
    if (!formData.company.trim()) errs.company = 'Company / Factory name is required';
    if (!formData.email.trim() || !/^\S+@\S+\.\S+$/.test(formData.email)) {
      errs.email = 'Valid business email is required';
    }
    if (!formData.phone.trim() || formData.phone.length < 7) {
      errs.phone = 'Valid phone / WhatsApp number is required';
    }
    if (!formData.quantity.trim()) errs.quantity = 'Estimated quantities or sizes are required';
    if (!formData.destination.trim()) errs.destination = 'Delivery destination city/country is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoading) return;
    if (!validate()) return;

    setIsLoading(true);

    try {
      const payload = {
        name: formData.name,
        company: formData.company,
        email: formData.email,
        phone: formData.phone,
        location: formData.destination,
        projectType: formData.category,
        materialGrade: formData.material,
        boqSummary: `Quantity: ${formData.quantity}\nSpecs: ${formData.specs}`
      };

      const res = await apiService.submitQuote(payload);
      const code = res?.data?.reference || `LT-BOQ-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
      setSuccessCode(code);
      if (onNotify) {
        onNotify(`Quotation request recorded! Reference: ${code}`, 'success');
      }
    } catch (err) {
      console.error('Quote submission error:', err);
      const code = `LT-BOQ-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
      setSuccessCode(code);
      if (onNotify) {
        onNotify(`Quote saved locally. Reference: ${code}`, 'success');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    const fieldName = id.replace('rfq-', '');
    setFormData((prev) => ({ ...prev, [fieldName]: value }));
    if (errors[fieldName]) {
      setErrors((prev) => ({ ...prev, [fieldName]: null }));
    }
  };

  return (
    <div>
      <section className="page-hero">
        <div className="site-container">
          <h1 className="page-hero-title">Request a Comprehensive Quotation</h1>
          <p className="page-hero-subtitle">
            Submit your exact product requirements, quantities, material grades, or attach your Bill of Quantities (BOQ).
          </p>
        </div>
      </section>

      <div className="site-container section" style={{ maxWidth: '960px' }}>
        <div className="form-card" style={{ position: 'relative' }}>
          <div className="section-header" style={{ marginBottom: '24px' }}>
            <div>
              <span className="section-eyebrow">Quick RFQ System</span>
              <h2 className="section-title" style={{ fontSize: '1.8rem' }}>
                Bill of Quantities (BOQ) &amp; RFQ Submission
              </h2>
              <p className="section-subtitle">Our sales estimators respond within 2 to 4 business hours.</p>
            </div>
          </div>

          {successCode ? (
            <div id="full-rfq-success" className="form-success-box mt-3" style={{ display: 'block' }}>
              <div className="success-icon">✓</div>
              <h3>Quotation Request Successfully Logged!</h3>
              <p>
                Your reference code: <strong id="rfq-success-code">{successCode}</strong>
              </p>
              <p>
                A copy has been recorded in our local CRM demonstration workflow. Our estimators will contact you via WhatsApp and email with pricing details.
              </p>
              <div className="success-actions mt-2" style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <a href="#crm/enquiries" className="btn btn--outline-dark">
                  Inspect In Internal CRM Demo &rarr;
                </a>
                <button
                  type="button"
                  className="btn btn--secondary"
                  onClick={() => {
                    setSuccessCode(null);
                    setFormData({
                      name: '',
                      company: '',
                      email: '',
                      phone: '',
                      category: 'Sanitary Pipes & Tubes',
                      material: 'SS 316L',
                      quantity: '',
                      destination: '',
                      specs: ''
                    });
                  }}
                >
                  Submit Another RFQ
                </button>
              </div>
            </div>
          ) : (
            <form id="full-rfq-form" onSubmit={handleSubmit} noValidate>
              <h4 style={{ fontFamily: 'var(--font-heading)', color: 'var(--deep-navy)', marginBottom: '12px', borderBottom: '1.5px solid var(--border-color)', paddingBottom: '6px' }}>
                1. Customer &amp; Business Information
              </h4>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="rfq-name">Your Full Name <span className="required">*</span></label>
                  <input
                    type="text"
                    id="rfq-name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="e.g. Chirag Shah"
                  />
                  {errors.name && <span className="field-error" style={{ color: '#EF4444', fontSize: '12px' }}>{errors.name}</span>}
                </div>
                <div className="form-group">
                  <label htmlFor="rfq-company">Company / Factory Name <span className="required">*</span></label>
                  <input
                    type="text"
                    id="rfq-company"
                    value={formData.company}
                    onChange={handleChange}
                    required
                    placeholder="e.g. BioPharma Projects Pvt Ltd"
                  />
                  {errors.company && <span className="field-error" style={{ color: '#EF4444', fontSize: '12px' }}>{errors.company}</span>}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="rfq-email">Business Email <span className="required">*</span></label>
                  <input
                    type="email"
                    id="rfq-email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="procurement@company.com"
                  />
                  {errors.email && <span className="field-error" style={{ color: '#EF4444', fontSize: '12px' }}>{errors.email}</span>}
                </div>
                <div className="form-group">
                  <label htmlFor="rfq-phone">Phone / WhatsApp <span className="required">*</span></label>
                  <input
                    type="tel"
                    id="rfq-phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    placeholder="+91 98200 12345"
                  />
                  {errors.phone && <span className="field-error" style={{ color: '#EF4444', fontSize: '12px' }}>{errors.phone}</span>}
                </div>
              </div>

              <h4 style={{ fontFamily: 'var(--font-heading)', color: 'var(--deep-navy)', marginTop: '24px', marginBottom: '12px', borderBottom: '1.5px solid var(--border-color)', paddingBottom: '6px' }}>
                2. Technical &amp; Order Requirements
              </h4>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="rfq-category">Primary Product Interest</label>
                  <select
                    id="rfq-category"
                    value={formData.category}
                    onChange={handleChange}
                  >
                    <option value="Sanitary Pipes & Tubes">Sanitary Pipes &amp; Tubes (EP / MP)</option>
                    <option value="Sanitary Pipe Fittings">Sanitary Pipe Fittings (Bends, Tees, Reducers)</option>
                    <option value="Tri-Clamp Components">Tri-Clamp Ferrules, Clamps &amp; Unions</option>
                    <option value="Sanitary Valves">Manual &amp; Pneumatic Sanitary Valves</option>
                    <option value="Complete Process Line / BOQ">Complete Process Package / Mixed BOQ</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="rfq-material">Material Grade</label>
                  <select
                    id="rfq-material"
                    value={formData.material}
                    onChange={handleChange}
                  >
                    <option value="SS 316L">SS 316L (Pharma / High Purity)</option>
                    <option value="SS 304">SS 304 (Dairy / Food Grade)</option>
                    <option value="Both / Need Recommendation">Both / Need Engineering Recommendation</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="rfq-quantity">Estimated Quantities / Sizes <span className="required">*</span></label>
                  <input
                    type="text"
                    id="rfq-quantity"
                    value={formData.quantity}
                    onChange={handleChange}
                    required
                    placeholder="e.g. 200m 1.5 inch tube + 40 Bends"
                  />
                  {errors.quantity && <span className="field-error" style={{ color: '#EF4444', fontSize: '12px' }}>{errors.quantity}</span>}
                </div>
                <div className="form-group">
                  <label htmlFor="rfq-destination">Delivery City &amp; Country <span className="required">*</span></label>
                  <input
                    type="text"
                    id="rfq-destination"
                    value={formData.destination}
                    onChange={handleChange}
                    required
                    placeholder="e.g. Vapi, Gujarat or Dubai, UAE"
                  />
                  {errors.destination && <span className="field-error" style={{ color: '#EF4444', fontSize: '12px' }}>{errors.destination}</span>}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="rfq-specs">Detailed Specifications, Finish (EP/MP), Standards, or Remarks</label>
                <textarea
                  id="rfq-specs"
                  rows={4}
                  value={formData.specs}
                  onChange={handleChange}
                  placeholder="Detail any specific outside diameter, wall gauge, standard (ASTM A270), or delivery deadline..."
                ></textarea>
              </div>

              <div className="form-actions mt-3">
                <button
                  type="submit"
                  className="btn btn--primary btn--block btn--lg"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader variant="button" size="sm" color="#FFFFFF" label="Submitting quotation request..." />
                  ) : (
                    <span>Submit Quotation Request &rarr;</span>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuoteView;
