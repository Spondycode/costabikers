
/**
 * Image Upload Service using ImgBB API
 * Free tier: unlimited uploads, no account required
 * API Key from: https://api.imgbb.com/
 */

const IMGBB_API_KEY = process.env.IMGBB_API_KEY || '';
const IMGBB_UPLOAD_URL = 'https://api.imgbb.com/1/upload';

export interface UploadResult {
  success: boolean;
  url?: string;
  error?: string;
}

/**
 * Uploads an image file to ImgBB
 * @param file - Image file from input[type="file"]
 * @returns Promise with upload result containing URL or error
 */
export const uploadImage = async (file: File): Promise<UploadResult> => {
  if (!IMGBB_API_KEY) {
    console.error('IMGBB_API_KEY not configured');
    return {
      success: false,
      error: 'Image upload not configured. Please add IMGBB_API_KEY to .env.local',
    };
  }

  // Validate file type
  if (!file.type.startsWith('image/')) {
    return {
      success: false,
      error: 'Please select a valid image file',
    };
  }

  // Validate file size (ImgBB free tier max: 32MB)
  const maxSize = 32 * 1024 * 1024; // 32MB in bytes
  if (file.size > maxSize) {
    return {
      success: false,
      error: 'Image size must be less than 32MB',
    };
  }

  try {
    const formData = new FormData();
    formData.append('key', IMGBB_API_KEY);
    formData.append('image', file);

    const response = await fetch(IMGBB_UPLOAD_URL, {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();

    if (data.success && data.data?.url) {
      return {
        success: true,
        url: data.data.url,
      };
    } else {
      return {
        success: false,
        error: data.error?.message || 'Upload failed',
      };
    }
  } catch (error) {
    console.error('Image upload error:', error);
    return {
      success: false,
      error: 'Network error during upload',
    };
  }
};

/**
 * Creates a preview URL for a selected file
 * @param file - Image file
 * @returns Object URL for preview (remember to revoke when done)
 */
export const createPreviewUrl = (file: File): string => {
  return URL.createObjectURL(file);
};

/**
 * Revokes a preview URL to free memory
 * @param url - Preview URL to revoke
 */
export const revokePreviewUrl = (url: string): void => {
  URL.revokeObjectURL(url);
};
