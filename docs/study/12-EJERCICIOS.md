# 12 — Ejercicios Progresivos

15+ ejercicios organizados por nivel de dificultad. Cada ejercicio referencia archivos reales del proyecto.

---

## CÓMO USAR ESTOS EJERCICIOS

1. Lee el código fuente del archivo mencionado
2. Intenta resolver sin mirar la solución
3. Verifica con `pnpm lint` y `pnpm type-check`
4. Si te atascas, usa los hints

---

# NIVEL BÁSICO

---

## Ejercicio B1: Cambiar color primario

**Objetivo:** Modificar el token de color primary del tema.

**Instrucciones:**
1. Abre `src/index.css`
2. Localiza el bloque `@theme`
3. Cambia `--color-primary` de `#059669` (verde esmeralda) a `#2563eb` (azul)
4. Cambia también `--color-primary-hover` a un tono más oscuro de azul

**Hints:**
- El color primary se usa en `bg-primary`, `text-primary`, `border-primary`, etc.
- `primary-hover` se usa en hover states de botones
- Verifica que los cambios se reflejen en la UI (Navbar, botones, badges)

**Resultado esperado:** Todos los elementos primary (botones, badges, enlaces) cambian de verde a azul.

**Archivos a modificar:** `src/index.css`

---

## Ejercicio B2: Agregar enlace al footer

**Objetivo:** Agregar un enlace "Política de Privacidad" en el Layout.

**Instrucciones:**
1. Abre `src/shared/ui/Layout.tsx`
2. Dentro del `<main>`, agrega un `<footer>` después de `{children}`
3. El footer debe contener: un `<p>` con el texto "© 2026 ShopAPI" y un `<a>` con href="#" que diga "Política de Privacidad"
4. Usa clases Tailwind: `text-xs text-muted-foreground text-center pt-8 pb-4`

**Hints:**
- El Layout es el componente que envuelve todas las páginas
- El Navbar ya está en el Layout, el footer debería ir al final

**Resultado esperado:** Un footer discreto aparece al final de cada página.

**Archivos a modificar:** `src/shared/ui/Layout.tsx`

---

## Ejercicio B3: Modificar texto del botón "Añadir al Carrito"

**Objetivo:** Cambiar el texto del botón en el modal de detalle de producto.

**Instrucciones:**
1. Abre `src/features/products/presentation/ProductDetailModal.tsx`
2. Busca el botón que dice "Añadir al Carrito" (usa `ShoppingBag`)
3. Cambia el texto a "Agregar a mi carrito"
4. Asegúrate de que el texto para `isOutOfStock` también se actualice (actualmente "Sin Stock" → "Agotado")

**Hints:**
- Busca la cadena exacta "Añadir al Carrito" en el archivo
- El botón usa el componente `<Button>` de shared/ui

**Resultado esperado:** El modal de producto muestra "Agregar a mi carrito".

**Archivos a modificar:** `src/features/products/presentation/ProductDetailModal.tsx`

---

## Ejercicio B4: Agregar badge de "Nuevo" en tarjetas

**Objetivo:** Mostrar un badge "NUEVO" en productos seleccionados.

**Instrucciones:**
1. Abre `src/features/products/presentation/ProductCard.tsx`
2. Después del badge de descuento (línea 207), agrega un badge "NUEVO" para productos con `id` par
3. Usa la condición: si `product.id % 2 === 0`, muestra "NUEVO"
4. Estilo: `bg-emerald-500 text-white px-2.5 py-0.5 rounded-full text-[10px] font-extrabold`

**Hints:**
- Los badges actuales usan posición absoluta (`absolute top-2.5 left-2.5`)
- Coloca el badge "NUEVO" en la esquina superior derecha (`top-2.5 right-2.5`)

**Resultado esperado:** Los productos con ID par muestran un badge "NUEVO" en la esquina superior derecha.

**Archivos a modificar:** `src/features/products/presentation/ProductCard.tsx`

---

## Ejercicio B5: Cambiar borde de tarjeta en hover

**Objetivo:** Modificar el color del borde al hacer hover sobre una tarjeta de producto.

**Instrucciones:**
1. Abre `src/features/products/presentation/ProductCard.tsx`
2. Busca la propiedad `whileHover` del `<m.article>`
3. Cambia el `borderColor` de `rgba(5, 150, 105, 0.45)` a `rgba(37, 99, 235, 0.45)` (azul)

**Hints:**
- El whileHover usa framer-motion para animar propiedades
- También puedes modificar el boxShadow para que combine con azul

