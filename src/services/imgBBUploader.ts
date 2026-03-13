
// Simple imgBB uploader service as fallback for Firebase Storage issues

const IMGBB_API_KEY = '2d63e44b80c3021f7cd8842ba0ec31f2'; // Public API key for imgBB

interface ImgBBResponse {
  data?: {
    url: string;
    delete_url: string;
  };
  success?: boolean;
  error?: {
    message: string;
  };
}

export const uploadImageToImgBB = async (file: File): Promise<string | null> => {
  try {
    console.log('Starting imgBB upload for file:', file.name, 'Type:', file.type, 'Size:', file.size);
    
    // Additional validation for imgBB
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      console.error('File type not supported by imgBB:', file.type);
      return null;
    }

    // imgBB has a 32MB limit, but we'll stick to 5MB for better performance
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      console.error('File too large for imgBB:', file.size);
      return null;
    }

    // Create form data
    const formData = new FormData();
    formData.append('image', file);
    formData.append('key', IMGBB_API_KEY);

    // Upload to imgBB with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

    const response = await fetch('https://api.imgbb.com/1/upload', {
      method: 'POST',
      body: formData,
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`imgBB HTTP error! status: ${response.status}, response:`, errorText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result: ImgBBResponse = await response.json();
    
    if (result.success && result.data?.url) {
      console.log('imgBB upload successful:', result.data.url);
      return result.data.url;
    } else {
      console.error('imgBB upload failed:', result.error?.message || 'Unknown error');
      return null;
    }
  } catch (error: any) {
    if (error.name === 'AbortError') {
      console.error('imgBB upload timeout');
    } else {
      console.error('Error uploading to imgBB:', error);
    }
    return null;
  }
};
