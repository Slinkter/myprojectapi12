# Patrón: Contextos de React

El proyecto utiliza Context API para tres contextos globales. Todos siguen el mismo patrón:

1. Creación del contexto con `createContext`
2. Provider con estado memoizado
3. Hook consumidor con validación

---

## ThemeContext (`src/features/theme/application/ThemeContext.tsx`)

Gestiona el tema claro/oscuro de la aplicación.

### Contexto

```typescript
interface IThemeContextType {
  theme: Theme; // "light" | "dark"
  toggleDarkMode: () => void;
}

const ThemeContext = createContext<IThemeContextType | undefined>(undefined);
```

### Provider

```tsx
export const ThemeProvider = ({ children }: IThemeProviderProps): ReactNode => {
  const [theme, setTheme] = useState<Theme>(getStoredTheme);

  useEffect(() => {
    applyThemeToDocument(theme);
    saveTheme(theme);
  }, [theme]);

  const toggleDarkMode = useCallback(() => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  }, []);

  const value = useMemo(() => ({ theme, toggleDarkMode }), [theme, toggleDarkMode]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};
```

### Hook

```typescript
export const useTheme = (): IThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme debe usarse dentro de un ThemeProvider");
  }
  return context;
};
```

### Ubicación en el Árbol

```tsx
<ThemeProvider>
  <CartProvider>{/* ... */}</CartProvider>
</ThemeProvider>
```

---

## CartContext (`src/features/cart/application/CartContext.tsx`)

Gestiona el estado del carrito de compras con persistencia en localStorage.

### Contexto

```typescript
interface ICartContextValue {
  cart: ICartItem[];
  isCartOpen: boolean;
  totalPrice: number;
  totalItems: number;
  addToCart: (product: IProduct, quantity: number) => void;
  removeFromCart: (productId: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
}

export const CartContext = createContext<ICartContextValue | undefined>(undefined);
```

### Provider

Características clave:

- **Persistencia**: carga/guarda en localStorage (`api12-cart-storage`)
- **Optimización**: `useMemo` para `totalPrice`, `totalItems` y el valor del contexto
- **Composición**: delega acciones a `useCartActions` y drawer a `useCartDrawer`
- **Logging**: `useLogLifecycle("CartProvider")`

```tsx
export const CartProvider = ({ children }: ICartProviderProps) => {
  const [cart, setCart] = useState<ICartItem[]>(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  }, [cart]);

  const { isCartOpen, openCart, closeCart, toggleCart } = useCartDrawer();
  const { addToCart, removeFromCart, clearCart } = useCartActions(setCart, openCart);
  const totalPrice = useMemo(() => calculateTotal(cart), [cart]);
  const totalItems = useMemo(() => cart.reduce((sum, item) => sum + item.quantity, 0), [cart]);

  const propValue = useMemo<ICartContextValue>(() => ({
    cart, addToCart, removeFromCart, clearCart,
    isCartOpen, openCart, closeCart, toggleCart,
    totalPrice, totalItems,
  }), [/* dependencias */]);

  return <CartContext.Provider value={propValue}>{children}</CartContext.Provider>;
};
```

### Hook

```typescript
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart debe usarse dentro de un CartProvider");
  }
  return context;
};
```

### Re-exportación

`src/features/cart/application/useCart.ts` re-exporta `useCart` desde `CartContext`.

---

## ProductModalContext (`src/features/products/application/ProductModalContext.ts`)

Gestiona el estado del modal de detalle de producto. Es un **contexto de feature** (no global).

### Contexto

```typescript
interface IUseProductModalResult {
  isModalOpen: boolean;
  selectedProduct: IProduct | null;
  openProductModal: (product: IProduct) => void;
  closeProductModal: () => void;
}

export const ProductModalContext = createContext<IUseProductModalResult | undefined>(undefined);
```

### Provider

```tsx
export const ProductModalProvider = ({ children }: IProductModalProviderProps) => {
  const { isModalOpen, selectedProduct, openProductModal, closeProductModal } =
    useProductModal();

  const value = { isModalOpen, selectedProduct, openProductModal, closeProductModal };

  return (
    <ProductModalContext.Provider value={value}>
      {children}
    </ProductModalContext.Provider>
  );
};
```

### Hook

```typescript
export const useProductModalContext = () => {
  const context = useContext(ProductModalContext);
  if (context === undefined) {
    throw new Error("useProductModalContext debe usarse dentro de un ProductModalProvider");
  }
  return context;
};
```

### Ubicación

Se envuelve solo la página Home:

```tsx
// Home.tsx
<ProductModalProvider>
  <FeatureErrorBoundary featureName="Products">
    <HomeContent />
  </FeatureErrorBoundary>
</ProductModalProvider>
```

---

## Patrón General

```
1. Crear contexto con `createContext<T | undefined>(undefined)`
2. Crear Provider que:
   a. Gestiona estado con hooks (useState, useReducer)
   b. Memoiza valores con useMemo
   c. Provee el contexto con <Context.Provider value={value}>
3. Crear hook consumidor que:
   a. Llama useContext(Context)
   b. Valida que no sea undefined
   c. Lanza error descriptivo si se usa fuera del provider
   d. Retorna el valor tipado
4. El provider se coloca en el nivel adecuado del árbol (global o feature)
```

Este patrón garantiza tipado seguro, detección temprana de errores de contexto y rendimiento optimizado con memoización.