**Resultado esperado:** Las tarjetas muestran borde azul (no verde) al hacer hover.

**Archivos a modificar:** `src/features/products/presentation/ProductCard.tsx`

---

# NIVEL INTERMEDIO

---

## Ejercicio I1: Agregar filtro de categoría en página de productos

**Objetivo:** Agregar un selector visual de categorías como chips clickeables en la página principal.

**Instrucciones:**
1. Abre `src/pages/HomeContent.tsx`
2. Después del `SearchInput`, agrega una sección de chips de categoría
3. Usa `useCategories()` para obtener las categorías (ya está importado)
4. Renderiza cada categoría como un `<button>` con:
   - `onClick` → `setSearchParams({ category: cat.slug })`
   - Clase: `rounded-full px-3 py-1 text-xs font-bold border`
   - Categoría activa: `bg-primary text-white`
5. La categoría "Todas" debe limpiar el filtro

**Hints:**
- Ya existe `categoryQuery` y `clearCategoryFilter` en el componente
- Usa `searchParams` de `useSearchParams()` (ya importado)
- Las categorías ya están cargadas en `const { data: categories } = useCategories();`

**Resultado esperado:** Chips de categorías aparecen debajo del buscador. Al hacer clic, se filtra la lista de productos.

**Archivos a modificar:** `src/pages/HomeContent.tsx`

---

## Ejercicio I2: Crear hook `useWindowSize`

**Objetivo:** Crear un custom hook que detecte cambios en el tamaño de la ventana.

**Instrucciones:**
1. Crea `src/shared/hooks/useWindowSize.ts`
2. El hook debe retornar `{ width: number, height: number }`
3. Usa `useState` + `useEffect` con `window.addEventListener('resize', handler)`
4. Limpia el event listener en el cleanup del useEffect
5. Exporta desde `src/shared/hooks/index.ts`

**Código base:**

```typescript
import { useState, useEffect } from 'react';

interface WindowSize {
    width: number;
    height: number;
}

export function useWindowSize(): WindowSize {
    const [windowSize, setWindowSize] = useState<WindowSize>({
        width: window.innerWidth,
        height: window.innerHeight,
    });

    useEffect(() => {
        const handleResize = () => {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return windowSize;
}
```

**Hints:**
- Agrega `useLogLifecycle` para depurar
- El hook debe ser genérico, no depender de ninguna feature

**Resultado esperado:** `const { width, height } = useWindowSize()` funciona en cualquier componente.

**Archivos a crear/modificar:** `src/shared/hooks/useWindowSize.ts`, `src/shared/hooks/index.ts`

---

## Ejercicio I3: Agregar ordenar por precio

**Objetivo:** Agregar un selector "Ordenar por" que permita ordenar productos por precio ascendente/descendente.

**Instrucciones:**
1. Abre `src/pages/HomeContent.tsx`
2. Agrega un `<select>` o botones de ordenamiento cerca del buscador
3. Estados: "Relevancia" (default), "Menor precio", "Mayor precio"
4. Usa `useMemo` para ordenar `filteredProducts` según la opción seleccionada
5. Pasa los productos ordenados a `<ProductList>`

**Hints:**
- Crea un estado `const [sortBy, setSortBy] = useState<'default' | 'price-asc' | 'price-desc'>('default')`
- El useMemo existente para `filteredProducts` puede extenderse

**Resultado esperado:** Un selector permite ordenar productos de menor a mayor precio y viceversa.

**Archivos a modificar:** `src/pages/HomeContent.tsx`

---

## Ejercicio I4: Persistencia local del carrito con fecha de expiración

**Objetivo:** Modificar la persistencia del carrito para que expire después de 24 horas.

**Instrucciones:**
1. Abre `src/features/cart/application/CartContext.tsx`
2. Modifica la inicialización desde localStorage para incluir un timestamp
3. Al guardar, almacena `{ data: cart, timestamp: Date.now() }`
4. Al cargar, verifica si han pasado más de 24 horas
5. Si expiró, retorna `[]` (carrito vacío)

**Hints:**
- Modifica la key `CART_STORAGE_KEY` o crea una nueva estructura
- 24 horas en ms: `24 * 60 * 60 * 1000`

**Resultado esperado:** El carrito se limpia automáticamente después de 24 horas sin usar la app.

**Archivos a modificar:** `src/features/cart/application/CartContext.tsx`

---

## Ejercicio I5: Agregar variante de Skeleton

**Objetivo:** Crear una variante de SkeletonCard con forma de lista (horizontal) además de la existente (grid).

