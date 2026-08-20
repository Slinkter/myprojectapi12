/**
 * @file FirestoreProductRepository.ts
 * @description Adaptador de infraestructura que implementa IProductRepository sobre Firebase Firestore con fallback a REST API.
 * @architecture Infrastructure Layer - Product Repository Adapter (Repository Pattern)
 */

import {
  collection,
  getDocs,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  writeBatch,
} from "firebase/firestore";
import { db } from "@/shared/lib/firebase";
import {
  getProducts as getProductsFromApi,
  getCategories as getCategoriesFromApi,
  type ICategory,
} from "@/features/products/infrastructure/productsApi";
import type { IProduct, IProductsApiResponse } from "@/features/products/domain/productTypes";
import type { IProductRepository } from "@/features/products/domain/repositories/IProductRepository";
import { ProductFactory } from "@/features/products/domain/factories/ProductFactory";

const PRODUCTS_COLLECTION = "products";

/**
 * @class FirestoreProductRepository
 * @description Repositorio concreto para operaciones CRUD y paginación sobre Firestore con seeding inteligente.
 */
export class FirestoreProductRepository implements IProductRepository {
  private isSeeded = false;

  /**
   * Realiza la siembra inicial de productos desde la API DummyJSON si la colección está vacía.
   */
  public async seedIfEmpty(): Promise<void> {
    if (this.isSeeded) return;
    try {
      const productsRef = collection(db, PRODUCTS_COLLECTION);
      const snapshot = await getDocs(productsRef);

      if (snapshot.empty) {
        console.log("FirestoreProductRepository: Colección vacía. Ejecutando siembra de datos...");
        const apiResponse = await getProductsFromApi(0, 100);
        const batch = writeBatch(db);

        for (const product of apiResponse.products) {
          const docRef = doc(db, PRODUCTS_COLLECTION, String(product.id));
          batch.set(docRef, product);
        }

        await batch.commit();
        console.log("FirestoreProductRepository: Siembra completada exitosamente.");
      }
      this.isSeeded = true;
    } catch (error) {
      console.warn("FirestoreProductRepository: Advertencia en siembra inicial:", error);
    }
  }

  /**
   * Obtiene la lista paginada de productos de Firestore con fallback a la API.
   */
  public async getProducts(
    skip: number,
    limit: number,
    category?: string
  ): Promise<IProductsApiResponse> {
    try {
      await this.seedIfEmpty();
      const productsRef = collection(db, PRODUCTS_COLLECTION);
      let q = query(productsRef);

      if (category) {
        q = query(productsRef, where("category", "==", category));
      }

      const snapshot = await getDocs(q);
      const allProducts: IProduct[] = [];

      snapshot.forEach((docSnap) => {
        const data = docSnap.data() as IProduct;
        if (data.isActive !== false) {
          allProducts.push(data);
        }
      });

      if (allProducts.length > 0) {
        allProducts.sort((a, b) => a.id - b.id);
        const paginatedProducts = allProducts.slice(skip, skip + limit);

        return {
          products: paginatedProducts,
          total: allProducts.length,
          skip,
          limit,
        };
      }
    } catch (error) {
      console.warn("FirestoreProductRepository: Fallo al leer de Firestore, recurriendo a API externa:", error);
    }

    return getProductsFromApi(skip, limit, category);
  }

  /**
   * Obtiene un producto individual por ID.
   */
  public async getProductById(id: number): Promise<IProduct | null> {
    try {
      const docRef = doc(db, PRODUCTS_COLLECTION, String(id));
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return docSnap.data() as IProduct;
      }
    } catch (error) {
      console.error(`FirestoreProductRepository: Error al leer producto ${id}:`, error);
    }
    return null;
  }

  /**
   * Obtiene la lista de categorías únicas disponibles.
   */
  public async getCategories(): Promise<ICategory[]> {
    try {
      await this.seedIfEmpty();
      const productsRef = collection(db, PRODUCTS_COLLECTION);
      const snapshot = await getDocs(productsRef);

      const categoriesSet = new Set<string>();
      snapshot.forEach((docSnap) => {
        const data = docSnap.data() as IProduct;
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
      console.warn("FirestoreProductRepository: Fallo al leer categorías de Firestore:", error);
    }

    return getCategoriesFromApi();
  }

  /**
   * Crea un nuevo producto con generación O(1) de ID numérico mediante ProductFactory.
   */
  public async createProduct(productData: Omit<IProduct, "id">): Promise<IProduct> {
    const newProduct = ProductFactory.createProduct(productData);
    await setDoc(doc(db, PRODUCTS_COLLECTION, String(newProduct.id)), newProduct);
    return newProduct;
  }

  /**
   * Actualiza los datos de un producto existente.
   */
  public async updateProduct(id: number, productData: Partial<IProduct>): Promise<void> {
    const docRef = doc(db, PRODUCTS_COLLECTION, String(id));
    await updateDoc(docRef, productData);
  }

  /**
   * Elimina un producto de la colección.
   */
  public async deleteProduct(id: number): Promise<void> {
    const docRef = doc(db, PRODUCTS_COLLECTION, String(id));
    await deleteDoc(docRef);
  }

  /**
   * Obtiene todos los productos para el panel de administración.
   */
  public async getAllProductsForAdmin(): Promise<IProduct[]> {
    await this.seedIfEmpty();
    const productsRef = collection(db, PRODUCTS_COLLECTION);
    const snapshot = await getDocs(productsRef);
    const products: IProduct[] = [];
    snapshot.forEach((docSnap) => {
      products.push(docSnap.data() as IProduct);
    });
    return products.sort((a, b) => a.id - b.id);
  }
}

/** Instancia singleton del repositorio de productos de Firestore */
export const firestoreProductRepository = new FirestoreProductRepository();
