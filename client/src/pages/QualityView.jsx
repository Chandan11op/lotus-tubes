import React, { useState } from 'react';
import { apiService } from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import PageHero from '../components/common/PageHero';
import { Loader } from '../components/common/Loader';

export const QualityView = () => {
  const { t, currentLang, localizePath } = useLanguage();
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
      setStatus({ state: 'error', message: 'Please enter both your company name and a valid email address.' });
      return;
    }
    setStatus({ state: 'submitting', message: 'Submitting request...' });
    try {
      const res = await apiService.submitQualityRequest({
        company: formData.company,
        email: formData.email,
        product: formData.product || 'General Technical Certification',
        docType: formData.docType,
        language: currentLang
      });
      setStatus({
        state: 'success',
        message: res?.message || 'Your technical document request has been received. Our Quality Engineering desk will verify the heat number and dispatch within 24 hours.'
      });
      setFormData({ company: '', email: '', product: '', docType: 'EN 10204 3.1 MTC' });
    } catch (err) {
      console.error('Quality document request error:', err);
      setStatus({
        state: 'error',
        message: err.message || 'Error submitting your request. Please email our quality desk directly at sales@lotustubes.com.'
      });
    }
  };

  return (
    <div className="quality-page-view">
      {/* 1. Cinematic Quality & Metrology Hero */}
      <PageHero
        image="/assets/images/hero/hero-quality-documentation-desk.jpg"
        badge="Zero-Defect Metrology & Metallurgy Desk"
        title="Quality Assurance, Material Certification & Testing"
        subtitle="Full Heat-Number Traceability, EN 10204 3.1 Mill Certificates & Surface Profilometry"
        description="Lotus Tubes enforces non-negotiable hygienic criteria across all SS 304 and SS 316L inventories. All components undergo rigorous chemical spectrometry, Ra profilometer surface inspection, eddy-current non-destructive testing, and hydrostatic pressure testing."
        stats={[
          { value: 'EN 10204 3.1', label: 'Mill Certificates Supplied' },
          { value: 'Ra ≤ 0.38 µm', label: 'Certified EP Internal Surface' },
          { value: '100% Boroscopy', label: 'Full Bore Weld Inspection' },
          { value: 'Positive PMI', label: 'Spectrometric Alloy Verification' }
        ]}
        actions={[
          <a key="docs" href="#doc-request" className="btn btn--primary">
            Request Mill Test Certificates (MTC) &rarr;
          </a>,
          <a key="standards" href="#metrology-matrix" className="btn btn--outline">
            Review Testing Protocols
          </a>
        ]}
      />

      {/* 2. Core Metrology Testing Protocols */}
      <section className="site-container py-16 sm:py-20" id="metrology-matrix">
        <div className="max-w-3xl mx-auto text-center mb-14">
          <span className="text-xs font-mono font-bold tracking-widest text-sky-600 uppercase">
            Rigorous Verification
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-2">
            Multi-Stage Non-Destructive Quality Verification
          </h2>
          <p className="text-sm text-slate-600 mt-2">
            Every batch delivered from our Mumbai stockhub is backed by comprehensive dimensional, mechanical, and metallurgical testing protocols.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Test 1 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:border-sky-500/50 transition-all">
            <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center text-xl font-bold mb-4">
              📐
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">Surface Roughness Profilometry</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Certified contact stylus profilometer measurements across the internal tube ID. Guaranteed Ra ≤ 0.38 µm (15 µin) for Electro-Polished (EP) and Ra ≤ 0.8 µm (32 µin) for Mechanical Polished (MP) lines.
            </p>
            <div className="mt-4 pt-3 border-t border-slate-100 font-mono text-[11px] text-sky-600">
              ASME BPE SF1 / SF4
            </div>
          </div>

          {/* Test 2 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:border-emerald-500/50 transition-all">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl font-bold mb-4">
              🔍
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">Positive Material Identification (PMI)</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Handheld XRF / optical emission spectrometry verifying elemental Cr, Ni, and Mo concentration before dispatch to rule out grade mixing and counterfeit raw materials.
            </p>
            <div className="mt-4 pt-3 border-t border-slate-100 font-mono text-[11px] text-emerald-600">
              ASTM E1476 • 100% Alloy Check
            </div>
          </div>

          {/* Test 3 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:border-amber-500/50 transition-all">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center text-xl font-bold mb-4">
              ⚡
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">Eddy-Current &amp; Hydrostatic</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              100% online eddy-current non-destructive flaw detection coupled with hydrostatic pressure testing up to design proof limits, guaranteeing zero pinhole defects and weld integrity.
            </p>
            <div className="mt-4 pt-3 border-t border-slate-100 font-mono text-[11px] text-amber-600">
              ASTM A450 / A1016
            </div>
          </div>

          {/* Test 4 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:border-purple-500/50 transition-all">
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center text-xl font-bold mb-4">
              🔬
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">Boroscopic Internal Bore Inspection</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              High-definition digital boroscope optical verification of the internal longitudinal weld seam. Ensures full root penetration, absence of discoloration, and flush planar bead profile.
            </p>
            <div className="mt-4 pt-3 border-t border-slate-100 font-mono text-[11px] text-purple-600">
              AWS D18.1 • ASME BPE
            </div>
          </div>
        </div>
      </section>

      {/* 3. Standards & Surface Finish Specification Table */}
      <section className="bg-slate-50 py-16 sm:py-20 border-y border-slate-200">
        <div className="site-container">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-5 space-y-4">
              <span className="text-xs font-mono font-bold tracking-widest text-sky-600 uppercase">
                Sanitary Finishing Standards
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Surface Roughness &amp; Chemical Dissolution Benchmarks
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                Biopharmaceutical and aseptic processes cannot tolerate micro-valleys or pitting where product residues could harbor bacteria. 
                Our electropolished tubes undergo an electrochemical bath that preferentially dissolves micro-peaks, producing an ultra-smooth chromium-enriched passive oxide layer.
              </p>

              <div className="p-4 bg-sky-50 border border-sky-200 rounded-xl text-xs text-sky-900 space-y-2">
                <div className="font-bold flex items-center gap-1.5">
                  <span>📌 Certified Compliance Reference</span>
                </div>
                <p className="leading-relaxed">
                  Lotus Tubes provides complete Mill Test Certificates (EN 10204 3.1) confirming chemical analysis, mechanical tensile/yield properties, and surface profilometer readings with each order.
                </p>
              </div>

              <div className="pt-2 flex flex-wrap gap-2 text-xs font-mono">
                <a
                  href="https://www.astm.org/a0270_a0270m-15r21.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-700 hover:text-sky-600 hover:border-sky-400 transition-colors"
                >
                  ASTM A270 Standards Reference ↗
                </a>
                <a
                  href="https://www.asme.org/codes-standards/find-codes-standards/bpe-bioprocessing-equipment"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-700 hover:text-sky-600 hover:border-sky-400 transition-colors"
                >
                  ASME BPE Specification Reference ↗
                </a>
              </div>
            </div>

            <div className="lg:col-span-7">
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                <div className="p-4 bg-slate-900 text-white font-mono text-xs uppercase tracking-wider flex justify-between items-center">
                  <span>Lotus Tubes Surface Finish Matrix</span>
                  <span className="text-sky-400 text-[11px]">ISO 4287 / ASME BPE</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-100 text-slate-700 uppercase font-mono text-[11px] border-b border-slate-200">
                      <tr>
                        <th className="p-3.5">Finish Code</th>
                        <th className="p-3.5">Process Treatment</th>
                        <th className="p-3.5">Internal Ra (Max)</th>
                        <th className="p-3.5">Typical Applications</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      <tr className="hover:bg-slate-50 transition-colors">
                        <td className="p-3.5 font-bold text-sky-700 font-mono">EP (Electro-Polished)</td>
                        <td className="p-3.5">Electrochemical anodic dissolution</td>
                        <td className="p-3.5 font-mono font-semibold text-emerald-600">Ra ≤ 0.38 µm (15 µin)</td>
                        <td className="p-3.5">WFI Systems, Vaccines, Sterile Biopharma</td>
                      </tr>
                      <tr className="hover:bg-slate-50 transition-colors">
                        <td className="p-3.5 font-bold text-slate-900 font-mono">MP (Mechanical Polish)</td>
                        <td className="p-3.5">Longitudinal abrasive polishing</td>
                        <td className="p-3.5 font-mono font-semibold text-slate-800">Ra ≤ 0.80 µm (32 µin)</td>
                        <td className="p-3.5">Dairy, Beverages, Brewery, Food Skids</td>
                      </tr>
                      <tr className="hover:bg-slate-50 transition-colors">
                        <td className="p-3.5 font-bold text-slate-900 font-mono">Satin / Hairline OD</td>
                        <td className="p-3.5">External orbital belt polish</td>
                        <td className="p-3.5 font-mono text-slate-600">Ra ≤ 1.0 µm (40 µin)</td>
                        <td className="p-3.5">Cleanroom Architectural Exterior</td>
                      </tr>
                      <tr className="hover:bg-slate-50 transition-colors">
                        <td className="p-3.5 font-bold text-slate-900 font-mono">Bright Annealed (BA)</td>
                        <td className="p-3.5">Hydrogen atmosphere furnace anneal</td>
                        <td className="p-3.5 font-mono text-slate-600">Ra ≤ 0.60 µm (25 µin)</td>
                        <td className="p-3.5">Gas Distribution, Instrumentation</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Interactive MTC & Technical Document Request Desk */}
      <section className="site-container py-16 sm:py-20" id="doc-request">
        <div className="max-w-2xl mx-auto bg-white rounded-2xl border border-slate-200 shadow-xl p-8 sm:p-10">
          <div className="text-center mb-8">
            <span className="text-xs font-mono font-bold tracking-widest text-sky-600 uppercase">
              Direct Engineering Verification
            </span>
            <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
              Request Mill Test Certificate (MTC 3.1)
            </h3>
            <p className="text-xs text-slate-600 mt-2">
              Provide your project details and heat number below. Our Quality Control desk will dispatch official certified inspection documents within 24 hours.
            </p>
          </div>

          {status.state === 'success' && (
            <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-start gap-3">
              <span className="text-emerald-600 text-lg">✓</span>
              <div>
                <strong>Request Received!</strong>
                <p className="text-xs mt-0.5">{status.message}</p>
              </div>
            </div>
          )}

          {status.state === 'error' && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm flex items-start gap-3">
              <span className="text-red-600 text-lg">⚠</span>
              <div>
                <strong>Submission Notice:</strong>
                <p className="text-xs mt-0.5">{status.message}</p>
              </div>
            </div>
          )}

          <form id="quality-request-form" onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Company / Organization <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="qc-company"
                  required
                  placeholder="e.g. Cipla / Sun Pharma Skid Fabricator"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Official Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="qc-email"
                  required
                  placeholder="quality@plant.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Product Description / Heat Number
                </label>
                <input
                  type="text"
                  id="qc-product"
                  placeholder="e.g. SS 316L EP Tube 1.5 inch / Heat #8492"
                  value={formData.product}
                  onChange={(e) => setFormData({ ...formData, product: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Required Certification Document
                </label>
                <select
                  id="qc-doc-type"
                  value={formData.docType}
                  onChange={(e) => setFormData({ ...formData, docType: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white"
                >
                  <option value="EN 10204 3.1 MTC">EN 10204 3.1 Material Test Certificate</option>
                  <option value="Surface Roughness Certificate">Surface Roughness (Ra) Profilometer Verification</option>
                  <option value="Positive Material Identification (PMI)">PMI Spectrometry Test Report</option>
                  <option value="Product Specification Sheet">Technical Product Specification Sheet</option>
                  <option value="Complete Product Catalogue PDF">Lotus Tubes Complete Sanitary Catalogue PDF</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-semibold text-sm tracking-wide uppercase transition-colors shadow-md shadow-sky-900/20 mt-2 flex items-center justify-center"
              disabled={status.state === 'submitting'}
            >
              {status.state === 'submitting' ? (
                <Loader variant="button" size="sm" color="#FFFFFF" label="Submitting Technical Request..." />
              ) : (
                'Submit Technical Document Request →'
              )}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default QualityView;
