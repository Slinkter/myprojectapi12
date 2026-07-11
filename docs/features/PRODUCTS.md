# Feature: Productos

La feature de productos gestiona la exploración, búsqueda y visualización detallada del catálogo de productos desde la API de DummyJSON.

---

## Estructura de Archivos

```
src/features/products/
├── domain/
│   └── productTypes.ts          # IProduct, IProductsApiResponse
├── application/
│   ├── types.ts                 # IUseProductsResult, IUseProductModalResult
│   ├── useProducts.ts           # Hook con paginación infinita
│   ├── useCategories.ts         # Hook para categorías
│   ├── useProductModal.ts       # Hook para modal de detalle
│   ├── useProductModalContext.ts # Consumidor del contexto de modal
│   ├── ProductModalContext.ts   # Contexto del modal de producto
│   └── ProductModalProvider.tsx # Provider del modal
├── infrastructure/
│   └── productsApi.ts           # Llamadas a la API
└── presentation/
    ├── ProductCard.tsx          # Tarjeta individual de producto
    ├── ProductGrid.tsx          # Cuadrícula con animaciones
    ├── ProductDetailModal.tsx   # Modal de detalle del producto
    ├── ProductList.tsx          # Orquestador con estados
    ├── SkeletonGrid.tsx         # Esqueletos de carga
    ├── SkeletonCard.tsx         # Esqueleto individual
    ├── type.ts                  # IProductListProps
    └── components/
        ├── SearchInput.tsx      # Input de búsqueda
        ├── useProductSearch.ts  # Hook de búsqueda con debounce
        ├── LoadMoreSection.tsx  # Sección de paginación
        ├── LoadMoreButton.tsx   # Botón "Cargar más"
        ├── AddToCartActions.tsx # Acciones de carrito en modal
        ├── QuantityControl.tsx  # Selector de cantidad
        ├── ProductPriceSection.tsx  # Precio con descuento
        ├── ProductStockInfo.tsx     # Estado de stock
        ├── ProductImageGallery.tsx  # Galería de imágenes
        ├── ProductHeader.tsx        # Encabezado del modal
        └── ModalCloseButton.tsx     # Botón cerrar modal
```

## Hooks Principales

### useProducts

Hook con paginación infinita usando `useInfiniteQuery`:

```typescript
const PRODUCTS_PER_PAGE = 20;

export const useProducts = (category?: string): IUseProductsResult => {
  const { data, fetchNextPage, hasNextPage, ... } = useInfiniteQuery({
    queryKey: ["products", category] as const,
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

  const products = data?.pages.flatMap((page) => page.products) ?? [];
  return { products, error, isLoading, initialLoading, hasMore, loadMoreProducts, isLoadingMore };
};
```

### useCategories

```typescript
export const useCategories = () => {
  return useQuery<ICategory[], Error>({
    queryKey: ["categories"] as const,
    queryFn: getCategories,
    staleTime: 1000 * 60 * 60, // 1 hora
  });
};
```

### useProductSearch

Búsqueda cliente con debounce y paginación infinita:

```typescript
export function useProductSearch(): IUseProductSearchResult {
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearch = useDebounce(searchQuery, 350);

  const { data, fetchNextPage, hasNextPage, ... } = useInfiniteQuery({
    queryKey: ['products', 'search', debouncedSearch] as const,
    // ...
  });
}
```

## Modal de Producto

Contexto que gestiona la apertura/cierre del modal de detalle:

```tsx
// ProductModalProvider
<ProductModalContext.Provider value={value}>
  {children}
</ProductModalContext.Provider>
```

Hook consumidor:

```typescript
export const useProductModalContext = () => {
  const context = useContext(ProductModalContext);
  if (context === undefined) {
    throw new Error("useProductModalContext debe usarse dentro de un ProductModalProvider");
  }
  return context;
};
```

El modal `ProductDetailModal` se renderiza con `createPortal` e incluye:

- Galería de imágenes seleccionable
- Marca, categoría, título, descripción
- Precio con descuento
- Rating con estrellas
- Control de cantidad
- Botón "Añadir al Carrito"
- Bloqueo de scroll del body

## Componentes de Presentación

### ProductCard

- Memoizada con `React.memo`
- Imagen con `LazyImage` y zoom suave al hover
- Badge de descuento
- Calificación con estrellas SVG (full/half/empty)
- Precio con descuento y tachado
- Estado de stock (ok/low/out)
- Overlay hover con botones "Añadir" y "Ver"
- Animaciones con Framer Motion
- `whileHover` con elevación y sombra

### ProductGrid

- Grid responsive: 1 col (móvil) → 4 cols (lg)
- Animaciones escalonadas con `staggerContainer` y `slideUp`
- Respeta `useReducedMotion`

### ProductList

Orquestador que maneja:

- **Estado de error**: muestra `ErrorMessage` con botón reintentar
- **Estado vacío**: muestra `EmptyState` con icono Archive
- **Carga progresiva**: `LoadMoreSection` al final del grid
- **Memoizado** para optimizar renders

### SearchInput

- Icono de lupa a la izquierda
- Botón "X" para limpiar (solo visible con texto)
- `aria-label="Buscar productos"`

### Stock Status

```typescript
export type StockStatus = 'out' | 'low' | 'ok';

export function getStockStatus(stock: number): StockStatus {
  if (stock === 0) return 'out';
  if (stock <= 10) return 'low';
  return 'ok';
}
```

## Flujo de Búsqueda en HomeContent

```typescript
const [searchQuery, setSearchQuery] = useState("");
const debouncedSearch = useDebounce(searchQuery, 350);

const filteredProducts = useMemo(() => {
  if (!debouncedSearch) return products;
  const lowerQuery = debouncedSearch.toLowerCase();
  return products.filter((p) =>
    p.title.toLowerCase().includes(lowerQuery) ||
    p.description.toLowerCase().includes(lowerQuery) ||
    p.category?.toLowerCase().includes(lowerQuery) ||
    p.brand?.toLowerCase().includes(lowerQuery)
  );
}, [debouncedSearch, products]);
```

La búsqueda es **cliente-side**: filtra los productos ya cargados por nombre, descripción, categoría o marca.
