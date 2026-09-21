/**
 * @file ProductFormModal.tsx
 * @description Modal con formulario para crear y editar productos con estado derivado por clave de montaje.
 * @architecture Presentation Layer - Product CRUD Form
 */

import React, { useState } from "react";
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

interface IProductFormContentProps {
  productToEdit?: IProduct | null;
  categories: Array<{ slug: string; name: string }>;
  onClose: () => void;
}

const ProductFormContent: React.FC<IProductFormContentProps> = ({
  productToEdit,
  categories,
  onClose,
}) => {
  const queryClient = useQueryClient();

  const [title, setTitle] = useState(productToEdit?.title ?? "");
  const [description, setDescription] = useState(productToEdit?.description ?? "");
  const [price, setPrice] = useState(productToEdit?.price ?? 0);
  const [stock, setStock] = useState(productToEdit?.stock ?? 0);
  const [category, setCategory] = useState(productToEdit?.category ?? categories[0]?.slug ?? "");
  const [thumbnail, setThumbnail] = useState(
    productToEdit?.thumbnail ?? "https://dummyjson.com/image/i/products/1/thumbnail.jpg"
  );
  const [errorMsg, setErrorMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    <>
      {/* Cabecera */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
          {productToEdit ? "Editar Producto" : "Nuevo Producto"}
        </h3>
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar modal"
          className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer"
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
          <label
            htmlFor="modal-product-title"
            className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1"
          >
            Nombre del Producto *
          </label>
          <input
            id="modal-product-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full h-10 px-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary text-slate-800 dark:text-slate-200"
            placeholder="Ej. iPhone 15 Pro"
          />
        </div>

        <div>
          <label
            htmlFor="modal-product-description"
            className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1"
          >
            Descripción *
          </label>
          <textarea
            id="modal-product-description"
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
            <label
              htmlFor="modal-product-price"
              className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1"
            >
              Precio (USD) *
            </label>
            <input
              id="modal-product-price"
              type="number"
              step="0.01"
              value={price || ""}
              onChange={(e) => {
                const val = e.target.valueAsNumber;
                setPrice(Number.isNaN(val) ? 0 : val);
              }}
              required
              className="w-full h-10 px-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary text-slate-800 dark:text-slate-200"
              placeholder="0.00"
            />
          </div>

          <div>
            <label
              htmlFor="modal-product-stock"
              className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1"
            >
              Stock *
            </label>
            <input
              id="modal-product-stock"
              type="number"
              value={stock === 0 ? "0" : stock || ""}
              onChange={(e) => {
                const val = e.target.valueAsNumber;
                setStock(Number.isNaN(val) ? 0 : val);
              }}
              required
              className="w-full h-10 px-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary text-slate-800 dark:text-slate-200"
              placeholder="0"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <div>
            <label
              htmlFor="modal-product-category"
              className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1"
            >
              Categoría *
            </label>
            <select
              id="modal-product-category"
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
          <label
            htmlFor="modal-product-thumbnail"
            className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1"
          >
            URL de la Imagen (Thumbnail)
          </label>
          <input
            id="modal-product-thumbnail"
            type="url"
            value={thumbnail}
            onChange={(e) => setThumbnail(e.target.value)}
            className="w-full h-10 px-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary text-slate-800 dark:text-slate-200"
            placeholder="https://ejemplo.com/imagen.jpg"
          />
        </div>

        {/* Acciones */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="h-10 px-4 rounded-xl border border-slate-200 dark:border-slate-800 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="h-10 px-5 rounded-xl bg-primary hover:bg-primary-hover text-white text-sm font-bold shadow-md shadow-primary/20 flex items-center gap-2 transition-colors disabled:opacity-50 cursor-pointer"
          >
            <Save size={16} />
            <span>{isSubmitting ? "Guardando..." : "Guardar"}</span>
          </button>
        </div>
      </form>
    </>
  );
};

export const ProductFormModal: React.FC<IProductFormModalProps> = ({
  isOpen,
  onClose,
  productToEdit,
}) => {
  const { data: categories = [] } = useCategories();

  if (!isOpen) return null;

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
          <ProductFormContent
            key={productToEdit ? String(productToEdit.id) : "new"}
            productToEdit={productToEdit}
            categories={categories}
            onClose={onClose}
          />
        </m.div>
      </div>
    </AnimatePresence>
  );
};
