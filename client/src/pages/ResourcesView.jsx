import React from 'react';

export const ResourcesView = ({ onNotify }) => {
  const resources = [
    {
      title: 'Lotus Tubes Master Sanitary Catalogue 2026',
      desc: 'Complete product specifications, OD charts, valve flow curves, and ASTM standards in high-resolution PDF format.',
      format: 'PDF',
      size: '8.4 MB',
      image: '/assets/images/resources/catalogue-cover.svg'
    },
    {
      title: 'Sanitary Tubing Dimensional & Wall Gauge Chart',
      desc: 'Complete size lookup table from 1/2" to 4" OD showing wall thickness in mm, gauge ratings, and working pressure limits.',
      format: 'PDF / Excel',
      size: '2.1 MB',
      image: '/assets/images/resources/dimensions-chart.svg'
    },
    {
      title: 'Surface Finish & Roughness (Ra) Conversion Guide',
      desc: 'Engineering whitepaper comparing Electro-Polishing (EP) vs Mechanical Polishing (MP), grit finishes, and ASME BPE designations.',
      format: 'PDF',
      size: '1.8 MB',
      image: '/assets/images/resources/roughness-guide.svg'
    }
  ];

  const handleDownload = (resTitle) => {
    if (onNotify) {
      onNotify(`Document [${resTitle}] prepared for download. (Demonstration)`, 'success');
    }
  };

  return (
    <div>
      <section className="page-hero">
        <div className="site-container">
          <h1 className="page-hero-title">Engineering Datasheets &amp; Resources</h1>
          <p className="page-hero-subtitle">
            Download dimensional charts, surface roughness standards, MTC sample documentation, and complete product catalogues.
          </p>
        </div>
      </section>

      <div className="site-container section">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px' }}>
          {resources.map((res, i) => (
            <article
              key={i}
              className="card"
              style={{
                background: '#FFFFFF',
                borderRadius: '12px',
                border: '1px solid #E3E8EF',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <div style={{ height: '220px', background: '#F8FAFC', display: 'flex', alignItems: 'center', justifyContent: 'center', borderBottom: '1px solid #E3E8EF' }}>
                <img
                  src={res.image}
                  alt={res.title}
                  style={{ maxHeight: '180px', maxWidth: '80%', objectFit: 'contain' }}
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              </div>
              <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <span className="badge badge--navy">{res.format}</span>
                    <span style={{ fontSize: '12px', color: '#667085' }}>{res.size}</span>
                  </div>
                  <h3 style={{ fontSize: '1.2rem', color: '#10263D', marginBottom: '10px', lineHeight: 1.4 }}>
                    {res.title}
                  </h3>
                  <p style={{ fontSize: '14px', color: '#667085', lineHeight: 1.6, marginBottom: '20px' }}>
                    {res.desc}
                  </p>
                </div>
                <button
                  type="button"
                  className="btn btn--outline-dark btn--block"
                  onClick={() => handleDownload(res.title)}
                >
                  <span>Download Document</span> &darr;
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ResourcesView;
