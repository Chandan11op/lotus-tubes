/**
 * Lotus Tubes - Client-side White Background Remover & Studio Product Isolator
 * Replaces solid white studio backgrounds with true RGBA transparency.
 */

const bgRemovalCache = new Map();

export function getTransparentProductImage(imageUrl) {
  if (!imageUrl) return Promise.resolve(imageUrl);
  if (bgRemovalCache.has(imageUrl)) {
    return Promise.resolve(bgRemovalCache.get(imageUrl));
  }

  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth || img.width;
        canvas.height = img.naturalHeight || img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);

        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imgData.data;
        const len = data.length;

        // Tolerance threshold for studio white / near-white neutral background
        const threshold = 228;

        for (let i = 0; i < len; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];

          // If the pixel is near-white and neutral (low saturation)
          const maxVal = Math.max(r, g, b);
          const minVal = Math.min(r, g, b);
          const diff = maxVal - minVal;

          if (minVal >= threshold && diff < 20) {
            // Smooth edge feathering
            const alphaFactor = Math.max(0, 1 - (minVal - threshold) / (255 - threshold));
            data[i + 3] = Math.round(data[i + 3] * alphaFactor);
          }
        }

        ctx.putImageData(imgData, 0, 0);
        const transparentDataUrl = canvas.toDataURL('image/png');
        bgRemovalCache.set(imageUrl, transparentDataUrl);
        resolve(transparentDataUrl);
      } catch (err) {
        // Fallback to original image if canvas security or processing fails
        resolve(imageUrl);
      }
    };
    img.onerror = () => resolve(imageUrl);
    img.src = imageUrl;
  });
}
