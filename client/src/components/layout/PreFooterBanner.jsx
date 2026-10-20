import React from 'react';
import { useLanguage } from '../../context/LanguageContext';

export const PreFooterBanner = () => {
  const { t } = useLanguage();

  return (
    <section className="pre-footer-banner" aria-label="Quick Technical Actions">
      <div className="pre-footer-banner__inner">
        <div className="pre-footer-banner__half pre-footer-banner__half--pink">
          <div className="banner-content">
            <div className="banner-icon" aria-hidden="true">
              <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10 9 9 9 8 9"></polyline>
              </svg>
            </div>
            <div className="banner-text">
              <h3>{t('banner_quote_title', 'Looking for a Custom Quote?')}</h3>
              <p>{t('banner_quote_desc', 'Share your required sizes, material grades (SS 304/316L), and delivery timeline.')}</p>
            </div>
            <a href="#quote" className="btn btn--white">
              {t('btn_get_quote', 'Get a Quote →')}
            </a>
          </div>
        </div>

        <div className="pre-footer-banner__half pre-footer-banner__half--navy">
          <div className="banner-content">
            <div className="banner-icon" aria-hidden="true">
              <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
                <polyline points="13 2 13 9 20 9"></polyline>
              </svg>
            </div>
            <div className="banner-text">
              <h3>{t('banner_docs_title', 'Need Technical Documents?')}</h3>
              <p>{t('banner_docs_desc', 'MTC • Product Catalogues • Dimensional Charts • Surface Finish Guides')}</p>
            </div>
            <a href="#resources" className="btn btn--outline-light">
              {t('banner_docs_btn', 'Download →')}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PreFooterBanner;
