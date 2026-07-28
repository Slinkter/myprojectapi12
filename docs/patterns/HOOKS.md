# Patrón: Custom Hooks

Los custom hooks encapsulan lógica reutilizable y efectos secundarios. El proyecto sigue la convención de hooks con `useCallback`, `useMemo` y tipado estricto.

---

## Hooks Compartidos

### useDebounce (`src/shared/hooks/useDebounce.ts`)

Retrasa la actualización de un valor hasta que transcurre un tiempo sin cambios.

```typescript
export function useDebounce<T>(value: T, delayMs: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delayMs);
    return () => clearTimeout(timer);
  }, [value, delayMs]);

  return debouncedValue;
}
```

**Uso**: búsqueda en HomeContent (350ms), useProductSearch (350ms).

### useLogLifecycle (`src/shared/hooks/useLogLifecycle.ts`)

Registra en consola el ciclo de vida de un componente para depuración.

```typescript
export const useLogLifecycle = (name: string) => {
  useEffect(() => {
    mountTimeRef.current = performance.now();
    console.log(`[LIFECYCLE] 🟢 MOUNT: ${name}`);
    return () => {
      console.log(`[LIFECYCLE] 🔴 UNMOUNT: ${name} (lived ${formatTime(...)})`);
    };
  }, [name]);

  useEffect(() => {
    renderCountRef.current += 1;
    if (renderCountRef.current > 1) {
      console.log(`[LIFECYCLE] 🔄 RENDER #${...}: ${name}`);
    }
  });
};
```

**Uso**: Todos los componentes principales y providers utilizan `useLogLifecycle` al inicio.

---

### useLocalStorage (`src/shared/hooks/useLocalStorage.ts`)

Sincroniza el estado reactivo de React con la persistencia en `localStorage`.

```typescript
export function useLocalStorage<T>(key: string, initialValue: T | (() => T)): [T, (value: T | ((val: T) => T)) => void] {
  // Manejo de lectura inicial segura, serialización JSON y escuchador del evento window storage
}
```

**Uso**: Persistencia automática en `CartContext` (`api12-cart-storage`).

---

## Hooks de Carrito

### useCart (`src/features/cart/application/CartContext.tsx`)

Hook principal para acceder al contexto del carrito:

```typescript
export const useCart = (): ICartContextValue => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart debe usarse dentro de un CartProvider");
  return context;
};
```

### useCartActions (`src/features/cart/application/hooks/useCartActions.ts`)

Acciones memoizadas con validación y notificaciones:

```typescript
export const useCartActions = (
  setCart: React.Dispatch<React.SetStateAction<ICartItem[]>>,
  openCart: () => void,
): IUseCartActionsReturn => {
  const addToCart = useCallback((product: IProduct, quantity: number) => {
    const validation = validateCartItem(product, quantity);
    if (!validation.isValid) {
      toast.error(validation.error || "Error al agregar el producto");
      return;
    }
    setCart((prev) => addItemToCart(prev, product, quantity));
    toast.success(`${product.title} agregado al carrito!`);
    openCart();
  }, [setCart, openCart]);
  // removeFromCart, clearCart...
};
```

### useCartDrawer (`src/features/cart/application/hooks/useCartDrawer.ts`)

Controla visibilidad del drawer del carrito con funciones memoizadas:

```typescript
export const useCartDrawer = (): IUseCartDrawerReturn => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const openCart = useCallback(() => setIsCartOpen(true), []);
  const closeCart = useCallback(() => setIsCartOpen(false), []);
  const toggleCart = useCallback(() => setIsCartOpen((prev) => !prev), []);
  return { isCartOpen, openCart, closeCart, toggleCart };
};
```

---

## Hooks de Productos

### useProducts (`src/features/products/application/useProducts.ts`)

Paginación infinita modularizada con `useProductsQuery` y `useFlattenedProducts`:

```typescript
export const useProducts = (category?: string): IUseProductsResult => {
  const query = useProductsQuery(category);
  const products = useFlattenedProducts(query.data);

  return {
    products,
    error: query.error?.message || null,
    isLoading: query.isLoading || query.isFetchingNextPage,
    initialLoading: query.isLoading,
    hasMore: query.hasNextPage ?? false,
    loadMoreProducts: query.fetchNextPage,
    isLoadingMore: query.isFetchingNextPage,
  };
};
```

### useCategories (`src/features/products/application/useCategories.ts`)

Categorías con caché prolongada (1 hora):

```typescript
export const useCategories = () => {
  return useQuery<ICategory[], Error>({
    queryKey: ["categories"] as const,
    queryFn: getCategories,
    staleTime: 1000 * 60 * 60,
  });
};
```

### useProductSearch (`src/features/products/presentation/components/useProductSearch.ts`)

Búsqueda con debounce y paginación infinita:

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

### useProductModalContext (`src/features/products/application/useProductModalContext.ts`)

Consumidor del contexto de modal de producto con validación:

```typescript
export const useProductModalContext = () => {
  const context = useContext(ProductModalContext);
  if (context === undefined) {
    throw new Error("useProductModalContext debe usarse dentro de un ProductModalProvider");
  }
  return context;
};
```

---

## Hooks de Checkout

### useCheckout (`src/features/checkout/application/useCheckout.ts`)

Hook principal del checkout que orquesta estado, validación y formateo:

```typescript
export const useCheckout = (): IUseCheckoutReturn => {
  const [state, dispatch] = useReducer(checkoutReducer, initialState);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Validación en tiempo real
  useEffect(() => {
    if (paymentMethod === "bitcoin") {
      dispatch({ type: "SET_ERRORS", payload: {} });
    } else {
      const validationErrors = validateCardInfo(cardInfo);
      dispatch({ type: "SET_ERRORS", payload: validationErrors });
    }
  }, [paymentMethod, cardInfo]);

  // Formateo de campos
  const handlePaymentFieldChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const { name } = e.target;
    let { value } = e.target;
    if (name === "number") value = formatCardNumber(value);
    if (name === "expiry") value = formatExpiryDate(value);
    dispatch({ type: "SET_FIELD_VALUE", payload: { name, value } });
  }, []);
  // ...
};
```

### useDiscountValidation (`src/features/checkout/application/useDiscountValidation.ts`)

Validación y aplicación de códigos de descuento desde la entidad dominial `DISCOUNT_CODES`:

```typescript
export function useDiscountValidation(): UseDiscountValidationReturn {
  const [code, setCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState<IDiscountCode | null>(null);
  const [error, setError] = useState('');
  const [isApplying, setIsApplying] = useState(false);

  const applyDiscount = useCallback(() => {
    // Simula validación asíncrona (500ms) usando DISCOUNT_CODES
    setTimeout(() => {
      const found = VALID_CODES.find(
        (c) => c.code.toUpperCase() === code.toUpperCase()
      );
      if (found) setAppliedDiscount(found);
      else setError('Código de descuento inválido');
    }, 500);
  }, [code]);
  // ...
}
```

## Resumen de Hooks

| Hook | Ubicación | Propósito |
|------|-----------|-----------|
| `useDebounce` | `shared/hooks` | Retrasar actualización de valor |
| `useLocalStorage` | `shared/hooks` | Sincronización de estado con localStorage |
| `useLogLifecycle` | `shared/hooks` | Depurar ciclo de vida |
| `useCart` | `features/cart/application` | Acceder al contexto del carrito |
| `useCartActions` | `features/cart/application/hooks` | Acciones memoizadas del carrito |
| `useCartDrawer` | `features/cart/application/hooks` | Control del drawer |
| `useProducts` | `features/products/application` | Productos con paginación infinita modularizada |
| `useCategories` | `features/products/application` | Categorías con caché |
| `useProductSearch` | `features/products/presentation/components` | Búsqueda con debounce |
| `useProductModalContext` | `features/products/application` | Acceder al contexto del modal |
| `useProductModal` | `features/products/application` | Estado local del modal |
| `useCheckout` | `features/checkout/application` | Lógica del checkout |
| `useDiscountValidation` | `features/checkout/application` | Códigos de descuento |
| `useTheme` | `features/theme/application` | Acceder al contexto del tema |
