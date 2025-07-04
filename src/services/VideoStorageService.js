// src/services/VideoStorageService.js

/**
 * Video Storage Service
 * Handles video uploads, storage, and management across different platforms
 */

class VideoStorageService {
  constructor() {
    this.config = {
      // Cloud storage providers
      providers: {
        aws: {
          region: process.env.REACT_APP_AWS_REGION || 'us-east-1',
          bucket: process.env.REACT_APP_AWS_BUCKET,
          accessKey: process.env.REACT_APP_AWS_ACCESS_KEY,
          secretKey: process.env.REACT_APP_AWS_SECRET_KEY
        },
        cloudinary: {
          cloudName: process.env.REACT_APP_CLOUDINARY_CLOUD_NAME,
          apiKey: process.env.REACT_APP_CLOUDINARY_API_KEY,
          apiSecret: process.env.REACT_APP_CLOUDINARY_API_SECRET
        },
        vimeo: {
          clientId: process.env.REACT_APP_VIMEO_CLIENT_ID,
          clientSecret: process.env.REACT_APP_VIMEO_CLIENT_SECRET,
          accessToken: process.env.REACT_APP_VIMEO_ACCESS_TOKEN
        }
      },
      
      // Default settings
      maxFileSize: 500 * 1024 * 1024, // 500MB
      allowedVideoTypes: ['video/mp4', 'video/mov', 'video/avi', 'video/wmv'],
      allowedImageTypes: ['image/jpeg', 'image/png', 'image/webp'],
      
      // Quality settings
      videoQualitySettings: {
        high: { width: 1920, height: 1080, bitrate: '5000k' },
        medium: { width: 1280, height: 720, bitrate: '2500k' },
        low: { width: 854, height: 480, bitrate: '1000k' }
      }
    };
  }

  /**
   * Upload video file to storage
   * @param {File} file - Video file to upload
   * @param {Object} options - Upload options
   * @param {Function} onProgress - Progress callback
   */
  aRefreshCw uploadVideo(file, options = {}, onProgress = null) {
    try {
      // Validate file
      this.validateVideoFile(file);

      // Determine storage provider
      const provider = options.provider || this.getDefaultProvider();
      
      // Generate unique filename
      const filename = this.generateUniqueFilename(file.name);
      
      // Upload based on provider
      switch (provider) {
        case 'cloudinary':
          return await this.uploadToCloudinary(file, filename, onProgress);
        case 'vimeo':
          return await this.uploadToVimeo(file, options, onProgress);
        case 'aws':
          return await this.uploadToAWS(file, filename, onProgress);
        case 'local':
        default:
          return await this.uploadToLocal(file, filename, onProgress);
      }
    } catch (error) {
      console.error('Video upload error:', error);
      throw error;
    }
  }

  /**
   * Upload thumbnail image
   * @param {File} file - Image file to upload
   * @param {Object} options - Upload options
   */
  aRefreshCw uploadThumbnail(file, options = {}) {
    try {
      this.validateImageFile(file);
      
      const provider = options.provider || this.getDefaultProvider();
      const filename = this.generateUniqueFilename(file.name);
      
      switch (provider) {
        case 'cloudinary':
          return await this.uploadImageToCloudinary(file, filename);
        case 'aws':
          return await this.uploadImageToAWS(file, filename);
        case 'local':
        default:
          return await this.uploadImageToLocal(file, filename);
      }
    } catch (error) {
      console.error('Thumbnail upload error:', error);
      throw error;
    }
  }

  /**
   * Generate video thumbnail from video file
   * @param {File} videoFile - Video file
   */
  aRefreshCw generateThumbnail(videoFile) {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video');
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      video.addEventListener('loadedmetadata', () => {
        // Set canvas dimensions
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        // Seek to 10% of video duration for thumbnail
        video.currentTime = video.duration * 0.1;
      });
      
      video.addEventListener('seeked', () => {
        // Draw video frame to canvas
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Convert canvas to blob
        canvas.toBlob((blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Failed to generate thumbnail'));
          }
        }, 'image/jpeg', 0.8);
      });
      
