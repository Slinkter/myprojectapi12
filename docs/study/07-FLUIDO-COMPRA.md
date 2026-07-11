# 07 — Flujo de Compra Completo

Recorrido desde que el usuario ve un producto en la página de inicio hasta que completa la compra.

---

## Diagrama de flujo

```
              ┌──────────────────────┐
              │      HOME PAGE       │
              │  (HomeContent.tsx)   │
              │  ProductList + Grid  │
              └──────────┬───────────┘
                         │
            Usuario hace clic en tarjeta
                         │
                         v
              ┌──────────────────────┐
              │   ProductDetailModal │
              │  (createPortal)      │
              │  - Imagen, precio    │
              │  - Selector cantidad  │
              │  - Botón "Añadir"    │
              └──────────┬───────────┘
                         │
            Usuario hace clic "Añadir al Carrito"
                         │
                         v
              ┌──────────────────────┐
              │   addToCart()        │
              │  (useCartActions)    │
              │  1. validateCartItem │
              │  2. addItemToCart    │
              │  3. toast.success()  │
              │  4. openCart()       │
              └──────────┬───────────┘
                         │
                         v
              ┌──────────────────────┐
              │   CART DRAWER        │
              │  (Cart.tsx)          │
              │  - Lista de items    │
              │  - Subtotal/Envío    │
              │  - Botón "Pagar"     │
              └──────────┬───────────┘
                         │
            Usuario hace clic "Proceder al Pago"
                         │
                         v
              ┌──────────────────────┐
              │   CHECKOUT PAGE      │
              │  (Checkout.tsx)      │
              │  - Método de pago    │
              │  - Formulario tarjeta│
              │  - Resumen pedido    │
              └──────────┬───────────┘
                         │
            Usuario completa formulario y paga
                         │
                         v
              ┌──────────────────────┐
              │   handlePayment()    │
              │  (useCheckout)       │
              │  1. validateCardInfo │
              │  2. Algoritmo Luhn   │
              │  3. Si válido:       │
              └──────────┬───────────┘
                         │
                         v
              ┌──────────────────────┐
              │  CHECKOUT SUCCESS    │
              │  (CheckoutSuccess)   │
              │  "Pago Exitoso"      │
              │  Link → Volver a     │
              │  comprar             │
              └──────────────────────┘
```

---

## Flujo de datos (estado)

```
Paso 1: Catálogo
─────────────────
TanStack Query → useProducts() → products: IProduct[]
                                    │
                                    v
                              ProductGrid → ProductCard[] → UI

Paso 2: Modal
─────────────────
ProductModalContext → useProductModalContext()
  ├── openProductModal(product) → isModalOpen = true
  ├── selectedProduct = product
  └── ProductDetailModal → renderiza portal con detalle

Paso 3: Añadir al carrito
─────────────────
CartContext → useCartActions()
  ├── validateCartItem(product, quantity)
  │     ├── ¿product existe? → "Producto inválido"
  │     ├── ¿quantity > 0? → "Cantidad debe ser > 0"
  │     └── ¿stock >= quantity? → "Stock insuficiente"
  │
  └── addItemToCart(cart, product, quantity)
        ├── ¿existe en cart? → actualiza quantity
        └── ¿no existe? → agrega nuevo item

Persistencia: useEffect → localStorage.setItem("api12-cart-storage", JSON.stringify(cart))

Paso 4: Checkout
─────────────────
useCheckout() → useReducer(checkoutReducer)
  ├── paymentMethod → 'visa' | 'mastercard' | 'bitcoin'
  ├── cardInfo → { number, name, expiry, cvc }
  ├── validateCardInfo()
  │     ├── isValidLuhn(number) → algoritmo de Luhn
  │     ├── validateExpiry(MM/YY) → fecha no expirada
  │     └── validateCVC → mínimo 3 dígitos
  │
  └── handlePayment()
        ├── ¿bitcoin? → navega directo a éxito
        ├── ¿tarjeta válida? → navega a /checkout-success
        └── ¿inválida? → muestra errores

Paso 5: Éxito
─────────────────
CheckoutSuccess.tsx
  └── Link → "/" (Home)
```

---

## Archivos involucrados (en orden de ejecución)

| Paso | Archivo | Rol |
|------|---------|-----|
| 1 | `pages/Home.tsx` | Proveedor de modal, error boundary |
| 1 | `pages/HomeContent.tsx` | Búsqueda, filtros, grid |
| 1 | `features/products/presentation/ProductList.tsx` | Orquestación de grid + estados |
| 1 | `features/products/presentation/ProductGrid.tsx` | Grid responsivo de tarjetas |
| 1 | `features/products/presentation/ProductCard.tsx` | Tarjeta individual con hover |
| 2 | `features/products/presentation/ProductDetailModal.tsx` | Modal con detalle completo |
| 2 | `features/products/presentation/components/QuantityControl.tsx` | Selector +/- de cantidad |
| 3 | `features/cart/application/hooks/useCartActions.ts` | addToCart con validación |
| 3 | `features/cart/domain/cartUtils.ts` | Lógica pura: merge, validación |
| 3 | `features/cart/presentation/Cart.tsx` | Drawer del carrito |
| 3 | `features/cart/presentation/CartItemRow.tsx` | Fila de item en drawer |
| 4 | `features/checkout/presentation/Checkout.tsx` | Página de checkout |
| 4 | `features/checkout/application/useCheckout.ts` | Lógica de estado + validación |
| 4 | `features/checkout/application/checkoutReducer.ts` | Reducer de checkout |
| 4 | `features/checkout/application/validation.ts` | Validación de tarjeta + Luhn |
| 4 | `features/checkout/presentation/PaymentMethodSelector.tsx` | Selector de método de pago |
| 4 | `features/checkout/presentation/components/OrderSummary.tsx` | Resumen (sticky) |
| 5 | `features/checkout/presentation/CheckoutSuccess.tsx` | Confirmación |

---

## Enlaces relacionados

- [04-ALGORITMOS.md](./04-ALGORITMOS.md) — Algoritmos usados en cada paso
- [05-CUSTOM-HOOKS.md](./05-CUSTOM-HOOKS.md) — Hooks que orquestan el flujo
- [10-API-Y-DATOS.md](./10-API-Y-DATOS.md) — APIs consumidas
