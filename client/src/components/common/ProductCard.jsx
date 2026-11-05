import React from 'react';
import ProductCardVideo from './ProductCardVideo';
import { useLanguage } from '../../context/LanguageContext';

/**
 * LOTUS TUBES - Professional Industrial Product Card
 *
 * Designed to eliminate floating label clutter from product photography while
 * presenting verified technical attributes, clean specification chips, and deliberate
 * 360° video access in a responsive, structured hierarchy.
 */
export const ProductCard = ({
  product,
  onOpenEnquiry,
  className = ''
}) => {
  if (!product) return null;

  const { t, currentLang, localizePath } = useLanguage();

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
    image,
    video,
    video360,
    has360
  } = product;

  // Verified 360° Video presence check
  const hasVerifiedVideo = Boolean(has360 && (video360 || video));

  // Clean, standardized formatters for compact attribute chips
  const formatMaterialChip = (mat = '') => {
    if (!mat) return 'SS 316L / 304';
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
    <article className={`product-card group flex flex-col h-full bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-lg hover:border-sky-500/40 transition-all duration-300 ${className}`}>
      
      {/* 1. Unobstructed Product Media Stage */}
      <div className="product-card__img-wrap aspect-[4/3] bg-slate-50 relative overflow-hidden border-b border-slate-100">
        <a
          href={productPath}
          className="block w-full h-full cursor-pointer focus:outline-none focus:ring-2 focus:ring-sky-500"
          tabIndex="-1"
          aria-hidden="true"
        >
          <ProductCardVideo
            video={video || video360}
            poster={image}
            alt={name}
            categorySlug={categorySlug}
            has360={false}
            className="product-card__img w-full h-full object-contain p-3 transition-transform duration-300 group-hover:scale-105"
          />
        </a>
      </div>

      {/* 2. Structured Card Body & Specifications Area */}
      <div className="product-card__body p-4 sm:p-5 flex flex-col flex-1 min-w-0">
        
        {/* Category & 360° Video Action Header */}
        <div className="flex items-center justify-between gap-2 mb-2 min-w-0">
          <span className="product-card__category text-[11px] font-bold text-sky-700 tracking-wider uppercase truncate">
            {category || 'Sanitary Component'}
          </span>

          {/* Deliberate, subtle 360° Video Action Indicator */}
          {hasVerifiedVideo && (
            <a
              href={`${productPath}?view=360`}
              className="product-card__video-badge inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10.5px] font-semibold bg-sky-50 text-sky-700 border border-sky-200/80 hover:bg-sky-100 hover:text-sky-800 transition-colors shrink-0"
              title="Verified 360° interactive rotation video available"
              aria-label={`View 360° video for ${name}`}
            >
              <svg className="w-3 h-3 text-sky-600 animate-spin-slow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
              </svg>
              <span>{t('badge_360', '360° Video')}</span>
            </a>
          )}
        </div>

        {/* Product Title */}
        <h3 className="product-card__title text-base font-bold text-slate-900 leading-snug mb-2.5 min-h-[2.6em] line-clamp-2">
          <a
            href={productPath}
            className="hover:text-sky-700 transition-colors"
          >
            {name}
          </a>
        </h3>

        {/* Compact, Aligned Specification Chips (Material, Finish, Standard) */}
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
              className="spec-chip spec-chip--finish px-2 py-0.5 rounded text-[11px] font-medium bg-cyan-50 text-cyan-800 border border-cyan-200/70"
              title={`Surface Finish: ${finish}`}
            >
              {finishChip}
            </span>
          )}

          {standardChip && (
            <span
              className="spec-chip spec-chip--standard px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-50 text-emerald-800 border border-emerald-200/70"
              title={`Compliance Standard: ${standard}`}
            >
              {standardChip}
            </span>
          )}
        </div>

        {/* Concise 2-Row Technical Attribute Summary */}
        <div className="product-card__specs-table bg-slate-50/80 border border-slate-200/70 rounded-lg p-2.5 text-xs text-slate-600 mb-4 flex flex-col gap-1.5">
          <div className="flex items-center justify-between gap-2">
            <span className="font-semibold text-slate-500 shrink-0">Standard:</span>
            <span className="text-slate-800 font-medium truncate text-right">
              {standard || 'ASME BPE / 3-A / ASTM A270'}
            </span>
          </div>

          <div className="flex items-center justify-between gap-2">
            <span className="font-semibold text-slate-500 shrink-0">Sizes:</span>
            <span className="text-slate-800 font-medium truncate text-right">
              {sizes || '1/2" to 4" OD (Standard Stock)'}
            </span>
          </div>
        </div>

        {/* Action Buttons: View Details & Request RFQ */}
        <div className="product-card__actions mt-auto flex items-center gap-2 pt-2 border-t border-slate-100">
          <a
            href={productPath}
            className="btn btn--outline-dark btn--sm flex-1 text-center py-2 text-xs font-semibold rounded-lg border border-slate-300 hover:border-slate-800 hover:bg-slate-50 transition-colors"
          >
            {t('view_details', 'View Details')}
          </a>

          <button
            type="button"
            className="btn btn--primary btn--sm quick-rfq-btn flex-1 py-2 text-xs font-bold rounded-lg shadow-sm hover:shadow transition-all"
            onClick={() => onOpenEnquiry && onOpenEnquiry(id, name)}
          >
            {t('btn_request_rfq', 'Request RFQ')}
          </button>
        </div>

      </div>

    </article>
  );
};

export default ProductCard;

