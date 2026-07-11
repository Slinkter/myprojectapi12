# Feature: Carrito de Compras

El carrito de compras gestiona los productos seleccionados por el usuario, persistiendo el estado en `localStorage` y exponiendo acciones a través de Context API.

---

## Estructura de Archivos

```
src/features/cart/
├── domain/
│   ├── cartTypes.ts       # ICartItem, ICartContextValue, IValidationResult
│   ├── cart.types.ts      # CartItem, CartState, CartSummary (alternativo)
│   └── cartUtils.ts       # Funciones puras: addItemToCart, removeItemFromCart, etc.
├── application/
│   ├── CartContext.tsx     # Contexto + Provider + hook useCart
│   ├── useCart.ts          # Re-exportación de useCart
│   └── hooks/
│       ├── useCartActions.ts   # Acciones memoizadas con validación y toast
│       └── useCartDrawer.ts    # Control de visibilidad del drawer
└── presentation/
    ├── Cart.tsx            # Drawer principal del carrito (portal)
    ├── CartHeader.tsx      # Encabezado con título y botón de cierre
    ├── CartFooter.tsx      # Pie con total, checkout y vaciar
    ├── CartItemRow.tsx     # Fila individual de artículo
    └── CartEmptyState.tsx  # Estado vacío
```

## Tipos Principales

```typescript
interface ICartItem extends IProduct {
  quantity: number;
}

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
```

## CartProvider (`CartContext.tsx`)

Provider que envuelve la aplicación y proporciona el contexto del carrito.

```tsx
const CART_STORAGE_KEY = "api12-cart-storage";

export const CartProvider = ({ children }: ICartProviderProps) => {
  const [cart, setCart] = useState<ICartItem[]>(() => {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  });

  // Persistencia automática
  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  }, [cart]);

  const { isCartOpen, openCart, closeCart, toggleCart } = useCartDrawer();
  const { addToCart, removeFromCart, clearCart } = useCartActions(setCart, openCart);
  const totalPrice = useMemo(() => calculateTotal(cart), [cart]);
  const totalItems = useMemo(() => cart.reduce((sum, item) => sum + item.quantity, 0), [cart]);
  // ...
};
```

## useCartActions (`useCartActions.ts`)

Hook que proporciona acciones memoizadas con:

- **Validación** antes de agregar (`validateCartItem`)
- **Notificaciones toast** en éxito/error
- **Apertura automática** del drawer al agregar

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
  // ...
};
```

## useCartDrawer (`useCartDrawer.ts`)

Hook simple que controla la visibilidad del drawer del carrito:

```typescript
export const useCartDrawer = (): IUseCartDrawerReturn => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const openCart = useCallback(() => setIsCartOpen(true), []);
  const closeCart = useCallback(() => setIsCartOpen(false), []);
  const toggleCart = useCallback(() => setIsCartOpen((prev) => !prev), []);
  return { isCartOpen, openCart, closeCart, toggleCart };
};
```

## Utilidades de Dominio (`cartUtils.ts`)

Funciones puras sin efectos secundarios:

| Función | Descripción |
|---------|-------------|
| `calculateTotal(cart)` | Suma precio × cantidad de todos los items |
| `addItemToCart(cart, product, quantity)` | Agrega o incrementa cantidad |
| `removeItemFromCart(cart, productId)` | Elimina un item por ID |
| `validateCartItem(product, quantity)` | Valida producto, cantidad y stock |

## Componentes de Presentación

### Cart (drawer principal)

- Renderizado con `createPortal` en `document.body`
- Backdrop semitransparente que cierra al hacer clic
- Escape key para cerrar
- Footer con subtotal, envío (gratis desde $50), total y botones de acción
- Badge animado con cantidad de artículos

### CartItemRow

- Muestra miniatura, título, precio × cantidad, subtotal
- Botón de eliminar con icono Trash2

### CartEmptyState

- Icono de bolsa, mensaje "Tu carrito está vacío"
- Botón "Seguir comprando"

## Cálculo de Envío

- **Gratis** si el total es ≥ $50
- **$9.99** si el total es < $50
- Mensaje informativo: "Agrega $X más para envío gratis"
