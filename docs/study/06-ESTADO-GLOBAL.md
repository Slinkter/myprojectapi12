# 06 — Gestión de Estado Global

Comparación de las 4 estrategias de estado utilizadas en el proyecto, con criterios de decisión.

---

## Las 4 estrategias

| Estrategia | ¿Qué gestiona? | Ejemplo en el proyecto |
|------------|----------------|------------------------|
| **TanStack Query** | Estado del servidor (API) | Productos, categorías |
| **Context API** | Estado global de UI | Carrito, tema, modal |
| **useState** | Estado local de componente | Input de búsqueda, contador |
| **useReducer** | Estado complejo con transiciones | Formulario de checkout |

---

## 1. TanStack Query — Estado del Servidor

**Cuándo usarlo:** Datos que vienen de una API externa y necesitan sincronización (caché, re-fetch, loading states).

```typescript
// useProducts.ts — Estado del servidor con paginación
const { data, isLoading, fetchNextPage, hasNextPage } = useInfiniteQuery({
    queryKey: ["products", category],
    queryFn: ({ pageParam }) => getProducts(skip, limit, category),
    getNextPageParam: (lastPage, allPages) => { /* ... */ },
    initialPageParam: 1,
});

// useCategories.ts — Estado del servidor con staleTime alto
const { data } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
    staleTime: 1000 * 60 * 60, // 1 hora
});
```

**Ventajas:**
- Caché automática con `staleTime`/`gcTime`
- Reintentos automáticos (`retry: 2`)
- DevTools para depuración
- Deduplication de peticiones
- `isLoading`, `isFetching`, `isError` auto-gestionados

---

## 2. Context API — Estado Global de UI

**Cuándo usarlo:** Estado que debe ser accesible desde múltiples componentes en el árbol, pero que no viene del servidor.

```typescript
// CartContext.tsx — Estado global del carrito
export const CartProvider = ({ children }: ICartProviderProps) => {
    const [cart, setCart] = useState<ICartItem[]>(() => {
        const stored = localStorage.getItem(CART_STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
    });

    useEffect(() => {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    }, [cart]);

    const propValue = useMemo(() => ({
        cart, addToCart, removeFromCart, clearCart,
        isCartOpen, openCart, closeCart, toggleCart,
        totalPrice, totalItems,
    }), [cart, addToCart, ...]);

    return <CartContext.Provider value={propValue}>{children}</CartContext.Provider>;
};
```

**Proveedores en el árbol (`App.tsx`):**

```
QueryClientProvider
    └── ThemeProvider
        └── CartProvider
            └── BrowserRouter
                └── ErrorBoundary
                    └── Layout
                        └── AppRouter
                            └── (páginas)
                                  └── ProductModalProvider (solo en Home)
```

---

## 3. `useState` — Estado Local

**Cuándo usarlo:** Estado que solo necesita un componente y quizás sus hijos directos.

```typescript
// HomeContent.tsx
const [searchQuery, setSearchQuery] = useState("");
const debouncedSearch = useDebounce(searchQuery, 350);

// ProductCard.tsx
const [isHovered, setIsHovered] = useState(false);

// Navbar.tsx
const [isMobileOpen, setIsMobileOpen] = useState(false);
const [isSearchOpen, setIsSearchOpen] = useState(false);
```

---

## 4. `useReducer` — Estado Complejo

**Cuándo usarlo:** Múltiples sub-valores que cambian con lógica específica (máquina de estados).

```typescript
// checkoutReducer.ts
export const initialState: ICheckoutState = {
    paymentMethod: "visa",
    cardInfo: { number: "", name: "", expiry: "", cvc: "" },
    errors: {},
    cardType: "",
};

export function checkoutReducer(state: ICheckoutState, action: CheckoutAction) {
    switch (action.type) {
        case "SET_FIELD_VALUE":
            return { ...state, cardInfo: { ...state.cardInfo, [action.payload.name]: action.payload.value } };
        case "SET_PAYMENT_METHOD":
            return { ...state, paymentMethod: action.payload };
        case "SET_ERRORS":
            return { ...state, errors: action.payload };
        case "SET_CARD_TYPE":
            return { ...state, cardType: action.payload };
        default: return state;
    }
}
```

---

## Árbol de Decisión

```
¿Los datos vienen de una API?
    │
    SI ──→ ¿Necesito paginación infinita?
    │          │
    │          SI ──→ useInfiniteQuery (useProducts.ts)
    │          NO ───→ useQuery (useCategories.ts)
    │
    NO
    │
    v
¿El estado lo necesitan múltiples componentes?
    │
    SI ──→ ¿El estado tiene múltiples sub-valores
    │      que cambian con lógica compleja?
    │      │
    │      SI ──→ useReducer (checkoutReducer.ts)
    │      NO ───→ Context API (CartContext, ThemeContext, ProductModalContext)
    │
    NO
    │
    v
useState (búsqueda, hover, menú móvil)
```

---

## Mapa de estado del proyecto

```
TanStack Query
  ├── ["products", category] → Productos paginados
  ├── ["products", "search", debouncedSearch] → Búsqueda
  └── ["categories"] → Categorías

Context API
  ├── CartContext → cart[], isCartOpen, totalPrice, addToCart, etc.
  ├── ThemeContext → theme, toggleDarkMode
  └── ProductModalContext → isModalOpen, selectedProduct, open/close

useState
  ├── searchQuery, debouncedSearch (HomeContent)
  ├── isHovered (ProductCard)
  ├── quantity, selectedImage (ProductDetailModal)
  ├── isMobileOpen, isSearchOpen, searchVal, isCatOpen (Navbar)
  ├── code, appliedDiscount, error, isApplying (useDiscountValidation)
  └── isProcessing (Checkout)

useReducer
  └── checkoutReducer → paymentMethod, cardInfo, errors, cardType
```

---

## Enlaces relacionados

- [03-TECNOLOGIAS.md](./03-TECNOLOGIAS.md) — Descripción de cada tecnología
- [05-CUSTOM-HOOKS.md](./05-CUSTOM-HOOKS.md) — Hooks que gestionan cada estado
- [07-FLUIDO-COMPRA.md](./07-FLUIDO-COMPRA.md) — Flujo de datos en la compra
