import React from 'react';
import { CONFIG } from '../../data/siteData';

/**
 * FloatingWhatsApp
 * Official WhatsApp Business quick-action floating trigger.
 * Uses verified Meta WhatsApp brand mark geometry with high-contrast accessibility.
 */
export const FloatingWhatsApp = () => {
  const whatsappNumber = CONFIG.whatsappNumber || '919820525200';
  const defaultMessage = 'Hello Lotus Tubes, I have an enquiry regarding stainless steel sanitary products.';
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(defaultMessage)}`;

  return (
    <div className="lt-floating-whatsapp-container">
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="lt-floating-whatsapp-btn"
        aria-label="Enquire with Lotus Tubes on WhatsApp (+91 98205 25200)"
        title="Enquire on WhatsApp (+91 98205 25200)"
      >
        <span className="lt-whatsapp-ping" />
        {/* Official Meta WhatsApp Vector Icon */}
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="lt-whatsapp-icon"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.63C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2ZM12.04 20.15C10.56 20.15 9.11 19.76 7.85 19.01L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.3C4.24 14.99 3.8 13.47 3.8 11.91C3.8 7.37 7.5 3.67 12.04 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.04 20.15ZM16.56 14.39C16.31 14.26 15.1 13.67 14.87 13.59C14.65 13.51 14.48 13.46 14.32 13.71C14.15 13.96 13.67 14.53 13.53 14.7C13.38 14.86 13.24 14.88 12.99 14.76C12.74 14.63 11.95 14.37 11.01 13.54C10.28 12.89 9.78 12.08 9.64 11.83C9.49 11.58 9.62 11.45 9.75 11.32C9.86 11.21 10 11.04 10.12 10.9C10.25 10.76 10.29 10.66 10.37 10.49C10.45 10.33 10.41 10.18 10.35 10.06C10.29 9.93 9.79 8.71 9.59 8.2C9.39 7.71 9.18 7.78 9.03 7.77C8.89 7.76 8.72 7.76 8.55 7.76C8.38 7.76 8.11 7.82 7.88 8.07C7.65 8.32 7 8.93 7 10.17C7 11.41 7.9 12.61 8.03 12.77C8.15 12.94 9.81 15.5 12.35 16.59C12.95 16.85 13.42 17.01 13.79 17.12C14.4 17.31 14.95 17.29 15.39 17.22C15.88 17.15 16.9 16.61 17.11 16.02C17.32 15.43 17.32 14.93 17.26 14.82C17.2 14.72 17.06 14.66 16.81 14.53L16.56 14.39Z"
            fill="white"
          />
        </svg>
      </a>
    </div>
  );
};

export default FloatingWhatsApp;
