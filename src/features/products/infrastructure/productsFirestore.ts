/**
 * @file productsFirestore.ts
 * @description Servicio de acceso a datos para productos y catálogo en Google Cloud Firestore con soporte de migración/seeding inicial.
 * @architecture Infrastructure Layer - Firestore Products Service
 */

import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  writeBatch,
  DocumentData,
  QueryConstraint,
} from "firebase/firestore";
import { db, isFirebaseConfigured } from "@/shared/lib/firebase";
import apiClient from "@/app/api/apiClient";
import { reportServiceRuntimeError } from "@/shared/lib/credentialsValidator";
import type { IProduct, IProductsApiResponse } from "@/features/products/domain/productTypes";
import type { ICategory } from "./productsApi";

const PRODUCTS_COLLECTION = "products";

/**
 * Convierte un documento de Firestore a la interfaz IProduct asegurando tipos.
 */
function mapDocToProduct(idStr: string, data: DocumentData): IProduct {
  const numericId = Number(idStr) || Number(data.id) || Date.now();
  return {
    id: numericId,
    title: data.title || "",
    description: data.description || "",
    price: Number(data.price) || 0,
    discountPercentage: data.discountPercentage !== undefined ? Number(data.discountPercentage) : undefined,
    rating: data.rating !== undefined ? Number(data.rating) : undefined,
    stock: Number(data.stock) || 0,
    brand: data.brand || "",
    category: data.category || "",
    thumbnail: data.thumbnail || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80",
    images: Array.isArray(data.images) && data.images.length > 0
      ? data.images
      : [data.thumbnail || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80"],
  };
}

/**
 * Fallback a la API de DummyJSON para obtener productos cuando Firestore no esta disponible.
 */
async function fetchProductsFromFallbackApi(
  skip: number,
  limit: number,
  category?: string
): Promise<IProductsApiResponse> {
  const url = category
    ? `/products/category/${encodeURIComponent(category)}?limit=${limit}&skip=${skip}`
    : `/products?limit=${limit}&skip=${skip}`;
  return apiClient<IProductsApiResponse>(url);
}

/**
 * Fallback a la API de DummyJSON para obtener categorías.
 */
async function fetchCategoriesFromFallbackApi(): Promise<ICategory[]> {
  try {
    const rawCategories = await apiClient<Array<string | { slug: string; name: string; url: string }>>(
      "/products/categories"
    );
    return rawCategories.map((cat) => {
      if (typeof cat === "string") {
        return {
          slug: cat,
          name: cat.charAt(0).toUpperCase() + cat.slice(1).replace(/-/g, " "),
          url: `/products/category/${cat}`,
        };
      }
      return {
        slug: cat.slug,
        name: cat.name,
        url: `/products/category/${cat.slug}`,
      };
    });
  } catch (err) {
    console.error("Error al obtener categorias de DummyJSON:", err);
    return [];
  }
}

/**
 * Seeding automático: Si la colección `products` está vacía, descarga los primeros
 * 100 productos de DummyJSON y los inserta por lotes (batch) en Firestore.
 */
export async function seedProductsIfEmpty(): Promise<boolean> {
  if (!isFirebaseConfigured) return false;

  try {
    const colRef = collection(db, PRODUCTS_COLLECTION);
    const snapshot = await getDocs(colRef);

    if (!snapshot.empty) {
      return false; // Ya existen productos
    }

    // Traer catálogo base de DummyJSON
    const seedData = await apiClient<IProductsApiResponse>("/products?limit=100");
    if (!seedData || !seedData.products || seedData.products.length === 0) {
      return false;
    }

    // Insertar en lotes de hasta 500 (Firestore batch limit)
    const batch = writeBatch(db);
    for (const prod of seedData.products) {
      const docRef = doc(db, PRODUCTS_COLLECTION, String(prod.id));
      batch.set(docRef, {
        id: prod.id,
        title: prod.title,
        description: prod.description,
        price: prod.price,
        discountPercentage: prod.discountPercentage ?? 0,
        rating: prod.rating ?? 4.5,
        stock: prod.stock ?? 10,
        brand: prod.brand ?? "Genérico",
        category: prod.category ?? "otros",
        thumbnail: prod.thumbnail,
        images: prod.images && prod.images.length > 0 ? prod.images : [prod.thumbnail],
        createdAt: new Date().toISOString(),
      });
    }

    await batch.commit();
    return true;
  } catch (err) {
    console.error("Error al sembrar catálogo inicial en Firestore:", err);
    if (err instanceof Error) {
      reportServiceRuntimeError("firebase", err.message);
    }
    return false;
  }
}

/**
 * Obtiene lista paginada de productos desde Firestore con fallback automatico a DummyJSON.
 */
export async function getProductsFromFirestore(
  skip: number,
  limit: number,
  category?: string
): Promise<IProductsApiResponse> {
  if (!isFirebaseConfigured) {
    return fetchProductsFromFallbackApi(skip, limit, category);
  }

  try {
    const colRef = collection(db, PRODUCTS_COLLECTION);
    let snapshot = await getDocs(colRef);

    if (snapshot.empty) {
      await seedProductsIfEmpty();
      snapshot = await getDocs(colRef);
    }

    const constraints: QueryConstraint[] = [];
    if (category) {
      constraints.push(where("category", "==", category));
    }
    // Ordenar por ID para paginación predecible
    constraints.push(orderBy("id", "asc"));

    const allProducts: IProduct[] = [];
    try {
      const q = query(colRef, ...constraints);
      const querySnap = await getDocs(q);
      querySnap.forEach((docSnap) => {
        allProducts.push(mapDocToProduct(docSnap.id, docSnap.data()));
      });
    } catch {
      // Si falta un índice compuesto en Firestore (por category + orderBy), hacemos fallback en memoria
      snapshot.forEach((docSnap) => {
        const prod = mapDocToProduct(docSnap.id, docSnap.data());
        if (!category || prod.category === category) {
          allProducts.push(prod);
        }
      });
      allProducts.sort((a, b) => a.id - b.id);
    }

    const total = allProducts.length;
    const paginated = allProducts.slice(skip, skip + limit);

    return {
      products: paginated,
      total,
      skip,
      limit,
    };
  } catch (err) {
    console.warn("Fallo al consultar Firestore, usando respaldo de DummyJSON:", err);
    if (err instanceof Error) {
      reportServiceRuntimeError("firebase", err.message);
    }
    return fetchProductsFromFallbackApi(skip, limit, category);
  }
}

/**
 * Obtiene las categorías únicas dinámicamente desde Firestore con fallback a DummyJSON.
 */
export async function getCategoriesFromFirestore(): Promise<ICategory[]> {
  if (!isFirebaseConfigured) {
    return fetchCategoriesFromFallbackApi();
  }

  try {
    const colRef = collection(db, PRODUCTS_COLLECTION);
    let snapshot = await getDocs(colRef);

    if (snapshot.empty) {
      await seedProductsIfEmpty();
      snapshot = await getDocs(colRef);
    }

    const categorySet = new Set<string>();
    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      if (data.category) {
        categorySet.add(data.category);
      }
    });

    const categories: ICategory[] = Array.from(categorySet).sort().map((cat) => ({
      slug: cat,
      name: cat.charAt(0).toUpperCase() + cat.slice(1).replace(/-/g, " "),
      url: `/products/category/${cat}`,
    }));

    return categories;
  } catch (err) {
    console.warn("Fallo al obtener categorias desde Firestore, usando DummyJSON:", err);
    if (err instanceof Error) {
      reportServiceRuntimeError("firebase", err.message);
    }
    return fetchCategoriesFromFallbackApi();
  }
}

