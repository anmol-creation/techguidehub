'use client';

import { useState } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

interface ImageUploaderProps {
  onUpload: (url: string) => void;
  defaultImage?: string;
}

export default function ImageUploader({ onUpload, defaultImage }: ImageUploaderProps) {
  const [image, setImage] = useState<string>(defaultImage || '');
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    // Max size 5MB
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size should be less than 5MB');
      return;
    }

    setError(null);
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        throw new Error('Upload failed');
      }

      const data = await res.json();
      setImage(data.url);
      onUpload(data.url);
    } catch (err) {
      setError('Failed to upload image');
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  };

  const clearImage = () => {
    setImage('');
    onUpload('');
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
        <label className="block w-full cursor-pointer">
          <div className={`relative flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${error ? 'border-red-300 bg-red-50' : 'border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900'}`}>
            {image ? (
              <>
                <img src={image} alt="Preview" className="absolute inset-0 w-full h-full object-contain p-2" />
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    clearImage();
                  }}
                  className="absolute top-2 right-2 p-1 bg-red-100 text-red-600 rounded-full hover:bg-red-200"
                >
                  <X size={16} />
                </button>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload className="w-8 h-8 mb-3 text-gray-400" />
                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                  <span className="font-semibold">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">PNG, JPG, GIF (MAX. 5MB)</p>
              </div>
            )}
            <input
              type="file"
              className="hidden"
              onChange={handleFileChange}
              accept="image/*"
              disabled={isUploading}
            />
          </div>
        </label>
      </div>

      {isUploading && (
        <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
          <div className="bg-blue-600 h-2.5 rounded-full animate-pulse w-full"></div>
        </div>
      )}

      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}

      {/* Fallback URL input */}
      <div className="relative">
         <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
           <ImageIcon className="h-5 w-5 text-gray-400" />
         </div>
         <input
            type="text"
            value={image}
            onChange={(e) => {
              setImage(e.target.value);
              onUpload(e.target.value);
            }}
            className="pl-10 block w-full shadow-sm sm:text-sm border-gray-300 dark:border-gray-700 dark:bg-gray-800 rounded-md p-2 border"
            placeholder="Or enter image URL directly"
         />
      </div>
    </div>
  );
}