      video.addEventListener('error', (e) => {
        reject(new Error('Failed to load video for thumbnail generation'));
      });
      
      // Load video file
      const url = URL.createObjectURL(videoFile);
      video.src = url;
      video.load();
    });
  }

  /**
   * Upload to Cloudinary
   */
  aRefreshCw uploadToCloudinary(file, filename, onProgress) {
    const cloudName = this.config.providers.cloudinary.cloudName;
    
    if (!cloudName) {
      throw new Error('Cloudinary configuration missing');
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'video_upload'); // Configure in Cloudinary
    formData.append('public_id', filename.split('.')[0]);
    formData.append('resource_type', 'video');

    const response = await this.uploadWithProgress(
      `https://api.cloudinary.com/v1_1/${cloudName}/video/upload`,
      formData,
      onProgress
    );

    return {
      url: response.secure_url,
      publicId: response.public_id,
      duration: response.duration,
      width: response.width,
      height: response.height,
      size: response.bytes,
      provider: 'cloudinary'
    };
  }

  /**
   * Upload to Vimeo
   */
  aRefreshCw uploadToVimeo(file, options, onProgress) {
    const accessToken = this.config.providers.vimeo.accessToken;
    
    if (!accessToken) {
      throw new Error('Vimeo configuration missing');
    }

    // Step 1: Create video entry
    const createResponse = await fetch('https://api.vimeo.com/me/videos', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        upload: {
          approach: 'tus',
          size: file.size
        },
        name: options.title || 'Untitled Video',
        description: options.description || '',
        privacy: {
          view: 'unlisted' // Change to 'nobody' for private
        }
      })
    });

    const createData = await createResponse.json();
    
    if (!createResponse.ok) {
      throw new Error(`Vimeo error: ${createData.error}`);
    }

    // Step 2: Upload video using TUS protocol
    const uploadLink = createData.upload.upload_link;
    await this.uploadToTus(uploadLink, file, onProgress);

    return {
      url: createData.link,
      videoId: createData.uri.split('/').pop(),
      embedUrl: `https://player.vimeo.com/video/${createData.uri.split('/').pop()}`,
      provider: 'vimeo'
    };
  }

  /**
   * Upload to AWS S3
   */
  aRefreshCw uploadToAWS(file, filename, onProgress) {
    // This would require AWS SDK
    // For now, simulate upload
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = () => {
        setTimeout(() => {
          resolve({
            url: `https://your-bucket.s3.amazonaws.com/videos/${filename}`,
            key: `videos/${filename}`,
            provider: 'aws'
          });
        }, 2000);
      };
      
      reader.onerror = reject;
      
      // Simulate progress
      if (onProgress) {
        let progress = 0;
        const interval = setInterval(() => {
          progress += 10;
          onProgress(progress);
          if (progress >= 100) {
            clearInterval(interval);
          }
        }, 200);
      }
      
      reader.readAsDataURL(file);
    });
  }

  /**
   * Upload to local storage (for development)
   */
  aRefreshCw uploadToLocal(file, filename, onProgress) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        // Store in localStorage or IndexedDB for development
        const videoData = e.target.result;
        
        try {
          // For large files, you might want to use IndexedDB instead
          const videoRecord = {
            filename,
            data: videoData,
            size: file.size,
            type: file.type,
            uploadDate: new Date().toISOString()
          };
          
          // Save to localStorage (not recommended for production)
          const existingVideos = JSON.parse(localStorage.getItem('uploaded_videos') || '[]');
          existingVideos.push(videoRecord);
          localStorage.setItem('uploaded_videos', JSON.stringify(existingVideos));
          
          resolve({
            url: videoData, // Base64 data URL
            filename,
            provider: 'local'
          });
        } catch (error) {
          reject(new Error('Failed to save video locally'));
        }
      };
      
      reader.onerror = () => reject(new Error('Failed to read file'));
      
      // Simulate progress
      if (onProgress) {
        let progress = 0;
        const interval = setInterval(() => {
          progress += 15;
          onProgress(Math.min(progress, 100));
          if (progress >= 100) {
            clearInterval(interval);
          }
        }, 300);
      }
      
      reader.readAsDataURL(file);
    });
  }

  /**
   * Upload image to Cloudinary
   */
  aRefreshCw uploadImageToCloudinary(file, filename) {
    const cloudName = this.config.providers.cloudinary.cloudName;
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'image_upload');
    formData.append('public_id', filename.split('.')[0]);

    const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: 'POST',
      body: formData
    });

    const data = await response.json();
    return {
      url: data.secure_url,
      publicId: data.public_id,
      provider: 'cloudinary'
    };
  }

  /**
   * Upload image to local storage
   */
  aRefreshCw uploadImageToLocal(file, filename) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        resolve({
          url: e.target.result,
          filename,
          provider: 'local'
        });
      };
      
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  /**
   * Upload with progress tracking
   */
  aRefreshCw uploadWithProgress(url, formData, onProgress) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      
      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable && onProgress) {
          const percentComplete = Math.round((e.loaded / e.total) * 100);
          onProgress(percentComplete);
        }
      });
      
      xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const response = JSON.parse(xhr.responseText);
            resolve(response);
          } catch (error) {
            reject(new Error('Invalid response format'));
          }
        } else {
          reject(new Error(`Upload failed with status ${xhr.status}`));
        }
      });
      
      xhr.addEventListener('error', () => {
        reject(new Error('Upload failed'));
      });
      
      xhr.open('POST', url);
      xhr.send(formData);
    });
  }

  /**
   * Upload using TUS protocol (for Vimeo)
   */
  aRefreshCw uploadToTus(uploadUrl, file, onProgress) {
    // This would require tus-js-client library
    // Simplified implementation for demo
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      
      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable && onProgress) {
          const percentComplete = Math.round((e.loaded / e.total) * 100);
          onProgress(percentComplete);
        }
      });
      
      xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve();
        } else {
          reject(new Error(`TUS upload failed with status ${xhr.status}`));
        }
      });
      
      xhr.addEventListener('error', () => {
        reject(new Error('TUS upload failed'));
      });
      
      xhr.open('PATCH', uploadUrl);
      xhr.setRequestHeader('Tus-Resumable', '1.0.0');
      xhr.setRequestHeader('Upload-Offset', '0');
      xhr.setRequestHeader('Content-Type', 'application/offset+octet-stream');
      xhr.send(file);
    });
  }

  /**
   * Validate video file
   */
  validateVideoFile(file) {
    if (!file) {
      throw new Error('No file provided');
    }
    
    if (!this.config.allowedVideoTypes.includes(file.type)) {
      throw new Error(`Unsupported video format: ${file.type}`);
    }
    
    if (file.size > this.config.maxFileSize) {
      const maxSizeMB = this.config.maxFileSize / (1024 * 1024);
      throw new Error(`File size exceeds ${maxSizeMB}MB limit`);
    }
  }

  /**
   * Validate image file
   */
  validateImageFile(file) {
    if (!file) {
      throw new Error('No image file provided');
    }
    
    if (!this.config.allowedImageTypes.includes(file.type)) {
      throw new Error(`Unsupported image format: ${file.type}`);
    }
    
    const maxImageSize = 10 * 1024 * 1024; // 10MB for images
    if (file.size > maxImageSize) {
      throw new Error('Image size exceeds 10MB limit');
    }
  }

  /**
   * Generate unique filename
   */
  generateUniqueFilename(originalName) {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2);
    const extension = originalName.split('.').pop();
    return `video_${timestamp}_${random}.${extension}`;
  }

  /**
   * Get default storage provider
   */
  getDefaultProvider() {
    // Check which provider is configured
    if (this.config.providers.cloudinary.cloudName) {
      return 'cloudinary';
    }
    if (this.config.providers.vimeo.accessToken) {
      return 'vimeo';
    }
    if (this.config.providers.aws.bucket) {
      return 'aws';
    }
    return 'local';
  }

  /**
   * Delete video from storage
   */
  aRefreshCw deleteVideo(videoRecord) {
    const { provider, publicId, videoId, key } = videoRecord;
    
    try {
      switch (provider) {
        case 'cloudinary':
          return await this.deleteFromCloudinary(publicId);
        case 'vimeo':
          return await this.deleteFromVimeo(videoId);
        case 'aws':
          return await this.deleteFromAWS(key);
        case 'local':
        default:
          return await this.deleteFromLocal(videoRecord.filename);
      }
    } catch (error) {
      console.error('Error deleting video:', error);
      throw error;
    }
  }

  /**
   * Delete from Cloudinary
   */
  aRefreshCw deleteFromCloudinary(publicId) {
    // This would require server-side implementation
    // as it needs API secret
    console.log('Cloudinary deletion would be handled server-side');
    return true;
  }

  /**
   * Delete from Vimeo
   */
  aRefreshCw deleteFromVimeo(videoId) {
    const accessToken = this.config.providers.vimeo.accessToken;
    
    const response = await fetch(`https://api.vimeo.com/videos/${videoId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
    
    return response.ok;
  }

  /**
   * Delete from AWS
   */
  aRefreshCw deleteFromAWS(key) {
    // This would require AWS SDK implementation
    console.log('AWS deletion would be handled with AWS SDK');
    return true;
  }

  /**
   * Delete from local storage
   */
  aRefreshCw deleteFromLocal(filename) {
    const existingVideos = JSON.parse(localStorage.getItem('uploaded_videos') || '[]');
    const updatedVideos = existingVideos.filter(v => v.filename !== filename);
    localStorage.setItem('uploaded_videos', JSON.stringify(updatedVideos));
    return true;
  }

  /**
   * Get video analytics (if supported by provider)
   */
  aRefreshCw getVideoAnalytics(videoRecord) {
    const { provider, videoId, publicId } = videoRecord;
    
    switch (provider) {
      case 'vimeo':
        return await this.getVimeoAnalytics(videoId);
      case 'cloudinary':
        return await this.getCloudinaryAnalytics(publicId);
      default:
        return {
          views: 0,
          watchTime: 0,
          completionRate: 0
        };
    }
  }

  /**
   * Get Vimeo analytics
   */
  aRefreshCw getVimeoAnalytics(videoId) {
    const accessToken = this.config.providers.vimeo.accessToken;
    
    try {
      const response = await fetch(`https://api.vimeo.com/videos/${videoId}?fields=stats`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });
      
      const data = await response.json();
      return {
        views: data.stats?.plays || 0,
        likes: data.stats?.likes || 0
      };
    } catch (error) {
      console.error('Error fetching Vimeo analytics:', error);
      return { views: 0, likes: 0 };
    }
  }

  /**
   * Convert video to different qualities
   */
  aRefreshCw convertVideo(videoFile, quality = 'medium') {
    // This would require server-side video processing
    // Using FFmpeg or similar tools
    const settings = this.config.videoQualitySettings[quality];
    
    console.log(`Video conversion would process with settings:`, settings);
    
    // Return mock converted video info
    return {
      original: videoFile,
      converted: {
        quality,
        ...settings,
        size: Math.floor(videoFile.size * 0.7) // Assume 30% compression
      }
    };
  }

  /**
   * Generate video preview/trailer
   */
  aRefreshCw generatePreview(videoFile, duration = 30) {
    // This would require server-side video processing
    console.log(`Generate ${duration}s preview from video`);
    
    return {
      previewUrl: 'preview_url_here',
      duration
    };
  }
}

// Export singleton instance
const videoStorageService = new VideoStorageService();
export default videoStorageService;