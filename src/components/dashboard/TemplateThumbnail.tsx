
import { useState } from 'react';
import { Image, ImageOff } from 'lucide-react';

interface TemplateThumbnailProps {
  templateId: string;
  templateName?: string;
  className?: string;
}

const TemplateThumbnail = ({ templateId, templateName, className = "" }: TemplateThumbnailProps) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const previewPath = `/previews/template-${templateId}.jpg`;

  const handleImageError = () => {
    setImageError(true);
    setImageLoading(false);
  };

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  if (imageError) {
    return (
      <div className={`bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center ${className}`}>
        <div className="text-center">
          <ImageOff className="h-6 w-6 text-gray-400 mx-auto mb-1" />
          <p className="text-xs text-gray-500 font-medium">
            {templateName || `Template ${templateId}`}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {imageLoading && (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center">
          <Image className="h-6 w-6 text-gray-400 animate-pulse" />
        </div>
      )}
      <img
        src={previewPath}
        alt={`${templateName || `Template ${templateId}`} preview`}
        className={`w-full h-full object-cover transition-opacity duration-200 ${
          imageLoading ? 'opacity-0' : 'opacity-100'
        }`}
        onError={handleImageError}
        onLoad={handleImageLoad}
      />
    </div>
  );
};

export default TemplateThumbnail;
