# 🗺️ MyProjectAPI12 — Roadmap de Implementación Completo
## Versión 2.0: Firebase Full-Stack + UX Premium

> **Stack actual:** React 18 · TypeScript · Radix Themes · TanStack Query  
> **Stack destino:** + Firebase (Auth · Realtime DB · Storage · Cloud Functions)

---

## 📊 Estado Actual del Proyecto

| Área | Estado | Notas |
|---|---|---|
| UI / Radix Themes | ✅ Migrado | 70 tests pasando |
| TypeScript | ✅ Limpio | 0 errores |
| Carrito (localStorage) | ✅ Funcional | Solo persiste localmente |
| Checkout | ⚠️ Básico | Sin guard de carrito vacío |
| Auth | ❌ No existe | — |
| Firebase | ❌ No existe | — |
| Historial compras | ❌ No existe | — |
| Multi-payment | ❌ Parcial | Solo tarjeta simulada |
| Cloud Functions | ❌ No existe | — |

---

## 🔧 Fase 0 — UX Bug Fixes (5 correcciones críticas)
> Sin dependencias. Ejecutable inmediatamente.

### 0.1 — ProductCard: imagen cortada + card muy alto
**Archivo:** `src/features/products/presentation/ProductCard.tsx`

**Problema:** `<Inset>` de Radix + `objectFit: "cover"` corta imágenes verticales. `height: "100%"` estira la card sin límite.

**Fix:**
```tsx
// Reemplazar <Inset> por contenedor fijo
<Box style={{
  height: 200,
  overflow: "hidden",
  backgroundColor: "var(--gray-2)",
  borderRadius: "var(--radius-3) var(--radius-3) 0 0",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}}>
  <LazyImage
    src={product.thumbnail}
    alt={product.title}
    style={{ width: "100%", height: "100%", objectFit: "contain", padding: "12px" }}
  />
</Box>
```

### 0.2 — Navbar: eliminar búsqueda duplicada (no funcional)
**Archivo:** `src/shared/ui/Navbar.tsx`

**Problema:** `isSearchOpen` abre un `TextField.Root` sin `value` ni `onChange` — es decorativo y duplica el `SearchInput` de HomeContent.

**Fix:** Eliminar `isSearchOpen`, el estado y el bloque `{isSearchOpen && ...}`. El ícono de lupa hace `focus()` en el `SearchInput` de la página:
```tsx
onClick={() => {
  document.querySelector<HTMLInputElement>('[aria-label="Buscar productos"]')?.focus();
}}
```

### 0.3 — Navbar: "Productos" → Dropdown de categorías dinámico
**Archivo:** `src/shared/ui/Navbar.tsx`

**Problema:** Link `/products` no existe en AppRouter — botón muerto.

**Fix:** Reemplazar con `<DropdownMenu.Root>` cargando categorías desde `dummyjson.com/products/categories`. Al seleccionar → filtrar por URL param `?category=smartphones` en HomeContent.

### 0.4 — Checkout: guard de carrito vacío
**Archivo:** `src/features/checkout/presentation/Checkout.tsx`

**Fix:**
```tsx
import { Navigate } from "react-router-dom";

const Checkout = () => {
  const { cart } = useCart();
  if (cart.length === 0) return <Navigate to="/" replace />;
  // ...
};
```

También eliminar: `console.log('[Checkout] Component mounted!')` (debug log).

### 0.5 — Navbar: ícono de carrito abre drawer (no navega)
**Archivo:** `src/shared/ui/Navbar.tsx`

**Fix:** `BackpackIcon` llama `openCart()` en lugar de navegar a `/checkout`.

---

## 🔥 Fase 1 — Firebase Setup + Google Auth
> Prerequisito: credenciales del proyecto Firebase.

### 1.1 — Instalación
```bash
pnpm add firebase
```

### 1.2 — Archivos de configuración

