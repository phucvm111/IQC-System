import { useState, useRef } from 'react';
import { UploadCloud, X, Camera } from 'lucide-react';

interface ImageUploadProps {
  onImagesChange: (files: File[]) => void;
}

export default function ImageUpload({ onImagesChange }: ImageUploadProps) {
  const [previews, setPreviews] = useState<{ url: string; file: File }[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      const newPreviews = newFiles.map(file => ({
        url: URL.createObjectURL(file),
        file
      }));
      const updatedPreviews = [...previews, ...newPreviews];
      setPreviews(updatedPreviews);
      onImagesChange(updatedPreviews.map(p => p.file));
    }
  };

  const removeImage = (index: number) => {
    const updated = previews.filter((_, i) => i !== index);
    setPreviews(updated);
    onImagesChange(updated.map(p => p.file));
  };

  return (
    <div className="w-full">
      <div className="flex gap-4 mb-4">
        <button 
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="flex-1 border-2 border-dashed border-gray-300 hover:border-primary hover:bg-primary/5 rounded-xl p-6 flex flex-col items-center justify-center transition-colors"
        >
          <UploadCloud className="w-8 h-8 text-gray-400 mb-2" />
          <span className="text-sm font-medium text-gray-600">Upload Images</span>
          <span className="text-xs text-gray-400 mt-1">PNG, JPG up to 10MB</span>
        </button>
        <button 
          type="button"
          onClick={() => cameraInputRef.current?.click()}
          className="flex-1 border-2 border-dashed border-gray-300 hover:border-primary hover:bg-primary/5 rounded-xl p-6 flex flex-col items-center justify-center transition-colors"
        >
          <Camera className="w-8 h-8 text-gray-400 mb-2" />
          <span className="text-sm font-medium text-gray-600">Take Photo</span>
          <span className="text-xs text-gray-400 mt-1">Use device camera</span>
        </button>
      </div>

      <input 
        type="file" 
        multiple 
        accept="image/*" 
        className="hidden" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
      />
      <input 
        type="file" 
        accept="image/*" 
        capture="environment" 
        className="hidden" 
        ref={cameraInputRef} 
        onChange={handleFileChange} 
      />

      {previews.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 mt-6">
          {previews.map((preview, idx) => (
            <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-gray-200 group">
              <img src={preview.url} alt="Preview" className="w-full h-full object-cover" />
              <button
                onClick={() => removeImage(idx)}
                className="absolute top-1 right-1 bg-black/50 hover:bg-danger text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
