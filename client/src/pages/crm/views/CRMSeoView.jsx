import React, { useState } from 'react';
import { CRMIcon } from '../components/CRMIcon';
import { runSEOAudit, CANONICAL_ORIGIN, GOOGLE_VERIFICATION_FILE } from '../../../utils/seoAudit';

export const CRMSeoView = ({ isSuperAdmin = false, onNotify }) => {
  const [auditData, setAuditData] = useState(() => runSEOAudit());
  const [isScanning, setIsScanning] = useState(false);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState('all');
  const [activeStatusFilter, setActiveStatusFilter] = useState('all');

  const handleRefreshAudit = () => {
    setIsScanning(true);
    setTimeout(() => {
      const freshData = runSEOAudit();
      setAuditData(freshData);
      setIsScanning(false);
      if (onNotify) {
        onNotify('Live SEO audit completed. Real-time DOM and performance directives evaluated.', 'success');
      }
    }, 700);
  };

  if (!isSuperAdmin) {
    return (
      <div className="crm-workspace-view">
        <div className="crm-card" style={{ padding: '48px 24px', textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', padding: '16px', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '50%', marginBottom: '16px', color: '#EF4444' }}>
            <CRMIcon name="close" size={36} />
          </div>
          <h3 style={{ fontSize: '1.25rem', color: '#10263D', margin: '0 0 8px 0' }}>Access Restricted</h3>
          <p style={{ color: '#64748B', maxWidth: '480px', margin: '0 auto', fontSize: '14px' }}>
            The SEO Performance Engine and Search Console Audit Meter is restricted exclusively to authorized Super Administrators.
          </p>
        </div>
      </div>
    );
  }

  const {
    overallScore,
    status,
    totalChecks,
    passedChecks,
    warningChecks,
    failedChecks,
    notTestedChecks = 0,
    unavailableChecks = 0,
    categories,
    formattedTimestamp
  } = auditData;

  // Flatten checks for filtering
  const allChecks = [
    ...categories.technical.checks,
    ...categories.onpage.checks,
    ...categories.performance.checks,
    ...categories.structuredData.checks
  ];

  const filteredChecks = allChecks.filter((c) => {
    if (activeCategoryFilter !== 'all' && c.category.toLowerCase().replace(/[^a-z]/g, '') !== activeCategoryFilter.toLowerCase().replace(/[^a-z]/g, '')) {
      return false;
    }
    if (activeStatusFilter !== 'all' && c.status !== activeStatusFilter) {
      return false;
    }
    return true;
  });

  // Calculate circular SVG progress values (radius = 54, circumference = 2 * PI * 54 = 339.29)
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (overallScore / 100) * circumference;

  return (
    <div className="crm-workspace-view">
      {/* Top Banner Toolbar */}
      <div className="crm-card crm-toolbar-card" style={{ marginBottom: '20px' }}>
        <div className="crm-toolbar-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ display: 'inline-flex', padding: '6px', background: 'rgba(2, 132, 199, 0.12)', borderRadius: '8px', color: '#0284C7' }}>
                <CRMIcon name="seo" size={20} />
              </span>
              <h2 style={{ margin: 0, fontSize: '1.15rem', color: '#10263D', fontWeight: '700' }}>
                SEO Health & Search Console Audit Meter
              </h2>
            </div>
            <p style={{ margin: '6px 0 0 0', fontSize: '12px', color: '#64748B' }}>
              Real-time audit for <strong style={{ color: '#0284C7' }}>{CANONICAL_ORIGIN}</strong> — Evaluates Technical Directives, On-Page Signals, Mobile UX, and Schema.org Rich Snippets.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '11px', color: '#64748B' }}>
              Last scan: <strong>{formattedTimestamp}</strong>
            </span>
            <button
              type="button"
              className={`crm-btn crm-btn-primary crm-btn-sm ${isScanning ? 'scanning' : ''}`}
              onClick={handleRefreshAudit}
              disabled={isScanning}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              <CRMIcon name="dashboard" size={14} className={isScanning ? 'crm-spin' : ''} />
              <span>{isScanning ? 'Running Live Audit...' : 'Run Fresh Live Audit'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Hero Overview: Circular Gauge & High-Level KPIs */}
      <div className="crm-card" style={{ marginBottom: '20px', padding: '24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', alignItems: 'center' }}>
          {/* Circular Gauge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px', paddingRight: '20px', borderRight: '1px solid #E2E8F0' }}>
            <div style={{ position: 'relative', width: '130px', height: '130px', flexShrink: 0 }}>
              <svg width="130" height="130" viewBox="0 0 130 130" style={{ transform: 'rotate(-90deg)' }}>
                {/* Background Track */}
                <circle
                  cx="65"
                  cy="65"
                  r={radius}
                  stroke="#E2E8F0"
                  strokeWidth="10"
                  fill="transparent"
                />
                {/* Dynamic Value Arc */}
                <circle
                  cx="65"
                  cy="65"
                  r={radius}
                  stroke={overallScore >= 80 ? '#10B981' : overallScore >= 65 ? '#0284C7' : '#F59E0B'}
                  strokeWidth="10"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  fill="transparent"
                  style={{ transition: 'stroke-dashoffset 0.8s ease' }}
                />
              </svg>
              <div style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                pointerEvents: 'none'
              }}>
                <span style={{ fontSize: '32px', fontWeight: '800', color: '#10263D', lineHeight: 1 }}>
                  {overallScore}%
                </span>
                <span style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#64748B', marginTop: '4px' }}>
                  Optimization
                </span>
              </div>
            </div>

            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: '700', backgroundColor: overallScore >= 80 ? '#ECFDF5' : '#FEF3C7', color: overallScore >= 80 ? '#065F46' : '#92400E', marginBottom: '8px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: overallScore >= 80 ? '#10B981' : '#F59E0B' }} />
                STATUS: {status.toUpperCase()}
              </div>
              <h3 style={{ margin: '0 0 4px 0', fontSize: '16px', color: '#10263D' }}>
                Search Visibility Score
              </h3>
              <p style={{ margin: 0, fontSize: '12px', color: '#64748B', lineHeight: '1.4' }}>
                Live evaluation calculated across active DOM directives, Core Web Vitals performance, and rich structured data schemas.
              </p>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '12px' }}>
            <div style={{ padding: '12px 14px', borderRadius: '8px', background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
              <div style={{ fontSize: '10px', color: '#64748B', fontWeight: '700', textTransform: 'uppercase' }}>TOTAL CHECKS</div>
              <div style={{ fontSize: '22px', fontWeight: '800', color: '#10263D', marginTop: '2px' }}>{totalChecks}</div>
              <div style={{ fontSize: '11px', color: '#0284C7', marginTop: '2px' }}>4 Disciplines</div>
            </div>

            <div style={{ padding: '12px 14px', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
              <div style={{ fontSize: '10px', color: '#065F46', fontWeight: '700', textTransform: 'uppercase' }}>PASSED</div>
              <div style={{ fontSize: '22px', fontWeight: '800', color: '#059669', marginTop: '2px' }}>{passedChecks}</div>
              <div style={{ fontSize: '11px', color: '#059669', marginTop: '2px' }}>Verified Valid</div>
            </div>

            <div style={{ padding: '12px 14px', borderRadius: '8px', background: 'rgba(245, 158, 11, 0.08)', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
              <div style={{ fontSize: '10px', color: '#92400E', fontWeight: '700', textTransform: 'uppercase' }}>ADVISORY</div>
              <div style={{ fontSize: '22px', fontWeight: '800', color: '#D97706', marginTop: '2px' }}>{warningChecks}</div>
              <div style={{ fontSize: '11px', color: '#D97706', marginTop: '2px' }}>Optimizations</div>
            </div>

            <div style={{ padding: '12px 14px', borderRadius: '8px', background: failedChecks > 0 ? 'rgba(239, 68, 68, 0.08)' : '#F8FAFC', border: '1px solid ' + (failedChecks > 0 ? 'rgba(239, 68, 68, 0.2)' : '#E2E8F0') }}>
              <div style={{ fontSize: '10px', color: failedChecks > 0 ? '#991B1B' : '#64748B', fontWeight: '700', textTransform: 'uppercase' }}>FAILURES</div>
              <div style={{ fontSize: '22px', fontWeight: '800', color: failedChecks > 0 ? '#DC2626' : '#10263D', marginTop: '2px' }}>{failedChecks}</div>
              <div style={{ fontSize: '11px', color: failedChecks === 0 ? '#059669' : '#DC2626', marginTop: '2px' }}>
                {failedChecks === 0 ? 'Zero Blockers' : 'Action Required'}
              </div>
            </div>

            <div style={{ padding: '12px 14px', borderRadius: '8px', background: unavailableChecks > 0 ? '#F1F5F9' : '#F8FAFC', border: '1px solid #CBD5E1' }}>
              <div style={{ fontSize: '10px', color: '#475569', fontWeight: '700', textTransform: 'uppercase' }}>UNAVAILABLE</div>
              <div style={{ fontSize: '22px', fontWeight: '800', color: '#475569', marginTop: '2px' }}>{unavailableChecks}</div>
              <div style={{ fontSize: '11px', color: '#64748B', marginTop: '2px' }}>Not Connected</div>
            </div>
          </div>
        </div>

        {/* Google Search Console Direct Integration Callout */}
        <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', background: '#FFFBEB', padding: '14px 18px', borderRadius: '8px', border: '1px solid #FDE68A' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ display: 'inline-flex', padding: '8px', background: '#D97706', color: '#FFFFFF', borderRadius: '6px' }}>
              <CRMIcon name="clock" size={16} />
            </span>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <strong style={{ fontSize: '13px', color: '#92400E' }}>
                  Google Search Console: Not Connected
                </strong>
                <span style={{ fontSize: '10px', background: '#FEE2E2', color: '#DC2626', padding: '1px 6px', borderRadius: '4px', fontWeight: '700' }}>
                  Action Required
                </span>
              </div>
              <div style={{ fontSize: '12px', color: '#78350F', marginTop: '3px', fontWeight: 600 }}>
                Google Search Console is not connected. Connect your property to view verified search performance data.
              </div>
              <div style={{ fontSize: '11px', color: '#B45309', marginTop: '2px' }}>
                Verification file: <code>{GOOGLE_VERIFICATION_FILE}</code> is deployed to the public root ready for ownership verification.
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <a
              href={`/${GOOGLE_VERIFICATION_FILE}`}
              target="_blank"
              rel="noopener noreferrer"
              className="crm-btn crm-btn-secondary crm-btn-sm"
              style={{ fontSize: '11px', textDecoration: 'none' }}
            >
              <span>Inspect Token File</span>
              <CRMIcon name="externalLink" size={12} />
            </a>
            <a
              href="https://search.google.com/search-console"
              target="_blank"
              rel="noopener noreferrer"
              className="crm-btn crm-btn-primary crm-btn-sm"
              style={{ fontSize: '11px', textDecoration: 'none' }}
            >
              <span>Open Search Console</span>
              <CRMIcon name="externalLink" size={12} />
            </a>
          </div>
        </div>
      </div>

      {/* 4 Category Breakdown Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '20px' }}>
        {Object.entries(categories).map(([key, cat]) => {
          return (
            <div key={key} className="crm-card" style={{ padding: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                <div>
                  <span style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', color: '#64748B', letterSpacing: '0.04em' }}>
                    Weight {cat.weight}%
                  </span>
                  <h4 style={{ margin: '2px 0 0 0', fontSize: '14px', color: '#10263D', fontWeight: '700' }}>
                    {cat.title}
                  </h4>
                </div>
                <div style={{ fontSize: '18px', fontWeight: '800', color: cat.score >= 85 ? '#059669' : cat.score >= 70 ? '#0284C7' : '#D97706' }}>
                  {cat.score}%
                </div>
              </div>

              {/* Mini progress bar */}
              <div style={{ width: '100%', height: '6px', background: '#E2E8F0', borderRadius: '3px', overflow: 'hidden', marginBottom: '12px' }}>
                <div
                  style={{
                    width: `${cat.score}%`,
                    height: '100%',
                    background: cat.score >= 85 ? '#10B981' : cat.score >= 70 ? '#0284C7' : '#F59E0B',
                    borderRadius: '3px',
                    transition: 'width 0.6s ease'
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#64748B' }}>
                <span>Checks: <strong>{cat.passed}/{cat.total} Passed</strong></span>
                {cat.warnings > 0 && (
                  <span style={{ color: '#D97706', fontWeight: '600' }}>{cat.warnings} Advisory</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Audit Checklist Table with Category & Status Filters */}
      <div className="crm-card">
        <div className="crm-card__header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div className="crm-card__header-title">
            <CRMIcon name="tasks" size={18} />
            <h3 style={{ margin: 0, fontSize: '14px' }}>Detailed Directive Verification Audit</h3>
            <span className="crm-badge crm-badge-blue" style={{ fontSize: '11px' }}>
              Showing {filteredChecks.length} of {totalChecks} Checks
            </span>
          </div>

          {/* Filter Pills */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', background: '#F1F5F9', borderRadius: '6px', padding: '2px' }}>
              {[
                { id: 'all', label: 'All Categories' },
                { id: 'technical', label: 'Technical' },
                { id: 'onpage', label: 'On-Page' },
                { id: 'performance', label: 'Performance' },
                { id: 'structureddata', label: 'Structured Data' }
              ].map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setActiveCategoryFilter(f.id)}
                  style={{
                    border: 'none',
                    background: activeCategoryFilter === f.id ? '#FFFFFF' : 'transparent',
                    color: activeCategoryFilter === f.id ? '#10263D' : '#64748B',
                    fontWeight: activeCategoryFilter === f.id ? '700' : '500',
                    fontSize: '11px',
                    padding: '4px 10px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    boxShadow: activeCategoryFilter === f.id ? '0 1px 2px rgba(0,0,0,0.06)' : 'none'
                  }}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', background: '#F1F5F9', borderRadius: '6px', padding: '2px', flexWrap: 'wrap', gap: '2px' }}>
              {[
                { id: 'all', label: 'All Status' },
                { id: 'pass', label: `Pass (${passedChecks})` },
                { id: 'warning', label: `Advisory (${warningChecks})` },
                ...(failedChecks > 0 ? [{ id: 'fail', label: `Fail (${failedChecks})` }] : []),
                ...(notTestedChecks > 0 ? [{ id: 'not-tested', label: `Not Tested (${notTestedChecks})` }] : []),
                ...(unavailableChecks > 0 ? [{ id: 'unavailable', label: `Unavailable (${unavailableChecks})` }] : [])
              ].map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setActiveStatusFilter(f.id)}
                  style={{
                    border: 'none',
                    background: activeStatusFilter === f.id ? '#FFFFFF' : 'transparent',
                    color: activeStatusFilter === f.id ? '#10263D' : '#64748B',
                    fontWeight: activeStatusFilter === f.id ? '700' : '500',
                    fontSize: '11px',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    boxShadow: activeStatusFilter === f.id ? '0 1px 2px rgba(0,0,0,0.06)' : 'none'
                  }}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="crm-card__body" style={{ padding: 0 }}>
          <div className="crm-table-container">
            <table className="crm-table">
              <thead>
                <tr>
                  <th style={{ width: '110px' }}>Status</th>
                  <th style={{ width: '220px' }}>Directive / Metric</th>
                  <th style={{ width: '120px' }}>Category</th>
                  <th style={{ width: '90px' }}>Impact</th>
                  <th>Verification Evidence & Technical Findings</th>
                </tr>
              </thead>
              <tbody>
                {filteredChecks.map((check) => {
                  return (
                    <tr key={check.id}>
                      <td>
                        {check.status === 'pass' && (
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '2px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: '700', backgroundColor: '#ECFDF5', color: '#059669' }}>
                            <CRMIcon name="check" size={12} />
                            PASS
                          </span>
                        )}
                        {check.status === 'warning' && (
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '2px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: '700', backgroundColor: '#FEF3C7', color: '#D97706' }}>
                            <CRMIcon name="clock" size={12} />
                            ADVISORY
                          </span>
                        )}
                        {check.status === 'fail' && (
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '2px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: '700', backgroundColor: '#FEE2E2', color: '#DC2626' }}>
                            <CRMIcon name="close" size={12} />
                            FAIL
                          </span>
                        )}
                        {check.status === 'not-tested' && (
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '2px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: '700', backgroundColor: '#F1F5F9', color: '#64748B' }}>
                            NOT TESTED
                          </span>
                        )}
                        {check.status === 'unavailable' && (
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '2px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: '700', backgroundColor: '#E2E8F0', color: '#475569' }}>
                            UNAVAILABLE
                          </span>
                        )}
                      </td>
                      <td>
                        <strong style={{ color: '#10263D', fontSize: '13px' }}>{check.name}</strong>
                      </td>
                      <td>
                        <span style={{ fontSize: '11px', background: '#F1F5F9', padding: '2px 6px', borderRadius: '4px', color: '#475569' }}>
                          {check.category}
                        </span>
                      </td>
                      <td>
                        <span style={{
                          fontSize: '11px',
                          fontWeight: '600',
                          color: check.impact === 'Critical' ? '#DC2626' : check.impact === 'High' ? '#D97706' : '#64748B'
                        }}>
                          {check.impact}
                        </span>
                      </td>
                      <td>
                        <div style={{ fontSize: '12px', color: '#334155', lineHeight: '1.4' }}>
                          {check.detail}
                        </div>
                        {check.recommendation && (
                          <div style={{ marginTop: '4px', fontSize: '11px', color: '#B45309', background: '#FFFBEB', padding: '4px 8px', borderRadius: '4px', border: '1px solid #FDE68A' }}>
                            <strong>Recommendation:</strong> {check.recommendation}
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CRMSeoView;