/**
 * Obtiene un producto individual por ID desde Firestore o DummyJSON si no está configurado.
 */
export async function getProductByIdFromFirestore(id: number | string): Promise<IProduct | null> {
  if (!isFirebaseConfigured) {
    try {
      return await apiClient<IProduct>(`/products/${id}`);
    } catch {
      return null;
    }
  }

  try {
    const docRef = doc(db, PRODUCTS_COLLECTION, String(id));
    const snap = await getDoc(docRef);
    if (!snap.exists()) return null;
    return mapDocToProduct(snap.id, snap.data());
  } catch (err) {
    console.warn("Fallo al obtener producto individual desde Firestore, usando DummyJSON:", err);
    if (err instanceof Error) {
      reportServiceRuntimeError("firebase", err.message);
    }
    try {
      return await apiClient<IProduct>(`/products/${id}`);
    } catch {
      return null;
    }
  }
}

/**
 * Crea un nuevo producto en Firestore (exclusivo para Admin).
 */
export async function createProductInFirestore(
  productData: Omit<IProduct, "id"> & { id?: number }
): Promise<IProduct> {
  if (!isFirebaseConfigured) {
    throw new Error(
      "No es posible crear productos porque Firebase no esta configurado. Define las variables VITE_FIREBASE_* en tu archivo .env local."
    );
  }

  const id = productData.id || Date.now();
  const docRef = doc(db, PRODUCTS_COLLECTION, String(id));
  
  const newProduct: IProduct = {
    ...productData,
    id,
    thumbnail: productData.thumbnail || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80",
    images: productData.images && productData.images.length > 0 
      ? productData.images 
      : [productData.thumbnail || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80"],
  };

  await setDoc(docRef, {
    ...newProduct,
    createdAt: new Date().toISOString(),
  });

  return newProduct;
}

/**
 * Actualiza un producto existente en Firestore (exclusivo para Admin).
 */
export async function updateProductInFirestore(
  id: number | string,
  updates: Partial<IProduct>
): Promise<void> {
  if (!isFirebaseConfigured) {
    throw new Error(
      "No es posible actualizar productos porque Firebase no esta configurado. Define las variables VITE_FIREBASE_* en tu archivo .env local."
    );
  }

  const docRef = doc(db, PRODUCTS_COLLECTION, String(id));
  await updateDoc(docRef, {
    ...updates,
    updatedAt: new Date().toISOString(),
  });
}

/**
 * Elimina un producto de Firestore por su ID (exclusivo para Admin).
 */
export async function deleteProductFromFirestore(id: number | string): Promise<void> {
  if (!isFirebaseConfigured) {
    throw new Error(
      "No es posible eliminar productos porque Firebase no esta configurado. Define las variables VITE_FIREBASE_* en tu archivo .env local."
    );
  }

  const docRef = doc(db, PRODUCTS_COLLECTION, String(id));
  await deleteDoc(docRef);
}

// Aliases para compatibilidad entre módulos
export const getProducts = getProductsFromFirestore;
export const getCategories = getCategoriesFromFirestore;
export const createProduct = createProductInFirestore;
export const updateProduct = updateProductInFirestore;
export const deleteProduct = deleteProductFromFirestore;

export const getAllProductsForAdmin = async (): Promise<IProduct[]> => {
  const res = await getProductsFromFirestore(0, 1000);
  return res.products;
};
