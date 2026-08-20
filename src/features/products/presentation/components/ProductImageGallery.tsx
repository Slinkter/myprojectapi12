import { ImageZoom } from "@/shared/ui/ImageZoom";
import { cn } from "@/shared/lib/cn";

/**
 * @interface ProductImageGalleryProps
 * @description Propiedades del componente ProductImageGallery.
 */
export interface ProductImageGalleryProps {
  /** Array de URLs de imágenes adicionales del producto. */
  images?: string[];
  /** URL de la imagen miniatura principal. */
  thumbnail: string;
  /** URL de la imagen actualmente seleccionada y en zoom. */
  selectedImage: string;
  /** Callback al seleccionar una imagen de la galería. */
  onSelect: (image: string) => void;
  /** Título del producto (usado como texto alternativo). */
  title: string;
}

/**
 * Galería de imágenes del producto con zoom interactivo.
 *
 * @remarks
 * Muestra la imagen seleccionada con un componente `ImageZoom`.
 * Si hay múltiples imágenes, renderiza una fila de miniaturas seleccionables.
 * Cada miniatura tiene borde resaltado y escala al estar activa.
 * Si no hay imágenes adicionales, solo muestra la miniatura principal.
 *
 * @component
 * @param props.images - Lista de URLs de imágenes adicionales.
 * @param props.thumbnail - Miniatura principal del producto.
 * @param props.selectedImage - Imagen actualmente en vista principal.
 * @param props.onSelect - Callback al hacer clic en una miniatura.
 * @param props.title - Título para los atributos alt de las imágenes.
 * @returns Elemento JSX con la galería de imágenes.
 */
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
              key={img}
              type="button"
              onClick={() => onSelect(img)}
              aria-label={`Ver imagen ${index + 1} de ${title}`}
              className={cn(
                'flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-[transform,opacity,border-color,box-shadow] duration-300 bg-background/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/30',
                selectedImage === img ? "border-primary shadow-lg shadow-primary/20 scale-110" : "border-transparent opacity-60 hover:opacity-100"
              )}
            >
              <img src={img} alt={`${title} - ${index + 1}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductImageGallery;

