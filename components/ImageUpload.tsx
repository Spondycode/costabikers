import React, { useState, useRef } from 'react';
import { Upload, X, Loader2 } from 'lucide-react';
import { uploadImage, createPreviewUrl, revokePreviewUrl } from '../services/imageUploadService';

interface ImageUploadProps {
  onImageUploaded: (url: string) => void;
  buttonText?: string;
  className?: string;
  showPreview?: boolean;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  onImageUploaded,
  buttonText = 'Upload Image',
  className = '',
  showPreview = true,
}) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setError(null);

    // Show preview if enabled
    if (showPreview) {
      if (previewUrl) {
        revokePreviewUrl(previewUrl);
      }
      const preview = createPreviewUrl(file);
      setPreviewUrl(preview);
    }

    // Upload image
    setUploading(true);
    const result = await uploadImage(file);
    setUploading(false);

    if (result.success && result.url) {
      onImageUploaded(result.url);
      // Keep preview visible after successful upload
    } else {
      setError(result.error || 'Upload failed');
      // Clear preview on error
      if (previewUrl) {
        revokePreviewUrl(previewUrl);
        setPreviewUrl(null);
      }
    }

    // Reset input so same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClearPreview = () => {
    if (previewUrl) {
      revokePreviewUrl(previewUrl);
      setPreviewUrl(null);
    }
    setError(null);
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
        id="image-upload-input"
      />
      
      <label
        htmlFor="image-upload-input"
        className={`inline-flex items-center gap-2 px-4 py-2 bg-bike-orange-600 text-white rounded-lg cursor-pointer hover:bg-bike-orange-700 transition-colors ${
          uploading ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        {uploading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Uploading...
          </>
        ) : (
          <>
            <Upload className="w-4 h-4" />
            {buttonText}
          </>
        )}
      </label>

      {error && (
        <div className="text-red-400 text-sm flex items-center gap-2">
          <X className="w-4 h-4" />
          {error}
        </div>
      )}

      {showPreview && previewUrl && (
        <div className="relative inline-block">
          <img
            src={previewUrl}
            alt="Preview"
            className="max-w-xs max-h-48 rounded-lg border border-gray-700"
          />
          <button
            onClick={handleClearPreview}
            className="absolute -top-2 -right-2 bg-gray-800 text-white rounded-full p-1 hover:bg-gray-700 transition-colors"
            type="button"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
