/**
 * @file types.ts
 * @description Tipos e interfaces dominiales de la entidad Product.
 * @architecture Entity Layer - Product Model
 */

export interface IProduct {
    id: number;
    title: string;
    description: string;
    price: number;
    discountPercentage?: number;
    rating?: number;
    stock: number;
    brand?: string;
    category?: string;
    thumbnail: string;
    images?: string[];
    isActive?: boolean;
}

export interface IProductsApiResponse {
    products: IProduct[];
    total: number;
    skip: number;
    limit: number;
}