**[NUEVO] `src/app/config/firebase.ts`**
```ts
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getDatabase } from 'firebase/database'
import { getStorage } from 'firebase/storage'

export const app = initializeApp({
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL:       import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId:             import.meta.env.VITE_FIREBASE_APP_ID,
})

export const auth    = getAuth(app)
export const db      = getDatabase(app)
export const storage = getStorage(app)
```

**[NUEVO] `.env.example`**
```env
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_DATABASE_URL=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

### 1.3 — Feature Auth (Clean Architecture)

```
src/features/auth/
├── domain/
│   └── authTypes.ts           # IUser { uid, name, email, photoURL }
├── application/
│   ├── AuthContext.tsx         # onAuthStateChanged listener + Provider
│   └── useAuth.ts             # { user, isLoading, signInWithGoogle, signOut }
├── infrastructure/
│   └── firebaseAuth.ts        # GoogleAuthProvider + signInWithPopup
└── presentation/
    ├── LoginPage.tsx           # Ruta /login — Card centrada con logo
    ├── GoogleSignInButton.tsx  # Botón Google estilizado (Radix Button)
    └── UserAvatar.tsx          # Avatar circular con foto de Google
```

### 1.4 — Integración en App y Router

**[MODIFICAR] `src/App.tsx`:**
```tsx
<AuthProvider>
  <CartProvider>
    ...
  </CartProvider>
</AuthProvider>
```

**[MODIFICAR] `src/app/routing/AppRouter.tsx`:**
- Agregar `<Route path="/login" element={<LoginPage />} />`
- Login es **opcional** — checkout accesible sin autenticarse

**[MODIFICAR] `src/shared/ui/Navbar.tsx`:**
- Si autenticado: foto de Google (avatar) + ícono de historial + Logout
- Si no autenticado: botón `Iniciar sesión con Google`

---

## 📦 Fase 2 — Firebase Storage: Imágenes de Productos

### 2.1 — Estructura en Storage
```
gs://[project].firebasestorage.app/
│
├── products/
│   └── {productId}/
│       ├── thumbnail.webp       ← imagen principal del card
│       └── gallery/
│           ├── 0.webp
│           └── 1.webp
│
└── receipts/
    └── {userId}/
        └── {orderId}.json       ← recibo de compra (generado por Cloud Function)
```

### 2.2 — Servicio de imágenes
**[NUEVO] `src/features/products/infrastructure/productStorage.ts`**
```ts
// Sube imagen y retorna downloadURL
uploadProductImage(productId: string, file: File): Promise<string>

// Obtiene URL de Storage (prefiere sobre thumbnail de API)
getProductImageUrl(productId: string): Promise<string | null>
```

### 2.3 — Prioridad de imagen en ProductCard
```ts
// ProductCard muestra en este orden:
const imageSrc = product.imageUrl        // 1. Storage (alta calidad)
  ?? product.thumbnail                   // 2. DummyJSON API (fallback)
