# Referencia Completa de la API

## Tipos de Dominio

### IProduct (`src/features/products/domain/productTypes.ts`)

```typescript
interface IProduct {
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
}
```

### IProductsApiResponse

```typescript
interface IProductsApiResponse {
  products: IProduct[];
  total: number;
  skip: number;
  limit: number;
}
```

### ICategory

```typescript
interface ICategory {
  slug: string;
  name: string;
  url: string;
}
```

## Endpoints de la API

| Endpoint | Método | Parámetros | Retorno | Propósito |
|----------|--------|-------------|---------|-----------|
| `/products` | GET | `limit?`, `skip?` | `IProductsApiResponse` | Listado paginado |
| `/products/search` | GET | `q`, `limit?`, `skip?` | `IProductsApiResponse` | Búsqueda por texto |
| `/products/categories` | GET | — | `ICategory[]` | Todas las categorías |
| `/products/category/:slug` | GET | `limit?`, `skip?` | `IProductsApiResponse` | Productos por categoría |

## Funciones de Infraestructura

### productsApi

| Función | Parámetros | Retorno |
|---------|------------|---------|
| `getProducts(skip, limit, category?)` | `skip: number`, `limit: number`, `category?: string` | `Promise<IProductsApiResponse>` |
| `getCategories()` | — | `Promise<ICategory[]>` |

## Hooks

### useProducts

```typescript
function useProducts(category?: string): IUseProductsResult
```

| Propiedad | Tipo | Descripción |
|-----------|------|-------------|
| `products` | `IProduct[]` | Lista plana de productos |
| `error` | `string \| null` | Mensaje de error |
| `isLoading` | `boolean` | Carga inicial o de más páginas |
| `initialLoading` | `boolean` | Solo carga inicial |
| `hasMore` | `boolean` | Hay más páginas disponibles |
| `loadMoreProducts` | `() => void` | Cargar siguiente página |
| `isLoadingMore` | `boolean` | Cargando página adicional |

### useCategories

```typescript
function useCategories(): UseQueryResult<ICategory[], Error>
```

### useProductSearch

```typescript
function useProductSearch(): IUseProductSearchResult
```

| Propiedad | Tipo | Descripción |
|-----------|------|-------------|
| `searchQuery` | `string` | Valor actual del input |
| `debouncedSearch` | `string` | Valor con debounce (350ms) |
| `setSearchQuery` | `(query: string) => void` | Actualiza búsqueda |
| `products` | `IProduct[]` | Productos filtrados |
| `isLoading` | `boolean` | Carga en curso |
| `isSearching` | `boolean` | Búsqueda activa |
| `hasMore` | `boolean` | Más páginas disponibles |
| `loadMoreProducts` | `() => void` | Cargar más |
| `error` | `string \| null` | Error |

## Clientes HTTP

| Función | Importación | URL Base |
|---------|-------------|----------|
| `httpClient` | `@shared/api` | `VITE_API_URL` o `https://dummyjson.com` |
| `apiClient` | `@/app/api/apiClient` | `VITE_API_BASE_URL` o `https://dummyjson.com` |

## Clases de Error

```typescript
class HttpError extends Error {
  status: number;
  statusText: string;
  name: 'HttpError';
}

class ApiError extends Error {
  status: number;
  statusText: string;
  data?: unknown;
  name: 'ApiError';
}
```
