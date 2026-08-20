/**
 * @file ProductImageGallery.tsx
 * @description Galería interactiva de imágenes de producto con selector y miniaturas.
 * @architecture Presentation Layer - Product Component
 */

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
 * Galería de imágenes del producto con visualizador principal y selector de miniaturas.
 *
 * @remarks
 * Muestra la imagen seleccionada con soporte de zoom interactivo.
 * Si hay múltiples imágenes, renderiza una fila de miniaturas seleccionables
 * con anillo de resplandor activo (border glow), escala sutil y estados accesibles.
 *
 * @component
 * @param {ProductImageGalleryProps} props - Propiedades del componente.
 * @returns {JSX.Element} Elemento JSX con la galería de imágenes.
 */
const ProductImageGallery = ({
  images,
  thumbnail,
  selectedImage,
  onSelect,
  title,
}: ProductImageGalleryProps) => {
  const displayImages = images && images.length > 0 ? images : [thumbnail];

  return (
    <div className="flex flex-col items-center justify-between p-4 sm:p-6 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 min-h-[300px] md:min-h-[400px]">
      {/* Visualizador de imagen principal con zoom */}
      <div className="relative w-full flex-1 flex items-center justify-center min-h-[220px] max-h-[320px] p-2">
        <ImageZoom
          src={selectedImage}
          alt={title}
          className="w-full h-full max-h-[300px] object-contain rounded-xl"
        />
      </div>

      {/* Selector de miniaturas con active border glow */}
      {displayImages.length > 1 && (
        <div className="flex gap-2.5 mt-4 pt-3 border-t border-slate-200/60 dark:border-slate-800/60 flex-wrap justify-center max-w-full overflow-x-auto py-1">
          {displayImages.map((img, index) => {
            const isSelected = selectedImage === img;
            return (
              <button
                key={img}
                type="button"
                onClick={() => onSelect(img)}
                aria-label={`Ver imagen ${index + 1} de ${displayImages.length}`}
                aria-pressed={isSelected}
                className={cn(
                  "w-12 h-12 md:w-14 md:h-14 p-0.5 rounded-xl cursor-pointer overflow-hidden border-2 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50 bg-white dark:bg-slate-950",
                  isSelected
                    ? "border-emerald-500 ring-2 ring-emerald-500/30 shadow-md shadow-emerald-500/20 scale-105 opacity-100"
                    : "border-slate-200 dark:border-slate-800 opacity-60 hover:opacity-100 hover:border-slate-300 dark:hover:border-slate-700"
                )}
              >
                <img
                  src={img}
                  alt={`${title} miniatura ${index + 1}`}
                  className="w-full h-full object-contain rounded-lg"
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ProductImageGallery;