**Instrucciones:**
1. Abre `src/features/products/presentation/SkeletonCard.tsx`
2. Agrega una prop `variant: 'grid' | 'list'`
3. Para `variant="list"`, renderiza un layout horizontal: imagen a la izquierda, texto a la derecha
4. Actualiza `SkeletonGrid.tsx` para aceptar la prop y pasarla

**Hints:**
- Usa `flex` para el layout horizontal
- Los placeholders actuales usan `bg-muted/50 animate-pulse rounded`

**Resultado esperado:** `SkeletonGrid variant="list"` muestra esqueletos en formato de lista horizontal.

**Archivos a modificar:** `src/features/products/presentation/SkeletonCard.tsx`, `src/features/products/presentation/SkeletonGrid.tsx`, `src/features/products/presentation/type.ts`

---

# NIVEL AVANZADO

---

## Ejercicio A1: Wishlist (Lista de Deseos)

**Objetivo:** Implementar una feature completa de Wishlist siguiendo la estructura FSD.

**Estructura a crear:**

```
src/features/wishlist/
├── domain/
│   ├── wishlistTypes.ts    ← tipos IWishlistItem, IWishlistContextValue
│   └── wishlistUtils.ts    ← addToWishlist, removeFromWishlist, isInWishlist
├── application/
│   ├── WishlistContext.tsx  ← Context + Provider + useWishlist hook
│   └── hooks/
│       └── useWishlistActions.ts
├── infrastructure/
│   └── wishlistStorage.ts  ← persistencia en localStorage
└── presentation/
    ├── WishlistButton.tsx   ← botón corazón en ProductCard
    └── WishlistPage.tsx     ← página que muestra todos los favoritos
```

**Requisitos:**
- Un corazón (❤️) en cada `ProductCard` que agrega/remueve de wishlist
- La wishlist persiste en localStorage
- Página `/wishlist` que lista los productos favoritos
- Toast notifications al agregar/remover

**Hints:**
- Sigue el patrón de `CartContext` como referencia
- Usa `lucide-react` para el icono Heart
- Los tipos `IProduct` ya existen en `@/features/products/domain/productTypes`
- Registra la ruta en `AppRouter.tsx`

**Resultado esperado:** Feature completa de wishlist funcionando con estructura FSD.

**Archivos a crear:** 7+ archivos en `src/features/wishlist/`

---

## Ejercicio A2: Agregar reseñas de productos desde API

**Objetivo:** Mostrar reseñas de productos usando datos simulados o de una API.

**Instrucciones:**
1. Crea `src/features/products/domain/reviewTypes.ts` con interfaz `IReview { id, userId, userName, rating, comment, date }`
2. Crea `src/features/products/infrastructure/reviewsApi.ts` con función `getProductReviews(productId)`
   - Por ahora, retorna datos mock (array simulado)
3. Crea `src/features/products/application/useProductReviews.ts` con `useQuery`
4. Crea `src/features/products/presentation/components/ProductReviews.tsx` que muestre:
   - Rating promedio
   - Lista de reseñas con avatar, nombre, estrellas, comentario
5. Integra en `ProductDetailModal.tsx`

**Hints:**
- Usa `useQuery({ queryKey: ['reviews', productId], queryFn: () => getProductReviews(productId) })`
- DummyJSON no tiene endpoint de reseñas, usa datos mock

**Resultado esperado:** Las reseñas aparecen en el modal de detalle de producto.

**Archivos a crear:** 4+ archivos

---

## Ejercicio A3: Códigos promocionales en checkout

**Objetivo:** Agregar funcionalidad completa de códigos promocionales en la página de checkout.

**Instrucciones:**
1. Abre `src/features/checkout/presentation/Checkout.tsx`
2. Integra el componente `DiscountInput` en el formulario
3. El `DiscountInput` debe permitir ingresar un código y aplicar descuento
4. Muestra `AppliedDiscountBadge` cuando un descuento está aplicado
5. El `OrderSummary` debe reflejar el descuento en el total

**Hints:**
- El hook `useDiscountValidation` ya existe en `src/features/checkout/application/useDiscountValidation.ts`
- Los componentes `DiscountInput` y `AppliedDiscountBadge` ya existen
- La función `calculateDiscountAmount` ya está implementada
- Revisa qué archivos de checkout/presentation/components/ ya existen

**Resultado esperado:** Los usuarios pueden ingresar códigos como "WELCOME10" y ver el descuento aplicado en el resumen.

**Archivos a modificar:** `src/features/checkout/presentation/Checkout.tsx` y componentes relacionados.

---

## Ejercicio A4: Transiciones entre rutas

