import React, { useState, useEffect, useRef } from 'react';
import { apiService } from '../../services/api';
import { Loader } from '../common/Loader';
import { CONFIG } from '../../data/siteData';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import TurnstileWidget from '../common/TurnstileWidget';
import {
  MATERIAL_GRADES,
  NOMINAL_SIZES,
  WALL_THICKNESSES,
  UNITS_OF_MEASUREMENT,
  getSpecsForCategory
} from '../../data/productSpecsConfig';

/**
 * Lotus Tubes - Premium Industrial Quotation Modal (Light Theme)
 * Features:
 * - Clean white (#FFFFFF) & subtle slate (#F8FAFC) aesthetics with dark (#111827) readable typography
 * - Structured 4-section layout:
 *   Section A: Product Specifications
 *   Section B: Quantity Requirements
 *   Section C: Delivery Information
 *   Section D: Customer Information
 * - High-contrast form labels, dropdowns, inputs, and placeholders
 * - 24-hour turnaround commitment & automated customer acknowledgement
 */
export const QuickEnquiryModal = ({ isOpen, onClose, product, onSuccess }) => {
  const { user, isAuthenticated } = useAuth();
  const { t, currentLang } = useLanguage();

  const categorySpecs = getSpecsForCategory(product?.category || product?.name || 'Sanitary Pipes');

  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    country: 'India',
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

    const timer = setTimeout(() => {
      if (firstInputRef.current) {
        firstInputRef.current.focus();
      }
    }, 120);

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
        country: isAuthenticated && user?.country ? user.country : (prev.country || 'India'),
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

    // Section D: Customer Profile Validation
    if (!isAuthenticated) {
      if (!formData.name.trim()) errs.name = 'Please enter your full name';
      if (!formData.company.trim()) errs.company = 'Please enter your company or business name';
      if (!formData.email.trim() || !/^\S+@\S+\.\S+$/.test(formData.email)) {
        errs.email = 'Please provide a valid business email address';
      }
      if (!formData.phone.trim() || formData.phone.length < 7) {
        errs.phone = 'Please enter a valid phone or WhatsApp number with country code';
      }
      if (!formData.country.trim()) errs.country = 'Please select or enter your country';
    } else {
      if (!user?.phone && (!formData.phone || formData.phone.trim().length < 7)) {
        errs.phone = 'Please provide a contact phone/WhatsApp number for quotation delivery';
      }
      if (!user?.company && (!formData.company || !formData.company.trim())) {
        errs.company = 'Please specify your company or organization';
      }
    }

    // Section A & B: Product Specifications & Quantity
    if (!formData.quantity || String(formData.quantity).trim() === '') {
      errs.quantity = 'Please specify required quantity (e.g. 50 meters, 200 pcs)';
    }

    if (formData.nominalSize === 'Custom Size' && !formData.customSize.trim()) {
      errs.customSize = 'Please specify your custom dimensions';
    }

    if (formData.wallThickness === 'Custom' && categorySpecs.hasThickness && !formData.customThickness.trim()) {
      errs.customThickness = 'Please specify your required custom wall thickness';
    }

    // Section C: Delivery Destination
    if (!formData.location.trim()) {
      errs.location = 'Please specify delivery destination city, state or port';
    }

    // Cloudflare Turnstile validation for anonymous visitors
    if (!isAuthenticated && !turnstileToken) {
      errs.turnstile = 'Please complete the Cloudflare security verification check.';
      setTurnstileError('Please verify you are human before submitting.');
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
        country: formData.country,
        notes: formData.notes,
        finish: formData.finish,
        sizes: `${selectedSize} (${outsideDiameter || ''}) x ${selectedThickness}`,
        language: currentLang,
        ...(!isAuthenticated
          ? {
              name: formData.name,
              company: formData.company,
              email: formData.email,
              phone: formData.phone,
              country: formData.country,
              turnstileToken
            }
          : {
              ...(formData.phone ? { phone: formData.phone } : {}),
              ...(formData.company ? { company: formData.company } : {}),
              ...(formData.country ? { country: formData.country } : {})
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
          country: payload.country || user?.country || 'India',
          reference
        });
        if (onSuccess) onSuccess(reference, payload);
      } else {
        throw new Error(res?.message || 'Quotation submission failed. Please try again.');
      }
    } catch (err) {
      console.error('Error submitting quotation request:', err);
      setSubmitError(err.message || 'Server error occurred while submitting quotation. Please try again.');
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

  // Shared light-theme style constants
  const inputStyle = {
    width: '100%',
    padding: '10px 14px',
    fontSize: '14px',
    color: '#111827',
    backgroundColor: '#FFFFFF',
    border: '1px solid #D1D5DB',
    borderRadius: '8px',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 0.15s, box-shadow 0.15s'
  };

  const labelStyle = {
    display: 'block',
    fontSize: '13px',
    fontWeight: 600,
    color: '#1F2937',
    marginBottom: '6px'
  };

  const sectionBoxStyle = {
    background: '#F8FAFC',
    border: '1px solid #E2E8F0',
    borderRadius: '12px',
    padding: '20px',
    marginBottom: '20px'
  };

  const sectionHeaderStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '16px',
    paddingBottom: '10px',
    borderBottom: '1px solid #E2E8F0'
  };

  const pillNumberStyle = {
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    background: '#0284C7',
    color: '#FFFFFF',
    fontSize: '12px',
    fontWeight: 700,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0
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
        backgroundColor: 'rgba(15, 23, 42, 0.75)',
        backdropFilter: 'blur(6px)',
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
          maxWidth: '880px',
          width: '100%',
          maxHeight: '92vh',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          border: '1px solid #E2E8F0',
          color: '#111827',
          overflow: 'hidden'
        }}
      >
        {/* Sticky Header */}
        <div
          style={{
            padding: '20px 28px',
            backgroundColor: '#FFFFFF',
            borderBottom: '1px solid #E5E7EB',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'sticky',
            top: 0,
            zIndex: 10
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  color: '#0284C7',
                  backgroundColor: '#E0F2FE',
                  padding: '3px 10px',
                  borderRadius: '9999px'
                }}
              >
                Lotus Tubes Commercial Desk
              </span>
              <span style={{ fontSize: '12px', color: '#64748B' }}>•</span>
              <span style={{ fontSize: '12px', color: '#16A34A', fontWeight: 600 }}>
                ⏱️ 24h Official Quotation Turnaround
              </span>
            </div>
            <h3 id="quick-enquiry-title" style={{ margin: '6px 0 0 0', fontSize: '1.35rem', fontWeight: 700, color: '#0F172A' }}>
              Request Official Quotation
            </h3>
            <p style={{ margin: '2px 0 0 0', fontSize: '13px', color: '#64748B' }}>
              Hygienic Process Piping, Fittings &amp; Valves • ASME BPE &bull; DIN 11850 &bull; ASTM A270
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              border: '1px solid #E2E8F0',
              background: '#F8FAFC',
              color: '#64748B',
              fontSize: '22px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              lineHeight: 1,
              transition: 'background-color 0.15s, color 0.15s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#F1F5F9';
              e.currentTarget.style.color = '#0F172A';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#F8FAFC';
              e.currentTarget.style.color = '#64748B';
            }}
          >
            &times;
          </button>
        </div>

        {/* Scrollable Body */}
        <div style={{ padding: '24px 28px', overflowY: 'auto', flex: 1, backgroundColor: '#FFFFFF' }}>
          {successRef ? (
            /* ============================================================ */
            /* SUCCESS CONFIRMATION STATE                                   */
            /* ============================================================ */
            <div style={{ padding: '16px 8px', textAlign: 'center' }}>
              <div
                style={{
                  width: '68px',
                  height: '68px',
                  borderRadius: '50%',
                  background: '#DCFCE7',
                  color: '#15803D',
                  fontSize: '34px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px auto',
                  boxShadow: '0 4px 12px rgba(21, 128, 61, 0.15)'
                }}
              >
                ✓
              </div>

              <h4 style={{ color: '#0F172A', fontSize: '1.45rem', fontWeight: 700, margin: '0 0 8px 0' }}>
                Quotation Request Confirmed
              </h4>

              <div
                style={{
                  display: 'inline-block',
                  background: '#EFF6FF',
                  border: '1px solid #BFDBFE',
                  borderRadius: '9999px',
                  padding: '6px 16px',
                  marginBottom: '18px'
                }}
              >
                <span style={{ fontSize: '12px', color: '#1E40AF', fontWeight: 600 }}>Quotation Reference: </span>
                <strong style={{ fontSize: '15px', color: '#0284C7', fontFamily: 'monospace' }}>{successRef}</strong>
              </div>

              {/* High-Priority Turnaround Commitment Notice */}
              <div
                style={{
                  background: '#F0FDF4',
                  border: '1.5px solid #86EFAC',
                  borderRadius: '10px',
                  padding: '16px 20px',
                  maxWidth: '680px',
                  margin: '0 auto 24px auto',
                  textAlign: 'left'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <span style={{ fontSize: '18px' }}>⏱️</span>
                  <strong style={{ color: '#166534', fontSize: '14px' }}>
                    Commercial Review in Progress (Turnaround: Within 24 Hours)
                  </strong>
                </div>
                <p style={{ margin: 0, fontSize: '13px', color: '#15803D', lineHeight: 1.6 }}>
                  Your quotation request has been successfully submitted. Our commercial sales engineering team will review your requirements and send your formal quotation within <strong>24 hours</strong>. An automated confirmation email has also been dispatched to <strong>{submittedData?.email || user?.email}</strong>.
                </p>
              </div>

              {/* Submitted Specifications Card */}
              <div
                style={{
                  background: '#F8FAFC',
                  padding: '18px 24px',
                  borderRadius: '10px',
                  border: '1px solid #E2E8F0',
                  textAlign: 'left',
                  fontSize: '13px',
                  lineHeight: 1.7,
                  maxWidth: '680px',
                  margin: '0 auto 24px auto'
                }}
              >
                <div style={{ fontWeight: 700, color: '#0F172A', marginBottom: '8px', fontSize: '14px', borderBottom: '1px solid #E2E8F0', paddingBottom: '6px' }}>
                  Submitted Specification Summary
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '8px 16px' }}>
                  <div><span style={{ color: '#64748B' }}>Product:</span> <strong style={{ color: '#111827' }}>{product?.name || 'Sanitary Component'}</strong></div>
                  <div><span style={{ color: '#64748B' }}>Material Grade:</span> <strong style={{ color: '#111827' }}>{formData.grade}</strong></div>
                  <div><span style={{ color: '#64748B' }}>Dimensions:</span> <strong style={{ color: '#111827' }}>{formData.nominalSize} ({formData.wallThickness})</strong></div>
                  <div><span style={{ color: '#64748B' }}>Quantity:</span> <strong style={{ color: '#111827' }}>{submittedData?.quantity || formData.quantity} {formData.unit}</strong></div>
                  <div><span style={{ color: '#64748B' }}>Destination:</span> <strong style={{ color: '#111827' }}>{submittedData?.location || formData.location}</strong></div>
                  <div><span style={{ color: '#64748B' }}>Applicant:</span> <strong style={{ color: '#111827' }}>{submittedData?.name || user?.name} ({submittedData?.company || user?.company})</strong></div>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '20px' }}>
                <a
                  href="/sample-quotation.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn--primary btn--sm"
                  download={`LotusTubes-Quotation-${successRef}.pdf`}
                  style={{ padding: '10px 18px', fontSize: '13px', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                >
                  📥 Download Sample Quotation PDF
                </a>
                <a
                  href={`https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(
                    `Hello Lotus Tubes, I have submitted quotation request ${successRef} for ${product?.name || 'Sanitary Component'}. Please review and update me.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn--whatsapp btn--sm"
                  style={{ padding: '10px 18px', fontSize: '13px', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                >
                  💬 WhatsApp Sales Desk
                </a>
                {isAuthenticated ? (
                  <a
                    href="#account"
                    onClick={onClose}
                    className="btn btn--outline-dark btn--sm"
                    style={{ padding: '10px 18px', fontSize: '13px' }}
                  >
                    View in Customer Account &rarr;
                  </a>
                ) : null}
              </div>

              <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: '16px' }}>
                <button
                  type="button"
                  onClick={onClose}
                  style={{
                    background: '#F1F5F9',
                    border: '1px solid #CBD5E1',
                    borderRadius: '8px',
                    color: '#475569',
                    padding: '8px 24px',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Done • Close Window
                </button>
              </div>
            </div>
          ) : (
            /* ============================================================ */
            /* ACTIVE FORM STATE (LIGHT THEMED)                             */
            /* ============================================================ */
            <form id="quick-enquiry-form" onSubmit={handleSubmit} noValidate>
              {/* Product Context Banner */}
              {product && (
                <div
                  style={{
                    marginBottom: '20px',
                    padding: '14px 18px',
                    background: '#F8FAFC',
                    borderRadius: '10px',
                    border: '1px solid #E2E8F0',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '16px'
                  }}
                >
                  <div>
                    <span
                      style={{
                        fontSize: '11px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.06em',
                        color: '#0284C7',
                        fontWeight: 700
                      }}
                    >
                      Selected Product
                    </span>
                    <h4 style={{ margin: '2px 0 0 0', color: '#0F172A', fontSize: '1.05rem', fontWeight: 700 }}>
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
                        width: '56px',
                        height: '56px',
                        objectFit: 'cover',
                        borderRadius: '8px',
                        border: '1px solid #E2E8F0',
                        backgroundColor: '#FFFFFF',
                        flexShrink: 0
                      }}
                    />
                  )}
                </div>
              )}

              {/* Submission Error Banner */}
              {submitError && (
                <div
                  style={{
                    marginBottom: '18px',
                    padding: '12px 16px',
                    background: '#FEF2F2',
                    border: '1px solid #FECACA',
                    borderRadius: '8px',
                    fontSize: '13px',
                    color: '#B91C1C',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <span>⚠️</span>
                  <span>{submitError}</span>
                </div>
              )}

              {/* ========================================================== */}
              {/* SECTION A: PRODUCT SPECIFICATIONS                          */}
              {/* ========================================================== */}
              <div style={sectionBoxStyle}>
                <div style={sectionHeaderStyle}>
                  <div style={pillNumberStyle}>A</div>
                  <h4 style={{ margin: 0, fontSize: '14px', fontWeight: 700, color: '#0F172A', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Product Specifications
                  </h4>
                  <span style={{ fontSize: '12px', color: '#64748B', marginLeft: 'auto' }}>
                    Material, dimensions &amp; standards
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '16px' }}>
                  {/* Material Grade */}
                  <div>
                    <label htmlFor="eq-grade" style={labelStyle}>
                      Material Grade <span style={{ color: '#DC2626' }}>*</span>
                    </label>
                    <select
                      id="eq-grade"
                      name="grade"
                      value={formData.grade}
                      onChange={handleChange}
                      style={inputStyle}
                    >
                      {MATERIAL_GRADES.map((m) => (
                        <option key={m.value} value={m.value} style={{ color: '#111827', backgroundColor: '#FFFFFF' }}>
                          {m.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Nominal Size & OD */}
                  <div>
                    <label htmlFor="eq-nominalSize" style={labelStyle}>
                      Nominal Size &amp; Outside Diameter <span style={{ color: '#DC2626' }}>*</span>
                    </label>
                    <select
                      id="eq-nominalSize"
                      name="nominalSize"
                      value={formData.nominalSize}
                      onChange={handleChange}
                      style={inputStyle}
                    >
                      {NOMINAL_SIZES.map((s) => (
                        <option key={s.value} value={s.value} style={{ color: '#111827', backgroundColor: '#FFFFFF' }}>
                          {s.nominal} {s.odMm !== 'Custom' ? `(OD: ${s.odMm})` : '(Custom Dimension)'}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Custom Size field if selected */}
                {formData.nominalSize === 'Custom Size' && (
                  <div style={{ marginBottom: '16px' }}>
                    <label htmlFor="eq-customSize" style={labelStyle}>
                      Custom Size / Dimensional Drawing Requirements <span style={{ color: '#DC2626' }}>*</span>
                    </label>
                    <input
                      type="text"
                      id="eq-customSize"
                      name="customSize"
                      value={formData.customSize}
                      onChange={handleChange}
                      placeholder="e.g. 5 inch OD (127mm) / customized drawing DWG-2026"
                      style={inputStyle}
                    />
                    {errors.customSize && <span style={{ color: '#DC2626', fontSize: '12px', marginTop: '4px', display: 'block' }}>{errors.customSize}</span>}
                  </div>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
                  {/* Wall Thickness or End Connection */}
                  <div>
                    <label htmlFor="eq-wallThickness" style={labelStyle}>
                      {categorySpecs.hasThickness ? 'Wall Thickness' : 'End Connection Type'} <span style={{ color: '#64748B', fontWeight: 400 }}>(Standard)</span>
                    </label>
                    {categorySpecs.hasThickness ? (
                      <select
                        id="eq-wallThickness"
                        name="wallThickness"
                        value={formData.wallThickness}
                        onChange={handleChange}
                        style={inputStyle}
                      >
                        {WALL_THICKNESSES.map((w) => (
                          <option key={w.value} value={w.value} style={{ color: '#111827', backgroundColor: '#FFFFFF' }}>
                            {w.label}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type="text"
                        id="eq-wallThickness"
                        name="wallThickness"
                        value={formData.wallThickness}
                        onChange={handleChange}
                        placeholder="e.g. Tri-Clamp, SMS, DIN, Welded"
                        style={inputStyle}
                      />
                    )}
                  </div>

                  {/* Applicable Standard */}
                  <div>
                    <label htmlFor="eq-standard" style={labelStyle}>
                      Applicable Standard
                    </label>
                    <select
                      id="eq-standard"
                      name="standard"
                      value={formData.standard}
                      onChange={handleChange}
                      style={inputStyle}
                    >
                      {categorySpecs.standards.map((st) => (
                        <option key={st.value} value={st.value} style={{ color: '#111827', backgroundColor: '#FFFFFF' }}>
                          {st.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {formData.wallThickness === 'Custom' && categorySpecs.hasThickness && (
                  <div style={{ marginTop: '16px' }}>
                    <label htmlFor="eq-customThickness" style={labelStyle}>
                      Custom Wall Thickness <span style={{ color: '#DC2626' }}>*</span>
                    </label>
                    <input
                      type="text"
                      id="eq-customThickness"
                      name="customThickness"
                      value={formData.customThickness}
                      onChange={handleChange}
                      placeholder="e.g. 1.25 mm or Schedule 40S"
                      style={inputStyle}
                    />
                    {errors.customThickness && <span style={{ color: '#DC2626', fontSize: '12px', marginTop: '4px', display: 'block' }}>{errors.customThickness}</span>}
                  </div>
                )}

                {formData.standard === 'Custom' && (
                  <div style={{ marginTop: '16px' }}>
                    <label htmlFor="eq-customStandard" style={labelStyle}>
                      Custom Standard / Requirement <span style={{ color: '#DC2626' }}>*</span>
                    </label>
                    <input
                      type="text"
                      id="eq-customStandard"
                      name="customStandard"
                      value={formData.customStandard}
                      onChange={handleChange}
                      placeholder="e.g. ISO 1127 / Client Specification Standard"
                      style={inputStyle}
                    />
                    {errors.customStandard && <span style={{ color: '#DC2626', fontSize: '12px', marginTop: '4px', display: 'block' }}>{errors.customStandard}</span>}
                  </div>
                )}
              </div>

              {/* ========================================================== */}
              {/* SECTION B: QUANTITY REQUIREMENTS                           */}
              {/* ========================================================== */}
              <div style={sectionBoxStyle}>
                <div style={sectionHeaderStyle}>
                  <div style={pillNumberStyle}>B</div>
                  <h4 style={{ margin: 0, fontSize: '14px', fontWeight: 700, color: '#0F172A', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Quantity Requirements
                  </h4>
                  <span style={{ fontSize: '12px', color: '#64748B', marginLeft: 'auto' }}>
                    Commercial volume &amp; unit
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px' }}>
                  <div>
                    <label htmlFor="eq-quantity" style={labelStyle}>
                      Required Quantity <span style={{ color: '#DC2626' }}>*</span>
                    </label>
                    <input
                      type="number"
                      id="eq-quantity"
                      name="quantity"
                      min="0.1"
                      step="any"
                      value={formData.quantity}
                      onChange={handleChange}
                      required
                      placeholder="e.g. 50"
                      style={inputStyle}
                    />
                    {errors.quantity && <span style={{ color: '#DC2626', fontSize: '12px', marginTop: '4px', display: 'block' }}>{errors.quantity}</span>}
                  </div>

                  <div>
                    <label htmlFor="eq-unit" style={labelStyle}>
                      Unit of Measure <span style={{ color: '#DC2626' }}>*</span>
                    </label>
                    <select
                      id="eq-unit"
                      name="unit"
                      value={formData.unit}
                      onChange={handleChange}
                      style={inputStyle}
                    >
                      {UNITS_OF_MEASUREMENT.map((u) => (
                        <option key={u.value} value={u.value} style={{ color: '#111827', backgroundColor: '#FFFFFF' }}>
                          {u.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* ========================================================== */}
              {/* SECTION C: DELIVERY INFORMATION                            */}
              {/* ========================================================== */}
              <div style={sectionBoxStyle}>
                <div style={sectionHeaderStyle}>
                  <div style={pillNumberStyle}>C</div>
                  <h4 style={{ margin: 0, fontSize: '14px', fontWeight: 700, color: '#0F172A', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Delivery Information
                  </h4>
                  <span style={{ fontSize: '12px', color: '#64748B', marginLeft: 'auto' }}>
                    Destination &amp; custom engineering notes
                  </span>
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label htmlFor="eq-location" style={labelStyle}>
                    Delivery Destination (City, State / Port) <span style={{ color: '#DC2626' }}>*</span>
                  </label>
                  <input
                    type="text"
                    id="eq-location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    required
                    placeholder="e.g. Mumbai, India or Dubai, UAE"
                    style={inputStyle}
                  />
                  {errors.location && <span style={{ color: '#DC2626', fontSize: '12px', marginTop: '4px', display: 'block' }}>{errors.location}</span>}
                </div>

                <div>
                  <label htmlFor="eq-notes" style={labelStyle}>
                    Additional Dimensions or Technical Requirements <span style={{ color: '#64748B', fontWeight: 400 }}>(Optional)</span>
                  </label>
                  <textarea
                    id="eq-notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows={2}
                    placeholder="e.g. Surface finish Ra ≤ 0.38µm, EN 10204 3.1 MTC inspection certification, special cleanroom packaging, or customized spools..."
                    style={{ ...inputStyle, minHeight: '64px', resize: 'vertical' }}
                  />
                </div>
              </div>

              {/* ========================================================== */}
              {/* SECTION D: CUSTOMER INFORMATION                            */}
              {/* ========================================================== */}
              <div style={sectionBoxStyle}>
                <div style={sectionHeaderStyle}>
                  <div style={pillNumberStyle}>D</div>
                  <h4 style={{ margin: 0, fontSize: '14px', fontWeight: 700, color: '#0F172A', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Customer Information
                  </h4>
                  <span style={{ fontSize: '12px', color: '#64748B', marginLeft: 'auto' }}>
                    Commercial contact &amp; proposal delivery
                  </span>
                </div>

                {isAuthenticated ? (
                  <div
                    style={{
                      padding: '14px 18px',
                      background: '#F0FDF4',
                      border: '1px solid #BBF7D0',
                      borderRadius: '8px',
                      marginBottom: '16px',
                      fontSize: '13px'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#166534', fontWeight: 700, marginBottom: '6px' }}>
                      <span>✓</span>
                      <span>Verified Authenticated Customer Session</span>
                    </div>
                    <div style={{ color: '#374151', lineHeight: 1.6 }}>
                      <div><strong>Customer Name:</strong> {user?.name}</div>
                      <div><strong>Email:</strong> {user?.email}</div>
                      {user?.company && <div><strong>Company:</strong> {user.company}</div>}
                      {user?.phone && <div><strong>Phone:</strong> {user.phone}</div>}
                    </div>
                  </div>
                ) : null}

                {/* Show fields if not authenticated OR if authenticated user has missing phone/company */}
                {(!isAuthenticated || !user?.phone || !user?.company) && (
                  <>
                    {!isAuthenticated && (
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '16px' }}>
                        <div>
                          <label htmlFor="eq-name" style={labelStyle}>
                            Customer Full Name <span style={{ color: '#DC2626' }}>*</span>
                          </label>
                          <input
                            ref={firstInputRef}
                            type="text"
                            id="eq-name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            placeholder="e.g. Ramesh Patel"
                            style={inputStyle}
                          />
                          {errors.name && <span style={{ color: '#DC2626', fontSize: '12px', marginTop: '4px', display: 'block' }}>{errors.name}</span>}
                        </div>

                        <div>
                          <label htmlFor="eq-company" style={labelStyle}>
                            Company / Organization Name <span style={{ color: '#DC2626' }}>*</span>
                          </label>
                          <input
                            type="text"
                            id="eq-company"
                            name="company"
                            value={formData.company}
                            onChange={handleChange}
                            required
                            placeholder="e.g. BioPharma Process Ltd"
                            style={inputStyle}
                          />
                          {errors.company && <span style={{ color: '#DC2626', fontSize: '12px', marginTop: '4px', display: 'block' }}>{errors.company}</span>}
                        </div>
                      </div>
                    )}

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '16px' }}>
                      {!isAuthenticated && (
                        <div>
                          <label htmlFor="eq-email" style={labelStyle}>
                            Business Email <span style={{ color: '#DC2626' }}>*</span>
                          </label>
                          <input
                            type="email"
                            id="eq-email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            placeholder="procurement@company.com"
                            style={inputStyle}
                          />
                          {errors.email && <span style={{ color: '#DC2626', fontSize: '12px', marginTop: '4px', display: 'block' }}>{errors.email}</span>}
                        </div>
                      )}

                      {(!isAuthenticated || !user?.phone) && (
                        <div>
                          <label htmlFor="eq-phone" style={labelStyle}>
                            Phone / WhatsApp Number <span style={{ color: '#DC2626' }}>*</span>
                          </label>
                          <input
                            type="tel"
                            id="eq-phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                            placeholder="+91 98765 43210"
                            style={inputStyle}
                          />
                          {errors.phone && <span style={{ color: '#DC2626', fontSize: '12px', marginTop: '4px', display: 'block' }}>{errors.phone}</span>}
                        </div>
                      )}

                      <div>
                        <label htmlFor="eq-country" style={labelStyle}>
                          Country <span style={{ color: '#DC2626' }}>*</span>
                        </label>
                        <input
                          type="text"
                          id="eq-country"
                          name="country"
                          value={formData.country}
                          onChange={handleChange}
                          required
                          placeholder="India / UAE / Singapore"
                          style={inputStyle}
                        />
                        {errors.country && <span style={{ color: '#DC2626', fontSize: '12px', marginTop: '4px', display: 'block' }}>{errors.country}</span>}
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Bot Security: Cloudflare Turnstile */}
              {!isAuthenticated && (
                <div style={{ marginBottom: '16px', padding: '14px', background: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                  <div style={{ fontSize: '12px', fontWeight: 600, color: '#475569', marginBottom: '8px' }}>
                    Security verification (Anti-Bot Protection):
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
                  {turnstileError && (
                    <span style={{ color: '#DC2626', fontSize: '12px', marginTop: '4px', display: 'block' }}>
                      {turnstileError}
                    </span>
                  )}
                </div>
              )}
            </form>
          )}
        </div>

        {/* Sticky Footer */}
        {!successRef && (
          <div
            style={{
              padding: '16px 28px',
              backgroundColor: '#F8FAFC',
              borderTop: '1px solid #E5E7EB',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '16px',
              position: 'sticky',
              bottom: 0,
              zIndex: 10
            }}
          >
            <div style={{ fontSize: '12px', color: '#64748B', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>🛡️</span>
              <span>Commercial team reviews &amp; sends quotation within 24 hours.</span>
            </div>

            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <button
                type="button"
                onClick={onClose}
                style={{
                  padding: '10px 18px',
                  borderRadius: '8px',
                  border: '1px solid #D1D5DB',
                  background: '#FFFFFF',
                  color: '#475569',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isLoading || (!isAuthenticated && !turnstileToken)}
                style={{
                  padding: '10px 24px',
                  borderRadius: '8px',
                  border: 'none',
                  background: '#0284C7',
                  color: '#FFFFFF',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: isLoading || (!isAuthenticated && !turnstileToken) ? 'not-allowed' : 'pointer',
                  opacity: isLoading || (!isAuthenticated && !turnstileToken) ? 0.75 : 1,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 2px 4px rgba(2, 132, 199, 0.2)'
                }}
              >
                {isLoading ? (
                  <Loader variant="button" size="sm" color="#FFFFFF" label="Submitting Request..." />
                ) : (
                  <span>Request Official Quotation &rarr;</span>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuickEnquiryModal;
