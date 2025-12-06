import { config } from '@/config/env';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { v4 as uuidv4 } from 'uuid';

// Cloudinary Configuration
cloudinary.config({
  cloud_name: config.CLOUDINARY_CLOUD_NAME,
  api_key: config.CLOUDINARY_API_KEY,
  api_secret: config.CLOUDINARY_API_SECRET,
});

// Types
interface UploadOptions {
  folder?: string;
  quality?: string | number;
  transformation?: string;
  tags?: string[];
}

interface UploadResult {
  public_id: string;
  secure_url: string;
  bytes: number;
  format: string;
  resource_type: string;
  created_at: string;
}

enum FileType {
  IMAGE = 'image',
  PDF = 'pdf',
  VIDEO = 'video',
  RAW = 'raw',
}

// Helper: Detect file type from buffer or filename
const detectFileType = (fileName: string, buffer?: Buffer): FileType => {
  const ext = fileName.split('.').pop()?.toLowerCase() || '';

  // PDF detection
  if (ext === 'pdf' || buffer?.toString('utf8', 0, 4) === '%PDF') {
    return FileType.PDF;
  }

  // Image detection
  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp'];
  if (imageExtensions.includes(ext)) {
    return FileType.IMAGE;
  }

  // Video detection
  const videoExtensions = ['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm'];
  if (videoExtensions.includes(ext)) {
    return FileType.VIDEO;
  }

  return FileType.RAW;
};

// Helper: Get resource type for Cloudinary
const getResourceType = (fileType: FileType): string => {
  switch (fileType) {
    case FileType.IMAGE:
      return 'image';
    case FileType.VIDEO:
      return 'video';
    case FileType.PDF:
    case FileType.RAW:
    default:
      return 'raw';
  }
};

// Helper: Generate upload options
const generateUploadOptions = (
  fileType: FileType,
  fileName: string,
  customOptions?: UploadOptions
) => {
  const uniqueId = uuidv4();
  const nameWithoutExt = fileName.split('.')[0];
  const publicId = `${nameWithoutExt}_${uniqueId}`;
  const folder = customOptions?.folder || `${fileType}_uploads`;

  const baseOptions: any = {
    resource_type: getResourceType(fileType),
    folder,
    public_id: publicId,
    overwrite: true,
    unique_filename: false,
    use_filename: true,
  };

  // Image-specific optimizations
  if (fileType === FileType.IMAGE) {
    baseOptions.quality = customOptions?.quality || 'auto:good';
    baseOptions.fetch_format = 'auto';
    baseOptions.flags = 'progressive';
    if (customOptions?.transformation) {
      baseOptions.transformation = customOptions.transformation;
    }
  }

  // Add custom tags if provided
  if (customOptions?.tags && customOptions.tags.length > 0) {
    baseOptions.tags = customOptions.tags;
  }

  return baseOptions;
};

/**
 * Universal file upload function for PDF, Images, and other files
 * @param fileBuffer - File buffer to upload
 * @param fileName - Original file name
 * @param customOptions - Optional custom upload options
 * @returns Upload result with file details
 */
const uploadFileToCloudinary = async (
  fileBuffer: Buffer,
  fileName: string,
  customOptions?: UploadOptions
): Promise<UploadResult> => {
  try {
    // Validate inputs
    if (!fileBuffer || fileBuffer.length === 0) {
      throw new Error('File buffer is empty or invalid');
    }

    if (!fileName || typeof fileName !== 'string') {
      throw new Error('Invalid file name provided');
    }

    // Detect file type
    const fileType = detectFileType(fileName, fileBuffer);

    // Generate upload options
    const uploadOptions = generateUploadOptions(fileType, fileName, customOptions);

    // Upload to Cloudinary
    const result = await new Promise<UploadApiResponse>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(uploadOptions, (error, result) => {
        if (error) {
          reject(new Error(`Cloudinary upload failed: ${error.message}`));
          return;
        }

        if (!result) {
          reject(new Error('Upload result is undefined'));
          return;
        }

        resolve(result);
      });

      uploadStream.end(fileBuffer);
    });

    // Return standardized result
    return {
      public_id: result.public_id,
      secure_url: result.secure_url,
      bytes: result.bytes,
      format: result.format,
      resource_type: result.resource_type,
      created_at: result.created_at,
    };
  } catch (error: any) {
    console.error('Upload error:', {
      fileName,
      message: error.message,
      stack: error.stack,
    });
    throw new Error(`Failed to upload file: ${error.message}`);
  }
};

