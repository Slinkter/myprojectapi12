/**
 * @file ProductFormModal.tsx
 * @description Modal administrativo para crear o editar productos con sincronización en Firestore.
 * @architecture Presentation Layer - Admin Component
 */

import { useState, useEffect } from "react";
import { X, Sparkles, AlertCircle } from "lucide-react";
import { Button } from "@/shared/ui/Button";
import type { IProduct } from "@/entities/product";

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (productData: Partial<IProduct>) => Promise<void>;
  productToEdit?: IProduct | null;
  categories?: { slug: string; name: string }[];
}

/**
 * Modal interactivo con formulario para crear y actualizar productos.
 */
export const ProductFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  productToEdit,
  categories = [],
}: ProductFormModalProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<number | string>("");
  const [stock, setStock] = useState<number | string>("");
  const [category, setCategory] = useState("");
  const [brand, setBrand] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [discountPercentage, setDiscountPercentage] = useState<number | string>(0);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (productToEdit) {
      setTitle(productToEdit.title || "");
      setDescription(productToEdit.description || "");
      setPrice(productToEdit.price ?? "");
      setStock(productToEdit.stock ?? 10);
      setCategory(productToEdit.category || "");
      setBrand(productToEdit.brand || "");
      setThumbnail(productToEdit.thumbnail || "");
      setDiscountPercentage(productToEdit.discountPercentage ?? 0);
    } else {
      setTitle("");
      setDescription("");
      setPrice("");
      setStock(10);
      setCategory(categories[0]?.slug || "beauty");
      setBrand("");
      setThumbnail("");
      setDiscountPercentage(0);
    }
    setError("");
  }, [productToEdit, isOpen, categories]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!title.trim() || !price || !category) {
      setError("Por favor completa los campos requeridos (Título, Precio, Categoría).");
      return;
    }

    const numPrice = Number(price);
    const numStock = Number(stock);
    const numDiscount = Number(discountPercentage);

    if (isNaN(numPrice) || numPrice <= 0) {
      setError("El precio debe ser un número mayor a 0.");
      return;
    }

    if (isNaN(numStock) || numStock < 0) {
      setError("El stock no puede ser negativo.");
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        title: title.trim(),
        description: description.trim(),
        price: numPrice,
        stock: numStock,
        category: category.trim(),
        brand: brand.trim() || "Genérico",
        thumbnail: thumbnail.trim() || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80",
        discountPercentage: isNaN(numDiscount) ? 0 : numDiscount,
      });
      onClose();
    } catch (err) {
      console.error(err);
      setError("Ocurrió un error al guardar el producto. Por favor intenta de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        aria-hidden="true"
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      <div className="relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-in fade-in zoom-in-95 duration-200 z-10">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 bg-transparent border-none cursor-pointer rounded-lg"
          aria-label="Cerrar modal"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-2 mb-6">
          <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <Sparkles size={20} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
              {productToEdit ? "Editar Producto" : "Nuevo Producto"}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {productToEdit ? "Modifica los atributos en Firestore" : "Añade un producto al catálogo en Firestore"}
            </p>
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 p-3 mb-5 rounded-xl text-xs font-semibold bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800">
            <AlertCircle size={16} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Título del Producto *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ej. Auriculares Inalámbricos Pro"
              className="w-full h-10 px-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Precio (USD) *
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="29.99"
                className="w-full h-10 px-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Stock *
              </label>
              <input
                type="number"
                min="0"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                placeholder="10"
                className="w-full h-10 px-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Categoría *
              </label>
              <input
                type="text"
                list="category-options"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="beauty, fragrances..."
                className="w-full h-10 px-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                required
              />
              <datalist id="category-options">
                {categories.map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {c.name}
                  </option>
                ))}
              </datalist>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Marca
              </label>
              <input
                type="text"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                placeholder="Ej. Apple, Sony..."
                className="w-full h-10 px-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              URL de Imagen / Thumbnail
            </label>
            <input
              type="url"
              value={thumbnail}
              onChange={(e) => setThumbnail(e.target.value)}
              placeholder="https://images.unsplash.com/..."
              className="w-full h-10 px-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Descripción
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detalles sobre características y uso..."
              className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 resize-none"
            />
          </div>

          <div className="flex gap-3 pt-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 h-11 rounded-xl"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 h-11 rounded-xl font-bold shadow-lg shadow-emerald-500/20"
            >
              {isSubmitting ? "Guardando..." : productToEdit ? "Actualizar" : "Crear Producto"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
