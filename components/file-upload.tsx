'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, Camera, X, Image as ImageIcon } from 'lucide-react';

interface UploadedFile {
  file: File;
  preview: string;
  uploaded?: boolean;
  url?: string;
}

interface FileUploadProps {
  onFilesChange: (files: File[]) => void;
  initialFiles?: UploadedFile[];
  className?: string;
}

export function FileUpload({ onFilesChange, initialFiles = [], className }: FileUploadProps) {
  const [files, setFiles] = useState<UploadedFile[]>(initialFiles);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback((selectedFiles: FileList | null) => {
    if (!selectedFiles || selectedFiles.length === 0) {
      return;
    }

    console.log(`Processing ${selectedFiles.length} files`);
    const newFiles: UploadedFile[] = [];

    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i];
      console.log(`Processing file ${i + 1}:`, file.name, file.type, file.size);

      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert(`${file.name} är inte en giltig bildfil`);
        continue;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert(`${file.name} är för stor. Max storlek är 5MB.`);
        continue;
      }

      const uploadedFile = {
        file,
        preview: URL.createObjectURL(file),
        uploaded: false
      };

      console.log('Added file:', uploadedFile);
      newFiles.push(uploadedFile);
    }

    console.log(`Valid files to add:`, newFiles.length);

    // Append new files to existing files instead of replacing them
    setFiles(prevFiles => {
      const updatedFiles = [...prevFiles, ...newFiles];
      console.log(`Total files now:`, updatedFiles.length);
      return updatedFiles;
    });
  }, []);

  // Use useEffect to call onFilesChange when files change
  useEffect(() => {
    onFilesChange(files.map(f => f.file));
  }, [files, onFilesChange]);

  const handleFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    const droppedFiles = e.dataTransfer.files;
    console.log('Dropped files:', droppedFiles);
    handleFileSelect(droppedFiles);
  }, [handleFileSelect]);

  const removeFile = (index: number) => {
    setFiles(prevFiles => {
      const updatedFiles = prevFiles.filter((_, i) => i !== index);

      // Clean up preview URL to prevent memory leaks
      URL.revokeObjectURL(prevFiles[index].preview);

      return updatedFiles;
    });
  };

  return (
    <div className={className}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={(e) => handleFileSelect(e.target.files)}
        className="hidden"
      />

      {/* Upload Area */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Foton</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Upload Button */}
            <div
              onClick={handleFileInput}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-all cursor-pointer ${
                isDragOver
                  ? 'border-lime-500 bg-lime-50'
                  : 'border-stone-300 hover:border-lime-400'
              }`}
            >
              <div className="space-y-2">
                <Upload className={`w-8 h-8 mx-auto ${
                  isDragOver ? 'text-lime-600' : 'text-muted-foreground'
                }`} />
                <div>
                  <p className={`font-medium ${
                    isDragOver ? 'text-lime-800' : 'text-stone-900'
                  }`}>
                    {isDragOver ? 'Släpp bilderna här' : 'Lägg till produktfoton'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Dra och släpp eller klicka för att välja bilder
                  </p>
                </div>
              </div>
            </div>

            {/* Camera Button for Mobile */}
            <Button
              type="button"
              variant="outline"
              className="w-full lg:hidden"
              onClick={handleFileInput}
            >
              <Camera className="w-4 h-4 mr-2" />
              Ta foto
            </Button>

            {/* File Grid */}
            {files.length > 0 && (
              <div className="grid grid-cols-4 gap-2">
                {files.map((uploadedFile, index) => (
                  <div key={`${uploadedFile.file.name}-${index}`} className="aspect-square bg-stone-100 rounded-lg relative group overflow-hidden">
                    <Image
                      src={uploadedFile.preview}
                      alt={`Preview ${index + 1}`}
                      fill
                      sizes="(max-width: 768px) 25vw, 200px"
                      className="object-cover"
                      unoptimized
                    />

                    {/* Remove Button */}
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="absolute top-1 right-1 p-1 bg-red-500 hover:bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3 h-3" />
                    </button>

                    {/* Upload Status */}
                    {uploadedFile.uploaded && (
                      <div className="absolute bottom-1 left-1 right-1 bg-green-500 text-white text-xs text-center py-1 rounded">
                        Uppladdad
                      </div>
                    )}
                  </div>
                ))}

                {/* Add More Photos Button */}
                {files.length < 8 && (
                  <div
                    onClick={handleFileInput}
                    className="aspect-square bg-stone-50 border-2 border-dashed border-stone-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-lime-400 transition-colors"
                  >
                    <div className="text-center">
                      <ImageIcon className="w-6 h-6 text-muted-foreground mx-auto mb-1" />
                      <p className="text-xs text-muted-foreground">Lägg till</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Upload Help Text */}
            <p className="text-xs text-muted-foreground">
              Max 8 bilder. Stödda format: JPG, PNG, WEBP. Max storlek: 5MB per bild.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}