```

---

## 🗄️ Fase 3 — Realtime Database: Carrito, Stock y Órdenes

### 3.1 — Estructura completa de la BD

```json
{
  "products": {
    "1": {
      "stock": 10,
      "price": 299.99,
      "imageUrl": "https://storage.googleapis.com/..."
    }
  },

  "carts": {
    "{userId}": {
      "items": {
        "{productId}": {
          "quantity": 2,
          "price": 299.99,
          "title": "Reloj Premium",
          "imageUrl": "...",
          "addedAt": 1703123456789
        }
      }
    }
  },

  "orders": {
    "{userId}": {
      "{orderId}": {
        "status": "completed",
        "paymentMethod": "visa",
        "subtotal": 549.98,
        "shipping": 50.00,
        "discount": 0,
        "total": 599.98,
        "currency": "USD",
        "items": [
          {
            "productId": "1",
            "title": "Reloj Premium",
            "quantity": 2,
            "price": 299.99,
            "imageUrl": "..."
          }
        ],
        "createdAt": 1703123456789,
        "receiptUrl": "https://storage.googleapis.com/.../receipt.json",
        "refund": {
          "status": "none",
          "reason": null,
          "amount": 0,
          "processedAt": null
        }
      }
    }
  }
}
```

### 3.2 — Carrito sincronizado con Firebase
**[NUEVO] `src/features/cart/infrastructure/firebaseCart.ts`**

| Caso | Comportamiento |
|---|---|
| Usuario no autenticado | localStorage (comportamiento actual) |
| Usuario autenticado | Sync en tiempo real con `/carts/{uid}` |
| Usuario se loguea | Merge carrito local + DB (suma cantidades) |

### 3.3 — Stock en tiempo real
`onValue(ref(db, 'products/{id}/stock'))` en ProductCard → badge "Agotado" automático sin recargar.

---

## 💳 Fase 4 — Multi-Payment (4 métodos)

### 4.1 — Métodos soportados

| Método | Flujo |
|---|---|
| 💳 **Visa / Mastercard** | Formulario actual (formulario existente) |
| 💵 **Efectivo** | Genera código de referencia + instrucciones donde pagar |
| 📱 **Billetera Digital** | QR + link de pago (PayPal / MercadoPago placeholder) |
| ₿ **Bitcoin** | Dirección de wallet + QR generado en pantalla |

### 4.2 — Nuevos componentes de pago
```
src/features/checkout/presentation/payment-methods/
├── CashPayment.tsx            # Código de referencia + instrucciones
├── DigitalWalletPayment.tsx   # QR + link de pago
└── BitcoinPayment.tsx         # Dirección BTC + QR
```

### 4.3 — Tipo actualizado
```ts
type PaymentMethod = "visa" | "mastercard" | "cash" | "wallet" | "bitcoin"

// Se guarda en la orden:
order.paymentMethod = "bitcoin"
```

---

## 🧾 Fase 5 — Panel de Historial de Compras

### 5.1 — Trigger de apertura
- Al autenticarse con Google **y** haber órdenes previas → panel se abre automáticamente mostrando el historial
- Botón de historial en Navbar (ícono reloj) para abrir/cerrar manualmente
- Si no hay órdenes → no se abre automáticamente

### 5.2 — Estructura de componentes
```
src/features/orders/
├── domain/
│   └── orderTypes.ts
├── application/
│   ├── OrderContext.tsx
│   └── useOrders.ts           # { orders, isLoading, requestRefund }
├── infrastructure/
│   └── firebaseOrders.ts      # onValue listener de /orders/{uid}
└── presentation/
    ├── PurchaseHistoryPanel.tsx   # Sheet deslizable (Radix Dialog)
    ├── OrderCard.tsx              # Tarjeta por orden
    ├── OrderStatusBadge.tsx       # Verde/Rojo/Naranja
    └── RefundBadge.tsx            # Monto + razón de reembolso
```

### 5.3 — Diseño del panel

```
┌──────────────────────────────────────────┐
│  🧾 Historial de Compras           [✕]  │
├──────────────────────────────────────────┤
│  📅 20 Jun 2025, 5:47 PM               │
│  ₿ Bitcoin · 3 artículos               │
│                                          │
│  Reloj Premium ×2 .............. $599.98 │
│  Zapatillas ×1 .................. $89.99 │
│                                 ──────── │
│  Total ......................... $689.97  │
│                                          │
│  🟢 Completado          [Ver recibo]    │
├──────────────────────────────────────────┤
│  📅 15 Jun 2025, 2:13 PM               │
│  💳 Visa · 1 artículo                  │
│                                          │
│  Auriculares Sony ×1 ........... $249.99 │
│                                          │
│  🔴 Error de stock — Reembolsado        │
│  💰 $249.99 devueltos el 16 Jun         │
│                                          │
│  [Ver recibo] [Detalles del reembolso]  │
└──────────────────────────────────────────┘
```

### 5.4 — Ciclo de vida de una orden

```
pending → processing → completed ✅
                     ↘
                      failed
                       ├── stock_error ⚠️  → refunded 💰
                       └── payment_error ❌ → refunded 💰
