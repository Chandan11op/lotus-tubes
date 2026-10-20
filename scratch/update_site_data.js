import fs from 'fs';
import path from 'path';
import { pathToFileURL } from 'url';

const siteDataPath = path.resolve('client/src/data/siteData.js');
let content = fs.readFileSync(siteDataPath, 'utf8');

// 1. Replace getInitialCRMData() body with empty arrays (no fake data)
const crmStart = content.indexOf('function getInitialCRMData() {');
const crmEnd = content.indexOf('function loadCRMData() {');

if (crmStart !== -1 && crmEnd !== -1) {
  const cleanCRM = `function getInitialCRMData() {
    return {
      enquiries: [],
      customers: [],
      quotations: [],
      tasks: [],
      employees: [],
      integrations: {
        whatsappStatus: 'Cloud API Ready',
        whatsappPhone: '+91 99304 30789',
        emailSMTP: 'Configured (sales@lotustubes.com)',
        autoEnquiryCapture: true
      }
    };
  }

  `;
  content = content.substring(0, crmStart) + cleanCRM + content.substring(crmEnd);
  console.log('CRM demo data removed from getInitialCRMData()');
}

// 2. Map videos & 3 images for each product
function getVideoForCategory(catSlug) {
  if (catSlug === 'sanitary-pipes') return '/assets/videos/pipes-360-sample.webm';
  if (catSlug === 'sanitary-fittings') return '/assets/videos/fittings-360-sample.webm';
  if (catSlug === 'tri-clamp' || catSlug === 'gaskets') return '/assets/videos/clamps-360-sample.webm';
  return '/assets/videos/valves-360-sample.webm';
}

const prodStart = content.indexOf('const PRODUCTS = [');
const prodEnd = content.indexOf('const INDUSTRIES = [');

if (prodStart !== -1 && prodEnd !== -1) {
  const fileUrl = pathToFileURL(siteDataPath).href;
  const { PRODUCTS } = await import(fileUrl);
  
  const updatedProducts = PRODUCTS.map(p => {
    const video = getVideoForCategory(p.categorySlug);
    const mainImg = p.image.startsWith('/') ? p.image : `/${p.image}`;
    const images = [
      mainImg,
      `/assets/images/products/details/${p.slug}-bore.svg`,
      `/assets/images/products/details/${p.slug}-pack.svg`
    ];
    return {
      ...p,
      video,
      images,
      mediaStatus: 'sample'
    };
  });

  const productsCode = `const PRODUCTS = ${JSON.stringify(updatedProducts, null, 2)};\n\n  `;
  content = content.substring(0, prodStart) + productsCode + content.substring(prodEnd);
  console.log('PRODUCTS updated with video, 3 images, and mediaStatus');
}

fs.writeFileSync(siteDataPath, content);
console.log('Successfully updated siteData.js');
