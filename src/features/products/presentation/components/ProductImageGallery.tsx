import { ImageZoom } from "@/shared/ui/ImageZoom";
import { cn } from "@/lib/utils";

interface ProductImageGalleryProps {
  images?: string[];
  thumbnail: string;
  selectedImage: string;
  onSelect: (image: string) => void;
  title: string;
}

const ProductImageGallery = ({ images, thumbnail, selectedImage, onSelect, title }: ProductImageGalleryProps) => {
  const displayImages = images && images.length > 0 ? images : [thumbnail];

  return (
    <div className="w-full md:w-1/2 order-1 md:order-2 bg-muted/20 relative flex flex-col items-center justify-center p-8 md:p-12">
      <div className="relative w-full h-64 md:h-full max-h-[500px] flex items-center justify-center mb-8">
        <div className="absolute inset-0 bg-primary/5 rounded-full blur-3xl transform scale-75 animate-pulse" />
        <ImageZoom
          src={selectedImage}
          alt={title}
          className="relative z-10 w-full h-full object-contain"
        />
      </div>
      
      {displayImages.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2 max-w-full">
          {displayImages.map((img, index) => (
            <button
              key={index}
              onClick={() => onSelect(img)}
              className={cn(
                'flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all duration-300 bg-background/50',
                selectedImage === img ? "border-primary shadow-lg shadow-primary/20 scale-110" : "border-transparent opacity-60 hover:opacity-100"
              )}
            >
              <img src={img} alt={`${title} - ${index}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductImageGallery;
