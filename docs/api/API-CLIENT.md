# Cliente API

El proyecto tiene **dos** implementaciones de cliente HTTP. Ambas se basan en la API nativa `fetch` pero con propósitos diferentes.

---

## httpClient (`src/shared/api/httpClient.ts`)

Cliente HTTP genérico y reutilizable. Ideal para peticiones simples.

```typescript
const BASE_URL = import.meta.env.VITE_API_URL ?? 'https://dummyjson.com';
```

### Clase de Error

```typescript
class HttpError extends Error {
  constructor(
    public readonly status: number,
    public readonly statusText: string,
    message: string
  ) {
    super(message);
    this.name = 'HttpError';
  }
}
```

### Funcionalidad

- **Query params**: soporte mediante `IRequestConfig.params`
- **Headers por defecto**: `Content-Type: application/json`
- **Tipado genérico**: `request<T>(endpoint, config)`

### Métodos Expuestos

| Método | Descripción | Firma |
|--------|-------------|-------|
| `httpClient.get` | GET request | `get<T>(endpoint, config?)` |
| `httpClient.post` | POST request | `post<T>(endpoint, body, config?)` |
| `httpClient.put` | PUT request | `put<T>(endpoint, body, config?)` |
| `httpClient.patch` | PATCH request | `patch<T>(endpoint, body, config?)` |
| `httpClient.delete` | DELETE request | `delete<T>(endpoint, config?)` |

### Uso

```typescript
import { httpClient } from '@/shared/api';

const products = await httpClient.get<IProductsApiResponse>('/products', {
  params: { limit: '20', skip: '0' }
});
```

---

## apiClient (`src/app/api/apiClient.ts`)

Cliente estandarizado de aplicación con manejo estructurado de errores.

### Clase de Error

```typescript
export class ApiError extends Error {
  constructor(
    public message: string,
    public status: number,
    public statusText: string,
    public data?: unknown,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}
```

### Características

- **URL base** desde `config.api.baseUrl` (`src/app/config/env.ts`)
- **Manejo de errores**: parsea el cuerpo de error si existe
- **204 No Content**: retorna objeto vacío
- **Errores de red**: envuelve en `ApiError` con status 500

### Uso

```typescript
import apiClient from '@/app/api/apiClient';

const products = await apiClient<IProductsApiResponse>('/products?limit=20&skip=0');
```

### Diferencia entre httpClient y apiClient

| Aspecto | httpClient | apiClient |
|---------|------------|-----------|
| Ubicación | `shared/api` (genérico) | `app/api` (aplicación) |
| Error | `HttpError` | `ApiError` con `data` |
| URL base | `VITE_API_URL` | `VITE_API_BASE_URL` |
| Query params | `IRequestConfig.params` | Manual en URL |
| 204 handling | No | Sí |
| Network errors | No encapsula | Envuelve en ApiError |

---

## Configuración de TanStack Query

En `src/app/config/queryClient.ts`:

```typescript
export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onSuccess: (data, query) => console.log(`[API] Success: ${query.queryKey}`, data),
    onError: (error, query) => console.log(`[API] Error: ${query.queryKey}`, error),
  }),
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,    // 5 minutos
      gcTime: 1000 * 60 * 30,      // 30 minutos
      retry: 2,
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    },
  },
});
```

## Proveedor de React Query

En `App.tsx` se envuelve toda la aplicación:

```tsx
<QueryClientProvider client={queryClient}>
  {/* providers anidados */}
  <ReactQueryDevtools initialIsOpen={false} />
</QueryClientProvider>
```
