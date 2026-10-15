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
import { db } from "@/shared/lib/firebase";
import apiClient from "@/app/api/apiClient";
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
 * Seeding automático: Si la colección `products` está vacía, descarga los primeros
 * 100 productos de DummyJSON y los inserta por lotes (batch) en Firestore.
 */
export async function seedProductsIfEmpty(): Promise<boolean> {
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
    return false;
  }
}

/**
 * Obtiene lista paginada de productos desde Firestore.
 * Si la colección está vacía, dispara el seeding automático transparentemente.
 */
export async function getProductsFromFirestore(
  skip: number,
  limit: number,
  category?: string
): Promise<IProductsApiResponse> {
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
}

/**
 * Obtiene las categorías únicas dinámicamente desde los productos almacenados en Firestore.
 */
export async function getCategoriesFromFirestore(): Promise<ICategory[]> {
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
}

/**
 * Obtiene un producto individual por ID desde Firestore.
 */
export async function getProductByIdFromFirestore(id: number | string): Promise<IProduct | null> {
  const docRef = doc(db, PRODUCTS_COLLECTION, String(id));
  const snap = await getDoc(docRef);
  if (!snap.exists()) return null;
  return mapDocToProduct(snap.id, snap.data());
}

/**
 * Crea un nuevo producto en Firestore (exclusivo para Admin).
 */
export async function createProductInFirestore(
  productData: Omit<IProduct, "id"> & { id?: number }
): Promise<IProduct> {
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
  const docRef = doc(db, PRODUCTS_COLLECTION, String(id));
  await deleteDoc(docRef);
}
