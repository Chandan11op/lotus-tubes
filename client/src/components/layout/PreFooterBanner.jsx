import React from 'react';
import { useLanguage } from '../../context/LanguageContext';

export const PreFooterBanner = ({ onOpenEnquiry }) => {
  const { t } = useLanguage();

  return (
    <section className="w-full bg-surface-container-lowest px-4 lg:px-8 py-8 border-t border-surface-container-high/40" aria-label="Quick Technical Actions">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Left Action Box */}
        <div className="p-6 rounded-xl bg-surface-container border border-surface-container-high/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-md">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-lg bg-surface-container-high flex items-center justify-center text-primary-container text-xl shrink-0 border border-surface-container-highest">
              📋
            </div>
            <div className="flex flex-col">
              <h3 className="font-headline-sm text-base text-primary font-bold">
                {t('banner_quote_title', 'Looking for a Custom Quote?')}
              </h3>
              <p className="font-body-sm text-xs text-on-surface-variant">
                {t('banner_quote_desc', 'Share your required sizes, material grades (SS 304/316L), and delivery timeline.')}
              </p>
            </div>
          </div>
          <button
            type="button"
            className="shrink-0 px-4 py-2.5 bg-primary-container hover:bg-primary-fixed text-on-primary-container font-label-technical text-xs font-bold rounded-lg transition-all cursor-pointer shadow-sm"
            onClick={() => onOpenEnquiry && onOpenEnquiry(null, 'Custom Sanitary Stainless Steel Piping')}
          >
            {t('btn_get_quote', 'Get a Quote →')}
          </button>
        </div>

        {/* Right Action Box */}
        <div className="p-6 rounded-xl bg-surface-container-low border border-surface-container-high/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-md">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-lg bg-surface-container-high flex items-center justify-center text-secondary text-xl shrink-0 border border-surface-container-highest">
              📥
            </div>
            <div className="flex flex-col">
              <h3 className="font-headline-sm text-base text-primary font-bold">
                {t('banner_docs_title', 'Need Technical Documents?')}
              </h3>
              <p className="font-body-sm text-xs text-on-surface-variant">
                {t('banner_docs_desc', 'MTC • Product Catalogues • Dimensional Charts • Surface Finish Guides')}
              </p>
            </div>
          </div>
          <a
            href="/resources"
            className="shrink-0 px-4 py-2.5 bg-surface-container-high hover:bg-surface-bright text-primary font-label-technical text-xs font-bold rounded-lg transition-all border border-surface-container-highest"
          >
            {t('banner_docs_btn', 'Download →')}
          </a>
        </div>
      </div>
    </section>
  );
};

export default PreFooterBanner;