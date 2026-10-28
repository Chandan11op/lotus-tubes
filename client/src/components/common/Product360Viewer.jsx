import React, { useState } from 'react';
import InteractiveCanvas from '../3d/InteractiveCanvas.jsx';
import ProductImage from './ProductImage.jsx';

/**
 * Enhanced 360° Technical Inspection Viewer
 * Provides:
 * - Real-time WebGL 3D model with orbital manipulation (rotate, zoom, pan, lighting)
 * - Toggleable mode between 3D Model and High-Resolution Studio Photograph
 * - Specification watermark and technical validation badge
 * - Graceful fallback on unsupported browsers
 */
export const Product360Viewer = ({ product, fallbackImage, height = '420px' }) => {
  const [viewMode, setViewMode] = useState('3d'); // '3d' or 'photo'

  const primaryPhoto = product?.image || fallbackImage || '/assets/images/products/pipes/electro-polished/ss-316l-electropolished-sanitary-tube-001.jpg';

  return (
    <div className="relative w-full rounded-xl overflow-hidden border border-slate-200/80 shadow-md bg-white">
      {/* Mode Switcher Tabs */}
      <div className="absolute top-3 left-3 z-20 flex items-center gap-1 bg-slate-900/80 backdrop-blur-md p-1 rounded-lg shadow-sm">
        <button
          type="button"
          onClick={() => setViewMode('3d')}
          className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
            viewMode === '3d'
              ? 'bg-sky-500 text-white shadow'
              : 'text-slate-300 hover:text-white'
          }`}
        >
          🔄 Interactive 3D Model
        </button>

        <button
          type="button"
          onClick={() => setViewMode('photo')}
          className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
            viewMode === 'photo'
              ? 'bg-sky-500 text-white shadow'
              : 'text-slate-300 hover:text-white'
          }`}
        >
          📷 Studio Photograph
        </button>
      </div>

      {/* Main Display Stage */}
      {viewMode === '3d' ? (
        <InteractiveCanvas
          product={product}
          fallbackImage={primaryPhoto}
          height={height}
          enableFloat={false}
        />
      ) : (
        <div className="relative w-full flex items-center justify-center bg-slate-50 p-6" style={{ height }}>
          <ProductImage
            src={primaryPhoto}
            alt={product?.name || 'Lotus Tubes Specification Photo'}
            aspectRatio="auto"
            className="w-full h-full max-h-full"
            imgClassName="max-h-[360px] object-contain"
            priority={true}
          />
          <div className="absolute bottom-3 right-3 bg-slate-900/80 text-white text-[11px] font-medium px-2.5 py-1 rounded backdrop-blur-sm">
            Genuine Studio Photograph &bull; {product?.material || 'SS 316L'}
          </div>
        </div>
      )}
    </div>
  );
};

export default Product360Viewer;