/**
 * Batch upload multiple files
 * @param files - Array of files with buffer and name
 * @param customOptions - Optional custom upload options
 * @returns Array of upload results
 */
const uploadMultipleFiles = async (
  files: Array<{ buffer: Buffer; name: string }>,
  customOptions?: UploadOptions
): Promise<UploadResult[]> => {
  try {
    if (!files || files.length === 0) {
      throw new Error('No files provided for upload');
    }

    // Upload files in parallel with concurrency limit
    const BATCH_SIZE = 5;
    const results: UploadResult[] = [];

    for (let i = 0; i < files.length; i += BATCH_SIZE) {
      const batch = files.slice(i, i + BATCH_SIZE);
      const batchResults = await Promise.all(
        batch.map((file) => uploadFileToCloudinary(file.buffer, file.name, customOptions))
      );
      results.push(...batchResults);
    }

    return results;
  } catch (error: any) {
    console.error('Batch upload error:', error.message);
    throw new Error(`Failed to upload multiple files: ${error.message}`);
  }
};

/**
 * Delete file from Cloudinary
 * @param publicId - Public ID of the file to delete
 * @param resourceType - Type of resource (image, raw, video)
 * @returns Deletion result
 */
const deleteFileFromCloudinary = async (
  publicId: string,
  resourceType: string = 'raw'
): Promise<{ success: boolean; message: string }> => {
  try {
    if (!publicId || typeof publicId !== 'string') {
      throw new Error('Invalid publicId provided for deletion');
    }

    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
      invalidate: true,
    });

    if (result.result === 'not found') {
      console.warn(`File not found: ${publicId}`);
      return {
        success: false,
        message: 'File not found in Cloudinary',
      };
    }

    if (result.result !== 'ok') {
      throw new Error(`Delete failed: ${result.result}`);
    }

    return {
      success: true,
      message: 'File deleted successfully',
    };
  } catch (error: any) {
    console.error('Delete error:', {
      publicId,
      message: error.message,
    });
    return {
      success: false,
      message: `Delete failed: ${error.message}`,
    };
  }
};

/**
 * Delete multiple files
 * @param publicIds - Array of public IDs
 * @param resourceType - Type of resource
 * @returns Array of deletion results
 */
const deleteMultipleFiles = async (
  publicIds: string[],
  resourceType: string = 'raw'
): Promise<Array<{ publicId: string; success: boolean; message: string }>> => {
  try {
    const results = await Promise.all(
      publicIds.map(async (publicId) => {
        const result = await deleteFileFromCloudinary(publicId, resourceType);
        return { publicId, ...result };
      })
    );
    return results;
  } catch (error: any) {
    console.error('Batch delete error:', error.message);
    throw new Error(`Failed to delete multiple files: ${error.message}`);
  }
};

/**
 * Extract public ID from Cloudinary URL
 * @param url - Cloudinary URL
 * @returns Public ID or null
 */
const getPublicIdFromUrl = (url: string): string | null => {
  try {
    if (!url || typeof url !== 'string') {
      throw new Error('Invalid URL provided');
    }

    // Handle different Cloudinary URL formats
    const urlParts = url.split('/');

    // Find the upload folder index
    const uploadIndex = urlParts.findIndex((part) => part === 'upload');
    if (uploadIndex === -1) {
      throw new Error('Invalid Cloudinary URL format');
    }

    // Extract public_id (includes folder path)
    const publicIdParts = urlParts.slice(uploadIndex + 2);
    const publicIdWithExt = publicIdParts.join('/');

    // Remove file extension
    const publicId = publicIdWithExt.substring(0, publicIdWithExt.lastIndexOf('.'));

    return publicId || null;
  } catch (error: any) {
    console.error('URL parsing error:', error.message);
    return null;
  }
};

/**
 * Get file info from Cloudinary
 * @param publicId - Public ID of the file
 * @param resourceType - Type of resource
 * @returns File details
 */
const getFileInfo = async (publicId: string, resourceType: string = 'raw'): Promise<any> => {
  try {
    const result = await cloudinary.api.resource(publicId, {
      resource_type: resourceType,
    });
    return result;
  } catch (error: any) {
    console.error('Get file info error:', error.message);
    throw new Error(`Failed to get file info: ${error.message}`);
  }
};

export const cloudinaryConfig = {
  getFileInfo,
  uploadFileToCloudinary,
  getPublicIdFromUrl,
  deleteMultipleFiles,
  deleteFileFromCloudinary,
  uploadMultipleFiles,
};