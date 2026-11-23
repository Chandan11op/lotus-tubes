import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { getCategoryFallbackImage, UNIVERSAL_FALLBACK_IMAGE, INLINE_SVG_FAILSAFE } from '../../utils/mediaFallback';

/**
 * LOTUS TUBES - Professional Industrial Product Card
 *
 * Strict Figma Design System Implementation:
 * - 100% STATIC PRODUCT PHOTOGRAPHS ONLY (No 3D models, no 360-degree rotation, no video players)
 * - Clear category and ready stock badges
 * - Aligned specification chips (Material, Finish, Standard, MTC)
 * - Quick RFQ & View Details CTAs matching Figma pink/navy styling
 */
export const ProductCard = ({
  product,
  onOpenEnquiry,
  className = ''
}) => {
  if (!product) return null;

  const { t, currentLang, localizePath } = useLanguage();
  const [imgFallbackLevel, setImgFallbackLevel] = useState(0);

  const {
    id,
    name,
    slug,
    category,
    categorySlug,
    material,
    finish,
    standard,
    sizes,
    image
  } = product;

  const handleImageError = () => {
    setImgFallbackLevel((prev) => prev + 1);
  };

  const resolveImage = () => {
    if (imgFallbackLevel === 0) return image || getCategoryFallbackImage(categorySlug, name);
    if (imgFallbackLevel === 1) return getCategoryFallbackImage(categorySlug, name);
    if (imgFallbackLevel === 2) return UNIVERSAL_FALLBACK_IMAGE;
    return INLINE_SVG_FAILSAFE;
  };

  // Clean formatters for compact attribute chips
  const formatMaterialChip = (mat = '') => {
    if (!mat) return null;
    if (/304.*316|316.*304/i.test(mat)) return 'SS 304 / SS 316L';
    if (/316l?/i.test(mat)) return 'SS 316L';
    if (/304l?/i.test(mat)) return 'SS 304';
    if (/silicone/i.test(mat)) return 'Silicone USP VI';
    if (/ptfe/i.test(mat)) return 'PTFE Grade';
    if (/epdm/i.test(mat)) return 'EPDM Grade';
    if (/viton/i.test(mat)) return 'FKM Viton';
    return mat.length > 24 ? `${mat.substring(0, 22)}...` : mat;
  };

  const formatFinishChip = (fin = '') => {
    if (!fin) return null;
    if (/electro|ep/i.test(fin)) return 'EP Mirror';
    if (/mechanical|mp/i.test(fin)) return 'MP Satin';
    if (/mirror/i.test(fin)) return 'Mirror Polish';
    if (/satin/i.test(fin)) return 'Satin Polish';
    if (/fda/i.test(fin)) return 'FDA Food Grade';
    return fin.split(' ')[0];
  };

  const formatStandardChip = (std = '') => {
    if (!std) return null;
    if (/a270/i.test(std)) return 'ASTM A270';
    if (/bpe/i.test(std)) return 'ASME BPE';
    if (/3-?a/i.test(std)) return '3-A Certified';
    if (/din/i.test(std)) return 'DIN 11851';
    if (/sms/i.test(std)) return 'SMS Standard';
    return null;
  };

  const materialChip = formatMaterialChip(material);
  const finishChip = formatFinishChip(finish);
  const standardChip = formatStandardChip(standard);
  const productPath = localizePath(`/product/${slug || id}`, currentLang);

  return (
    <article
      onClick={(e) => {
        if (e.target.closest('button') || e.target.closest('.rfq-action-btn')) return;
        if (window.history && window.history.pushState) {
          window.history.pushState({}, '', productPath);
          window.dispatchEvent(new PopStateEvent('popstate'));
        } else {
          window.location.href = productPath;
        }
      }}
      className={`product-card group flex flex-col h-full bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-xl hover:border-[#E93984]/50 transition-all duration-300 cursor-pointer ${className}`}
    >
      
      {/* 1. Static Product Photograph Stage */}
      <div className="product-card__img-wrap aspect-[4/3] bg-slate-50 relative overflow-hidden border-b border-slate-100 p-4 flex items-center justify-center">
        <a
          href={productPath}
          className="block w-full h-full cursor-pointer focus:outline-none flex items-center justify-center"
          tabIndex="-1"
          aria-hidden="true"
        >
          <img
            src={resolveImage()}
            alt={name}
            loading="lazy"
            onError={handleImageError}
            className="product-card__img max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105"
          />
        </a>
      </div>

      {/* 2. Structured Card Body & Specifications Area */}
      <div className="product-card__body p-4 sm:p-5 flex flex-col flex-1 min-w-0">
        
        {/* Category Header & Stock Status */}
        <div className="flex items-center justify-between gap-2 mb-2 min-w-0">
          <span className="product-card__category text-[11px] font-bold text-[#E93984] tracking-wider uppercase truncate">
            {category || 'Sanitary Component'}
          </span>
          <span className="flex items-center gap-1 text-[10px] font-sans font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Ready Stock
          </span>
        </div>

        {/* Product Title */}
        <h3 className="product-card__title text-sm sm:text-base font-bold text-slate-900 leading-snug mb-2.5 min-h-[2.6em] line-clamp-2">
          <a
            href={productPath}
            className="hover:text-[#E93984] transition-colors"
          >
            {name}
          </a>
        </h3>

        {/* Compact, Aligned Specification Chips (Material, Finish, Standard, MTC) */}
        <div className="product-card__chips-row flex flex-wrap items-center gap-1.5 mb-3">
          {materialChip && (
            <span
              className="spec-chip spec-chip--material px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200/80"
              title={`Material Grade: ${material}`}
            >
              {materialChip}
            </span>
          )}

          {finishChip && (
            <span
              className="spec-chip spec-chip--finish px-2 py-0.5 rounded text-[11px] font-medium bg-pink-50 text-[#E93984] border border-pink-200/70"
              title={`Surface Finish: ${finish}`}
            >
              {finishChip}
            </span>
          )}

          {standardChip && (
            <span
              className="spec-chip spec-chip--standard px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200"
              title={`Compliance Standard: ${standard}`}
            >
              {standardChip}
            </span>
          )}

          <span
            className="spec-chip spec-chip--mtc px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-100 text-slate-700 border border-slate-200"
            title="EN 10204 3.1 Material Test Certificate Traceable"
          >
            EN 10204 3.1
          </span>
        </div>

        {/* Concise 2-Row Technical Attribute Summary */}
        <div className="product-card__specs-table bg-slate-50 border border-slate-200/70 rounded-xl p-2.5 text-xs text-slate-600 mb-4 flex flex-col gap-1.5">
          <div className="flex items-center justify-between gap-2">
            <span className="font-semibold text-slate-500 shrink-0">Standard:</span>
            <span className="text-slate-800 font-medium truncate text-right">
              {standard || 'Confirm on enquiry'}
            </span>
          </div>

          <div className="flex items-center justify-between gap-2">
            <span className="font-semibold text-slate-500 shrink-0">Sizes:</span>
            <span className="text-slate-800 font-medium truncate text-right">
              {sizes || 'Per technical schedule'}
            </span>
          </div>
        </div>

        {/* Action Buttons: View Details & Request RFQ */}
        <div className="product-card__actions mt-auto flex items-center gap-2 pt-2 border-t border-slate-100">
          <a
            href={productPath}
            className="flex-1 text-center py-2 px-3 text-xs font-semibold rounded-full border border-slate-300 text-slate-700 hover:border-slate-800 hover:bg-slate-50 transition-colors"
          >
            {t('view_details', 'View Details')}
          </a>

          <button
            type="button"
            className="rfq-action-btn flex-1 py-2 px-3 text-xs font-bold rounded-full bg-gradient-to-r from-[#E93984] to-[#FC63A7] hover:from-[#D81B60] hover:to-[#E93984] text-white shadow-sm hover:shadow transition-all cursor-pointer z-10"
            onClick={(e) => {
              e.stopPropagation();
              onOpenEnquiry && onOpenEnquiry(id, name);
            }}
          >
            {t('btn_request_rfq', 'Request RFQ')}
          </button>
        </div>

      </div>

    </article>
  );
};

export default ProductCard;
