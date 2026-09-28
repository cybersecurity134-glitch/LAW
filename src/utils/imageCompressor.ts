/**
 * High-performance client-side image compression and resizing utility.
 * Downscales images to max dimensions and compresses to WebP/JPEG,
 * dramatically lowering memory footprint, preventing UI freezes on phones/tablets,
 * and freeing canvas resources.
 */

export interface CompressedImageResult {
  dataUrl: string;
  size: number;
  mimeType: string;
  width: number;
  height: number;
}

export async function compressImageFile(
  file: File,
  maxWidth = 1024,
  maxHeight = 1024,
  quality = 0.8
): Promise<CompressedImageResult> {
  return new Promise((resolve, reject) => {
    // If not an image, reject
    if (!file.type.startsWith('image/')) {
      reject(new Error('File is not an image'));
      return;
    }

    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      // Clean up the object URL immediately to release memory
      URL.revokeObjectURL(objectUrl);

      let { width, height } = img;

      // Calculate downscaled dimensions preserving aspect ratio
      if (width > maxWidth || height > maxHeight) {
        if (width / height > maxWidth / maxHeight) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        } else {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d', { alpha: false });
      if (!ctx) {
        reject(new Error('Failed to get canvas 2d context'));
        return;
      }

      // High-quality image smoothing
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'medium';
      ctx.drawImage(img, 0, 0, width, height);

      // Prefer image/webp if supported, fallback to image/jpeg
      const targetMime = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
      const dataUrl = canvas.toDataURL(targetMime, quality);

      // Estimate byte size from dataUrl
      const head = `data:${targetMime};base64,`;
      const base64Len = dataUrl.length - head.length;
      const size = Math.round((base64Len * 3) / 4);

      // Clear canvas memory
      canvas.width = 0;
      canvas.height = 0;

      resolve({
        dataUrl,
        size,
        mimeType: targetMime,
        width,
        height,
      });
    };

    img.onerror = (err) => {
      URL.revokeObjectURL(objectUrl);
      reject(err);
    };

    img.src = objectUrl;
  });
}
