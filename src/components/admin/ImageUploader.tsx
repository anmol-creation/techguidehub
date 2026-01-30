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
      <div className="group relative">
        <label
          className={`
            relative flex flex-col items-center justify-center w-full h-48
            border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200
            ${error
              ? 'border-red-500/50 bg-red-500/5 hover:bg-red-500/10'
              : 'border-slate-700 bg-slate-900/50 hover:bg-slate-800 hover:border-blue-500/50'
            }
          `}
        >
          {image ? (
            <>
              <img
                src={image}
                alt="Preview"
                className="absolute inset-0 w-full h-full object-contain p-2 rounded-xl"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-xl">
                 <p className="text-white text-sm font-medium">Click to change</p>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  clearImage();
                }}
                className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors shadow-lg z-10"
              >
                <X size={14} />
              </button>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center">
              <div className="p-3 bg-slate-800 rounded-full mb-3 group-hover:scale-110 transition-transform duration-200">
                <Upload className="w-6 h-6 text-blue-400" />
              </div>
              <p className="mb-1 text-sm text-slate-300">
                <span className="font-semibold text-blue-400">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-slate-500">PNG, JPG, GIF up to 5MB</p>
            </div>
          )}
          <input
            type="file"
            className="hidden"
            onChange={handleFileChange}
            accept="image/*"
            disabled={isUploading}
          />
        </label>
      </div>

      {isUploading && (
        <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-1.5 rounded-full animate-progress w-full origin-left"></div>
        </div>
      )}

      {error && (
        <p className="text-sm text-red-400 flex items-center gap-2">
           <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
           {error}
        </p>
      )}

      {/* Fallback URL input */}
      <div className="relative group">
         <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
           <ImageIcon className="h-4 w-4 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
         </div>
         <input
            type="text"
            value={image}
            onChange={(e) => {
              setImage(e.target.value);
              onUpload(e.target.value);
            }}
            className="admin-input pl-10 text-xs"
            placeholder="Or enter image URL directly..."
         />
      </div>
    </div>
  );
}
