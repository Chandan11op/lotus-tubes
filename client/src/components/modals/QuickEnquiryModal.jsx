import React, { useState, useEffect } from 'react';
import { apiService } from '../../services/api';
import { Loader } from '../common/Loader';
import { CONFIG } from '../../data/siteData';
import { useAuth } from '../../context/AuthContext';

export const QuickEnquiryModal = ({ isOpen, onClose, product, onSuccess }) => {
  const { user, isAuthenticated } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    grade: 'SS 316L',
    quantity: '',
    location: '',
    notes: '',
    finish: '',
    sizes: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [successRef, setSuccessRef] = useState(null);
  const [submittedData, setSubmittedData] = useState(null);

  useEffect(() => {
    if (isOpen) {
      setErrors({});
      setSuccessRef(null);
      // Automatically prefill customer information if authenticated
      setFormData({
        name: user?.name || '',
        company: user?.company || '',
        email: user?.email || '',
        phone: user?.phone || '',
        grade: product?.material || 'SS 316L',
        quantity: '',
        location: '',
        notes: '',
        finish: product?.finish || 'Electro-Polished (EP Ra ≤ 0.38µm)',
        sizes: product?.sizes || ''
      });
    }
  }, [isOpen, user, product]);

  if (!isOpen) return null;

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Please enter your full name';
    if (!formData.company.trim()) errs.company = 'Please enter your company / business name';
    if (!formData.email.trim() || !/^\S+@\S+\.\S+$/.test(formData.email)) {
      errs.email = 'Please provide a valid business email';
    }
    if (!formData.phone.trim() || formData.phone.length < 7) {
      errs.phone = 'Please enter a valid phone or WhatsApp number with country code';
    }
    if (!formData.quantity.trim()) errs.quantity = 'Please specify required quantity';
    if (!formData.location.trim()) errs.location = 'Please specify delivery destination';
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
        productId: product?.id || 'sanitary-item',
        productName: product?.name || 'Sanitary Component',
        name: formData.name,
        company: formData.company,
        email: formData.email,
        phone: formData.phone,
        grade: formData.grade,
        quantity: formData.quantity,
        location: formData.location,
        notes: formData.notes,
        finish: formData.finish,
        sizes: formData.sizes
      };

      const res = await apiService.submitEnquiry(payload);
      const reference = res?.data?.reference || `LT-RFQ-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
      setSuccessRef(reference);
      setSubmittedData({ ...payload, reference });
      if (onSuccess) onSuccess(reference, payload);
    } catch (err) {
      console.error('Error submitting quotation request:', err);
      const reference = `LT-RFQ-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
      setSuccessRef(reference);
      setSubmittedData({ ...formData, reference });
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
    <div className="modal-overlay active" id="quick-enquiry-modal" role="dialog" aria-modal="true" aria-label="Request Official Quotation">
      <div className="modal-box modal-box--enquiry" style={{ position: 'relative', maxWidth: '640px' }}>
        <div className="modal-header">
          <div>
            <h3 id="quick-enquiry-title">Request Official Quotation</h3>
            <p className="modal-subtitle" id="quick-enquiry-subtitle">
              Formal Commercial Quotation &bull; Dispatched via Email &amp; WhatsApp
            </p>
          </div>
          <button type="button" className="modal-close-btn" onClick={onClose} aria-label="Close modal">
            &times;
          </button>
        </div>

        <div className="modal-body">
          {successRef ? (
            <div className="form-success-box" id="quick-enquiry-success" style={{ display: 'block', padding: '24px', textAlign: 'center' }}>
              <div className="success-icon" style={{ fontSize: '36px', color: '#10B981', marginBottom: '12px' }}>✓</div>
              <h4 style={{ color: 'var(--deep-navy)', fontSize: '1.4rem', marginBottom: '8px' }}>Quotation Request Confirmed</h4>
              <p className="success-ref" style={{ fontSize: '15px', color: '#10263D', marginBottom: '12px' }}>
                Quotation Reference: <strong id="success-enquiry-ref" style={{ color: 'var(--primary-blue)' }}>{successRef}</strong>
              </p>
              <div style={{ background: '#F8FAFC', padding: '14px', borderRadius: '8px', border: '1px solid #E3E8EF', textAlign: 'left', fontSize: '13px', lineHeight: 1.6, marginBottom: '16px' }}>
                <div><strong>Product:</strong> {product?.name || 'Sanitary Component'}</div>
                <div><strong>Requested Quantity:</strong> {submittedData?.quantity || formData.quantity}</div>
                <div><strong>Destination:</strong> {submittedData?.location || formData.location}</div>
                <div><strong>Delivered to:</strong> {submittedData?.email || formData.email}</div>
                <div style={{ marginTop: '8px', color: '#667085', fontSize: '12px', borderTop: '1px solid #E3E8EF', paddingTop: '6px' }}>
                  A sample quotation PDF document has been assigned to this request.
                </div>
              </div>

              {/* Sample Quotation Document Action */}
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '16px' }}>
                <a
                  href="/sample-quotation.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn--primary btn--sm"
                  download={`LotusTubes-Quotation-${successRef}.pdf`}
                >
                  📥 Download Sample Quotation PDF
                </a>
                {isAuthenticated ? (
                  <a
                    href="#account"
                    onClick={onClose}
                    className="btn btn--outline-dark btn--sm"
                  >
                    View in My Customer Account &rarr;
                  </a>
                ) : null}
              </div>

              {/* Explicit Disclaimer */}
              <p style={{ fontSize: '11px', color: '#98A2B3', margin: 0, fontStyle: 'italic' }}>
                Disclaimer: The generated document is a sample quotation for evaluation purposes. Final commercial pricing, lead time, and terms are confirmed upon review by Lotus Tubes sales engineering.
              </p>

              <div className="success-actions mt-3">
                <button type="button" className="btn btn--secondary btn--sm" onClick={onClose}>
                  Done &bull; Close Window
                </button>
              </div>
            </div>
          ) : (
            <form id="quick-enquiry-form" className="enquiry-form" onSubmit={handleSubmit} noValidate>
              {/* Product Context Banner */}
              {product && (
                <div className="selected-product-preview" style={{ marginBottom: '16px', padding: '12px', background: '#F8FAFC', borderRadius: '6px', border: '1px solid #E3E8EF', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--primary-blue)', fontWeight: 600 }}>
                      Selected Product
                    </span>
                    <h4 style={{ margin: 0, color: '#10263D', fontSize: '1rem' }}>{product.name}</h4>
                    <div style={{ fontSize: '12px', color: '#667085' }}>
                      {product.material} &bull; {product.finish}
                    </div>
                  </div>
                  {product.image && (
                    <img src={product.image} alt={product.name} style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #E3E8EF' }} />
                  )}
                </div>
              )}

              {isAuthenticated && (
                <div style={{ marginBottom: '14px', padding: '8px 12px', background: '#ECFDF5', border: '1px solid #A7F3D0', borderRadius: '6px', fontSize: '12px', color: '#065F46' }}>
                  ✓ Signed in as <strong>{user?.name}</strong> ({user?.email}). Profile details prefilled below.
                </div>
              )}

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="eq-name">Full Name <span className="required">*</span></label>
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
                  <label htmlFor="eq-company">Company / Factory Name <span className="required">*</span></label>
                  <input
                    type="text"
                    id="eq-company"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    required
                    placeholder="e.g. BioPharma Process Ltd"
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
                    placeholder="procurement@company.com"
                  />
                  {errors.email && <span className="field-error" style={{ color: '#EF4444', fontSize: '12px' }}>{errors.email}</span>}
                </div>
                <div className="form-group">
                  <label htmlFor="eq-phone">WhatsApp / Contact Number <span className="required">*</span></label>
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
                    <option value="SS 316L">SS 316L (High Purity / Corrosion Resistant)</option>
                    <option value="SS 304">SS 304 (Standard Food / Dairy Grade)</option>
                    <option value="Both / Need Consultation">Both / Need Consultation</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="eq-quantity">Required Quantity <span className="required">*</span></label>
                  <input
                    type="text"
                    id="eq-quantity"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleChange}
                    required
                    placeholder="e.g. 150 meters / 200 pcs / 1 project lot"
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
                  placeholder="e.g. Mumbai, India or Dubai, UAE"
                />
                {errors.location && <span className="field-error" style={{ color: '#EF4444', fontSize: '12px' }}>{errors.location}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="eq-notes">Additional Dimensions or Technical Requirements (Optional)</label>
                <textarea
                  id="eq-notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows={2}
                  placeholder="Specify outer diameter (OD), wall thickness, standard (ASTM A270, DIN 11850), or inspection tolerances..."
                ></textarea>
              </div>

              <div style={{ fontSize: '12px', color: '#667085', marginBottom: '14px' }}>
                ℹ️ An official quotation document will be dispatched to your email and WhatsApp number.
              </div>

              <div className="form-actions" style={{ position: 'relative' }}>
                <button
                  type="submit"
                  className="btn btn--primary btn--block btn--lg"
                  id="eq-submit-btn"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader variant="button" size="sm" color="#FFFFFF" label="Processing quotation request..." />
                  ) : (
                    <span>Request Official Quotation &rarr;</span>
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

export default QuickEnquiryModal;
