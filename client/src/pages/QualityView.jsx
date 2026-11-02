import React, { useState } from 'react';
import { apiService } from '../services/api';
import PageHero from '../components/common/PageHero';
import { Loader } from '../components/common/Loader';

export const QualityView = () => {
  const [formData, setFormData] = useState({
    company: '',
    email: '',
    product: '',
    docType: 'EN 10204 3.1 MTC'
  });
  const [status, setStatus] = useState({ state: 'idle', message: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.company || !formData.email) {
      setStatus({ state: 'error', message: 'Please enter both company name and a valid email address.' });
      return;
    }
    setStatus({ state: 'submitting', message: 'Submitting request...' });
    try {
      await apiService.submitEnquiry({
        name: formData.company,
        email: formData.email,
        phone: 'N/A',
        company: formData.company,
        productName: formData.product || 'Quality Documentation Request',
        notes: `Document Type Requested: ${formData.docType}`
      });
      setStatus({
        state: 'success',
        message: 'Your technical document request has been received. Our QC desk will verify and dispatch within 24 hours.'
      });
      setFormData({ company: '', email: '', product: '', docType: 'EN 10204 3.1 MTC' });
    } catch (err) {
      setStatus({
        state: 'error',
        message: 'Error submitting your request. Please email us directly at sales@lotustubes.com.'
      });
    }
  };

  return (
    <>
      <PageHero
        badge="100% Quality & Metallurgy Assurance"
        title="Quality Standards & Inspection Documentation"
        subtitle="Surface Roughness Profilometry, Boroscopic QC & Full Batch Traceability"
        description="Rigorous metallurgical testing and certified EN 10204 3.1 Material Test Certificates ensuring total compliance with ASME BPE, 3-A, SMS, and ASTM sanitary benchmarks."
        slides={[
          {
            image: '/assets/images/products/custom-products/hero-showcases/lotus-tubes-master-product-line-hero-008.jpg',
            badge: '100% Quality & Metallurgy Assurance',
            title: 'Quality Standards & Inspection Documentation',
            subtitle: 'Surface Roughness Profilometry, Boroscopic QC & Batch Traceability',
            description: 'Rigorous metallurgical testing and certified EN 10204 3.1 Material Test Certificates ensuring total compliance with ASME BPE, 3-A, SMS, and ASTM sanitary benchmarks.'
          },
          {
            image: '/assets/images/products/custom-products/hero-showcases/lotus-tubes-master-product-line-hero-004.jpg',
            badge: 'Ra ≤ 0.38 µm EP Contact Surface',
            title: 'Electropolished & Mechanically Polished Precision',
            subtitle: 'Profilometer Verified Surface Finishes Eliminating Biofilm Formation',
            description: 'Every tube and fitting is measured for surface roughness, dimensional ovality, and hydrostatically tested to guarantee leak-tight integrity.'
          }
        ]}
        stats={[
          { value: 'EN 10204 3.1', label: 'Mill Certificates' },
          { value: 'Ra ≤ 0.38 µm', label: 'Electropolished Finish' },
          { value: '100% Boroscopy', label: 'Internal Bore Inspection' },
          { value: 'Positive PMI', label: 'Alloy Composition Verified' }
        ]}
        actions={[
          <a key="docs" href="#doc-request" className="btn btn--primary">
            Request Mill Test Certificates (MTC) &rarr;
          </a>,
          <a key="standards" href="#section-standards" className="btn btn--outline">
            View ASME BPE Benchmark
          </a>
        ]}
      />

      <div className="site-container section">
        <div id="section-standards" className="about-preview-grid mb-3">
          <div>
            <span className="section-eyebrow">Quality Philosophy</span>
            <h2 className="section-title">Strict Adherence to Hygienic Standards</h2>
            <p style={{ lineHeight: 1.7, color: 'var(--text-secondary)', marginTop: '14px' }}>
              Sanitary piping systems must prevent microbiological entrapment and withstand intensive CIP/SIP sterilization routines. At Lotus Tubes, all high-purity components are tracked by heat number and verified against recognized international benchmarks.
            </p>
            <div
              className="why-card mt-2"
              style={{ background: 'var(--pink-subtle)', borderColor: 'var(--pink-light)', color: 'var(--deep-navy)' }}
            >
              <h4 style={{ marginBottom: '6px' }}>Important Compliance Notice:</h4>
              <p style={{ fontSize: '0.9rem', lineHeight: 1.5 }}>
                We supply Material Test Certificates (EN 10204 3.1) confirming chemical analysis and mechanical properties. We do not claim compliance with a particular standard unless the supplied product verifiedly meets its requirements.
              </p>
            </div>
          </div>
          <div>
            <div className="spec-table-box">
              <table className="spec-table">
                <thead>
                  <tr>
                    <th>Finish Code</th>
                    <th>Process</th>
                    <th>Typical Ra Roughness</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <strong>EP (Electro Polished)</strong>
                    </td>
                    <td>Electrochemical dissolution</td>
                    <td>Ra ≤ 0.38 µm (15 µin) Inside</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>MP (Mechanical Polish)</strong>
                    </td>
                    <td>Abrasive belt & compound</td>
                    <td>Ra ≤ 0.8 µm (32 µin) Inside</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>ASTM A270</strong>
                    </td>
                    <td>Sanitary austenitic tube standard</td>
                    <td>Controlled OD & Wall Tolerance</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>ASTM A269</strong>
                    </td>
                    <td>Seamless & welded SS tube</td>
                    <td>Corrosion resistant process lines</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Technical Document Enquiry Form */}
        <div id="doc-request" className="form-card mt-3">
          <div className="section-header" style={{ marginBottom: '24px' }}>
            <div>
              <span className="section-eyebrow">Technical Support</span>
              <h3 className="section-title" style={{ fontSize: '1.6rem' }}>
                Request Material Test Certificates or Technical Datasheets
              </h3>
            </div>
          </div>

          {status.state === 'success' && (
            <div className="alert alert--success mb-3" style={{ padding: '16px', background: '#ECFDF5', color: '#065F46', borderRadius: '8px' }}>
              ✓ {status.message}
            </div>
          )}
          {status.state === 'error' && (
            <div className="alert alert--error mb-3" style={{ padding: '16px', background: '#FEF2F2', color: '#991B1B', borderRadius: '8px' }}>
              ⚠ {status.message}
            </div>
          )}

          <form id="quality-request-form" onSubmit={handleSubmit} noValidate>
            <div className="form-row">
              <div className="form-group">
                <label>
                  Company / Organization <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="qc-company"
                  required
                  placeholder="e.g. Cipla / Dr. Reddy's Contractor"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>
                  Your Email Address <span className="required">*</span>
                </label>
                <input
                  type="email"
                  id="qc-email"
                  required
                  placeholder="engineer@plant.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Product of Interest / Heat No.</label>
                <input
                  type="text"
                  id="qc-product"
                  placeholder="e.g. SS 316L EP Tube 1.5 inch"
                  value={formData.product}
                  onChange={(e) => setFormData({ ...formData, product: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Required Document Type</label>
                <select
                  id="qc-doc-type"
                  value={formData.docType}
                  onChange={(e) => setFormData({ ...formData, docType: e.target.value })}
                >
                  <option value="EN 10204 3.1 MTC">EN 10204 3.1 Material Test Certificate</option>
                  <option value="Product Specification Sheet">Product Specification Sheet</option>
                  <option value="Surface Roughness Certificate">Surface Roughness Verification</option>
                  <option value="Complete Product Catalogue PDF">Complete Product Catalogue PDF</option>
                </select>
              </div>
            </div>
            <button
              type="submit"
              className="btn btn--primary btn--lg"
              disabled={status.state === 'submitting'}
            >
              {status.state === 'submitting' ? (
                <Loader variant="button" size="sm" color="#FFFFFF" label="Submitting Technical Request..." />
              ) : (
                'Submit Technical Request →'
              )}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default QualityView;