**Objetivo:** Agregar animaciones de entrada/salida al navegar entre páginas.

**Instrucciones:**
1. Abre `src/app/routing/AppRouter.tsx`
2. Envuelve `<Routes>` con `<AnimatePresence mode="wait">`
3. Usa `<m.div>` con la variante `pageFadeIn` de `shared/lib/animations.ts`
4. Aplica la animación a cada ruta individualmente
5. Asegúrate de respetar `useReducedMotion()`

**Hints:**
- `AnimatePresence` necesita un `key` único en el elemento animado
- Usa `location.pathname` como key
- `pageFadeIn` ya existe en `shared/lib/animations.ts`

**Código base:**

```typescript
import { AnimatePresence, m } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { pageFadeIn } from '@/shared/lib/animations';

const location = useLocation();

return (
    <AnimatePresence mode="wait">
        <m.div key={location.pathname} variants={pageFadeIn} initial="hidden" animate="visible">
            <Routes location={location}>
                {/* rutas */}
            </Routes>
        </m.div>
    </AnimatePresence>
);
```

**Resultado esperado:** Transición suave (fade) al navegar entre Home, Checkout y Success.

**Archivos a modificar:** `src/app/routing/AppRouter.tsx`

---

## Ejercicio A5: Internacionalización (i18n)

**Objetivo:** Agregar soporte multi-idioma (español/inglés) usando Context API.

**Instrucciones:**
1. Crea `src/features/i18n/domain/translations.ts` con objeto de traducciones:

```typescript
export type Language = 'es' | 'en';

export const translations = {
    es: {
        'cart.title': 'Mi Carrito',
        'cart.empty': 'Tu carrito está vacío',
        'cart.checkout': 'Proceder al Pago',
        'product.add': 'Añadir al Carrito',
        'product.outOfStock': 'Sin stock',
        'nav.home': 'Inicio',
        'nav.categories': 'Categorías',
    },
    en: {
        'cart.title': 'My Cart',
        'cart.empty': 'Your cart is empty',
        'cart.checkout': 'Proceed to Checkout',
        'product.add': 'Add to Cart',
        'product.outOfStock': 'Out of stock',
        'nav.home': 'Home',
        'nav.categories': 'Categories',
    },
};
```

2. Crea `src/features/i18n/application/I18nContext.tsx` con `useLanguage` hook
3. Crea un hook `useTranslate` que retorne una función `t(key: string): string`
4. Agrega un botón de cambio de idioma en el Navbar
5. Reemplaza textos hardcodeados por llamadas a `t()`

**Hints:**
- Sigue el patrón de ThemeContext (Context + Provider + hook)
- Usa `localStorage` para persistir el idioma seleccionado
- Comienza con 10-15 claves, no necesitas traducir todo

**Resultado esperado:** Botón de cambio de idioma en el Navbar que alterna entre español e inglés.

**Archivos a crear/modificar:** 3+ archivos en `src/features/i18n/`, modificaciones en componentes con textos.

---

## REFERENCIAS

| Ejercicio | Archivos involucrados | Conceptos |
|-----------|----------------------|-----------|
| B1 | `src/index.css` | Tokens de diseño, CSS variables |
| B2 | `src/shared/ui/Layout.tsx` | Composición, Layout |
| B3 | `ProductDetailModal.tsx` | Props, strings |
| B4 | `ProductCard.tsx` | Renderizado condicional |
| B5 | `ProductCard.tsx` | Framer Motion animaciones |
| I1 | `HomeContent.tsx` | URL params, filtros |
| I2 | `shared/hooks/useWindowSize.ts` | Custom hooks, eventos |
| I3 | `HomeContent.tsx` | useMemo, ordenamiento |
| I4 | `CartContext.tsx` | localStorage, expiración |
| I5 | `SkeletonCard.tsx` | Variantes, props |
| A1 | `features/wishlist/` | FSD completa, nueva feature |
| A2 | `features/products/` | API, useQuery, reseñas |
| A3 | `features/checkout/` | Descuentos, composición |
| A4 | `AppRouter.tsx` | Framer Motion, rutas |
| A5 | `features/i18n/` | Context API, i18n |

---

## Enlaces relacionados

- [02-ESTRUCTURA.md](./02-ESTRUCTURA.md) — Entender la estructura FSD para el ejercicio A1
- [05-CUSTOM-HOOKS.md](./05-CUSTOM-HOOKS.md) — Referencia para crear hooks
- [GLOSARIO.md](./GLOSARIO.md) — Definiciones de términos técnicos
