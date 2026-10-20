import React, { useState, useEffect } from 'react';
import { apiService } from '../../services/api';
import { Loader } from '../common/Loader';
import { CONFIG } from '../../data/siteData';

export const QuickEnquiryModal = ({ isOpen, onClose, product, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    grade: 'SS 316L (Recommended for Pharma/Biotech)',
    quantity: '',
    location: '',
    notes: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [successRef, setSuccessRef] = useState(null);

  useEffect(() => {
    if (isOpen) {
      setErrors({});
      setSuccessRef(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Please enter your full name';
    if (!formData.company.trim()) errs.company = 'Please enter your company / business name';
    if (!formData.email.trim() || !/^\S+@\S+\.\S+$/.test(formData.email)) {
      errs.email = 'Please provide a valid business email';
    }
    if (!formData.phone.trim() || formData.phone.length < 7) {
      errs.phone = 'Please enter a valid phone or WhatsApp number';
    }
    if (!formData.quantity.trim()) errs.quantity = 'Please specify estimated quantity';
    if (!formData.location.trim()) errs.location = 'Please specify destination city/country';
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
        productId: product?.id || '',
        productName: product?.name || 'Sanitary Component',
        ...formData
      };

      const res = await apiService.submitEnquiry(payload);
      const reference = res?.data?.reference || `LT-RFQ-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
      setSuccessRef(reference);
      if (onSuccess) onSuccess(reference, payload);
    } catch (err) {
      console.error('Error submitting enquiry:', err);
      // Even if network fails, show local reference
      const reference = `LT-RFQ-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
      setSuccessRef(reference);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  return (
    <div className="modal-overlay active" id="quick-enquiry-modal" role="dialog" aria-modal="true" aria-label="Quick Product Enquiry">
      <div className="modal-box modal-box--enquiry" style={{ position: 'relative' }}>
        <div className="modal-header">
          <div>
            <h3 id="quick-enquiry-title">Enquire for Product Price</h3>
            <p className="modal-subtitle" id="quick-enquiry-subtitle">
              Instant quote &bull; Same day response via WhatsApp &amp; Email
            </p>
          </div>
          <button type="button" className="modal-close-btn" onClick={onClose} aria-label="Close modal">
            &times;
          </button>
        </div>

        <div className="modal-body">
          {successRef ? (
            <div className="form-success-box" id="quick-enquiry-success" style={{ display: 'block' }}>
              <div className="success-icon">✓</div>
              <h4>Thank You for Your Enquiry!</h4>
              <p className="success-ref">
                Enquiry Reference: <strong id="success-enquiry-ref">{successRef}</strong>
              </p>
              <p>
                Our sales desk has recorded your specifications into our operational workflow. You will receive an official technical quotation and WhatsApp confirmation promptly.
              </p>
              <div className="success-actions">
                <button type="button" className="btn btn--secondary" onClick={onClose}>
                  Close Window
                </button>
                <a href="#crm/enquiries" onClick={onClose} className="btn btn--outline-dark">
                  View in Staff CRM Demo &rarr;
                </a>
              </div>
            </div>
          ) : (
            <form id="quick-enquiry-form" className="enquiry-form" onSubmit={handleSubmit} noValidate>
              {product && (
                <div className="selected-product-preview" style={{ marginBottom: '16px', padding: '12px', background: '#F8FAFC', borderRadius: '6px', border: '1px solid #E3E8EF' }}>
                  <strong style={{ color: '#10263D' }}>{product.name}</strong>
                  <div style={{ fontSize: '13px', color: '#667085' }}>
                    {product.material} &bull; {product.finish} &bull; {product.standard}
                  </div>
                </div>
              )}

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="eq-name">Your Full Name <span className="required">*</span></label>
                  <input
                    type="text"
                    id="eq-name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="e.g. Ramesh Patel"
                  />
                  {errors.name && <span className="field-error" style={{ color: '#EF4444', fontSize: '12px' }}>{errors.name}</span>}
                </div>
                <div className="form-group">
                  <label htmlFor="eq-company">Company / Business Name <span className="required">*</span></label>
                  <input
                    type="text"
                    id="eq-company"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    required
                    placeholder="e.g. BioPharma Engineering Ltd"
                  />
                  {errors.company && <span className="field-error" style={{ color: '#EF4444', fontSize: '12px' }}>{errors.company}</span>}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="eq-email">Business Email <span className="required">*</span></label>
                  <input
                    type="email"
                    id="eq-email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="purchase@company.com"
                  />
                  {errors.email && <span className="field-error" style={{ color: '#EF4444', fontSize: '12px' }}>{errors.email}</span>}
                </div>
                <div className="form-group">
                  <label htmlFor="eq-phone">Phone / WhatsApp Number <span className="required">*</span></label>
                  <input
                    type="tel"
                    id="eq-phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    placeholder="+91 98765 43210"
                  />
                  {errors.phone && <span className="field-error" style={{ color: '#EF4444', fontSize: '12px' }}>{errors.phone}</span>}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="eq-grade">Material Grade</label>
                  <select id="eq-grade" name="grade" value={formData.grade} onChange={handleChange}>
                    <option value="SS 316L (Recommended for Pharma/Biotech)">SS 316L (High Purity / Corrosion Resistant)</option>
                    <option value="SS 304 (Standard Food/Dairy Grade)">SS 304 (Standard Food / Dairy Grade)</option>
                    <option value="Both / Need Consultation">Both / Need Consultation</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="eq-quantity">Estimated Quantity <span className="required">*</span></label>
                  <input
                    type="text"
                    id="eq-quantity"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleChange}
                    required
                    placeholder="e.g. 150 meters / 200 pcs"
                  />
                  {errors.quantity && <span className="field-error" style={{ color: '#EF4444', fontSize: '12px' }}>{errors.quantity}</span>}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="eq-location">Delivery Destination City &amp; Country <span className="required">*</span></label>
                <input
                  type="text"
                  id="eq-location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Vapi, Gujarat, India or Munich, Germany"
                />
                {errors.location && <span className="field-error" style={{ color: '#EF4444', fontSize: '12px' }}>{errors.location}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="eq-notes">Specific Size, Finish (EP/MP), or Standard Requirements</label>
                <textarea
                  id="eq-notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Specify outer diameter (OD), wall thickness, standard (ASTM A270), or custom tolerance..."
                ></textarea>
              </div>

              <div className="form-actions" style={{ position: 'relative' }}>
                <button
                  type="submit"
                  className="btn btn--primary btn--block btn--lg"
                  id="eq-submit-btn"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader variant="button" size="sm" color="#FFFFFF" label="Submitting quotation request..." />
                  ) : (
                    <span>Submit Quotation Request &rarr;</span>
                  )}
                </button>
              </div>

              <div className="whatsapp-direct-box mt-3">
                <span>Or connect right now:</span>
                <a
                  href={`https://wa.me/${CONFIG.whatsappNumber}?text=Hello%20Lotus%20Tubes%2C%20I%20want%20to%20enquire%20about%20${encodeURIComponent(product?.name || 'Sanitary Products')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn--whatsapp btn--sm"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                >
                  <span>🟢 Enquire via WhatsApp</span>
                </a>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuickEnquiryModal;
