import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { Loader } from '../components/common/Loader';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { CONFIG } from '../data/siteData';
import TurnstileWidget from '../components/common/TurnstileWidget';
import {
  MATERIAL_GRADES,
  NOMINAL_SIZES,
  WALL_THICKNESSES,
  UNITS_OF_MEASUREMENT,
  getSpecsForCategory
} from '../data/productSpecsConfig';

export const QuoteView = ({ onNotify }) => {
  const { user, isAuthenticated } = useAuth();
  const { t, currentLang } = useLanguage();

  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    category: 'Sanitary Pipes & Tubes',
    material: 'SS 316L',
    productType: 'Electro Round Polish Pipe',
    nominalSize: '1" (25.4mm OD)',
    customSize: '',
    wallThickness: '1.65 mm',
    customThickness: '',
    standard: 'ASTM A270',
    customStandard: '',
    quantity: '100',
    unit: 'Meter',
    destination: '',
    specs: ''
  });

  const [turnstileToken, setTurnstileToken] = useState('');
  const [turnstileResetKey, setTurnstileResetKey] = useState(0);
  const [turnstileError, setTurnstileError] = useState(null);

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [successCode, setSuccessCode] = useState(null);

  // Synchronize authenticated customer details
  useEffect(() => {
    if (user && isAuthenticated) {
      setFormData((prev) => ({
        ...prev,
        name: user.name || prev.name || '',
        company: user.company || prev.company || '',
        email: user.email || prev.email || '',
        phone: user.phone || prev.phone || ''
      }));
    }
  }, [user, isAuthenticated]);

  // Derive specs configuration for active category
  const activeCategorySpecs = getSpecsForCategory(formData.category);

  // Update productType, standard, and default unit when category changes
  const handleCategoryChange = (e) => {
    const newCategory = e.target.value;
    const newSpecs = getSpecsForCategory(newCategory);
    setFormData((prev) => ({
      ...prev,
      category: newCategory,
      productType: newSpecs.itemTypes[0]?.value || '',
      standard: newSpecs.standards[0]?.value || '',
      unit: newSpecs.defaultUnit || 'Pieces',
      customStandard: '',
      customSize: '',
      customThickness: ''
    }));
  };

  const validate = () => {
    const errs = {};

    // Customer Identity Validation
    if (!isAuthenticated) {
      if (!formData.name.trim()) errs.name = 'Full name is required';
      if (!formData.company.trim()) errs.company = 'Company / Factory name is required';
      if (!formData.email.trim() || !/^\S+@\S+\.\S+$/.test(formData.email)) {
        errs.email = 'Valid business email is required';
      }
      if (!formData.phone.trim() || formData.phone.length < 7) {
        errs.phone = 'Valid phone / WhatsApp number is required';
      }
    } else {
      if (!user?.phone && (!formData.phone || formData.phone.trim().length < 7)) {
        errs.phone = 'Please provide contact phone/WhatsApp number for quotation delivery';
      }
      if (!user?.company && (!formData.company || !formData.company.trim())) {
        errs.company = 'Please specify company name';
      }
    }

    // Product Specifications Validation
    if (!formData.quantity || isNaN(Number(formData.quantity)) || Number(formData.quantity) <= 0) {
      errs.quantity = 'Please enter a valid positive quantity';
    }

    if (!formData.destination.trim()) {
      errs.destination = 'Delivery destination city/country is required';
    }

    if (formData.nominalSize === 'Custom Size' && !formData.customSize.trim()) {
      errs.customSize = 'Please specify your custom outside diameter or dimensions';
    }

    if (formData.wallThickness === 'Custom' && !formData.customThickness.trim()) {
      errs.customThickness = 'Please enter the required custom wall thickness';
    }

    if (formData.standard === 'Custom' && !formData.customStandard.trim()) {
      errs.customStandard = 'Please specify your custom standard or drawing requirement';
    }

    // Cloudflare Turnstile Verification for Anonymous Visitors
    if (!isAuthenticated && !turnstileToken) {
      errs.turnstile = 'Please complete the Cloudflare security verification check.';
      setTurnstileError('Security verification required.');
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
      const selectedSize = formData.nominalSize === 'Custom Size' ? formData.customSize : formData.nominalSize;
      const selectedThickness = formData.wallThickness === 'Custom' ? formData.customThickness : formData.wallThickness;
      const selectedStandard = formData.standard === 'Custom' ? formData.customStandard : formData.standard;

      // Find exact outside diameter from nominal sizes table
      const matchedSizeObj = NOMINAL_SIZES.find((s) => s.value === formData.nominalSize);
      const outsideDiameter = matchedSizeObj && matchedSizeObj.odMm !== 'Custom' ? matchedSizeObj.odMm : formData.customSize;

      const payload = {
        name: formData.name,
        company: formData.company,
        email: formData.email,
        phone: formData.phone,
        location: formData.destination,
        projectType: formData.category,
        materialGrade: formData.material,
        productType: formData.productType,
        nominalSize: selectedSize,
        outsideDiameter: outsideDiameter || '',
        wallThickness: selectedThickness || '',
        standard: selectedStandard || '',
        quantity: formData.quantity,
        unit: formData.unit,
        timeline: 'Standard (1-2 Weeks)',
        language: currentLang,
        boqSummary: `Product: ${formData.category} (${formData.productType})\nGrade: ${formData.material}\nSize / OD: ${selectedSize} (${outsideDiameter || ''})\nWall: ${selectedThickness}\nStandard: ${selectedStandard}\nQuantity: ${formData.quantity} ${formData.unit}\nDestination: ${formData.destination}\nRemarks: ${formData.specs}`,
        ...(!isAuthenticated ? { turnstileToken } : {})
      };

      const res = await apiService.submitQuote(payload);

      if (res?.success) {
        const code = res.data?.reference || `LT-BOQ-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
        setSuccessCode(code);
        if (onNotify) {
          onNotify(`Quotation request logged successfully! Reference: ${code}`, 'success');
        }
      } else {
        throw new Error(res?.message || 'Quotation request submission failed.');
      }
    } catch (err) {
      console.error('Quote submission error:', err);
      const errorMsg = err.message || 'Error communicating with quotation server. Please try again.';
      if (onNotify) {
        onNotify(errorMsg, 'danger');
      }
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
    <div>
      <section className="page-hero">
        <div className="site-container">
          <h1 className="page-hero-title">Request Official Commercial Quotation</h1>
          <p className="page-hero-subtitle">
            Configure exact product specifications, material grades, dimensions, applicable standards, or attach your Bill of Quantities (BOQ).
          </p>
        </div>
      </section>

      <div className="site-container section" style={{ maxWidth: '960px' }}>
        <div className="form-card" style={{ position: 'relative' }}>
          <div className="section-header" style={{ marginBottom: '24px' }}>
            <div>
              <span className="section-eyebrow">Engineering Quotation Desk</span>
              <h2 className="section-title" style={{ fontSize: '1.8rem' }}>
                Technical Specification & Official RFQ Submission
              </h2>
              <p className="section-subtitle">
                Commercial quotations are prepared by Lotus Tubes sales engineering with certified metallurgy traceability.
              </p>
            </div>
          </div>

          {successCode ? (
            <div id="full-rfq-success" className="form-success-box mt-3" style={{ display: 'block' }}>
              <div className="success-icon" style={{ fontSize: '42px', color: '#10B981', marginBottom: '8px' }}>✓</div>
              <h3 style={{ fontSize: '1.4rem', color: '#10263D', marginBottom: '6px' }}>
                Quotation Request Successfully Logged!
              </h3>
              <p>
                Your official reference number:{' '}
                <strong id="rfq-success-code" style={{ color: 'var(--primary-blue, #0284C7)', fontSize: '18px' }}>
                  {successCode}
                </strong>
              </p>
              <p style={{ color: '#475569', fontSize: '13px', lineHeight: 1.6 }}>
                Your request has been routed to our Mumbai sales engineering team. Upon review and mandatory Super Admin authorization, an official formal commercial quotation with itemized pricing, delivery lead times, and MTC documentation will be dispatched to your email address.
              </p>

              <div className="success-actions mt-3" style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <a
                  href="/sample-quotation.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn--primary"
                  download={`LotusTubes-Quote-${successCode}.pdf`}
                >
                  📥 Download Sample Quotation PDF
                </a>
                <a
                  href={`https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(
                    `Hello Lotus Tubes, I have submitted RFQ Quotation Request ${successCode}. Please review and update me with commercial terms.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn--whatsapp"
                >
                  <span>🟢 WhatsApp Desk ({successCode})</span>
                </a>
                {isAuthenticated && (
                  <a href="/account" className="btn btn--outline-dark">
                    View in My Customer Account &rarr;
                  </a>
                )}
                <button
                  type="button"
                  className="btn btn--secondary"
                  onClick={() => {
                    setSuccessCode(null);
                    setTurnstileToken('');
                    setTurnstileResetKey((k) => k + 1);
                  }}
                >
                  Submit Another RFQ
                </button>
              </div>

              <p style={{ fontSize: '11px', color: '#98A2B3', marginTop: '14px', fontStyle: 'italic' }}>
                Notice: All commercial quotations are subject to formal Super Admin approval and MTC metallurgy verification prior to final dispatch.
              </p>
            </div>
          ) : (
            <form id="full-rfq-form" onSubmit={handleSubmit} noValidate>
              {/* Authenticated Customer Information Card */}
              {isAuthenticated ? (
                <div
                  className="authenticated-customer-card"
                  style={{
                    marginBottom: '20px',
                    padding: '14px 18px',
                    background: '#F0FDF4',
                    border: '1px solid #BBF7D0',
                    borderRadius: '8px',
                    fontSize: '13px',
                    color: '#166534'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <span style={{ fontSize: '18px' }}>✓</span>
                    <span style={{ fontWeight: 700 }}>Authenticated Customer Session Active</span>
                  </div>
                  <div style={{ color: '#374151', fontSize: '13px', lineHeight: 1.6 }}>
                    <div><strong>Customer:</strong> {user?.name}</div>
                    <div><strong>Email:</strong> {user?.email}</div>
                    {user?.company && <div><strong>Company:</strong> {user.company}</div>}
                    {user?.phone && <div><strong>Phone / WhatsApp:</strong> {user.phone}</div>}
                  </div>
                  <div style={{ marginTop: '6px', fontSize: '11px', color: '#059669' }}>
                    Identity securely bound to your verified customer account.
                  </div>
                </div>
              ) : null}

              {/* 1. Customer & Business Information */}
              {!isAuthenticated && (
                <>
                  <h4 style={{ fontFamily: 'var(--font-heading)', color: 'var(--deep-navy)', marginBottom: '12px', borderBottom: '1.5px solid var(--border-color)', paddingBottom: '6px' }}>
                    1. Customer & Business Information
                  </h4>
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="rfq-name">Your Full Name <span className="required">*</span></label>
                      <input
                        type="text"
                        id="rfq-name"
                        name="name"
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
                        name="company"
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
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="procurement@company.com"
                      />
                      {errors.email && <span className="field-error" style={{ color: '#EF4444', fontSize: '12px' }}>{errors.email}</span>}
                    </div>
                    <div className="form-group">
                      <label htmlFor="rfq-phone">Phone / WhatsApp Number <span className="required">*</span></label>
                      <input
                        type="tel"
                        id="rfq-phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        placeholder="+91 98200 12345"
                      />
                      {errors.phone && <span className="field-error" style={{ color: '#EF4444', fontSize: '12px' }}>{errors.phone}</span>}
                    </div>
                  </div>
                </>
              )}

              {/* If authenticated but missing company or phone in profile */}
              {isAuthenticated && (!user?.phone || !user?.company) && (
                <div className="form-row" style={{ marginBottom: '16px' }}>
                  {!user?.company && (
                    <div className="form-group">
                      <label htmlFor="rfq-company">Company / Factory Name <span className="required">*</span></label>
                      <input
                        type="text"
                        id="rfq-company"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        required
                        placeholder="e.g. BioPharma Projects Pvt Ltd"
                      />
                      {errors.company && <span className="field-error" style={{ color: '#EF4444', fontSize: '12px' }}>{errors.company}</span>}
                    </div>
                  )}
                  {!user?.phone && (
                    <div className="form-group">
                      <label htmlFor="rfq-phone">Contact Phone / WhatsApp <span className="required">*</span></label>
                      <input
                        type="tel"
                        id="rfq-phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        placeholder="+91 98200 12345"
                      />
                      {errors.phone && <span className="field-error" style={{ color: '#EF4444', fontSize: '12px' }}>{errors.phone}</span>}
                    </div>
                  )}
                </div>
              )}

              {/* 2. Technical Product Specifications (Category-driven) */}
              <h4 style={{ fontFamily: 'var(--font-heading)', color: 'var(--deep-navy)', marginTop: '24px', marginBottom: '12px', borderBottom: '1.5px solid var(--border-color)', paddingBottom: '6px' }}>
                {isAuthenticated ? '1. Technical Product Specifications' : '2. Technical Product Specifications'}
              </h4>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="rfq-category">Product Category <span className="required">*</span></label>
                  <select
                    id="rfq-category"
                    name="category"
                    value={formData.category}
                    onChange={handleCategoryChange}
                  >
                    <option value="Sanitary Pipes & Tubes">Sanitary Pipes & Tubes (EP / MP)</option>
                    <option value="Sanitary Pipe Fittings">Sanitary Pipe Fittings (Bends, Tees, Reducers)</option>
                    <option value="Tri-Clamp Components">Tri-Clamp Components (Ferrules, Clamps, Unions)</option>
                    <option value="Sanitary Valves">Sanitary Valves (Manual & Pneumatic)</option>
                    <option value="Complete Process Line / BOQ">Complete Process Package / Mixed BOQ</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="rfq-material">Material Grade <span className="required">*</span></label>
                  <select
                    id="rfq-material"
                    name="material"
                    value={formData.material}
                    onChange={handleChange}
                  >
                    {MATERIAL_GRADES.map((m) => (
                      <option key={m.value} value={m.value}>
                        {m.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Product Type / Item Specific to Category */}
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="rfq-productType">Item / Product Type <span className="required">*</span></label>
                  <select
                    id="rfq-productType"
                    name="productType"
                    value={formData.productType}
                    onChange={handleChange}
                  >
                    {activeCategorySpecs.itemTypes.map((t) => (
                      <option key={t.value} value={t.value}>
                        {t.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="rfq-nominalSize">Nominal Size & Outside Diameter <span className="required">*</span></label>
                  <select
                    id="rfq-nominalSize"
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
                <div className="form-group" style={{ marginBottom: '16px' }}>
                  <label htmlFor="rfq-customSize">Specify Custom Nominal Size & Outside Diameter <span className="required">*</span></label>
                  <input
                    type="text"
                    id="rfq-customSize"
                    name="customSize"
                    value={formData.customSize}
                    onChange={handleChange}
                    placeholder="e.g. 5 inch OD (127mm) or customized tube drawing"
                  />
                  {errors.customSize && <span className="field-error" style={{ color: '#EF4444', fontSize: '12px' }}>{errors.customSize}</span>}
                </div>
              )}

              {/* Wall Thickness & Standards */}
              <div className="form-row">
                {activeCategorySpecs.hasThickness ? (
                  <div className="form-group">
                    <label htmlFor="rfq-wallThickness">Wall Thickness</label>
                    <select
                      id="rfq-wallThickness"
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
                    <label htmlFor="rfq-conn-type">Connection Standard End</label>
                    <input
                      type="text"
                      id="rfq-conn-type"
                      name="wallThickness"
                      value={formData.wallThickness}
                      onChange={handleChange}
                      placeholder="e.g. Tri-Clamp (TC) Ferrule End, SMS, DIN, Welded"
                    />
                  </div>
                )}

                <div className="form-group">
                  <label htmlFor="rfq-standard">Applicable Product Standard <span className="required">*</span></label>
                  <select
                    id="rfq-standard"
                    name="standard"
                    value={formData.standard}
                    onChange={handleChange}
                  >
                    {activeCategorySpecs.standards.map((st) => (
                      <option key={st.value} value={st.value}>
                        {st.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {formData.wallThickness === 'Custom' && activeCategorySpecs.hasThickness && (
                <div className="form-group" style={{ marginBottom: '16px' }}>
                  <label htmlFor="rfq-customThickness">Specify Custom Wall Thickness <span className="required">*</span></label>
                  <input
                    type="text"
                    id="rfq-customThickness"
                    name="customThickness"
                    value={formData.customThickness}
                    onChange={handleChange}
                    placeholder="e.g. 1.25 mm or Schedule 40S"
                  />
                  {errors.customThickness && <span className="field-error" style={{ color: '#EF4444', fontSize: '12px' }}>{errors.customThickness}</span>}
                </div>
              )}

              {formData.standard === 'Custom' && (
                <div className="form-group" style={{ marginBottom: '16px' }}>
                  <label htmlFor="rfq-customStandard">Specify Custom Compliance Standard or Drawing <span className="required">*</span></label>
                  <input
                    type="text"
                    id="rfq-customStandard"
                    name="customStandard"
                    value={formData.customStandard}
                    onChange={handleChange}
                    placeholder="e.g. Client Technical Specification DWG-2026 / ISO 1127"
                  />
                  {errors.customStandard && <span className="field-error" style={{ color: '#EF4444', fontSize: '12px' }}>{errors.customStandard}</span>}
                </div>
              )}

              {/* Quantity, Unit & Delivery Destination */}
              <div className="form-row">
                <div className="form-group" style={{ flex: '2 1 200px' }}>
                  <label htmlFor="rfq-quantity">Required Quantity <span className="required">*</span></label>
                  <input
                    type="number"
                    id="rfq-quantity"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleChange}
                    min="0.1"
                    step="any"
                    required
                    placeholder="e.g. 100"
                  />
                  {errors.quantity && <span className="field-error" style={{ color: '#EF4444', fontSize: '12px' }}>{errors.quantity}</span>}
                </div>

                <div className="form-group" style={{ flex: '1 1 140px' }}>
                  <label htmlFor="rfq-unit">Unit of Measure <span className="required">*</span></label>
                  <select
                    id="rfq-unit"
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

                <div className="form-group" style={{ flex: '3 1 240px' }}>
                  <label htmlFor="rfq-destination">Delivery Destination City & Country <span className="required">*</span></label>
                  <input
                    type="text"
                    id="rfq-destination"
                    name="destination"
                    value={formData.destination}
                    onChange={handleChange}
                    required
                    placeholder="e.g. Vapi, Gujarat or Dubai, UAE"
                  />
                  {errors.destination && <span className="field-error" style={{ color: '#EF4444', fontSize: '12px' }}>{errors.destination}</span>}
                </div>
              </div>

              {/* Additional Requirements / Remarks */}
              <div className="form-group">
                <label htmlFor="rfq-specs">Additional Dimensions, Technical Requirements, or BOQ Remarks</label>
                <textarea
                  id="rfq-specs"
                  name="specs"
                  rows={3}
                  value={formData.specs}
                  onChange={handleChange}
                  placeholder="Detail any surface roughness requirements (e.g. Ra ≤ 0.38µm), certification needs (EN 10204 3.1 MTC), or specific packaging requirements..."
                ></textarea>
              </div>

              {/* Cloudflare Turnstile Human Verification (Anonymous Visitors Only) */}
              {!isAuthenticated && (
                <div className="turnstile-section" style={{ margin: '18px 0 10px 0' }}>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                    Cloudflare Human Verification <span className="required">*</span>
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
                      setTurnstileError('Verification failed. Please retry.');
                    }}
                    resetKey={turnstileResetKey}
                  />
                  {errors.turnstile && (
                    <span className="field-error" style={{ color: '#EF4444', fontSize: '12px', display: 'block', marginTop: '-4px', marginBottom: '8px' }}>
                      {errors.turnstile}
                    </span>
                  )}
                </div>
              )}

              {/* Action Button */}
              <div className="form-actions mt-3">
                <button
                  type="submit"
                  className="btn btn--primary btn--block btn--lg"
                  disabled={isLoading || (!isAuthenticated && !turnstileToken)}
                  style={{
                    opacity: isLoading || (!isAuthenticated && !turnstileToken) ? 0.75 : 1,
                    cursor: isLoading || (!isAuthenticated && !turnstileToken) ? 'not-allowed' : 'pointer'
                  }}
                >
                  {isLoading ? (
                    <Loader variant="button" size="sm" color="#FFFFFF" label="Submitting quotation request..." />
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

export default QuoteView;
