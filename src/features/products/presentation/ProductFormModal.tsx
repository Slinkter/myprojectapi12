/**
 * @file ProductFormModal.tsx
 * @description Modal con formulario para crear y editar productos.
 * @architecture Presentation Layer - Product CRUD Form
 */

import React, { useState, useEffect } from "react";
import { m, AnimatePresence } from "framer-motion";
import { X, Save, AlertCircle } from "lucide-react";
import type { IProduct } from "@/features/products/domain/productTypes";
import { useCategories } from "@/features/products/application/useCategories";
import { createProduct, updateProduct } from "@/features/products/infrastructure/productsFirestore";
import { useQueryClient } from "@tanstack/react-query";

interface IProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  productToEdit?: IProduct | null;
}

export const ProductFormModal: React.FC<IProductFormModalProps> = ({
  isOpen,
  onClose,
  productToEdit,
}) => {
  const queryClient = useQueryClient();
  const { data: categories = [] } = useCategories();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [stock, setStock] = useState(0);
  const [category, setCategory] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (productToEdit) {
      setTitle(productToEdit.title);
      setDescription(productToEdit.description);
      setPrice(productToEdit.price);
      setStock(productToEdit.stock);
      setCategory(productToEdit.category || "");
      setThumbnail(productToEdit.thumbnail);
    } else {
      setTitle("");
      setDescription("");
      setPrice(0);
      setStock(0);
      setCategory(categories[0]?.slug || "");
      setThumbnail("https://dummyjson.com/image/i/products/1/thumbnail.jpg");
    }
    setErrorMsg("");
  }, [productToEdit, isOpen, categories]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || !category.trim()) {
      setErrorMsg("Por favor rellena todos los campos obligatorios.");
      return;
    }

    if (price <= 0 || stock < 0) {
      setErrorMsg("El precio debe ser mayor a 0 y el stock no puede ser negativo.");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg("");

    try {
      const productPayload = {
        title,
        description,
        price,
        stock,
        category,
        thumbnail: thumbnail.trim() || "https://dummyjson.com/image/i/products/1/thumbnail.jpg",
        images: [thumbnail.trim() || "https://dummyjson.com/image/i/products/1/thumbnail.jpg"],
      };

      if (productToEdit) {
        await updateProduct(productToEdit.id, productPayload);
      } else {
        await createProduct(productPayload);
      }

      // Invalidamos queries para refrescar la lista de productos
      await queryClient.invalidateQueries({ queryKey: ["products"] });
      onClose();
    } catch (err) {
      console.error(err);
      setErrorMsg("Error al guardar el producto. Inténtalo de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
        <m.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="relative w-full max-w-lg overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl flex flex-col"
        >
          {/* Cabecera */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
              {productToEdit ? "Editar Producto" : "Nuevo Producto"}
            </h3>
            <button
              onClick={onClose}
              className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4 max-h-[75vh]">
            {errorMsg && (
              <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900/50 rounded-xl text-xs text-red-600 dark:text-red-400">
                <AlertCircle size={16} />
                <span>{errorMsg}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                Nombre del Producto *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full h-10 px-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary text-slate-800 dark:text-slate-200"
                placeholder="Ej. iPhone 15 Pro"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                Descripción *
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                rows={3}
                className="w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary text-slate-800 dark:text-slate-200"
                placeholder="Detalla las características del producto..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                  Precio (USD) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={price || ""}
                  onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
                  required
                  className="w-full h-10 px-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary text-slate-800 dark:text-slate-200"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                  Stock *
                </label>
                <input
                  type="number"
                  value={stock === 0 ? "0" : stock || ""}
                  onChange={(e) => setStock(parseInt(e.target.value, 10) || 0)}
                  required
                  className="w-full h-10 px-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary text-slate-800 dark:text-slate-200"
                  placeholder="0"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                  Categoría *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                  className="w-full h-10 px-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary text-slate-800 dark:text-slate-200"
                >
                  <option value="">Selecciona una categoría</option>
                  {categories.map((cat) => (
                    <option key={cat.slug} value={cat.slug}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                URL de la Imagen (Thumbnail)
              </label>
              <input
                type="url"
                value={thumbnail}
                onChange={(e) => setThumbnail(e.target.value)}
                className="w-full h-10 px-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary text-slate-800 dark:text-slate-200"
                placeholder="https://ejemplo.com/imagen.jpg"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/20 -mx-6 -mb-6 p-6">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="px-4 h-10 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 h-10 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary-hover active:scale-95 transition-all shadow-md shadow-primary/20 flex items-center gap-1.5"
              >
                <Save size={16} />
                {isSubmitting ? "Guardando..." : "Guardar Producto"}
              </button>
            </div>
          </form>
        </m.div>
      </div>
    </AnimatePresence>
  );
};
