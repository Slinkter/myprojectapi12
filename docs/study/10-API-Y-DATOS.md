# 10 — Consumo de API Externa

---

## API utilizada: DummyJSON

El proyecto consume la API pública **DummyJSON** (`https://dummyjson.com`) para obtener productos y categorías.

---

## Cliente HTTP base: `httpClient`

**Archivo:** `src/shared/api/httpClient.ts`

Cliente genérico con tipado seguro y soporte para query params.

```typescript
const BASE_URL = import.meta.env.VITE_API_URL ?? 'https://dummyjson.com';

async function request<T>(endpoint: string, config: IRequestConfig = {}): Promise<T> {
    const { params, headers, ...rest } = config;
    const url = new URL(`${BASE_URL}${endpoint}`);

    if (params) {
        Object.entries(params).forEach(([key, value]) => {
            url.searchParams.set(key, value);
        });
    }

    const response = await fetch(url.toString(), {
        headers: { 'Content-Type': 'application/json', ...headers },
        ...rest,
    });

    if (!response.ok) {
        throw new HttpError(response.status, response.statusText, `Request failed: ${response.status}`);
    }

    return response.json() as Promise<T>;
}

export const httpClient = {
    get: <T>(endpoint: string, config?: IRequestConfig) => request<T>(endpoint, { method: 'GET', ...config }),
    post: <T>(endpoint: string, body: unknown, config?: IRequestConfig) =>
        request<T>(endpoint, { method: 'POST', body: JSON.stringify(body), ...config }),
    put: <T>(endpoint: string, body: unknown, config?: IRequestConfig) =>
        request<T>(endpoint, { method: 'PUT', body: JSON.stringify(body), ...config }),
    patch: <T>(endpoint: string, body: unknown, config?: IRequestConfig) =>
        request<T>(endpoint, { method: 'PATCH', body: JSON.stringify(body), ...config }),
    delete: <T>(endpoint: string, config?: IRequestConfig) => request<T>(endpoint, { method: 'DELETE', ...config }),
};
```

**Características:**
- Tipado genérico `<T>` — la respuesta se tipa al llamar
- `HttpError` personalizado con `status` y `statusText`
- Soporte para `params` (query string)
- Headers `Content-Type: application/json` por defecto

---

## Cliente de aplicación: `apiClient`

**Archivo:** `src/app/api/apiClient.ts`

Capa de abstracción sobre fetch con manejo estructurado de errores.

```typescript
export class ApiError extends Error {
    constructor(
        public message: string,
        public status: number,
        public statusText: string,
        public data?: unknown,
    ) {
        super(message);
        this.name = "ApiError";
    }
}

const apiClient = async <T>(endpoint: string, options: RequestInit = {}): Promise<T> => {
    // 1. Construir URL
    const url = `${BASE_URL}${endpoint}`;

    // 2. Configurar headers
    const requestOptions: RequestInit = {
        ...options,
        headers: { "Content-Type": "application/json", ...options.headers },
    };

    // 3. Fetch
    const response = await fetch(url, requestOptions);

    // 4. Manejo de errores
    if (!response.ok) {
        let errorData;
        try { errorData = await response.json(); } catch { errorData = null; }
        throw new ApiError(`Error en la petición API (${response.status})`, response.status, response.statusText, errorData);
    }

    // 5. Respuesta vacía (204)
    if (response.status === 204) return {} as T;

    return (await response.json()) as T;
};
```

Diferencias con `httpClient`:
- `apiClient` incluye manejo de error 204 (No Content)
- `apiClient` captura errores de red genéricos
- Ambos coexisten; `httpClient` es más versátil, `apiClient` más específico para la app

---

## Capa de Infraestructura (Products API)

**Archivo:** `src/features/products/infrastructure/productsApi.ts`

```typescript
export const getProducts = async (skip: number, limit: number, category?: string): Promise<IProductsApiResponse> => {
    const baseUrl = category ? `/products/category/${category}` : '/products';
    const endpoint = `${baseUrl}?limit=${limit}&skip=${skip}`;
    return apiClient<IProductsApiResponse>(endpoint);
};

export const getCategories = async (): Promise<ICategory[]> => {
    return apiClient<ICategory[]>('/products/categories');
};
```

