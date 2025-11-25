'use client';

import { useState } from 'react';

interface FileUploadProps {
  onFilesSelected: (files: File[]) => void;
  selectedFiles: File[];
  onRemoveFile: (index: number) => void;
  accept?: string;
  multiple?: boolean;
  maxSizeMB?: number;
  label?: string;
  description?: string;
}

export default function FileUpload({
  onFilesSelected,
  selectedFiles,
  onRemoveFile,
  accept = 'image/*,.pdf',
  multiple = true,
  maxSizeMB = 10,
  label = 'Upload Files',
  description = 'Drop files here or click to upload'
}: FileUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateFile = (file: File): boolean => {
    const maxSize = maxSizeMB * 1024 * 1024; // Convert MB to bytes
    if (file.size > maxSize) {
      setError(`File "${file.name}" is too large. Maximum size is ${maxSizeMB}MB.`);
      return false;
    }
    setError(null);
    return true;
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      const validFiles = newFiles.filter(validateFile);
      if (validFiles.length > 0) {
        onFilesSelected(validFiles);
      }
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const newFiles = Array.from(e.dataTransfer.files);
      const validFiles = newFiles.filter(validateFile);
      if (validFiles.length > 0) {
        onFilesSelected(validFiles);
      }
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const getFileIcon = (file: File): string => {
    if (file.type.startsWith('image/')) return 'fa-image text-primary';
    if (file.type === 'application/pdf') return 'fa-file-pdf text-error';
    if (file.type.includes('word')) return 'fa-file-word text-primary';
    if (file.type.includes('excel') || file.type.includes('spreadsheet')) return 'fa-file-excel text-success';
    return 'fa-file text-font-detail';
  };

  return (
    <div className="w-full">
      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-all ${
          dragActive
            ? 'border-primary bg-primary/5'
            : 'border-bd hover:border-primary/50'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center justify-center">
          <i className="fa-solid fa-cloud-upload-alt text-5xl text-primary mb-4"></i>
          <p className="text-font-base font-medium mb-2">{label}</p>
          <p className="text-font-detail text-sm mb-4">{description}</p>
          <input
            type="file"
            multiple={multiple}
            accept={accept}
            className="hidden"
            id="file-upload"
            onChange={handleFileSelect}
          />
          <label
            htmlFor="file-upload"
            className="bg-primary text-white px-6 py-2.5 rounded-lg cursor-pointer hover:bg-primary-light transition-colors font-medium inline-flex items-center gap-2"
          >
            <i className="fa-solid fa-folder-open"></i>
            Choose Files
          </label>
          <p className="text-xs text-font-detail mt-3">
            Maximum file size: {maxSizeMB}MB
          </p>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mt-4 p-3 bg-error/10 border border-error rounded-lg text-error text-sm flex items-start gap-2">
          <i className="fa-solid fa-exclamation-circle mt-0.5"></i>
          <span>{error}</span>
        </div>
      )}

      {/* Selected Files List */}
      {selectedFiles.length > 0 && (
        <div className="mt-4 space-y-2">
          <p className="text-sm font-medium text-font-base flex items-center gap-2">
            <i className="fa-solid fa-paperclip"></i>
            Selected Files ({selectedFiles.length})
          </p>
          {selectedFiles.map((file, index) => (
            <div
              key={index}
              className="flex items-center justify-between bg-bg-subtle p-3 rounded-lg border border-bd group hover:border-primary/30 transition-all"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <i className={`fa-solid ${getFileIcon(file)} text-xl flex-shrink-0`}></i>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-font-base truncate" title={file.name}>
                    {file.name}
                  </p>
                  <p className="text-xs text-font-detail">
                    {formatFileSize(file.size)}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => onRemoveFile(index)}
                className="text-error hover:text-error-darker transition-colors p-2 opacity-0 group-hover:opacity-100"
                title="Remove file"
              >
                <i className="fa-solid fa-times-circle text-lg"></i>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
