import React, { useState, useMemo } from 'react';
import { CRMIcon } from '../components/CRMIcon';
import { Loader } from '../../../components/common/Loader';
import { Product360Viewer } from '../../../components/common/Product360Viewer';
import manifestData from '../../../data/productVideosManifest.json';
import { MASTER_PRODUCTS } from '../../../data/productsData';

export const CRMVideoManagerView = ({
  searchQuery = '',
  onNotify
}) => {
  const [manifest, setManifest] = useState(manifestData || { products: {} });
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [previewProduct, setPreviewProduct] = useState(null);
  const [isBulkGenerating, setIsBulkGenerating] = useState(false);
  const [generatingProductId, setGeneratingProductId] = useState(null);
  const [progressPercent, setProgressPercent] = useState(0);
  const [showAiModal, setShowAiModal] = useState(false);

  const categories = [
    'All',
    'Sanitary Pipes & Tubes',
    'Sanitary Pipe Fittings',
    'Tri-Clamp Fittings & Components',
    'Hygienic Manual Valves',
    'Pneumatic Actuated Valves',
    'Sanitary Gaskets',
    'Tank Cleaning'
  ];

  // Merge Master Catalog items with Manifest status
  const catalogItems = useMemo(() => {
    return MASTER_PRODUCTS.map((prod) => {
      const manifestEntry = manifest.products?.[prod.id] || {};
      const hasGenerated360 = Boolean(manifestEntry.video360 || prod.video360);
      const hasGeneratedShowcase = Boolean(manifestEntry.videoShowcase || prod.videoShowcase);

      return {
        ...prod,
        video360: manifestEntry.video360 || prod.video360 || `/assets/videos/products/${prod.id}/360.mp4`,
        video360Webm: manifestEntry.video360Webm || prod.video360Webm || `/assets/videos/products/${prod.id}/360.webm`,
        videoShowcase: manifestEntry.videoShowcase || prod.videoShowcase || `/assets/videos/products/${prod.id}/showcase.mp4`,
        poster: manifestEntry.poster || prod.poster || `/assets/videos/products/${prod.id}/poster.webp`,
        has360: hasGenerated360,
        hasShowcase: hasGeneratedShowcase,
        frameCount: manifestEntry.frameCount || (prod.images ? prod.images.length : 1),
        mode: manifestEntry.mode || (prod.images?.length > 1 ? 'multi-angle-frames' : 'studio-2.5d-engine'),
        status: hasGenerated360 ? 'completed' : 'pending',
        sizeBytes: manifestEntry.sizeBytes || 350000,
        lastGenerated: manifestEntry.lastGenerated || null
      };
    });
  }, [manifest]);

  // Filtered view items
  const filteredProducts = useMemo(() => {
    return catalogItems.filter((p) => {
      if (selectedCategory !== 'All' && p.category !== selectedCategory) {
        return false;
      }
      if (statusFilter === 'Completed' && !p.has360) return false;
      if (statusFilter === 'Pending' && p.has360) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        return (
          p.name.toLowerCase().includes(q) ||
          p.id.toLowerCase().includes(q) ||
          (p.sku && p.sku.toLowerCase().includes(q)) ||
          p.category.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [catalogItems, selectedCategory, statusFilter, searchQuery]);

  // Overall catalog metrics
  const totalProducts = catalogItems.length;
  const completed360 = catalogItems.filter((p) => p.has360).length;
  const completedShowcase = catalogItems.filter((p) => p.hasShowcase).length;
  const pendingCount = totalProducts - completed360;
  const percentComplete = Math.round((completed360 / Math.max(1, totalProducts)) * 100);

  // Trigger Single Video Generation Simulation / Dispatch
  const handleGenerateSingle = async (prod) => {
    setGeneratingProductId(prod.id);
    if (onNotify) onNotify(`Initiating video synthesis for ${prod.name}...`, 'info');

    // Simulate backend rendering trigger
    setTimeout(() => {
      setManifest((prev) => ({
        ...prev,
        products: {
          ...prev.products,
          [prod.id]: {
            id: prod.id,
            name: prod.name,
            has360: true,
            video360: `/assets/videos/products/${prod.id}/360.mp4`,
            video360Webm: `/assets/videos/products/${prod.id}/360.webm`,
            videoShowcase: `/assets/videos/products/${prod.id}/showcase.mp4`,
            poster: `/assets/videos/products/${prod.id}/poster.webp`,
            status: 'completed',
            mode: prod.mode,
            sizeBytes: 380000,
            lastGenerated: new Date().toISOString()
          }
        }
      }));
      setGeneratingProductId(null);
      if (onNotify) onNotify(`360° video & showcase successfully synthesized for ${prod.name}!`, 'success');
    }, 1800);
  };

  // Bulk Generation Execution
  const handleBulkGenerate = () => {
    setIsBulkGenerating(true);
    setProgressPercent(10);
    if (onNotify) onNotify(`Queuing ${pendingCount} products for bulk video rendering...`, 'info');

    let current = 10;
    const interval = setInterval(() => {
      current += 15;
      if (current >= 100) {
        clearInterval(interval);
        setIsBulkGenerating(false);
        setProgressPercent(100);

        // Update all to completed in manifest
        const updated = { ...manifest.products };
        catalogItems.forEach((p) => {
          updated[p.id] = {
            id: p.id,
            name: p.name,
            has360: true,
            video360: `/assets/videos/products/${p.id}/360.mp4`,
            video360Webm: `/assets/videos/products/${p.id}/360.webm`,
            videoShowcase: `/assets/videos/products/${p.id}/showcase.mp4`,
            poster: `/assets/videos/products/${p.id}/poster.webp`,
            status: 'completed',
            mode: p.mode,
            sizeBytes: 410000,
            lastGenerated: new Date().toISOString()
          };
        });

        setManifest((prev) => ({ ...prev, products: updated }));
        if (onNotify) onNotify('Bulk video generation pipeline completed for entire catalog!', 'success');
      } else {
        setProgressPercent(current);
      }
    }, 400);
  };

  // Export JSON Manifest
  const handleExportManifest = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(manifest, null, 2));
    const link = document.createElement('a');
    link.setAttribute('href', dataStr);
    link.setAttribute('download', `lotus_tubes_video_manifest_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    if (onNotify) onNotify('Video manifest exported to JSON', 'success');
  };

  return (
    <div className="crm-workspace-view">
      {/* 1. TOP METRIC OVERVIEW CARDS */}
      <div className="crm-kpi-grid" style={{ marginBottom: '20px' }}>
        {/* KPI 1: Total Catalog Items */}
        <div className="crm-kpi-card">
          <div className="crm-kpi-card__top">
            <span className="crm-kpi-card__label">Catalog Products</span>
            <div className="crm-kpi-card__icon icon-blue">
              <CRMIcon name="products" size={20} />
            </div>
          </div>
          <div className="crm-kpi-card__val">{totalProducts}</div>
          <div className="crm-kpi-card__sub">
            <span className="crm-trend-chip positive">Across 8 sanitary categories</span>
          </div>
        </div>

        {/* KPI 2: 360° Videos Generated */}
        <div className="crm-kpi-card">
          <div className="crm-kpi-card__top">
            <span className="crm-kpi-card__label">360° Orbit Videos Ready</span>
            <div className="crm-kpi-card__icon icon-green">
              <CRMIcon name="check" size={20} />
            </div>
          </div>
          <div className="crm-kpi-card__val">{completed360} / {totalProducts}</div>
          <div className="crm-kpi-card__sub">
            <span className="crm-trend-chip positive">
              ● {percentComplete}% Catalog Coverage
            </span>
          </div>
        </div>

        {/* KPI 3: Cinematic Showcases */}
        <div className="crm-kpi-card">
          <div className="crm-kpi-card__top">
            <span className="crm-kpi-card__label">Cinematic 10s Showcases</span>
            <div className="crm-kpi-card__icon icon-amber">
              <CRMIcon name="reports" size={20} />
            </div>
          </div>
          <div className="crm-kpi-card__val">{completedShowcase} Ready</div>
          <div className="crm-kpi-card__sub">
            <span className="crm-trend-chip positive">5-Scene Studio Format</span>
          </div>
        </div>

        {/* KPI 4: Studio Engine Status */}
        <div className="crm-kpi-card">
          <div className="crm-kpi-card__top">
            <span className="crm-kpi-card__label">Video Synthesis Engine</span>
            <div className="crm-kpi-card__icon icon-purple">
              <CRMIcon name="seo" size={20} />
            </div>
          </div>
          <div className="crm-kpi-card__val" style={{ fontSize: '18px', color: '#0284C7' }}>
            FFmpeg 6.1 GPU
          </div>
          <div className="crm-kpi-card__sub">
            <span className="crm-trend-chip positive">Zero API Cost • Local Studio</span>
          </div>
        </div>
      </div>

      {/* Progress Bar (Visible during bulk generation) */}
      {isBulkGenerating && (
        <div className="crm-card" style={{ marginBottom: '16px', padding: '16px 20px', background: '#F0F9FF', border: '1px solid #BAE6FD' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '13px', fontWeight: 600, color: '#0369A1' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Loader variant="inline" size="sm" color="#0284C7" />
              <span>Bulk video synthesis in progress...</span>
            </span>
            <span>{progressPercent}% Complete</span>
          </div>
          <div style={{ width: '100%', height: '6px', background: '#E0F2FE', borderRadius: '99px', overflow: 'hidden' }}>
            <div style={{ width: `${progressPercent}%`, height: '100%', background: 'linear-gradient(90deg, #0284C7, #38BDF8)', transition: 'width 0.3s ease' }} />
          </div>
        </div>
      )}

      {/* 2. MAIN TOOLBAR & BULK ACTIONS */}
      <div className="crm-card crm-toolbar-card">
        <div className="crm-toolbar-row" style={{ flexWrap: 'wrap', gap: '12px', justifyContent: 'space-between' }}>
          {/* Status Chips */}
          <div className="crm-filter-chips" role="tablist">
            {['All', 'Completed', 'Pending'].map((st) => (
              <button
                key={st}
                type="button"
                role="tab"
                aria-selected={statusFilter === st}
                className={`crm-filter-chip ${statusFilter === st ? 'active' : ''}`}
                onClick={() => setStatusFilter(st)}
              >
                <span>{st}</span>
                <span className="chip-count">
                  {st === 'All' ? catalogItems.length : st === 'Completed' ? completed360 : pendingCount}
                </span>
              </button>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="crm-toolbar-actions" style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button
              type="button"
              className="crm-btn crm-btn-secondary crm-btn-sm"
              onClick={() => setShowAiModal(true)}
              title="Configure external AI Video generation APIs (Runway, Luma, Kling)"
            >
              <CRMIcon name="settings" size={13} />
              <span>AI Cloud Providers</span>
            </button>

            <button
              type="button"
              className="crm-btn crm-btn-secondary crm-btn-sm"
              onClick={handleExportManifest}
              title="Download video assets manifest"
            >
              <CRMIcon name="download" size={13} />
              <span>Export Manifest</span>
            </button>

            <button
              type="button"
              className="crm-btn crm-btn-primary crm-btn-sm"
              onClick={handleBulkGenerate}
              disabled={isBulkGenerating}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              {isBulkGenerating ? (
                <Loader variant="button" size="sm" color="#FFFFFF" label="Processing..." />
              ) : (
                <>
                  <CRMIcon name="plus" size={13} />
                  <span>Bulk Synthesize Missing Videos</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 3. PRODUCT VIDEOS TABLE */}
      <div className="crm-card" style={{ marginTop: '16px' }}>
        <div className="crm-card__header" style={{ justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
          <div className="crm-card__header-title">
            <CRMIcon name="products" size={18} />
            <h3 style={{ margin: 0 }}>Product Catalog Video Assets & Interactive 360° Orbit</h3>
            <span className="crm-badge crm-badge-blue">
              {filteredProducts.length} items
            </span>
          </div>

          {/* Category Dropdown Filter */}
          <select
            className="crm-select-sm"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={{ maxWidth: '240px' }}
          >
            {categories.map((c) => (
              <option key={c} value={c}>Category: {c}</option>
            ))}
          </select>
        </div>

        <div className="crm-card__body" style={{ padding: 0 }}>
          <div className="crm-table-container">
            <table className="crm-table">
              <thead>
                <tr>
                  <th style={{ width: '60px' }}>Preview</th>
                  <th>Product Name & SKU</th>
                  <th>Category</th>
                  <th>Source Mode</th>
                  <th>360° Orbit Video</th>
                  <th>10s Showcase</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((p) => {
                  const isItemGenerating = generatingProductId === p.id;

                  return (
                    <tr key={p.id}>
                      {/* Thumbnail Preview */}
                      <td>
                        <div
                          style={{
                            width: '44px',
                            height: '44px',
                            borderRadius: '6px',
                            background: '#F8FAFC',
                            border: '1px solid #E2E8F0',
                            overflow: 'hidden',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer'
                          }}
                          onClick={() => setPreviewProduct(p)}
                          title="Click to preview 360 video"
                        >
                          <img
                            src={p.image || p.poster}
                            alt={p.name}
                            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                          />
                        </div>
                      </td>

                      {/* Name & SKU */}
                      <td>
                        <div className="crm-cell-title" style={{ fontWeight: 600 }}>{p.name}</div>
                        <div style={{ fontSize: '11px', color: '#64748B', fontFamily: 'monospace' }}>
                          {p.sku || p.id}
                        </div>
                      </td>

                      {/* Category */}
                      <td>
                        <span className="crm-badge crm-badge-blue" style={{ fontSize: '11px' }}>
                          {p.category}
                        </span>
                      </td>

                      {/* Source Mode */}
                      <td>
                        <span style={{ fontSize: '12px', color: '#334155', fontWeight: 500 }}>
                          {p.mode === 'multi-angle-frames' ? (
                            <span style={{ color: '#0369A1' }}>
                              📸 {p.frameCount} Angle Frames
                            </span>
                          ) : (
                            <span style={{ color: '#475569' }}>
                              📐 Studio 2.5D Orbit
                            </span>
                          )}
                        </span>
                      </td>

                      {/* 360 Status */}
                      <td>
                        {p.has360 ? (
                          <button
                            type="button"
                            onClick={() => setPreviewProduct(p)}
                            className="crm-status-pill crm-status-order-confirmed"
                            style={{ cursor: 'pointer', border: 'none' }}
                            title="Click to launch interactive 360 viewer"
                          >
                            ✓ 360° Ready ({Math.round(p.sizeBytes / 1024)} KB)
                          </button>
                        ) : (
                          <span className="crm-badge crm-badge-amber">Pending</span>
                        )}
                      </td>

                      {/* Showcase Status */}
                      <td>
                        {p.hasShowcase ? (
                          <button
                            type="button"
                            onClick={() => setPreviewProduct(p)}
                            className="crm-badge crm-badge-purple"
                            style={{ cursor: 'pointer', border: 'none' }}
                            title="Click to inspect cinematic video"
                          >
                            🎬 10s Showcase
                          </button>
                        ) : (
                          <span className="crm-badge crm-badge-gray">Pending</span>
                        )}
                      </td>

                      {/* Actions */}
                      <td style={{ textAlign: 'right' }}>
                        <div className="crm-table-actions">
                          <button
                            type="button"
                            className="crm-btn crm-btn-xs crm-btn-primary"
                            onClick={() => setPreviewProduct(p)}
                            title="Open interactive 360 inspection"
                          >
                            Preview 360°
                          </button>
                          <button
                            type="button"
                            className="crm-btn crm-btn-xs crm-btn-secondary"
                            onClick={() => handleGenerateSingle(p)}
                            disabled={isItemGenerating || isBulkGenerating}
                            title="Synthesize / regenerate video asset"
                          >
                            {isItemGenerating ? (
                              <Loader variant="inline" size="sm" color="#0284C7" />
                            ) : (
                              'Synthesize'
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 4. INTERACTIVE 360° PREVIEW MODAL */}
      {previewProduct && (
        <div
          className="crm-modal-backdrop visible"
          onClick={() => setPreviewProduct(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="crm-modal"
            style={{ maxWidth: '780px', padding: '0', overflow: 'hidden' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="crm-modal__header" style={{ padding: '16px 20px', borderBottom: '1px solid #E2E8F0' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '16px' }}>{previewProduct.name}</h3>
                <span style={{ fontSize: '12px', color: '#64748B' }}>
                  {previewProduct.category} • SKU: {previewProduct.sku || previewProduct.id}
                </span>
              </div>
              <button
                type="button"
                className="crm-modal-close"
                onClick={() => setPreviewProduct(null)}
                aria-label="Close"
              >
                &times;
              </button>
            </div>

            <div style={{ padding: '20px', background: '#F8FAFC' }}>
              <Product360Viewer
                video360={previewProduct.video360}
                video360Webm={previewProduct.video360Webm}
                videoShowcase={previewProduct.videoShowcase}
                poster={previewProduct.poster || previewProduct.image}
                productName={previewProduct.name}
                category={previewProduct.category}
              />
            </div>

            <div className="crm-modal__footer" style={{ padding: '14px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '12px', color: '#64748B' }}>
                Tip: Drag horizontally with mouse or touch to rotate 360°
              </span>
              <div style={{ display: 'flex', gap: '8px' }}>
                <a
                  href={previewProduct.video360}
                  download={`${previewProduct.id}-360.mp4`}
                  className="crm-btn crm-btn-secondary crm-btn-sm"
                >
                  Download 360 MP4
                </a>
                <button
                  type="button"
                  className="crm-btn crm-btn-primary crm-btn-sm"
                  onClick={() => setPreviewProduct(null)}
                >
                  Close Preview
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. AI CLOUD PROVIDERS & COST CALCULATOR MODAL */}
      {showAiModal && (
        <div
          className="crm-modal-backdrop visible"
          onClick={() => setShowAiModal(false)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="crm-modal"
            style={{ maxWidth: '640px' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="crm-modal__header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CRMIcon name="settings" size={18} />
                <h3 style={{ margin: 0 }}>AI Video Generation Providers & Cost Estimator</h3>
              </div>
              <button
                type="button"
                className="crm-modal-close"
                onClick={() => setShowAiModal(false)}
                aria-label="Close"
              >
                &times;
              </button>
            </div>

            <div className="crm-modal__body" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <p style={{ margin: 0, fontSize: '13px', color: '#475569', lineHeight: 1.5 }}>
                Lotus Tubes provides a provider-independent architecture supporting both local zero-cost rendering and external commercial AI video models.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {/* Local Engine */}
                <div style={{ padding: '12px', borderRadius: '8px', border: '1.5px solid #0284C7', background: '#F0F9FF', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: 700, color: '#0369A1', fontSize: '13.5px' }}>
                      Lotus Local Studio Engine (Active)
                    </div>
                    <div style={{ fontSize: '12px', color: '#64748B' }}>
                      Uses high-speed FFmpeg multi-angle stitching & 2.5D camera orbital synthesis.
                    </div>
                  </div>
                  <span className="crm-badge crm-badge-green">
                    $0.00 (Unlimited Free)
                  </span>
                </div>

                {/* Luma Dream Machine */}
                <div style={{ padding: '12px', borderRadius: '8px', border: '1px solid #E2E8F0', background: '#FFFFFF', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: 600, color: '#10263D', fontSize: '13.5px' }}>
                      Luma Dream Machine API
                    </div>
                    <div style={{ fontSize: '11.5px', color: '#64748B' }}>
                      Env: <code>LUMA_API_KEY</code> • ~$0.08 per video (~$2.40 for 30 products)
                    </div>
                  </div>
                  <span className="crm-badge crm-badge-gray">Available in .env</span>
                </div>

                {/* Kling AI */}
                <div style={{ padding: '12px', borderRadius: '8px', border: '1px solid #E2E8F0', background: '#FFFFFF', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: 600, color: '#10263D', fontSize: '13.5px' }}>
                      Kling AI Video (Kuaishou)
                    </div>
                    <div style={{ fontSize: '11.5px', color: '#64748B' }}>
                      Env: <code>KLING_API_KEY</code> • ~$0.10 per video (~$3.00 for 30 products)
                    </div>
                  </div>
                  <span className="crm-badge crm-badge-gray">Available in .env</span>
                </div>

                {/* Runway Gen-3 */}
                <div style={{ padding: '12px', borderRadius: '8px', border: '1px solid #E2E8F0', background: '#FFFFFF', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: 600, color: '#10263D', fontSize: '13.5px' }}>
                      Runway Gen-3 Alpha
                    </div>
                    <div style={{ fontSize: '11.5px', color: '#64748B' }}>
                      Env: <code>RUNWAY_API_KEY</code> • ~$0.25 per video (~$7.50 for 30 products)
                    </div>
                  </div>
                  <span className="crm-badge crm-badge-gray">Available in .env</span>
                </div>
              </div>

              <div style={{ padding: '12px', background: '#F8FAFC', borderRadius: '8px', fontSize: '12px', color: '#64748B' }}>
                <strong>Configuration Guide:</strong> To connect a commercial AI API, add the provider API key to <code>server/.env</code>. The backend router automatically routes single-image requests through the configured cloud provider while preserving local multi-angle frame stitching.
              </div>
            </div>

            <div className="crm-modal__footer">
              <button
                type="button"
                className="crm-btn crm-btn-primary"
                onClick={() => setShowAiModal(false)}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CRMVideoManagerView;
