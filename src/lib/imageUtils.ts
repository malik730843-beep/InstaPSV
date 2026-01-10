/**
 * Compresses an image file to be under a specific size limit while maintaining quality.
 * Uses Canvas API for client-side processing.
 */
export async function compressImage(file: File, maxSizeKB: number = 100): Promise<File | Blob> {
    // If it's not an image or already small enough, return as is
    if (!file.type.startsWith('image/') || file.size / 1024 < maxSizeKB) {
        return file;
    }

    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target?.result as string;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;

                // Max dimensions to help with compression
                const MAX_WIDTH = 1200;
                const MAX_HEIGHT = 1200;

                if (width > height) {
                    if (width > MAX_WIDTH) {
                        height *= MAX_WIDTH / width;
                        width = MAX_WIDTH;
                    }
                } else {
                    if (height > MAX_HEIGHT) {
                        width *= MAX_HEIGHT / height;
                        height = MAX_HEIGHT;
                    }
                }

                canvas.width = width;
                canvas.height = height;

                const ctx = canvas.getContext('2d');
                if (!ctx) {
                    reject(new Error('Canvas context not available'));
                    return;
                }

                ctx.drawImage(img, 0, 0, width, height);

                // Iteratively compress until size is reached or quality is too low
                let quality = 0.9;
                const step = 0.1;

                const attemptCompression = (q: number) => {
                    canvas.toBlob(
                        (blob) => {
                            if (!blob) {
                                reject(new Error('Compression failed'));
                                return;
                            }

                            if (blob.size / 1024 <= maxSizeKB || q <= 0.1) {
                                // Create a new File object from the blob if it was a File originally
                                const compressedFile = new File([blob], file.name, {
                                    type: 'image/jpeg',
                                    lastModified: Date.now(),
                                });
                                resolve(compressedFile);
                            } else {
                                attemptCompression(q - step);
                            }
                        },
                        'image/jpeg',
                        q
                    );
                };

                attemptCompression(quality);
            };
            img.onerror = () => reject(new Error('Image load failed'));
        };
        reader.onerror = () => reject(new Error('File read failed'));
    });
}