**Endpoints consumidos:**

| Endpoint | Método | Parámetros | Respuesta |
|----------|--------|-------------|-----------|
| `/products` | GET | `limit`, `skip` | `IProductsApiResponse` |
| `/products/category/:slug` | GET | `limit`, `skip` | `IProductsApiResponse` |
| `/products/categories` | GET | — | `ICategory[]` |

---

## Mapeo de datos (Mappers)

El proyecto no tiene mappers explícitos separados porque el tipado fuerte de TypeScript sirve como contrato. Los tipos de dominio (`IProduct`, `ICategory`) se definen en:

```
src/features/products/domain/productTypes.ts
src/features/products/infrastructure/productsApi.ts (ICategory)
src/features/cart/domain/cartTypes.ts (ICartItem)
```

Los datos de la API se usan directamente, pero validados por tipo. El `flatMap` en `useProducts.ts` es el único "mapper":

```typescript
const products: IProduct[] = data?.pages.flatMap((page) => page.products) ?? [];
```

---

## Manejo de errores

### 1. Error de API → `ApiError`

```typescript
throw new ApiError("Error en la petición API (404)", 404, "Not Found", errorData);
```

### 2. Error de red → `ApiError` genérico

```typescript
throw new ApiError(error.message, 500, "Internal Network Error");
```

### 3. Error en componente → `ErrorBoundary` o `FeatureErrorBoundary`

```typescript
// ErrorBoundary.tsx — global
componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    if (import.meta.env.DEV) {
        console.error("ErrorBoundary capturó un error:", error, errorInfo);
    }
}
```

### 4. Error en query → TanStack Query `error` state

```typescript
// useProducts.ts
error: error?.message || null

// ProductList.tsx
if (error) return <ErrorMessage message={error} title="Error al cargar los productos" />;
```

---

## Type Safety

Cadena completa de tipado:

```
API (DummyJSON) → JSON sin tipo
       │
       v
httpClient.get<IProductsApiResponse>() → tipado en tiempo de compilación
       │
       v
useInfiniteQuery → queryFn retorna IProductsApiResponse
       │
       v
getNextPageParam recibe lastPage: IProductsApiResponse
       │
       v
flatMap → products: IProduct[]
       │
       v
ProductCard recibe product: IProduct (props tipadas)
       │
       v
ProductCard muestra product.title, product.price, etc.
```

---

## Diagrama de flujo de datos

```
┌────────────────────────────────────────────────────────────┐
│                    COMPONENTE REACT                         │
│  ProductCard / ProductList / ProductDetailModal             │
└──────────────────────┬─────────────────────────────────────┘
                       │ consume
                       v
┌────────────────────────────────────────────────────────────┐
│                    CUSTOM HOOK                              │
│  useProducts / useCategories / useProductSearch             │
│  (useInfiniteQuery / useQuery)                              │
└──────────────────────┬─────────────────────────────────────┘
                       │ llama
                       v
┌────────────────────────────────────────────────────────────┐
│                    INFRASTRUCTURE                           │
│  productsApi.ts → getProducts() / getCategories()           │
└──────────────────────┬─────────────────────────────────────┘
                       │ usa
                       v
┌────────────────────────────────────────────────────────────┐
│                    API CLIENT                               │
│  apiClient<T>(endpoint) / httpClient.get<T>()               │
│  → fetch → JSON → T                                        │
└──────────────────────┬─────────────────────────────────────┘
                       │ HTTP GET
                       v
┌────────────────────────────────────────────────────────────┐
│                    SERVIDOR EXTERNO                         │
│  https://dummyjson.com/products?limit=20&skip=0             │
│  https://dummyjson.com/products/categories                  │
└────────────────────────────────────────────────────────────┘
```

---

## Enlaces relacionados

- [04-ALGORITMOS.md](./04-ALGORITMOS.md) — Infinite scroll con estos endpoints
- [05-CUSTOM-HOOKS.md](./05-CUSTOM-HOOKS.md) — Hooks que consumen la API
- [GLOSARIO.md](./GLOSARIO.md) — Términos: API, endpoint, mapper, type safety