```

### 5.5 — Tipos de reembolso
| Causa | Estado | Descripción |
|---|---|---|
| `stock_error` | ⚠️ Error de stock | Producto agotado al procesar |
| `payment_error` | ❌ Error de pago | Fallo en la transacción |
| `user_request` | 🔄 Devolución | El usuario solicitó devolución |
| `none` | — | Sin reembolso |

---

## ⚡ Fase 6 — Cloud Functions (Backend Serverless)

### 6.1 — ¿Por qué Cloud Functions?
| Sin Cloud Functions | Con Cloud Functions |
|---|---|
| El frontend puede hacer trampa con el stock | Transacciones atómicas en el servidor |
| Los recibos se generan en el cliente | Los recibos se generan de forma segura |
| Los reembolsos son manuales | Flujo automatizable |
| El stock puede quedar inconsistente | `runTransaction` garantiza consistencia |

### 6.2 — Funciones a implementar

| Función | Tipo | Descripción |
|---|---|---|
| `processOrder` | HTTPS Callable | Valida stock → descuenta → crea orden (atómico) |
| `onOrderCompleted` | Realtime DB Trigger | Genera `receipt.json` → sube a Storage → actualiza `receiptUrl` |
| `processRefund` | HTTPS Callable | Revierte stock + marca orden como `refunded` |
| `validateStockOnAdd` | Realtime DB Trigger | Al agregar al carrito → verifica stock disponible |
| `syncProductImages` | Storage Trigger | Al subir imagen → actualiza `imageUrl` en DB |
| `cleanupAbandonedCarts` | Scheduled (cada 24h) | Elimina carritos de invitados inactivos |

### 6.3 — Flujo de `processOrder` (la más crítica)

```
Cliente → processOrder({ cartItems, paymentMethod, userId })
                ↓
1. Verificar stock de CADA item (runTransaction)
   └── Si falla → throw { code: "STOCK_ERROR", productId }
                ↓
2. Descontar stock atómicamente
                ↓
3. Crear /orders/{uid}/{orderId} { status: "completed" }
                ↓
4. Limpiar /carts/{uid}
                ↓
5. Return { orderId, status: "completed" }
                ↓
   [Trigger: onOrderCompleted dispara automáticamente]
                ↓
