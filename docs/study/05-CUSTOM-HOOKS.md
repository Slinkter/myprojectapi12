# 05 — Custom Hooks

Todos los custom hooks del proyecto, qué hacen, cuándo usarlos, código y ciclo de vida.

---

## 5.1 `useProducts`

**Archivo:** `src/features/products/application/useProducts.ts`

**Propósito:** Obtener productos con paginación infinita usando `useInfiniteQuery`.

**Cuándo usarlo:** En cualquier página o componente que necesite listar productos del catálogo con carga progresiva.

```typescript
const { products, initialLoading, isLoading, error, loadMoreProducts, hasMore } =
    useProducts(categoryQuery);
```

**Retorno:**

| Propiedad | Tipo | Descripción |
|-----------|------|-------------|
| `products` | `IProduct[]` | Lista plana de productos (flatMap de páginas) |
| `initialLoading` | `boolean` | Carga de la primera página |
| `isLoading` | `boolean` | Carga inicial o de más páginas |
| `error` | `string \| null` | Mensaje de error |
| `hasMore` | `boolean` | True si hay más páginas |
| `loadMoreProducts` | `() => void` | Dispara carga de siguiente página |

**Ciclo de vida:**

```
Componente se monta
       │
       v
useInfiniteQuery(["products", category])
       │
       v
  ¿Datos en caché? ──── SI ───→ Mostrar datos inmediatos
       │ NO
       v
  fetchFirstPage()
  GET /products?limit=20&skip=0
       │
       v
  isLoading = false
  (Se renderizan productos)
       │
       v
  loadMoreProducts() (usuario hace scroll / click)
       │
       v
  fetchNextPage()
  GET /products?limit=20&skip=20
       │
       v
  flatMap() → products actualizado
```

---

## 5.2 `useCategories`

**Archivo:** `src/features/products/application/useCategories.ts`

**Propósito:** Obtener categorías de productos con caché de 1 hora.

**Cuándo usarlo:** En navegación, filtros o dropdowns de categorías.

```typescript
const { data: categories, isLoading } = useCategories();
```

| Particularidad | Valor |
|----------------|-------|
| `staleTime` | 1 hora (minimiza re-validaciones) |
| `queryKey` | `["categories"]` |
| Frecuencia de cambio | Baja (las categorías raramente cambian) |

---

## 5.3 `useProductModal` + `useProductModalContext`

**Archivo:** `src/features/products/application/useProductModal.ts`  
**Contexto:** `src/features/products/application/ProductModalProvider.tsx`  
**Hook de consumo:** `src/features/products/application/useProductModalContext.ts`

**Propósito:** Gestionar apertura/cierre del modal de detalle de producto y el producto seleccionado.

**Cuándo usarlo:** En componentes que necesitan abrir un modal con información de producto (ProductCard, botones de "Ver detalle").

```typescript
// En un componente hijo:
const { selectedProduct, isModalOpen, openProductModal, closeProductModal } =
    useProductModalContext();

openProductModal(product);   // Abre modal con el producto
closeProductModal();         // Cierra modal
```

**Diagrama de flujo:**

```
ProductModalProvider (envuelve en Home.tsx)
       │
       v
  useProductModal()
  - useState: isModalOpen, selectedProduct
  - useCallback: openProductModal, closeProductModal
       │
       v
  ProductModalContext.Provider
       │
       v
  Cualquier hijo puede llamar
  useProductModalContext()
       │
       ├── ProductCard → onClick → openProductModal(product)
       └── ProductDetailModal → onClose → closeProductModal()
```

---

## 5.4 `useCart` / `useCartActions` / `useCartDrawer`

**Archivo:** `src/features/cart/application/CartContext.tsx` (exporta `useCart`)  
**Acciones:** `src/features/cart/application/hooks/useCartActions.ts`  
**Drawer:** `src/features/cart/application/hooks/useCartDrawer.ts`

**Propósito:** Gestionar el estado del carrito de compras con persistencia en localStorage.

**Cuándo usarlo:** En cualquier componente que necesite leer o modificar el carrito.

```typescript
const { cart, addToCart, removeFromCart, clearCart, totalPrice, totalItems,
        isCartOpen, openCart, closeCart, toggleCart } = useCart();

addToCart(product, 2);       // Agrega 2 unidades (con validación de stock)
removeFromCart(productId);    // Elimina producto
clearCart();                  // Vacía carrito
openCart();                   // Abre drawer
```

**Persistencia:** El carrito se guarda en `localStorage` con clave `api12-cart-storage`.

```
CartProvider
    │
    ├── useState(cart) ← inicializado desde localStorage
    │
    ├── useEffect → guarda en localStorage al cambiar cart
    │
    ├── useCartDrawer() → isCartOpen, openCart, closeCart, toggleCart
    │
    ├── useCartActions(setCart, openCart)
    │   ├── addToCart → validateCartItem → addItemToCart → toast
    │   ├── removeFromCart → toast
    │   └── clearCart → toast
    │
    ├── useMemo → totalPrice, totalItems
    │
    └── CartContext.Provider value={...}
```

---

## 5.5 `useCheckout`

**Archivo:** `src/features/checkout/application/useCheckout.ts`

