import React, { useState } from 'react';
import InteractiveCanvas from '../3d/InteractiveCanvas.jsx';
import ProductImage from './ProductImage.jsx';
import { hasVerified3DModel, getProductModelStatus } from '../../data/modelRegistry.js';

/**
 * Technical Product Media Viewer
 * Provides:
 * - High-Resolution Studio Photograph as the primary inspection view
 * - Real-time WebGL 3D model with orbital manipulation when verified CAD model exists
 * - Graceful fallback to verified photography when 3D is unavailable
 */
export const Product360Viewer = ({ product, fallbackImage, height = '420px', initialMode = 'photo' }) => {
  const is3DVerified = hasVerified3DModel(product);
  const [viewMode, setViewMode] = useState(is3DVerified && initialMode === '3d' ? '3d' : 'photo');

  const primaryPhoto = product?.image || fallbackImage || '/assets/images/products/pipes/electro-polished/ss-316l-electropolished-sanitary-tube-001.jpg';
  const modelSpec = getProductModelStatus(product);

  return (
    <div className="relative w-full rounded-xl overflow-hidden border border-slate-200/80 shadow-md bg-white">
      {/* Mode Switcher Tabs - Only rendered when a verified 3D model exists */}
      {is3DVerified && (
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
            🔄 3D Digital Twin
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
      )}

      {/* Main Display Stage */}
      {viewMode === '3d' && is3DVerified ? (
        <div className="relative w-full">
          <InteractiveCanvas
            product={product}
            fallbackImage={primaryPhoto}
            height={height}
            enableFloat={false}
          />
          {modelSpec.standard && (
            <div className="absolute top-3 right-3 z-10 hidden sm:block bg-slate-900/80 text-sky-300 text-[11px] font-medium px-2.5 py-1 rounded backdrop-blur-sm border border-slate-700/60">
              Verified: {modelSpec.standard}
            </div>
          )}
        </div>
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
            High-Resolution Studio Photograph • {product?.material || 'SS 316L'}
          </div>
        </div>
      )}
    </div>
  );
};

export default Product360Viewer;