6. Generar receipt.json
7. Upload → /receipts/{uid}/{orderId}.json en Storage
8. Actualizar receiptUrl en la orden de Realtime DB
```

### 6.4 — Estructura del proyecto Cloud Functions
```
functions/
├── src/
│   ├── index.ts
│   ├── orders/
│   │   ├── processOrder.ts
│   │   ├── onOrderCompleted.ts
│   │   └── processRefund.ts
│   ├── cart/
│   │   └── validateStockOnAdd.ts
│   ├── products/
│   │   └── syncProductImages.ts
│   └── scheduled/
│       └── cleanupCarts.ts
├── package.json
└── tsconfig.json
```

---

## 🔒 Reglas de Seguridad Firebase

### Realtime Database Rules
```json
{
  "rules": {
    "products": {
      ".read": true,
      ".write": false
    },
    "carts": {
      "$userId": {
        ".read": "auth != null && auth.uid === $userId",
        ".write": "auth != null && auth.uid === $userId"
      }
    },
    "orders": {
      "$userId": {
        ".read": "auth != null && auth.uid === $userId",
        ".write": false
      }
    }
  }
}
```

### Storage Rules
```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /products/{allPaths=**} {
      allow read: if true;
      allow write: if false; // Solo Cloud Functions
    }
    match /receipts/{userId}/{allPaths=**} {
      allow read: if request.auth.uid == userId;
      allow write: if false; // Solo Cloud Functions
    }
  }
}
```

---

## 📋 Inventario Completo de Cambios

### Archivos NUEVOS (30)
| Archivo | Fase |
|---|---|
| `.env.example` | 1 |
| `src/app/config/firebase.ts` | 1 |
| `src/features/auth/domain/authTypes.ts` | 1 |
| `src/features/auth/application/AuthContext.tsx` | 1 |
| `src/features/auth/application/useAuth.ts` | 1 |
| `src/features/auth/infrastructure/firebaseAuth.ts` | 1 |
| `src/features/auth/presentation/LoginPage.tsx` | 1 |
| `src/features/auth/presentation/GoogleSignInButton.tsx` | 1 |
| `src/features/auth/presentation/UserAvatar.tsx` | 1 |
| `src/features/products/infrastructure/productStorage.ts` | 2 |
| `src/features/cart/infrastructure/firebaseCart.ts` | 3 |
| `src/features/orders/domain/orderTypes.ts` | 5 |
| `src/features/orders/application/OrderContext.tsx` | 5 |
| `src/features/orders/application/useOrders.ts` | 5 |
| `src/features/orders/infrastructure/firebaseOrders.ts` | 5 |
| `src/features/orders/presentation/PurchaseHistoryPanel.tsx` | 5 |
| `src/features/orders/presentation/OrderCard.tsx` | 5 |
| `src/features/orders/presentation/OrderStatusBadge.tsx` | 5 |
| `src/features/orders/presentation/RefundBadge.tsx` | 5 |
| `src/features/checkout/presentation/payment-methods/CashPayment.tsx` | 4 |
| `src/features/checkout/presentation/payment-methods/DigitalWalletPayment.tsx` | 4 |
| `src/features/checkout/presentation/payment-methods/BitcoinPayment.tsx` | 4 |
| `functions/src/index.ts` | 6 |
| `functions/src/orders/processOrder.ts` | 6 |
| `functions/src/orders/onOrderCompleted.ts` | 6 |
| `functions/src/orders/processRefund.ts` | 6 |
| `functions/src/cart/validateStockOnAdd.ts` | 6 |
| `functions/src/products/syncProductImages.ts` | 6 |
| `functions/src/scheduled/cleanupCarts.ts` | 6 |
| `firebase.json` + `.firebaserc` | 6 |

### Archivos MODIFICADOS (8)
| Archivo | Cambios |
|---|---|
| `src/App.tsx` | `<AuthProvider>` wrapper |
| `src/app/routing/AppRouter.tsx` | Ruta `/login`, `<PurchaseHistoryPanel>` |
| `src/shared/ui/Navbar.tsx` | Avatar · Login/Logout · Historial · Fix búsqueda · Fix "Productos" |
| `src/features/checkout/presentation/Checkout.tsx` | Guard vacío · pre-fill auth · multi-pago |
| `src/features/cart/application/CartContext.tsx` | Sync Firebase si autenticado |
| `src/features/products/presentation/ProductCard.tsx` | Fix imagen · `imageUrl` de Storage |
| `src/features/checkout/presentation/CheckoutSuccess.tsx` | Guardar orden en Firebase al llegar aquí |
| `README.md` | Actualizar tech stack y diagramas |

---

## 🗓️ Orden de Sprints Sugerido

```
Sprint 1 ─── Fase 0 (UX Fixes) + Fase 1 (Firebase Auth Google)
Sprint 2 ─── Fase 2 (Storage imágenes) + Fase 3 (Realtime DB carrito/órdenes)
Sprint 3 ─── Fase 4 (Multi-payment) + Fase 5 (Historial de compras)
Sprint 4 ─── Fase 6 (Cloud Functions + Seguridad + Deploy)
```

---

> [!IMPORTANT]
> **Para iniciar Sprint 1** proporciona las 7 variables de tu proyecto Firebase (o indícame si prefieres empezar solo con los UX Fixes de Fase 0 mientras consigues las credenciales).

> [!NOTE]
> **README.md** tiene referencias a Tailwind CSS v4 y Shadcn/UI como stack — se actualizará para reflejar la migración a Radix Themes y el nuevo stack Firebase.
