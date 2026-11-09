import React from 'react';
import { CONFIG } from '../../data/siteData';

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
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="#FFFFFF"
          className="lt-whatsapp-icon"
          aria-hidden="true"
        >
          <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.592 2.654-.696c1.02.584 1.785.836 2.806.837 3.181 0 5.767-2.586 5.768-5.766.001-3.181-2.585-5.768-5.768-5.768zm3.393 8.309c-.14.394-.813.729-1.127.776-.314.047-.707.067-2.12-.497-1.413-.564-2.512-1.956-2.583-2.05-.07-.094-.572-.76-.572-1.447s.361-1.025.49-.166c.129-.141.282-.176.376-.176.094 0 .188.001.27.006.088.005.204-.033.319.243.117.282.4 1.012.435 1.082.035.07.058.153.012.247-.047.094-.07.153-.141.235-.07.082-.148.183-.211.247-.071.071-.144.148-.062.289.082.141.366.604.786.978.54.481.996.63 1.137.7s.224.059.306-.035c.082-.094.353-.412.447-.553.094-.141.188-.118.318-.071.129.047.824.388.965.459.141.071.235.106.27.165.035.059.035.341-.106.735zM12 2C6.477 2 2 6.477 2 12c0 1.891.524 3.662 1.435 5.176L2 22l4.981-1.396A9.957 9.957 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18.062c-1.637 0-3.167-.47-4.464-1.282l-.32-.199-2.96.777.79-2.884-.21-.334A8.026 8.026 0 014 12c0-4.411 3.589-8.062 8-8.062 4.411 0 8 3.651 8 8.062 0 4.411-3.589 8.062-8 8.062z" />
        </svg>
      </a>
    </div>
  );
};

export default FloatingWhatsApp;