**Propósito:** Orquestar la lógica del formulario de pago: estado, validación, formateo y navegación.

**Cuándo usarlo:** En la página de checkout.

```typescript
const {
    paymentMethod, cardInfo, errors, cardType,
    handlePayment, handlePaymentFieldChange, selectPaymentMethod,
    isPaymentDisabled,
} = useCheckout();
```

**Acciones:**

| Función | Descripción |
|---------|-------------|
| `handlePaymentFieldChange` | Formatea número (espacios cada 4 dígitos) y fecha (MM/YY) |
| `selectPaymentMethod` | Cambia método de pago, limpia errores |
| `handlePayment` | Valida tarjeta, navega a `/checkout-success` |

**Estado interno:**

```
useReducer(checkoutReducer, initialState)
  ├── paymentMethod: 'visa' | 'mastercard' | 'bitcoin'
  ├── cardInfo: { number, name, expiry, cvc }
  ├── errors: { number?, name?, expiry?, cvc? }
  └── cardType: 'visa' | 'mastercard' | ''

useState(touched)     ← campos que el usuario ha modificado
useState(isSubmitted) ← si se intentó enviar el formulario
```

---

## 5.6 `useDebounce`

**Archivo:** `src/shared/hooks/useDebounce.ts`

**Propósito:** Retrasar la actualización de un valor para evitar operaciones costosas mientras el usuario escribe.

**Cuándo usarlo:** Búsqueda en tiempo real, filtros, auto-guardado.

```typescript
const [searchQuery, setSearchQuery] = useState('');
const debouncedSearch = useDebounce(searchQuery, 350);

useEffect(() => {
    // Llamada API con debouncedSearch (no con searchQuery)
}, [debouncedSearch]);
```

---

## 5.7 `useLogLifecycle`

**Archivo:** `src/shared/hooks/useLogLifecycle.ts`

**Propósito:** Registrar en consola el ciclo de vida de un componente (mount, render, unmount) para depuración en desarrollo.

**Cuándo usarlo:** Durante desarrollo para entender cuándo y por qué se monta/desmonta/actualiza un componente.

```typescript
useLogLifecycle("ProductCard");
// Consola:
// [LIFECYCLE] 🟢 MOUNT: ProductCard
// [LIFECYCLE] 🔄 RENDER #2: ProductCard (+1.2s)
// [LIFECYCLE] 🔴 UNMOUNT: ProductCard (lived 5.3s)
```

También incluye `useApiDebug` para depurar peticiones API:

```typescript
useApiDebug('FetchProducts', isLoading, data, error);
// [API] ⏳ FetchProducts: Loading...
// [API] ✅ FetchProducts: Data received (+0.8s)
```

---

## 5.8 `useProductSearch`

**Archivo:** `src/features/products/presentation/components/useProductSearch.ts`

**Propósito:** Búsqueda de productos con debounce y paginación infinita.

**Cuándo usarlo:** Cuando necesitas un buscador de productos con carga diferida.

```typescript
const {
    searchQuery, debouncedSearch, setSearchQuery,
    products, isLoading, isSearching, hasMore,
    loadMoreProducts, error,
} = useProductSearch();
```

Diferencias con `useProducts`:
- `useProducts` filtra por categoría desde HomeContent
- `useProductSearch` aplica debounce al término de búsqueda y lo pasa como queryKey

---

## 5.9 `useDiscountValidation`

**Archivo:** `src/features/checkout/application/useDiscountValidation.ts`

**Propósito:** Validar y aplicar códigos de descuento en el checkout.

**Cuándo usarlo:** En el formulario de checkout cuando se necesita entrada de códigos promocionales.

```typescript
const {
    code, setCode, appliedDiscount, error,
    isApplying, applyDiscount, removeDiscount,
} = useDiscountValidation();

// Calcular descuento:
const discountAmount = calculateDiscountAmount(appliedDiscount, totalPrice);
```

---

## Mapa completo de hooks

```
shared/hooks/
├── useDebounce()            ← Genérico: retrasa valor
├── useLogLifecycle()        ← Genérico: debug de ciclo de vida

features/products/
├── useProducts()            ← Infinite scroll de productos
├── useCategories()          ← Categorías con caché
├── useProductModal()        ← Estado de modal
├── useProductModalContext() ← Consumir modal context
├── useProductSearch()       ← Búsqueda con debounce

features/cart/
├── useCart()                ← Estado global del carrito
├── useCartActions()         ← Acciones del carrito (add, remove, clear)
├── useCartDrawer()          ← Control de visibilidad del drawer

features/checkout/
├── useCheckout()            ← Lógica completa de checkout (reducer)
├── useDiscountValidation()  ← Validación de códigos de descuento

features/theme/
├── useTheme()               ← Modo claro/oscuro
```

---

## Enlaces relacionados

- [04-ALGORITMOS.md](./04-ALGORITMOS.md) — Algoritmos implementados por estos hooks
- [06-ESTADO-GLOBAL.md](./06-ESTADO-GLOBAL.md) — Dónde vive cada estado
- [07-FLUIDO-COMPRA.md](./07-FLUIDO-COMPRA.md) — Cómo se orquestan en el flujo de compra
