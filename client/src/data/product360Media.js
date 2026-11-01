/**
 * Lotus Tubes - Centralized 360° Product Media Registry
 *
 * Centralized, maintainable mapping system connecting product IDs to their corresponding
 * 360-degree rotation videos or genuine turntable frame sequences.
 *
 * For products where 360° media is not yet available, the viewer gracefully falls back
 * to high-resolution verified studio photography.
 *
 * To add a new product video:
 * 1. Place the video file in `client/public/assets/videos/`
 * 2. Add an entry below: `"<product-id>": "/assets/videos/<filename>.mp4"`
 */

// 1. Centralized mapping between product IDs and 360° rotation videos
export const product360Videos = {
  // SS Sanitary Butterfly Valve (Pull & Gripper Handle)
  'ss-sanitary-butterfly-valve': '/assets/videos/ss-butterfly-valves.mp4',

  // SS Tri-Clamp Heavy Duty Clamp (Single & Double Pin) / Pipe Holder
  'ss-tri-clamp-clamp': '/assets/videos/ss-pipe-holder.mp4',

  // Additional 360° rotation video renders will be mapped here as new assets become available
};

// 2. Genuine turntable frame sequences for products with multi-angle capture
export const product360FrameSequences = {
  // Pneumatic Actuated Sanitary Ball Valve with TC End (36 turntable frames)
  'pneumatic-sanitary-ball-valve': {
    frameCount: 36,
    format: 'jpg',
    basePath: '/assets/images/products/valves/pneumatic-valves/ss-pneumatic-actuated-sanitary-ball-valve-',
    padLength: 3, // yields -001.jpg through -036.jpg
    poster: '/assets/images/products/valves/pneumatic-valves/ss-pneumatic-actuated-sanitary-ball-valve-023.jpg'
  }
};

/**
 * Resolve 360 media definition for a given product ID or slug
 * @param {string} productId - Product ID or slug
 * @returns {object|null} Media descriptor { type: 'video'|'frames', src|frames, poster } or null
 */
export function getProduct360Media(productId) {
  if (!productId) return null;

  // Direct video match
  if (product360Videos[productId]) {
    return {
      type: 'video',
      src: product360Videos[productId],
      productId
    };
  }

  // Frame sequence match
  if (product360FrameSequences[productId]) {
    const seq = product360FrameSequences[productId];
    const frames = Array.from({ length: seq.frameCount }, (_, i) => {
      const num = String(i + 1).padStart(seq.padLength, '0');
      return `${seq.basePath}${num}.${seq.format}`;
    });

    return {
      type: 'frames',
      frames,
      totalFrames: seq.frameCount,
      poster: seq.poster || frames[0],
      productId
    };
  }

  return null;
}

/**
 * Check if a product has genuine 360° rotation media (video or frame sequence)
 * @param {string} productId
 * @returns {boolean}
 */
export function has360Media(productId) {
  if (!productId) return false;
  return Boolean(product360Videos[productId] || product360FrameSequences[productId]);
}

/**
 * Get full status report of product 360 media availability
 * @param {Array} products - List of all products
 * @returns {{ ready: Array, awaiting: Array }}
 */
export function get360MediaCoverage(products = []) {
  const ready = [];
  const awaiting = [];

  products.forEach((p) => {
    const id = p.id || p.slug;
    if (has360Media(id)) {
      ready.push({ id, name: p.name, media: getProduct360Media(id) });
    } else {
      awaiting.push({ id, name: p.name });
    }
  });

  return { ready, awaiting };
}

export default product360Videos;

