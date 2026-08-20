/**
 * @file productsFirestore.ts
 * @description Servicio de infraestructura para interactuar con Firebase Firestore para la colección de productos.
 * @architecture Infrastructure Layer - Firestore integration
 */

import { 
  collection, 
  getDocs, 
  doc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  writeBatch,
  query,
  where
} from "firebase/firestore";
import { db } from "@/shared/lib/firebase";
import { getProducts as getProductsFromApi, getCategories as getCategoriesFromApi } from "./productsApi";
import type { IProduct, IProductsApiResponse } from "@/features/products/domain/productTypes";
import type { ICategory } from "./productsApi";

const PRODUCTS_COLLECTION = "products";

/**
 * Realiza la siembra (seeding) de productos desde la API de DummyJSON hacia Firestore
 * únicamente si la colección está vacía.
 */
export const seedProductsIfEmpty = async (): Promise<void> => {
  try {
    const productsRef = collection(db, PRODUCTS_COLLECTION);
    const snapshot = await getDocs(productsRef);
    
    if (snapshot.empty) {
      console.log("La colección de productos en Firestore está vacía. Iniciando seeding...");
      // Obtenemos los primeros 100 productos de la API
      const apiResponse = await getProductsFromApi(0, 100);
      const batch = writeBatch(db);
      
      for (const product of apiResponse.products) {
        const docRef = doc(db, PRODUCTS_COLLECTION, String(product.id));
        batch.set(docRef, product);
      }
      
      await batch.commit();
      console.log("Seeding completado con éxito.");
    }
  } catch (error) {
    console.warn("No se pudo completar el seeding en Firestore (posible falta de permisos o BD no creada):", error);
  }
};

/**
 * Obtiene la lista de categorías disponibles desde Firestore con fallback a la API.
 */
export const getCategories = async (): Promise<ICategory[]> => {
  try {
    await seedProductsIfEmpty();
    const productsRef = collection(db, PRODUCTS_COLLECTION);
    const snapshot = await getDocs(productsRef);
    
    const categoriesSet = new Set<string>();
    snapshot.forEach((doc) => {
      const data = doc.data() as IProduct;
      if (data.category) {
        categoriesSet.add(data.category);
      }
    });

    if (categoriesSet.size > 0) {
      return Array.from(categoriesSet).map((categoryName) => ({
        slug: categoryName,
        name: categoryName.charAt(0).toUpperCase() + categoryName.slice(1).replace("-", " "),
        url: "",
      }));
    }
  } catch (error) {
    console.warn("Fallo al leer categorías de Firestore, usando API externa:", error);
  }

  // Fallback a DummyJSON si Firestore falla o está vacío
  return getCategoriesFromApi();
};

/**
 * Obtiene una lista paginada de productos de Firestore con fallback a la API.
 */
export const getProducts = async (
  skip: number,
  limit: number,
  category?: string
): Promise<IProductsApiResponse> => {
  try {
    await seedProductsIfEmpty();

    const productsRef = collection(db, PRODUCTS_COLLECTION);
    let q = query(productsRef);

    if (category) {
      q = query(productsRef, where("category", "==", category));
    }

    const snapshot = await getDocs(q);
    const allProducts: IProduct[] = [];
    
    snapshot.forEach((doc) => {
      allProducts.push(doc.data() as IProduct);
    });

    if (allProducts.length > 0) {
      // Ordenamos consistentemente por id numérico
      allProducts.sort((a, b) => a.id - b.id);

      // Aplicamos la paginación localmente
      const paginatedProducts = allProducts.slice(skip, skip + limit);

      return {
        products: paginatedProducts,
        total: allProducts.length,
        skip,
        limit,
      };
    }
  } catch (error) {
    console.warn("Fallo al leer productos de Firestore, usando API externa:", error);
  }

  // Fallback a DummyJSON si Firestore falla o está vacío
  return getProductsFromApi(skip, limit, category);
};

/**
 * Crea un nuevo producto en Firestore.
 */
export const createProduct = async (productData: Omit<IProduct, "id">): Promise<IProduct> => {
  const productsRef = collection(db, PRODUCTS_COLLECTION);
  
  // Obtenemos todos para calcular el siguiente ID numérico
  const snapshot = await getDocs(productsRef);
  let maxId = 0;
  snapshot.forEach((doc) => {
    const data = doc.data() as IProduct;
    if (data.id > maxId) {
      maxId = data.id;
    }
  });

  const newId = maxId + 1;
  const newProduct: IProduct = {
    ...productData,
    id: newId,
  };

  await setDoc(doc(db, PRODUCTS_COLLECTION, String(newId)), newProduct);
  return newProduct;
};

/**
 * Actualiza un producto existente en Firestore.
 */
export const updateProduct = async (id: number, productData: Partial<IProduct>): Promise<void> => {
  const docRef = doc(db, PRODUCTS_COLLECTION, String(id));
  await updateDoc(docRef, productData);
};

/**
 * Elimina un producto de Firestore.
 */
export const deleteProduct = async (id: number): Promise<void> => {
  const docRef = doc(db, PRODUCTS_COLLECTION, String(id));
  await deleteDoc(docRef);
};
