const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, '../client/public');

const PRODUCT_MAPPINGS = {
  'ss-316l-ep-pipe': {
    image: '/assets/images/products images/SS EP PIPE/TPM-10.jpg',
    images: [
      '/assets/images/products images/SS EP PIPE/TPM-10.jpg',
      '/assets/images/products images/SS EP PIPE/TPM-11.jpg',
      '/assets/images/products images/SS EP PIPE/TPM-12.jpg',
      '/assets/images/products images/SS EP PIPE/TPM-13.jpg',
      '/assets/images/products images/SS EP PIPE/TPM-16.jpg'
    ]
  },
  'ss-304-ep-pipe': {
    image: '/assets/images/products images/SS EP PIPE/TPM-10.jpg',
    images: [
      '/assets/images/products images/SS EP PIPE/TPM-10.jpg',
      '/assets/images/products images/SS EP PIPE/TPM-11.jpg',
      '/assets/images/products images/SS EP PIPE/TPM-12.jpg'
    ]
  },
  'ss-316l-mp-pipe': {
    image: '/assets/images/products images/SS MP PIPE/TPM-1.jpg',
    images: [
      '/assets/images/products images/SS MP PIPE/TPM-1.jpg',
      '/assets/images/products images/SS MP PIPE/TPM-14.jpg',
      '/assets/images/products images/SS MP PIPE/TPM-15.jpg',
      '/assets/images/products images/SS MP PIPE/TPM-17.jpg'
    ]
  },
  'ss-304-mp-pipe': {
    image: '/assets/images/products images/SS MP PIPE/TPM-2.jpg',
    images: [
      '/assets/images/products images/SS MP PIPE/TPM-2.jpg',
      '/assets/images/products images/SS MP PIPE/TPM-19.jpg',
      '/assets/images/products images/SS MP PIPE/TPM-20.jpg'
    ]
  },
  'ss-316l-fittings-range': {
    image: '/assets/images/products images/cover page/TPM-195.jpg',
    images: [
      '/assets/images/products images/cover page/TPM-195.jpg',
      '/assets/images/products images/cover page/TPM-196.jpg',
      '/assets/images/products images/SS BUTWELDED ELBOW/TPM-136.jpg',
      '/assets/images/products images/SS EQUAL TEE/TPM-103.jpg'
    ]
  },
  'ss-sanitary-90-bend': {
    image: '/assets/images/products images/SS LONG BEND/TPM-100.jpg',
    images: [
      '/assets/images/products images/SS LONG BEND/TPM-100.jpg',
      '/assets/images/products images/SS LONG BEND/TPM-101.jpg',
      '/assets/images/products images/SS LONG BEND/TPM-102.jpg',
      '/assets/images/products images/SS BUTWELDED ELBOW/TPM-136.jpg',
      '/assets/images/products images/SS TC BEND/TPM-177.jpg'
    ]
  },
  'ss-sanitary-equal-tee': {
    image: '/assets/images/products images/SS EQUAL TEE/TPM-103.jpg',
    images: [
      '/assets/images/products images/SS EQUAL TEE/TPM-103.jpg',
      '/assets/images/products images/SS EQUAL TEE/TPM-104.jpg',
      '/assets/images/products images/SS EQUAL TEE/TPM-105.jpg',
      '/assets/images/products images/SS BUTWELDED TEE/TPM-132.jpg'
    ]
  },
  'ss-sanitary-reducing-tee': {
    image: '/assets/images/products images/SS BUTWELDED TEE/TPM-132.jpg',
    images: [
      '/assets/images/products images/SS BUTWELDED TEE/TPM-132.jpg',
      '/assets/images/products images/SS BUTWELDED TEE/TPM-133.jpg',
      '/assets/images/products images/SS EQUAL TEE/TPM-106.jpg'
    ]
  },
  'ss-sanitary-concentric-reducer': {
    image: '/assets/images/products images/SS CONCENTRIC REDUCER/TPM-121.jpg',
    images: [
      '/assets/images/products images/SS CONCENTRIC REDUCER/TPM-121.jpg',
      '/assets/images/products images/SS CONCENTRIC REDUCER/TPM-122.jpg',
      '/assets/images/products images/SS CONCENTRIC REDUCER/TPM-123.jpg',
      '/assets/images/products images/SS CONCENTRIC REDUCER/TPM-124.jpg'
    ]
  },
  'ss-sanitary-eccentric-reducer': {
    image: '/assets/images/products images/SS CONCENTRIC REDUCER/TPM-125.jpg',
    images: [
      '/assets/images/products images/SS CONCENTRIC REDUCER/TPM-125.jpg',
      '/assets/images/products images/SS CONCENTRIC REDUCER/TPM-126.jpg',
      '/assets/images/products images/SS CONCENTRIC REDUCER/TPM-127.jpg'
    ]
  },
  'ss-tri-clamp-ferrule': {
    image: '/assets/images/products images/SS MP PIPE/TC CLAMP/TPM-394.jpg',
    images: [
      '/assets/images/products images/SS MP PIPE/TC CLAMP/TPM-394.jpg',
      '/assets/images/products images/SS MP PIPE/TC CLAMP/TPM-395.jpg',
      '/assets/images/products images/SS MP PIPE/TC CLAMP/TPM-389.jpg',
      '/assets/images/products images/SS MP PIPE/TC CLAMP/TPM-392.jpg',
      '/assets/images/products images/SS MP PIPE/TC CLAMP/TPM-390.jpg'
    ]
  },
  'ss-tri-clamp-clamp': {
    image: '/assets/images/products images/SS MP PIPE/TC CLAMP/TPM-396.jpg',
    images: [
      '/assets/images/products images/SS MP PIPE/TC CLAMP/TPM-396.jpg',
      '/assets/images/products images/SS MP PIPE/TC CLAMP/TPM-388.jpg',
      '/assets/images/products images/SS MP PIPE/TC CLAMP/TPM-391.jpg',
      '/assets/images/products images/SS MP PIPE/TC CLAMP/TPM-393.jpg'
    ]
  },
  'silicone-tri-clamp-gasket': {
    image: '/assets/images/products images/SS MP PIPE/TC CLAMP/TPM-391.jpg',
    images: [
      '/assets/images/products images/SS MP PIPE/TC CLAMP/TPM-391.jpg',
      '/assets/images/products images/SS MP PIPE/TC CLAMP/TPM-390.jpg',
      '/assets/images/products images/PIPEHOLDING CLAMP/TPM-377.jpg'
    ]
  },
  'ss-sms-union': {
    image: '/assets/images/products images/ss sms union/TPM-378.jpg',
    images: [
      '/assets/images/products images/ss sms union/TPM-378.jpg',
      '/assets/images/products images/ss sms union/TPM-379.jpg',
      '/assets/images/products images/ss sms union/TPM-380.jpg',
      '/assets/images/products images/ss sms union/TPM-381.jpg',
      '/assets/images/products images/ss sms union/TPM-410.jpg',
      '/assets/images/products images/ss sms union/SMS UNION/SMS nut_page-0001.jpg',
      '/assets/images/products images/ss sms union/SMS UNION/SMS liner_page-0001.jpg',
      '/assets/images/products images/ss sms union/SMS UNION/SMS male_page-0001.jpg'
    ]
  },
  'ss-sanitary-butterfly-valve': {
    image: '/assets/images/products images/SS BUTTERFLY VALVE/TPM-225.jpg',
    images: [
      '/assets/images/products images/SS BUTTERFLY VALVE/TPM-225.jpg',
      '/assets/images/products images/SS BUTTERFLY VALVE/TPM-226.jpg',
      '/assets/images/products images/SS BUTTERFLY VALVE/TPM-227.jpg',
      '/assets/images/products images/SS BUTTERFLY VALVE/TPM-228.jpg',
      '/assets/images/products images/SS BUTTERFLY VALVE/TPM-263.jpg'
    ]
  },
  'ss-316l-diaphragm-valve': {
    image: '/assets/images/products images/SS DAIPHGRAM VALVE CASTING/TPM-205.jpg',
    images: [
      '/assets/images/products images/SS DAIPHGRAM VALVE CASTING/TPM-205.jpg',
      '/assets/images/products images/SS DAIPHGRAM VALVE CASTING/TPM-206.jpg',
      '/assets/images/products images/SS DAIPHGRAM VALVE CASTING/TPM-207.jpg',
      '/assets/images/products images/STAINLESS STEEL DIAPHGRAM VALVE TC END/stainless-steel-sanitary-diaphragm-valve-.webp'
    ]
  },
  'ss-3-piece-ball-valve-tc': {
    image: '/assets/images/products images/SS 3PCS BALL VALVE TC END/TPM-370.jpg',
    images: [
      '/assets/images/products images/SS 3PCS BALL VALVE TC END/TPM-370.jpg',
      '/assets/images/products images/SS 3PCS BALL VALVE TC END/TPM-371.jpg',
      '/assets/images/products images/SS 3PCS BALL VALVE TC END/TPM-372.jpg',
      '/assets/images/products images/SS 3PCS BALL VALVE TC END/TPM-373.jpg'
    ]
  },
  'pneumatic-sanitary-ball-valve': {
    image: '/assets/images/products images/SS PNUEMATIC BUTTERFLY VALVE/c1b0348e-e78c-4fff-92c9-c1f2f5c37db0.png',
    images: [
      '/assets/images/products images/SS PNUEMATIC BUTTERFLY VALVE/c1b0348e-e78c-4fff-92c9-c1f2f5c37db0.png',
      '/assets/images/products images/SS PNUEMATIC DIAPHGRAM VALVE/stainless-steel-sanitary-pneumatic-diaphragm-valve-!j.webp',
      '/assets/images/products images/SS 3PCS BALL VALVE TC END/TPM-371.jpg'
    ]
  },
  'ss-sanitary-sampling-valve': {
    image: '/assets/images/products images/mini hex ball valve/TPM-318.jpg',
    images: [
      '/assets/images/products images/mini hex ball valve/TPM-318.jpg',
      '/assets/images/products images/mini hex ball valve/TPM-319.jpg',
      '/assets/images/products images/SS BALL VALVE BAR STOCK/TPM-412.jpg',
      '/assets/images/products images/mini hex ball valve/TPM-320.jpg'
    ]
  },
  'ss-sanitary-spray-ball': {
    image: '/assets/images/products images/SS SPRAY BALL VALVE/TPM-310.jpg',
    images: [
      '/assets/images/products images/SS SPRAY BALL VALVE/TPM-310.jpg',
      '/assets/images/products images/SS SPRAY BALL VALVE/TPM-311.jpg',
      '/assets/images/products images/SS SPRAY BALL VALVE/TPM-312.jpg',
      '/assets/images/products images/SS SPRAY BALL VALVE/TPM-313.jpg'
    ]
  },
  'ss-304-sanitary-pipe': {
    image: '/assets/images/products images/SS MP PIPE/TPM-14.jpg',
    images: [
      '/assets/images/products images/SS MP PIPE/TPM-14.jpg',
      '/assets/images/products images/SS MP PIPE/TPM-15.jpg',
      '/assets/images/products images/SS MP PIPE/TPM-17.jpg'
    ]
  },
  'ss-316l-sanitary-pipe': {
    image: '/assets/images/products images/SS EP PIPE/TPM-11.jpg',
    images: [
      '/assets/images/products images/SS EP PIPE/TPM-11.jpg',
      '/assets/images/products images/SS EP PIPE/TPM-12.jpg',
      '/assets/images/products images/SS EP PIPE/TPM-13.jpg'
    ]
  },
  'ss-304-seamless-sanitary-tube': {
    image: '/assets/images/products images/SS ROUND POLISH PIPE/TPM-57.jpg',
    images: [
      '/assets/images/products images/SS ROUND POLISH PIPE/TPM-57.jpg',
      '/assets/images/products images/SS ROUND POLISH PIPE/TPM-58.jpg',
      '/assets/images/products images/SS MP PIPE/TPM-1.jpg'
    ]
  },
  'ss-316l-seamless-sanitary-tube': {
    image: '/assets/images/products images/SS EP PIPE/TPM-16.jpg',
    images: [
      '/assets/images/products images/SS EP PIPE/TPM-16.jpg',
      '/assets/images/products images/SS EP PIPE/TPM-18.jpg',
      '/assets/images/products images/SS EP PIPE/TPM-21.jpg'
    ]
  },
  'ss-304-dairy-tube': {
    image: '/assets/images/products images/SS MP PIPE/TPM-2.jpg',
    images: [
      '/assets/images/products images/SS MP PIPE/TPM-2.jpg',
      '/assets/images/products images/SS MP PIPE/TPM-20.jpg',
      '/assets/images/products images/SS MP PIPE/TPM-23.jpg'
    ]
  },
  'epdm-tri-clamp-gasket': {
    image: '/assets/images/products images/PIPEHOLDING CLAMP/TPM-377.jpg',
    images: [
      '/assets/images/products images/PIPEHOLDING CLAMP/TPM-377.jpg',
      '/assets/images/products images/SS MP PIPE/TC CLAMP/TPM-391.jpg'
    ]
  },
  'ptfe-tri-clamp-gasket': {
    image: '/assets/images/products images/PIPEHOLDING CLAMP/TPM-376.jpg',
    images: [
      '/assets/images/products images/PIPEHOLDING CLAMP/TPM-376.jpg',
      '/assets/images/products images/SS MP PIPE/TC CLAMP/TPM-390.jpg'
    ]
  },
  'viton-tri-clamp-gasket': {
    image: '/assets/images/products images/PIPEHOLDING CLAMP/TPM-377.jpg',
    images: [
      '/assets/images/products images/PIPEHOLDING CLAMP/TPM-377.jpg',
      '/assets/images/products images/ss sms union/TPM-379.jpg'
    ]
  },
  'ss-sanitary-non-return-valve': {
    image: '/assets/images/products images/ss nrv tc end/TPM-238 - Copy.jpg',
    images: [
      '/assets/images/products images/ss nrv tc end/TPM-238 - Copy.jpg',
      '/assets/images/products images/SS BUTTERFLY VALVE/ss nrv tc end - Copy/TPM-232.jpg',
      '/assets/images/products images/SS BUTTERFLY VALVE/ss nrv tc end - Copy/TPM-233.jpg',
      '/assets/images/products images/SS NON RETURN VALVE/stainless-steel-food-processing-clamped-middle-clamp-nrv-check-valve-2-!j.webp'
    ]
  },
  'ss-sanitary-pipe-spool': {
    image: '/assets/images/products images/SS HOSE NIPPLE/TPM-403.jpg',
    images: [
      '/assets/images/products images/SS HOSE NIPPLE/TPM-403.jpg',
      '/assets/images/products images/SS HOSE NIPPLE/TPM-404.jpg',
      '/assets/images/products images/SS LONG BEND/TPM-101.jpg'
    ]
  }
};

let missingCount = 0;
for (const [id, m] of Object.entries(PRODUCT_MAPPINGS)) {
  const mainPath = path.join(publicDir, m.image.replace(/^\//, ''));
  if (!fs.existsSync(mainPath)) {
    console.error(`MISSING MAIN for ${id}: ${m.image}`);
    missingCount++;
  }
  m.images.forEach(img => {
    const full = path.join(publicDir, img.replace(/^\//, ''));
    if (!fs.existsSync(full)) {
      console.error(`MISSING GALLERY for ${id}: ${img}`);
      missingCount++;
    }
  });
}

console.log(`Validation completed: ${Object.keys(PRODUCT_MAPPINGS).length} products checked. Missing count: ${missingCount}`);
