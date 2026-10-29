import React, { useState, useEffect, useRef } from 'react';
import { apiService } from '../../services/api';
import { Loader } from '../common/Loader';
import { CONFIG } from '../../data/siteData';
import { useAuth } from '../../context/AuthContext';
import TurnstileWidget from '../common/TurnstileWidget';
import {
  MATERIAL_GRADES,
  NOMINAL_SIZES,
  WALL_THICKNESSES,
  UNITS_OF_MEASUREMENT,
  getSpecsForCategory
} from '../../data/productSpecsConfig';

export const QuickEnquiryModal = ({ isOpen, onClose, product, onSuccess }) => {
  const { user, isAuthenticated } = useAuth();

  const categorySpecs = getSpecsForCategory(product?.category || product?.name || 'Sanitary Pipes');

  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    grade: 'SS 316L',
    productType: '',
    nominalSize: '1" (25.4mm OD)',
    customSize: '',
    wallThickness: '1.65 mm',
    customThickness: '',
    standard: '',
    customStandard: '',
    quantity: '50',
    unit: 'Meter',
    location: '',
    notes: '',
    finish: '',
    sizes: ''
  });

  const [turnstileToken, setTurnstileToken] = useState('');
  const [turnstileResetKey, setTurnstileResetKey] = useState(0);
  const [turnstileError, setTurnstileError] = useState(null);

  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [successRef, setSuccessRef] = useState(null);
  const [submittedData, setSubmittedData] = useState(null);

  const firstInputRef = useRef(null);

  // Background scroll lock and escape key handler
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    // Focus initial input
    const timer = setTimeout(() => {
      if (firstInputRef.current) {
        firstInputRef.current.focus();
      }
    }, 100);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
      clearTimeout(timer);
    };
  }, [isOpen, onClose]);

  // Synchronize form data with authenticated user and selected product
  useEffect(() => {
    if (isOpen) {
      setErrors({});
      setSubmitError(null);
      setSuccessRef(null);
      setTurnstileToken('');
      setTurnstileError(null);

      const specs = getSpecsForCategory(product?.category || product?.name || 'Sanitary Pipes');

      setFormData((prev) => ({
        ...prev,
        name: isAuthenticated && user?.name ? user.name : (prev.name || ''),
        company: isAuthenticated && user?.company ? user.company : (prev.company || ''),
        email: isAuthenticated && user?.email ? user.email : (prev.email || ''),
        phone: isAuthenticated && user?.phone ? user.phone : (prev.phone || ''),
        grade: product?.material?.includes('304') ? 'SS 304L' : 'SS 316L',
        productType: specs.itemTypes[0]?.value || '',
        nominalSize: '1" (25.4mm OD)',
        customSize: '',
        wallThickness: '1.65 mm',
        customThickness: '',
        standard: specs.standards[0]?.value || '',
        customStandard: '',
        quantity: prev.quantity || '50',
        unit: specs.defaultUnit || 'Meter',
        location: prev.location || '',
        notes: prev.notes || '',
        finish: product?.finish || 'Electro-Polished (EP Ra ≤ 0.38µm)',
        sizes: product?.sizes || ''
      }));
    }
  }, [isOpen, user, isAuthenticated, product]);

  if (!isOpen) return null;

  const validate = () => {
    const errs = {};

    // For anonymous visitors, validate customer profile fields
    if (!isAuthenticated) {
      if (!formData.name.trim()) errs.name = 'Please enter your full name';
      if (!formData.company.trim()) errs.company = 'Please enter your company / business name';
      if (!formData.email.trim() || !/^\S+@\S+\.\S+$/.test(formData.email)) {
        errs.email = 'Please provide a valid business email';
      }
      if (!formData.phone.trim() || formData.phone.length < 7) {
        errs.phone = 'Please enter a valid phone or WhatsApp number with country code';
      }
    } else {
      // For authenticated user: only validate fields missing from profile
      if (!user?.phone && (!formData.phone || formData.phone.trim().length < 7)) {
        errs.phone = 'Please provide a contact phone/WhatsApp number for quotation delivery';
      }
      if (!user?.company && (!formData.company || !formData.company.trim())) {
        errs.company = 'Please specify your company or organization';
      }
    }

    // Required product specification fields for both guest and authenticated customers
    if (!formData.quantity.trim()) errs.quantity = 'Please specify required quantity (e.g. 50 meters, 200 pcs)';
    if (!formData.location.trim()) errs.location = 'Please specify delivery destination city and country';

    // Cloudflare Turnstile validation for anonymous visitors
    if (!isAuthenticated && !turnstileToken) {
      errs.turnstile = 'Please complete the Cloudflare security verification check.';
      setTurnstileError('Please check the verification box before submitting.');
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoading) return;

    setSubmitError(null);
    setTurnstileError(null);

    if (!validate()) return;

    setIsLoading(true);

    try {
      const selectedSize = formData.nominalSize === 'Custom Size' ? formData.customSize : formData.nominalSize;
      const selectedThickness = formData.wallThickness === 'Custom' ? formData.customThickness : formData.wallThickness;
      const selectedStandard = formData.standard === 'Custom' ? formData.customStandard : formData.standard;

      const matchedSizeObj = NOMINAL_SIZES.find((s) => s.value === formData.nominalSize);
      const outsideDiameter = matchedSizeObj && matchedSizeObj.odMm !== 'Custom' ? matchedSizeObj.odMm : formData.customSize;

      const payload = {
        productId: product?.id || 'sanitary-item',
        productName: product?.name || 'Sanitary Component',
        grade: formData.grade,
        materialGrade: formData.grade,
        productType: formData.productType || product?.category || 'Sanitary Component',
        nominalSize: selectedSize,
        outsideDiameter: outsideDiameter || '',
        wallThickness: selectedThickness || '',
        standard: selectedStandard || '',
        quantity: formData.quantity,
        unit: formData.unit,
        location: formData.location,
        notes: formData.notes,
        finish: formData.finish,
        sizes: `${selectedSize} (${outsideDiameter || ''}) x ${selectedThickness}`,
        // If guest, pass customer fields and Turnstile token
        ...(!isAuthenticated
          ? {
              name: formData.name,
              company: formData.company,
              email: formData.email,
              phone: formData.phone,
              turnstileToken
            }
          : {
              // Pass missing profile info if user entered it
              ...(formData.phone ? { phone: formData.phone } : {}),
              ...(formData.company ? { company: formData.company } : {})
            })
      };

      const res = await apiService.submitEnquiry(payload);

      if (res?.success) {
        const reference = res.data?.reference || `LT-RFQ-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
        setSuccessRef(reference);
        setSubmittedData({
          ...payload,
          name: payload.name || user?.name,
          email: payload.email || user?.email,
          phone: payload.phone || user?.phone,
          company: payload.company || user?.company,
          reference
        });
        if (onSuccess) onSuccess(reference, payload);
      } else {
        throw new Error(res?.message || 'Quotation submission failed. Please try again.');
      }
    } catch (err) {
      console.error('Error submitting quotation request:', err);
      setSubmitError(err.message || 'Server error occurred while submitting quotation. Please try again.');
      // Reset Turnstile token on failed attempt
      setTurnstileToken('');
      setTurnstileResetKey((k) => k + 1);
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
    <div
      className="modal-overlay active"
      id="quick-enquiry-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="quick-enquiry-title"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        backgroundColor: 'rgba(16, 38, 61, 0.75)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        overflowY: 'auto'
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="modal-box modal-box--enquiry"
        style={{
          position: 'relative',
          maxWidth: '680px',
          width: '100%',
          maxHeight: '92vh',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#FFFFFF',
          borderRadius: '12px',
          boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.35)',
          overflow: 'hidden'
        }}
      >
        {/* Modal Header */}
        <div
          className="modal-header"
          style={{
            padding: '20px 24px',
            borderBottom: '1px solid #E2E8F0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: '#F8FAFC'
          }}
        >
          <div>
            <span
              style={{
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: 'var(--primary-blue, #0284C7)'
              }}
            >
              Official Quotation Desk
            </span>
            <h3 id="quick-enquiry-title" style={{ margin: '2px 0 0 0', fontSize: '1.25rem', color: '#10263D' }}>
              Request Official Quotation
            </h3>
            <p className="modal-subtitle" id="quick-enquiry-subtitle" style={{ margin: '2px 0 0 0', fontSize: '12px', color: '#64748B' }}>
              Formal Commercial Quotation • Dispatched via Email & WhatsApp
            </p>
          </div>
          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close modal"
            style={{
              background: 'transparent',
              border: 'none',
              fontSize: '26px',
              cursor: 'pointer',
              color: '#64748B',
              lineHeight: 1,
              padding: '4px 8px',
              borderRadius: '4px'
            }}
          >
            &times;
          </button>
        </div>

        {/* Modal Body with internal scroll */}
        <div className="modal-body" style={{ padding: '24px', overflowY: 'auto', flex: 1 }}>
          {successRef ? (
            /* Confirmation State */
            <div
              className="form-success-box"
              id="quick-enquiry-success"
              style={{ display: 'block', padding: '16px', textAlign: 'center' }}
            >
              <div className="success-icon" style={{ fontSize: '42px', color: '#10B981', marginBottom: '8px' }}>
                ✓
              </div>
              <h4 style={{ color: '#10263D', fontSize: '1.35rem', marginBottom: '6px' }}>
                Quotation Request Confirmed
              </h4>
              <p className="success-ref" style={{ fontSize: '14px', color: '#10263D', marginBottom: '14px' }}>
                Quotation Reference:{' '}
                <strong id="success-enquiry-ref" style={{ color: 'var(--primary-blue, #0284C7)', fontSize: '16px' }}>
                  {successRef}
                </strong>
              </p>

              <div
                style={{
                  background: '#F8FAFC',
                  padding: '16px',
                  borderRadius: '8px',
                  border: '1px solid #E2E8F0',
                  textAlign: 'left',
                  fontSize: '13px',
                  lineHeight: 1.6,
                  marginBottom: '16px'
                }}
              >
                <div><strong>Product:</strong> {product?.name || 'Sanitary Component'}</div>
                <div><strong>Material Grade:</strong> {formData.grade}</div>
                <div><strong>Requested Quantity:</strong> {submittedData?.quantity || formData.quantity}</div>
                <div><strong>Destination:</strong> {submittedData?.location || formData.location}</div>
                <div><strong>Customer:</strong> {submittedData?.name || user?.name} ({submittedData?.email || user?.email})</div>
                <div style={{ marginTop: '8px', color: '#64748B', fontSize: '12px', borderTop: '1px solid #E2E8F0', paddingTop: '6px' }}>
                  A sample quotation PDF document has been assigned to this request and recorded in the database.
                </div>
              </div>

              {/* Sample Quotation Actions */}
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
                <a
                  href={`https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(
                    `Hello Lotus Tubes, I have requested quotation ${successRef} for ${product?.name || 'Sanitary Component'}. Please review and update me.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn--whatsapp btn--sm"
                >
                  <span>🟢 WhatsApp Desk ({successRef})</span>
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

              <p style={{ fontSize: '11px', color: '#94A3B8', margin: 0, fontStyle: 'italic' }}>
                Disclaimer: The generated document is a sample quotation for evaluation purposes. Final commercial pricing, lead time, and terms are confirmed upon review by Lotus Tubes sales engineering.
              </p>

              <div className="success-actions mt-3">
                <button type="button" className="btn btn--secondary btn--sm" onClick={onClose}>
                  Done • Close Window
                </button>
              </div>
            </div>
          ) : (
            /* Active Form State */
            <form id="quick-enquiry-form" className="enquiry-form" onSubmit={handleSubmit} noValidate>
              {/* Product Context Banner */}
              {product && (
                <div
                  className="selected-product-preview"
                  style={{
                    marginBottom: '16px',
                    padding: '12px 14px',
                    background: '#F8FAFC',
                    borderRadius: '8px',
                    border: '1px solid #E2E8F0',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '12px'
                  }}
                >
                  <div>
                    <span
                      style={{
                        fontSize: '11px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        color: 'var(--primary-blue, #0284C7)',
                        fontWeight: 600
                      }}
                    >
                      Selected Product
                    </span>
                    <h4 style={{ margin: 0, color: '#10263D', fontSize: '1rem', fontWeight: 600 }}>
                      {product.name}
                    </h4>
                    <div style={{ fontSize: '12px', color: '#64748B', marginTop: '2px' }}>
                      {product.material || 'SS 304 / SS 316L'} {product.finish ? `• ${product.finish}` : ''}
                    </div>
                  </div>
                  {product.image && (
                    <img
                      src={product.image}
                      alt={product.name}
                      style={{
                        width: '52px',
                        height: '52px',
                        objectFit: 'cover',
                        borderRadius: '6px',
                        border: '1px solid #CBD5E1',
                        flexShrink: 0
                      }}
                    />
                  )}
                </div>
              )}

              {/* Submission Error Banner */}
              {submitError && (
                <div
                  className="alert alert--danger"
                  style={{
                    marginBottom: '14px',
                    padding: '10px 14px',
                    background: '#FEF2F2',
                    border: '1px solid #F87171',
                    borderRadius: '6px',
                    fontSize: '13px',
                    color: '#991B1B'
                  }}
                >
                  <strong>⚠️ Submission Error:</strong> {submitError}
                </div>
              )}

              {/* Authenticated Customer Information Card */}
              {isAuthenticated ? (
                <div
                  className="authenticated-customer-card"
                  style={{
                    marginBottom: '16px',
                    padding: '12px 16px',
                    background: '#F0FDF4',
                    border: '1px solid #BBF7D0',
                    borderRadius: '8px',
                    fontSize: '13px',
                    color: '#166534'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span style={{ fontSize: '16px' }}>✓</span>
                    <span style={{ fontWeight: 600 }}>Authenticated Customer Session</span>
                  </div>
                  <div style={{ color: '#374151', fontSize: '12px', lineHeight: 1.5 }}>
                    <div><strong>Customer Name:</strong> {user?.name}</div>
                    <div><strong>Email:</strong> {user?.email}</div>
                    {user?.company && <div><strong>Company:</strong> {user.company}</div>}
                    {user?.phone && <div><strong>Phone / WhatsApp:</strong> {user.phone}</div>}
                  </div>
                  <div style={{ marginTop: '6px', fontSize: '11px', color: '#059669' }}>
                    Account details will be attached automatically without re-entry.
                  </div>
                </div>
              ) : null}

              {/* Anonymous Visitor Information Fields */}
              {!isAuthenticated && (
                <>
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="eq-name">Full Name <span className="required">*</span></label>
                      <input
                        ref={firstInputRef}
                        type="text"
                        id="eq-name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        placeholder="e.g. Rajesh Kumar"
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
                </>
              )}

              {/* If authenticated user has missing phone or company in their profile, ask only for those */}
              {isAuthenticated && (!user?.phone || !user?.company) && (
                <div className="form-row" style={{ marginBottom: '14px' }}>
                  {!user?.company && (
                    <div className="form-group">
                      <label htmlFor="eq-company">Company / Factory Name <span className="required">*</span></label>
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
                  )}
                  {!user?.phone && (
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
                  )}
                </div>
              )}

              {/* Product Specifications Section */}
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="eq-grade">Material Grade <span className="required">*</span></label>
                  <select id="eq-grade" name="grade" value={formData.grade} onChange={handleChange}>
                    {MATERIAL_GRADES.map((m) => (
                      <option key={m.value} value={m.value}>
                        {m.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="eq-nominalSize">Nominal Size & Outside Diameter <span className="required">*</span></label>
                  <select
                    id="eq-nominalSize"
                    name="nominalSize"
                    value={formData.nominalSize}
                    onChange={handleChange}
                  >
                    {NOMINAL_SIZES.map((s) => (
                      <option key={s.value} value={s.value}>
                        {s.nominal} {s.odMm !== 'Custom' ? `(OD: ${s.odMm})` : '(Custom Dimension)'}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {formData.nominalSize === 'Custom Size' && (
                <div className="form-group" style={{ marginBottom: '12px' }}>
                  <label htmlFor="eq-customSize">Custom Size / Dimensions <span className="required">*</span></label>
                  <input
                    type="text"
                    id="eq-customSize"
                    name="customSize"
                    value={formData.customSize}
                    onChange={handleChange}
                    placeholder="e.g. 5 inch OD (127mm) / customized drawing"
                  />
                  {errors.customSize && <span className="field-error" style={{ color: '#EF4444', fontSize: '12px' }}>{errors.customSize}</span>}
                </div>
              )}

              <div className="form-row">
                {categorySpecs.hasThickness ? (
                  <div className="form-group">
                    <label htmlFor="eq-wallThickness">Wall Thickness</label>
                    <select
                      id="eq-wallThickness"
                      name="wallThickness"
                      value={formData.wallThickness}
                      onChange={handleChange}
                    >
                      {WALL_THICKNESSES.map((w) => (
                        <option key={w.value} value={w.value}>
                          {w.label}
                        </option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <div className="form-group">
                    <label htmlFor="eq-conn">End Connection</label>
                    <input
                      type="text"
                      id="eq-conn"
                      name="wallThickness"
                      value={formData.wallThickness}
                      onChange={handleChange}
                      placeholder="e.g. Tri-Clamp, SMS, DIN, Welded"
                    />
                  </div>
                )}

                <div className="form-group">
                  <label htmlFor="eq-standard">Applicable Standard</label>
                  <select
                    id="eq-standard"
                    name="standard"
                    value={formData.standard}
                    onChange={handleChange}
                  >
                    {categorySpecs.standards.map((st) => (
                      <option key={st.value} value={st.value}>
                        {st.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {formData.wallThickness === 'Custom' && categorySpecs.hasThickness && (
                <div className="form-group" style={{ marginBottom: '12px' }}>
                  <label htmlFor="eq-customThickness">Custom Wall Thickness <span className="required">*</span></label>
                  <input
                    type="text"
                    id="eq-customThickness"
                    name="customThickness"
                    value={formData.customThickness}
                    onChange={handleChange}
                    placeholder="e.g. 1.25 mm or Schedule 40S"
                  />
                  {errors.customThickness && <span className="field-error" style={{ color: '#EF4444', fontSize: '12px' }}>{errors.customThickness}</span>}
                </div>
              )}

              {formData.standard === 'Custom' && (
                <div className="form-group" style={{ marginBottom: '12px' }}>
                  <label htmlFor="eq-customStandard">Custom Standard / Requirement <span className="required">*</span></label>
                  <input
                    type="text"
                    id="eq-customStandard"
                    name="customStandard"
                    value={formData.customStandard}
                    onChange={handleChange}
                    placeholder="e.g. Client Drawing DWG-2026 / ISO 1127"
                  />
                  {errors.customStandard && <span className="field-error" style={{ color: '#EF4444', fontSize: '12px' }}>{errors.customStandard}</span>}
                </div>
              )}

              <div className="form-row">
                <div className="form-group" style={{ flex: '2 1 180px' }}>
                  <label htmlFor="eq-quantity">
                    Required Quantity <span className="required">*</span>
                  </label>
                  <input
                    ref={isAuthenticated ? firstInputRef : null}
                    type="number"
                    id="eq-quantity"
                    name="quantity"
                    min="0.1"
                    step="any"
                    value={formData.quantity}
                    onChange={handleChange}
                    required
                    placeholder="e.g. 50"
                  />
                  {errors.quantity && <span className="field-error" style={{ color: '#EF4444', fontSize: '12px' }}>{errors.quantity}</span>}
                </div>

                <div className="form-group" style={{ flex: '1 1 120px' }}>
                  <label htmlFor="eq-unit">Unit <span className="required">*</span></label>
                  <select
                    id="eq-unit"
                    name="unit"
                    value={formData.unit}
                    onChange={handleChange}
                  >
                    {UNITS_OF_MEASUREMENT.map((u) => (
                      <option key={u.value} value={u.value}>
                        {u.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group" style={{ flex: '3 1 200px' }}>
                  <label htmlFor="eq-location">
                    Delivery Destination <span className="required">*</span>
                  </label>
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
              </div>

              <div className="form-group">
                <label htmlFor="eq-notes">Additional Dimensions or Technical Requirements (Optional)</label>
                <textarea
                  id="eq-notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows={2}
                  placeholder="Surface finish requirements (e.g. Ra ≤ 0.38µm), end connection types, or inspection certifications needed..."
                ></textarea>
              </div>

              {/* Cloudflare Turnstile Bot Protection: Rendered exclusively for Anonymous Visitors */}
              {!isAuthenticated && (
                <div className="turnstile-section" style={{ marginTop: '10px' }}>
                  <div style={{ fontSize: '12px', color: '#64748B', marginBottom: '4px' }}>
                    Security verification:
                  </div>
                  <TurnstileWidget
                    onVerify={(token) => {
                      setTurnstileToken(token);
                      setTurnstileError(null);
                      if (errors.turnstile) {
                        setErrors((prev) => ({ ...prev, turnstile: null }));
                      }
                    }}
                    onExpire={() => {
                      setTurnstileToken('');
                      setTurnstileError('Verification expired. Please verify again.');
                    }}
                    onError={() => {
                      setTurnstileToken('');
                      setTurnstileError('Verification failed to load. Please retry.');
                    }}
                    resetKey={turnstileResetKey}
                  />
                  {errors.turnstile && (
                    <span className="field-error" style={{ color: '#EF4444', fontSize: '12px', display: 'block', marginTop: '-8px', marginBottom: '8px' }}>
                      {errors.turnstile}
                    </span>
                  )}
                </div>
              )}

              <div style={{ fontSize: '12px', color: '#64748B', margin: '12px 0' }}>
                ℹ️ Official commercial quotation with itemized pricing and lead times will be dispatched promptly.
              </div>

              <div className="form-actions" style={{ position: 'relative' }}>
                <button
                  type="submit"
                  className="btn btn--primary btn--block btn--lg"
                  id="eq-submit-btn"
                  disabled={isLoading || (!isAuthenticated && !turnstileToken)}
                  style={{
                    opacity: isLoading || (!isAuthenticated && !turnstileToken) ? 0.75 : 1,
                    cursor: isLoading || (!isAuthenticated && !turnstileToken) ? 'not-allowed' : 'pointer'
                  }}
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
