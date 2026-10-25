import React from 'react';
import { CRMIcon } from '../components/CRMIcon';

export const CRMReportsView = ({
  enquiries = [],
  quotations = [],
  dashboardMetrics = null,
  onExportCSV
}) => {
  // Aggregate country distribution from enquiries
  const countryCounts = {};
  enquiries.forEach((e) => {
    const country = e.country || e.location || 'India';
    countryCounts[country] = (countryCounts[country] || 0) + 1;
  });
  const countryList = Object.entries(countryCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);

  // Aggregate product requests
  const productCounts = {};
  enquiries.forEach((e) => {
    const prod = e.productName || 'Sanitary Component';
    productCounts[prod] = (productCounts[prod] || 0) + 1;
  });
  const topProducts = Object.entries(productCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);

  return (
    <div className="crm-workspace-view">
      {/* Top Banner */}
      <div className="crm-card crm-toolbar-card">
        <div className="crm-toolbar-row">
          <div>
            <h3 style={{ margin: 0, fontSize: '1rem', color: '#10263D' }}>
              Sales Operations Analytics &amp; Commercial Intelligence
            </h3>
            <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#64748B' }}>
              Data derived from live customer RFQs, active quotations, and MongoDB persistent records.
            </p>
          </div>
          <div>
            <button
              type="button"
              className="crm-btn crm-btn-secondary crm-btn-sm"
              onClick={onExportCSV}
            >
              <CRMIcon name="download" size={14} />
              <span>Export Raw Enquiries CSV</span>
            </button>
          </div>
        </div>
      </div>

      <div className="crm-dashboard-split" style={{ marginTop: '16px' }}>
        {/* Countries Distribution */}
        <div className="crm-card">
          <div className="crm-card__header">
            <div className="crm-card__header-title">
              <CRMIcon name="reports" size={18} />
              <h3>Buyer Geographic Distribution</h3>
            </div>
          </div>
          <div className="crm-card__body">
            {countryList.length === 0 ? (
              <p style={{ color: '#64748B' }}>No geographic data recorded yet.</p>
            ) : (
              <div style={{ display: 'grid', gap: '10px' }}>
                {countryList.map(([country, count], idx) => {
                  const max = countryList[0][1] || 1;
                  const pct = Math.round((count / max) * 100);
                  return (
                    <div key={idx} className="crm-pipeline-row">
                      <div className="crm-pipeline-row__label">
                        <span>{country}</span>
                        <strong>{count} leads</strong>
                      </div>
                      <div className="crm-pipeline-row__track">
                        <div
                          className="crm-pipeline-row__fill"
                          style={{ width: `${pct}%`, backgroundColor: '#0284C7' }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Top Requested Components */}
        <div className="crm-card">
          <div className="crm-card__header">
            <div className="crm-card__header-title">
              <CRMIcon name="products" size={18} />
              <h3>Top Requested Sanitary Components</h3>
            </div>
          </div>
          <div className="crm-card__body">
            {topProducts.length === 0 ? (
              <p style={{ color: '#64748B' }}>No component enquiry records found.</p>
            ) : (
              <div style={{ display: 'grid', gap: '10px' }}>
                {topProducts.map(([prod, count], idx) => {
                  const max = topProducts[0][1] || 1;
                  const pct = Math.round((count / max) * 100);
                  return (
                    <div key={idx} className="crm-pipeline-row">
                      <div className="crm-pipeline-row__label">
                        <span>{prod}</span>
                        <strong>{count} RFQs</strong>
                      </div>
                      <div className="crm-pipeline-row__track">
                        <div
                          className="crm-pipeline-row__fill"
                          style={{ width: `${pct}%`, backgroundColor: '#F59E0B' }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CRMReportsView;
