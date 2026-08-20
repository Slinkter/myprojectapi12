import { IProduct } from "@/features/products/application/types";

/**
 * Propiedades para el componente ProductList.
 *
 * @interface IProductListProps
 * @property {IProduct[]} products - Lista de productos cargados actualmente.
 * @property {boolean} isLoading - Indica si hay una operación de carga en curso.
 * @property {string | null} error - Mensaje de error si la carga falló, o null si fue exitosa.
 * @property {boolean} hasMore - Indica si existen más productos disponibles para cargar.
 * @property {() => void} loadMoreProducts - Función para solicitar la siguiente página.
 */
export interface IProductListProps {
  products: IProduct[];
  isLoading: boolean;
  error: string | null;
  hasMore: boolean;
  loadMoreProducts: () => void;
  onEdit?: (product: IProduct) => void;
  onDelete?: (id: number) => void;
}
