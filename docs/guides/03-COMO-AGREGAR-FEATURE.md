# 🆕 Cómo Agregar una Nueva Funcionalidad

¡Esta guía te enseña a agregar algo nuevo al proyecto! Vamos a hacer un ejemplo completo: agregar una "lista de deseos" (wishlist).

---

## 🎯 ¿Qué es una feature?

Una **feature** (funcionalidad) es una parte del sistema que hace algo específico. Ejemplos:
- ✅ Agregar productos al carrito
- ✅ Buscar productos
- ✅ Cambiar el tema (claro/oscuro)
- 🆕 Lista de deseos (esto vamos a crear)

---

## 📝 Pasos para agregar una feature

### Paso 1: Define qué necesitas

Antes de programar, responde estas preguntas:

| Pregunta | Ejemplo (Wishlist) |
|----------|-------------------|
| ¿Qué datos necesito guardar? | Lista de productos favoritos |
| ¿Qué puede hacer el usuario? | Agregar, quitar, ver favoritos |
| ¿Cómo se ve? | Un corazón en cada producto, página de favoritos |

### Paso 2: Crea la estructura de carpetas

```
src/features/
└── wishlist/                    ← Nueva carpeta
    ├── domain/                  ← Definiciones
    │   └── wishlistTypes.ts     ← "¿Qué es una wishlist?"
    ├── application/             ← Lógica
    │   ├── WishlistContext.tsx  ← Estado global
    │   └── useWishlist.ts       ← Hook para usar
    ├── infrastructure/          ← Conexiones externas
    │   └── wishlistApi.ts      ← (si se necesita)
    └── presentation/            ← Lo que se ve
        ├── WishlistButton.tsx  ← Botón de favorito
        ├── WishlistPage.tsx    ← Página de favoritos
        └── WishlistCard.tsx    ← Tarjeta del producto
```

### Paso 3: Define los tipos (domain)

```typescript
// src/features/wishlist/domain/wishlistTypes.ts

/**
 * Representa un producto en la lista de deseos
 */
export interface WishlistItem {
  id: number;           // ID del producto
  addedAt: Date;        // Cuándo se agregó
}

/**
 * El estado completo de la wishlist
 */
export interface WishlistState {
  items: WishlistItem[];
  isOpen: boolean;      // Si el panel está abierto
}
```

### Paso 4: Crea la lógica (application)

```typescript
// src/features/wishlist/application/WishlistContext.tsx

import { createContext, useContext, useState, ReactNode } from 'react';
import type { WishlistState, WishlistItem } from '../domain/wishlistTypes';

interface WishlistContextValue {
  wishlist: WishlistState;
  addToWishlist: (productId: number) => void;
  removeFromWishlist: (productId: number) => void;
  isInWishlist: (productId: number) => boolean;
}

const WishlistContext = createContext<WishlistContextValue | undefined>(undefined);

/**
 * Provider que envuelve la aplicación
 * Permite usar la wishlist desde cualquier componente
 */
export function WishlistProvider({ children }: { children: ReactNode }) {
  const [wishlist, setWishlist] = useState<WishlistState>({
    items: [],
    isOpen: false,
  });

  // Agregar producto a favoritos
  const addToWishlist = (productId: number) => {
    setWishlist(prev => ({
      ...prev,
      items: [...prev.items, { id: productId, addedAt: new Date() }],
    }));
  };

  // Quitar de favoritos
  const removeFromWishlist = (productId: number) => {
    setWishlist(prev => ({
      ...prev,
      items: prev.items.filter(item => item.id !== productId),
    }));
  };

  // Verificar si ya está en favoritos
  const isInWishlist = (productId: number) => {
    return wishlist.items.some(item => item.id === productId);
  };

  return (
    <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist, isInWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
}

/**
 * Hook para usar la wishlist fácilmente
 */
export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within WishlistProvider');
  }
  return context;
}
```

### Paso 5: Crea la presentación (presentation)

```typescript
// src/features/wishlist/presentation/WishlistButton.tsx

import { useWishlist } from '../application/useWishlist';
import { Heart } from 'lucide-react';

/**
 * Botón de corazón para agregar/quitar de favoritos
 * Se usa en las tarjetas de productos
 */
interface WishlistButtonProps {
  productId: number;
}

export function WishlistButton({ productId }: WishlistButtonProps) {
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const isFavorite = isInWishlist(productId);

  const handleClick = () => {
    if (isFavorite) {
      removeFromWishlist(productId);
    } else {
      addToWishlist(productId);
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`p-2 rounded-full transition-colors ${
        isFavorite ? 'bg-red-100 text-red-500' : 'bg-gray-100 text-gray-400'
      }`}
      aria-label={isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
    >
      <Heart className={isFavorite ? 'fill-current' : ''} />
    </button>
  );
}
```

### Paso 6: Integra en la app

1. **Agrega el Provider** en `App.tsx`:

```tsx
import { WishlistProvider } from './features/wishlist/application/WishlistProvider';

function App() {
  return (
    <ThemeProvider>
      <CartProvider>
        <WishlistProvider>  {/* ← Agregar aquí */}
          <AppRouter />
        </WishlistProvider>
      </CartProvider>
    </ThemeProvider>
  );
}
```

2. **Usa el componente** donde necesites:

```tsx
import { WishlistButton } from './features/wishlist/presentation/WishlistButton';

function ProductCard({ product }) {
  return (
    <div className="card">
      <img src={product.image} alt={product.name} />
      <h3>{product.name}</h3>
      <WishlistButton productId={product.id} />  {/* ← Agregar aquí */}
    </div>
  );
}
```

---

## 🎯 Resumen: Estructura de una feature

```
feature/
├── domain/           ← "¿Qué es esto?" (tipos, reglas)
├── application/      ← "¿Cómo funciona?" (lógica, hooks)
├── infrastructure/  ← "¿Cómo se conecta?" (API, externos)
└── presentation/    ← "¿Cómo se ve?" (componentes UI)
```

---

## ✅ Checklist de verificación

- [ ] Definí los tipos en `domain/`
- [ ] Creé el Context y Hooks en `application/`
- [ ] Creé los componentes visuales en `presentation/`
- [ ] Agregué el Provider en `App.tsx`
- [ ] Usé los componentes donde necesitaba
- [ ] Probé que funciona

---

## 💡 Consejos

1. **Empieza siempre por domain** - Define primero qué vas a guardar
2. **Un componente = una responsabilidad** - No hagas un componente que haga de todo
3. **Usa TypeScript** - Te ayuda a detectar errores antes
4. **Prueba poco a poco** - Agrega una cosa y verifica que funcione

---

## ❓ Preguntas frecuentes

**P: ¿Tengo que crear todas las carpetas?**
R: No. Si es algo simple, puedes usar menos carpetas. Pero para features completas, esta estructura es recomendada.

**P: ¿Puedo poner todo en un archivo?**
R: Técnicamente sí, pero después será difícil de mantener. Es mejor separar.

**P: ¿Cómo sé qué va en cada capa?**
R:
- **domain**: Solo definiciones de tipos y funciones puras
- **application**: Hooks, Context, lógica de negocio
- **infrastructure**: Peticiones HTTP, localStorage, etc.
- **presentation**: Componentes de React que se ven

---

## 🎯 Siguiente paso

Si no conoces React todavía, aprende los conceptos básicos:

👉 **[04-TUTORIAL-REACT-BASICO.md](04-TUTORIAL-REACT-BASICO.md)**

---

¡Ahora puedes agregar tus propias funcionalidades! 🚀
