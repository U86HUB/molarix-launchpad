
import { SectionMotion } from './SectionMotion';
import { Skeleton } from '@/components/ui/skeleton';
import { useState } from 'react';

export interface GalleryProps {
  heading?: string;
  subheading?: string;
  images?: string[];
  columnsDesktop?: 2 | 3 | 4;
  columnsMobile?: 1 | 2;
}

export function Gallery({
  heading = 'Gallery',
  subheading = '',
  images = [],
  columnsDesktop = 3,
  columnsMobile = 2
}: GalleryProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const hasImages = images && images.length > 0;
  
  const colDesktopClass = {
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-3',
    4: 'md:grid-cols-4',
  }[columnsDesktop];
  
  const colMobileClass = {
    1: 'grid-cols-1',
    2: 'grid-cols-2',
  }[columnsMobile];

  return (
    <section className="py-16 md:py-24 bg-white dark:bg-gray-900">
      <SectionMotion className="container mx-auto px-4">
        <div className="text-center mb-12">
          {heading && (
            <h2 className="text-3xl font-bold mb-4"
              style={{ color: 'var(--primary-color)' }}>
              {heading}
            </h2>
          )}
          {subheading && (
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              {subheading}
            </p>
          )}
        </div>

        {hasImages ? (
          <div className={`grid ${colMobileClass} ${colDesktopClass} gap-4`}>
            {images.map((image, index) => (
              <div key={index} className="aspect-square overflow-hidden rounded-lg">
                <img 
                  src={image} 
                  alt={`Gallery image ${index + 1}`} 
                  className="w-full h-full object-cover cursor-pointer transition-transform duration-300 hover:scale-105"
                  onClick={() => setSelectedImage(image)}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center p-10 bg-white dark:bg-gray-900 rounded-lg shadow">
            <p className="text-gray-500 dark:text-gray-400">No gallery images configured</p>
            <div className={`grid ${colMobileClass} ${colDesktopClass} gap-4 mt-8`}>
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="aspect-square w-full rounded-lg" />
              ))}
            </div>
          </div>
        )}

        {/* Image Modal */}
        {selectedImage && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedImage(null)}
          >
            <div className="relative max-w-4xl max-h-[90vh] w-full">
              <button 
                onClick={() => setSelectedImage(null)}
                className="absolute top-2 right-2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <img 
                src={selectedImage} 
                alt="Gallery preview" 
                className="w-full h-full object-contain rounded-lg"
              />
            </div>
          </div>
        )}
      </SectionMotion>
    </section>
  );
}
