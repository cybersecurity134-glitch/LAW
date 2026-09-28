import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from './firebase';

export const storageService = {
  /**
   * Client-side image compression using HTML5 Canvas
   * Resizes large images to max width/height while maintaining aspect ratio,
   * compresses to webp/jpeg to stay well under 5MB and save user bandwidth.
   */
  async compressImage(
    file: File,
    maxWidth = 1920,
    maxHeight = 1080,
    quality = 0.85
  ): Promise<Blob> {
    return new Promise((resolve, reject) => {
      // If already a small SVG or webp < 500KB, return as is
      if (file.type === 'image/svg+xml' || (file.size < 500 * 1024 && file.type === 'image/webp')) {
        resolve(file);
        return;
      }

      const img = new Image();
      const reader = new FileReader();

      reader.onload = (e) => {
        img.src = e.target?.result as string;
      };

      reader.onerror = (err) => reject(new Error('Failed to read image file: ' + err));

      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        if (height > maxHeight) {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(file);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              resolve(file);
            }
          },
          'image/jpeg',
          quality
        );
      };

      reader.readAsDataURL(file);
    });
  },

  /**
   * Upload image for news articles under path news/{uid}/{filename}
   * Enforced strictly by storage.rules
   */
  async uploadNewsImage(file: File, uid: string): Promise<string> {
    // 1. Verify file size before upload
    if (file.size > 5 * 1024 * 1024) {
      throw new Error('Image size must be less than 5 MB.');
    }

    // 2. Compress image on client
    const compressedBlob = await this.compressImage(file);

    // 3. Generate sanitized path
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const storagePath = `news/${uid}/${Date.now()}_${sanitizedName}`;
    const storageRef = ref(storage, storagePath);

    // 4. Upload with correct content type metadata
    const snapshot = await uploadBytes(storageRef, compressedBlob, {
      contentType: file.type || 'image/jpeg',
    });

    // 5. Retrieve public download URL
    return getDownloadURL(snapshot.ref);
  },

  /**
   * Upload user profile avatar
   */
  async uploadAvatar(file: File, uid: string): Promise<string> {
    if (file.size > 5 * 1024 * 1024) {
      throw new Error('Avatar image size must be less than 5 MB.');
    }

    const compressedBlob = await this.compressImage(file, 400, 400, 0.9);
    const storagePath = `avatars/${uid}/${Date.now()}_avatar.jpg`;
    const storageRef = ref(storage, storagePath);

    const snapshot = await uploadBytes(storageRef, compressedBlob, {
      contentType: 'image/jpeg',
    });

    return getDownloadURL(snapshot.ref);
  }
};
