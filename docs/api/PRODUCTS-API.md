# API de Productos (DummyJSON)

La aplicación consume la [API pública de DummyJSON](https://dummyjson.com/) para productos. No requiere autenticación.

---

## Endpoints

### Obtener Productos

```
GET /products
```

Parámetros de consulta:

| Parámetro | Tipo | Por Defecto | Descripción |
|-----------|------|-------------|-------------|
| `limit` | number | 30 | Cantidad de productos por página |
| `skip` | number | 0 | Número de productos a saltar (offset) |

### Buscar Productos

```
GET /products/search
```

| Parámetro | Tipo | Por Defecto | Descripción |
|-----------|------|-------------|-------------|
| `q` | string | — | Término de búsqueda |
| `limit` | number | 30 | Cantidad máxima de resultados |
| `skip` | number | 0 | Offset |

### Obtener Categorías

```
GET /products/categories
```

Retorna un array de objetos:

```typescript
interface ICategory {
  slug: string;  // "smartphones"
  name: string;  // "Smartphones"
  url: string;   // "https://dummyjson.com/products/category/smartphones"
}
```

### Productos por Categoría

```
GET /products/category/:slug
```

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `slug` | string | Slug de la categoría (ej. "smartphones") |
| `limit` | number | Cantidad por página |
| `skip` | number | Offset |

---

## Implementación en el Proyecto

### productsApi (`src/features/products/infrastructure/productsApi.ts`)

```typescript
export const getCategories = async (): Promise<ICategory[]> => {
  return apiClient<ICategory[]>('/products/categories');
};

export const getProducts = async (
  skip: number,
  limit: number,
  category?: string,
): Promise<IProductsApiResponse> => {
  const baseUrl = category ? `/products/category/${category}` : '/products';
  const endpoint = `${baseUrl}?limit=${limit}&skip=${skip}`;
  return apiClient<IProductsApiResponse>(endpoint);
};
```

### Uso con TanStack Query

**useProducts** (paginación infinita):

```typescript
useInfiniteQuery({
  queryKey: ['products', category] as const,
  queryFn: async ({ pageParam = 1 }) => {
    const skip = (pageParam - 1) * PRODUCTS_PER_PAGE;
    return getProducts(skip, PRODUCTS_PER_PAGE, category);
  },
  getNextPageParam: (lastPage, allPages) => {
    const totalFetched = allPages.length * PRODUCTS_PER_PAGE;
    return totalFetched < lastPage.total ? allPages.length + 1 : undefined;
  },
  initialPageParam: 1,
});
```

**useCategories** (caché prolongada):

```typescript
useQuery<ICategory[], Error>({
  queryKey: ['categories'] as const,
  queryFn: getCategories,
  staleTime: 1000 * 60 * 60, // 1 hora
});
```

### Constantes de Query Keys

```typescript
export const QUERY_KEYS = {
  products: {
    all: ['products'],
    lists: () => [...QUERY_KEYS.products.all, 'list'],
    list: (filters?) => [...QUERY_KEYS.products.lists(), filters],
    details: () => [...QUERY_KEYS.products.all, 'detail'],
    detail: (id) => [...QUERY_KEYS.products.details(), id],
    categories: () => [...QUERY_KEYS.products.all, 'categories'],
  },
};
```
