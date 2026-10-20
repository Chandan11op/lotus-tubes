import React from 'react';

export const QualityView = ({ onOpenVideo }) => {
  return (
    <div>
      <section className="page-hero">
        <div className="site-container">
          <h1 className="page-hero-title">Quality Assurance &amp; MTC Documentation</h1>
          <p className="page-hero-subtitle">
            Zero-compromise hygienic standards conforming to ASTM A270, ASME BPE, and 3-A Sanitary Standards with 100% heat traceability.
          </p>
        </div>
      </section>

      <div className="site-container section">
        {/* Surface Finish Guide Table */}
        <div style={{ marginBottom: '48px' }}>
          <span className="section-eyebrow">Surface Topography Standards</span>
          <h2 className="section-title">Surface Roughness (Ra) Benchmark Matrix</h2>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginTop: '12px', marginBottom: '24px' }}>
            Surface roughness dictates fluid shear stress and bacterial harborage risk. Below are Lotus Tubes verified finish grades:
          </p>

          <div style={{ overflowX: 'auto' }}>
            <table className="spec-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: '#10263D', color: '#FFFFFF' }}>
                  <th style={{ padding: '14px' }}>Finish Designation</th>
                  <th style={{ padding: '14px' }}>Internal Roughness (ID)</th>
                  <th style={{ padding: '14px' }}>External Finish (OD)</th>
                  <th style={{ padding: '14px' }}>Target Application</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid #E3E8EF' }}>
                  <td style={{ padding: '12px' }}><strong>Electro Polished (EP) High Purity</strong></td>
                  <td style={{ padding: '12px', color: 'var(--primary-blue)', fontWeight: 600 }}>Ra &le; 0.38 &mu;m (15 &mu;in)</td>
                  <td style={{ padding: '12px' }}>Ra &le; 0.8 &mu;m (32 &mu;in)</td>
                  <td style={{ padding: '12px' }}>WFI Loops, Biotech Fermenters, Injectable lines</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #E3E8EF', background: '#F8FAFC' }}>
                  <td style={{ padding: '12px' }}><strong>Mechanical Polished (MP) Sanitary</strong></td>
                  <td style={{ padding: '12px', color: 'var(--primary-blue)', fontWeight: 600 }}>Ra &le; 0.8 &mu;m (32 &mu;in)</td>
                  <td style={{ padding: '12px' }}>Ra &le; 0.8 &mu;m (32 &mu;in)</td>
                  <td style={{ padding: '12px' }}>Dairy, Breweries, Food Puree, Juices</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #E3E8EF' }}>
                  <td style={{ padding: '12px' }}><strong>Ultra-Fine Pharma (SF4 Equivalent)</strong></td>
                  <td style={{ padding: '12px', color: 'var(--primary-blue)', fontWeight: 600 }}>Ra &le; 0.25 &mu;m (10 &mu;in)</td>
                  <td style={{ padding: '12px' }}>Ra &le; 0.8 &mu;m</td>
                  <td style={{ padding: '12px' }}>Ultra-pure semiconductors, critical bio-processing</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Quality Tests Protocol */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginBottom: '48px' }}>
          <div className="card" style={{ padding: '24px', background: '#FFFFFF', borderRadius: '12px', border: '1px solid #E3E8EF' }}>
            <span style={{ fontSize: '2rem' }}>🔬</span>
            <h3 style={{ color: 'var(--deep-navy)', marginTop: '12px', marginBottom: '8px' }}>Spectro Chemical Verification</h3>
            <p style={{ color: '#667085', fontSize: '14px', lineHeight: 1.6 }}>
              100% PMI (Positive Material Identification) ensures carbon content &le; 0.03% in 316L and molybdenum content &ge; 2.0% for maximum pitting resistance.
            </p>
          </div>

          <div className="card" style={{ padding: '24px', background: '#FFFFFF', borderRadius: '12px', border: '1px solid #E3E8EF' }}>
            <span style={{ fontSize: '2rem' }}>💧</span>
            <h3 style={{ color: 'var(--deep-navy)', marginTop: '12px', marginBottom: '8px' }}>Hydrostatic &amp; Eddy Current</h3>
            <p style={{ color: '#667085', fontSize: '14px', lineHeight: 1.6 }}>
              Every tube length tested up to 150 bar hydrostatic pressure and 100% non-destructive eddy current scan to guarantee zero pinholes or weld seam fissures.
            </p>
          </div>

          <div className="card" style={{ padding: '24px', background: '#FFFFFF', borderRadius: '12px', border: '1px solid #E3E8EF' }}>
            <span style={{ fontSize: '2rem' }}>📑</span>
            <h3 style={{ color: 'var(--deep-navy)', marginTop: '12px', marginBottom: '8px' }}>EN 10204 3.1 Traceability</h3>
            <p style={{ color: '#667085', fontSize: '14px', lineHeight: 1.6 }}>
              Each shipment is accompanied by Mill Test Certificates stating chemical composition, mechanical tensile values, elongation, and surface Ra roughness readings.
            </p>
          </div>
        </div>

        {/* Action Callout */}
        <div style={{ background: '#10263D', color: '#FFFFFF', padding: '36px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <h3 style={{ fontSize: '1.6rem', marginBottom: '8px' }}>Watch Our Quality &amp; Sourcing Sequence</h3>
            <p style={{ color: '#CBD5E1', margin: 0 }}>See step-by-step sizing, electro-polishing, testing, and capping sequence.</p>
          </div>
          <button type="button" className="btn btn--white" onClick={onOpenVideo}>
            ▶ Watch QC Video Simulation
          </button>
        </div>
      </div>
    </div>
  );
};

export default QualityView;
