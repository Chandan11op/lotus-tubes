import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { CONFIG } from '../../data/siteData';

export const Footer = () => {
  const { t } = useLanguage();
  const rawPhone = (CONFIG.primaryPhone || '+91 98205 25200').replace(/\s+/g, '');

  return (
    <footer className="site-footer" id="site-footer">
      <div className="site-container site-footer__main">
        <div className="footer-grid">

          {/* Col 1: Brand & Sourcing Statement */}
          <div className="footer-col footer-col--brand">
            <a href="#home" className="footer-brand-link" aria-label="Lotus Tubes - Return to Home">
              <img src="/Lotus Tubes Logo.png" alt="Lotus Tubes - Stainless Steel Sanitary Pipes & Valves" className="footer-logo" />
            </a>
            <p className="footer-description">
              {t(
                'footer_desc',
                'Lotus Tubes is a trusted supplier of premium stainless steel sanitary pipes, fittings, and valves in SS 304 and SS 316L. Supporting hygienic process applications across dairy, pharmaceutical, food, brewery, and water purification sectors worldwide.'
              )}
            </p>
            <div className="footer-badges">
              <span className="cert-tag">SS 304 • SS 316L</span>
              <span className="cert-tag">EP • MP Finishes</span>
              <span className="cert-tag">ASTM A270 / A269 Standards</span>
            </div>
            <div className="footer-socials">
              <a
                href={`https://wa.me/${CONFIG.whatsappNumber}?text=Hello%20Lotus%20Tubes%2C%20I%20have%20an%20enquiry%20regarding%20sanitary%20stainless%20steel%20products.`}
                className="social-link"
                title="WhatsApp Business"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp Business Desk"
              >
                💬
              </a>
              <a href={`mailto:${CONFIG.primaryEmail}`} className="social-link" title="Email Sales" aria-label="Email Sales Desk">
                ✉️
              </a>
              <a href={`tel:${rawPhone}`} className="social-link" title="Call Lotus Tubes" aria-label="Direct Phone Line">
                📞
              </a>
            </div>
          </div>

          {/* Col 2: Product Categories */}
          <div className="footer-col">
            <h4 className="footer-col__title">{t('footer_col_products', 'Sanitary Products')}</h4>
            <ul className="footer-links">
              <li><a href="#category/sanitary-pipes">Sanitary Pipes & Tubes</a></li>
              <li><a href="#category/sanitary-fittings">Sanitary Pipe Fittings</a></li>
              <li><a href="#category/tri-clamp">Tri-Clamp Components & Clamps</a></li>
              <li><a href="#category/gaskets">Sanitary Food-Grade Gaskets</a></li>
              <li><a href="#category/manual-valves">Hygienic Butterfly & Ball Valves</a></li>
              <li><a href="#category/pneumatic-valves">Pneumatic Diaphragm Valves</a></li>
              <li><a href="#category/tank-cleaning">Tank Cleaning Spray Balls</a></li>
              <li><a href="#category/custom-assemblies">Custom Hygienic Spools</a></li>
            </ul>
          </div>

          {/* Col 3: Industries Served */}
          <div className="footer-col">
            <h4 className="footer-col__title">{t('footer_col_industries', 'Industries Served')}</h4>
            <ul className="footer-links">
              <li><a href="#industry/pharmaceutical">{t('ind_pharma', 'Pharmaceutical Processing')}</a></li>
              <li><a href="#industry/biotechnology">{t('ind_biotech', 'Biotechnology & Sterile')}</a></li>
              <li><a href="#industry/dairy">{t('ind_dairy', 'Dairy & Milk Processing')}</a></li>
              <li><a href="#industry/food-beverage">{t('ind_food', 'Food & Beverage Manufacturing')}</a></li>
              <li><a href="#industry/breweries">{t('ind_brew', 'Breweries & Distilleries')}</a></li>
              <li><a href="#industry/water-treatment">{t('ind_water', 'WFI & Pure Water Treatment')}</a></li>
              <li><a href="#industry/chemical">{t('ind_chemical', 'Fine Chemical & Cosmetics')}</a></li>
            </ul>
          </div>

          {/* Col 4: Corporate & Compliance */}
          <div className="footer-col">
            <h4 className="footer-col__title">{t('footer_col_info', 'Information & Portal')}</h4>
            <ul className="footer-links">
              <li><a href="#about">{t('nav_about', 'About Lotus Tubes')}</a></li>
              <li><a href="#quality">{t('nav_quality', 'Material Grades & MTC Policy')}</a></li>
              <li><a href="#resources">{t('nav_resources', 'Datasheets & Dimension Charts')}</a></li>
              <li><a href="#contact">{t('nav_contact', 'Contact & Plant Location')}</a></li>
              <li><a href="#quote">{t('btn_get_quote', 'Submit Detailed BOQ / RFQ')}</a></li>
            </ul>
          </div>

          {/* Col 5: Registered Office & Details */}
          <div className="footer-col footer-col--contact">
            <h4 className="footer-col__title">{t('footer_col_office', 'Supply & Office Desk')}</h4>
            <p className="contact-line">
              <strong>{t('label_office', 'Registered Office:')}</strong><br />
              {CONFIG.officeAddress}
            </p>
            <p className="contact-line">
              <strong>GSTIN:</strong> {CONFIG.gstin}<br />
              <strong>IEC:</strong> {CONFIG.iec}
            </p>
            <p className="contact-line">
              <strong>{t('label_direct_sales', 'Direct Sales:')}</strong>{' '}
              <a href={`tel:${rawPhone}`}>{CONFIG.primaryPhone}</a><br />
              <strong>Email:</strong> <a href={`mailto:${CONFIG.primaryEmail}`}>{CONFIG.primaryEmail}</a>
            </p>
            <div className="footer-timing">
              <span>{t('footer_timing', 'Working Hours: Mon - Sat: 9:30 AM - 7:00 PM IST')}</span>
            </div>
          </div>

        </div>
      </div>

      <div className="site-footer__bottom">
        <div className="site-container site-footer__bottom-inner">
          <p>
            &copy; <span>{new Date().getFullYear()}</span> Lotus Tubes ({CONFIG.companyLegalName}).{' '}
            <span>{t('footer_rights', 'All rights reserved. Stainless Steel Sanitary Solutions.')}</span>
          </p>
          <div className="footer-bottom-links">
            <a href="#quality">Quality Disclaimer</a>
            <span className="sep">•</span>
            <a href="#contact">Privacy Policy</a>
            <span className="sep">•</span>
            <a href="#contact">Terms of Supply</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
