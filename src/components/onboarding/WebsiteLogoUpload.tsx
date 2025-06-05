
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Upload, X } from "lucide-react";

interface WebsiteLogoUploadProps {
  logo: File | null;
  onLogoChange: (file: File | null) => void;
}

const WebsiteLogoUpload = ({ logo, onLogoChange }: WebsiteLogoUploadProps) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onLogoChange(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        onLogoChange(file);
      }
    }
  };

  const removeLogo = () => {
    onLogoChange(null);
  };

  return (
    <div className="grid gap-2">
      <Label className="text-sm font-medium">Logo Upload (Optional)</Label>
      {logo ? (
        <div className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg">
          <div className="flex-1">
            <p className="text-sm font-medium">{logo.name}</p>
            <p className="text-xs text-gray-500">
              {(logo.size / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={removeLogo}
            className="text-red-600 hover:text-red-700"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div 
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
            isDragOver 
              ? 'border-blue-400 bg-blue-50' 
              : 'border-gray-300 hover:border-gray-400'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input
            id="logo-upload"
            type="file"
            accept="image/*"
            onChange={handleLogoUpload}
            className="hidden"
          />
          <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
          <div className="space-y-2">
            <label 
              htmlFor="logo-upload" 
              className="inline-block cursor-pointer text-sm text-blue-600 hover:text-blue-700 font-medium underline"
            >
              Click to upload
            </label>
            <p className="text-sm text-gray-600">or drag and drop</p>
            <p className="text-xs text-gray-500">PNG, JPG up to 2MB</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default WebsiteLogoUpload;
