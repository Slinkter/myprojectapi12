# 04 — Algoritmos y Patrones de Datos

Análisis detallado de cada algoritmo implementado en el proyecto, con código real, diagramas de flujo y complejidad.

---

## 4.1 Infinite Scroll (Paginación con `useInfiniteQuery`)

### Problema

Cargar todos los productos de una sola vez es lento, consume mucho ancho de banda y empeora la experiencia de usuario.

### Solución

Carga progresiva de productos en páginas de 20 elementos usando `useInfiniteQuery` de TanStack Query con cursor pagination (página → skip).

### Código real (`src/features/products/application/useProducts.ts`)

```typescript
export const useProducts = (category?: string): IUseProductsResult => {
    const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
        queryKey: ["products", category] as const,
        queryFn: async ({ pageParam = 1 }) => {
            const skip = (pageParam - 1) * PRODUCTS_PER_PAGE; // 20
            return getProducts(skip, PRODUCTS_PER_PAGE, category);
        },
        getNextPageParam: (lastPage, allPages) => {
            const totalFetched = allPages.length * PRODUCTS_PER_PAGE;
            return totalFetched < lastPage.total
                ? allPages.length + 1
                : undefined; // undefined = no hay más páginas
        },
        initialPageParam: 1,
    });

    const products: IProduct[] =
        data?.pages.flatMap((page) => page.products) ?? [];

    return { products, loadMoreProducts: fetchNextPage, hasMore: hasNextPage ?? false, ... };
};
```

### Diagrama de flujo

```
Usuario ve el final de la lista
           │
           v
   ¿hasMore == true? ─── NO ─→ Fin
           │
           SI
           v
   fetchNextPage()
           │
           v
   API: GET /products?limit=20&skip=N
           │
           v
   Recibe IProductsApiResponse { products, total }
           │
           v
   getNextPageParam():
   ¿totalFetched < total?
           │
    ┌──────┴──────┐
    SI             NO
    │              │
    v              v
 nextPage =      undefined
 allPages+1      (stop)
    │
    v
   Página se agrega al array pages[]
           │
           v
   flatMap() aplana
   pages[] → IProduct[]
           │
           v
   Se renderizan nuevos productos
```

### Complejidad

| Tipo | Valor |
|------|-------|
| **Tiempo (por página)** | O(n) donde n = 20 (constante) |
| **Tiempo (total)** | O(N) donde N = total productos |
| **Espacio** | O(N) — todos los productos cargados en memoria |
| **Red** | O(1) petición por página |

---

## 4.2 Algoritmo de Merge del Carrito

### Problema

Al agregar un producto que ya existe en el carrito, se debe incrementar su cantidad en lugar de duplicarlo.

### Solución

Función pura `addItemToCart` que busca el item existente por ID y lo actualiza, o lo agrega al final si es nuevo.

### Código real (`src/features/cart/domain/cartUtils.ts`)

```typescript
export const addItemToCart = (
    cart: ICartItem[],
    product: IProduct,
    quantity: number,
): ICartItem[] => {
    const existingItem = cart.find((item) => item.id === product.id);

    if (existingItem) {
        return cart.map((item) =>
            item.id === product.id
                ? { ...item, quantity: item.quantity + quantity }
                : item,
        );
    }

    return [...cart, { ...product, quantity }];
};
```

### Diagrama de flujo

```
addItemToCart(cart, product, quantity)
           │
           v
   ¿product.id existe en cart?
           │
    ┌──────┴──────┐
    SI             NO
    │              │
    v              v
  cart.map()     spread:
  (actualiza     [...cart,
   quantity)      { ...product, quantity }]
    │              │
    └──────┬──────┘
           v
   Nuevo array (inmutable)
```

### Complejidad

| Tipo | Valor |
|------|-------|
| **Tiempo** | O(n) — `find` + `map` recorren el array |
| **Espacio** | O(n) — nuevo array creado |

---

## 4.3 Patrón Reducer en Checkout (`useReducer`)

### Problema

El formulario de checkout tiene múltiples campos, métodos de pago, detección de tipo de tarjeta y errores de validación. Gestionar esto con múltiples `useState` sería desorganizado.

### Solución

`useReducer` con **discriminated union actions** para manejar transiciones de estado de forma predecible.

### Código real (`src/features/checkout/application/checkoutReducer.ts`)

```typescript
export function checkoutReducer(
    state: ICheckoutState,
    action: CheckoutAction,
): ICheckoutState {
    switch (action.type) {
        case "SET_FIELD_VALUE":
            return {
                ...state,
                cardInfo: {
                    ...state.cardInfo,
                    [action.payload.name]: action.payload.value,
                },
            };
        case "SET_PAYMENT_METHOD":
            return { ...state, paymentMethod: action.payload };
        case "SET_ERRORS":
            return { ...state, errors: action.payload };
        case "SET_CARD_TYPE":
            return { ...state, cardType: action.payload };
        default:
            return state;
    }
}
```

### Diagrama de flujo

```
dispatch({ type: "SET_FIELD_VALUE", payload: { name, value } })
           │
           v
   checkoutReducer(state, action)
           │
           v
   switch(action.type)
           │
    ┌──────┼──────┬──────┬──────┐
    v      v      v      v     default
 SET_    SET_   SET_   SET_    → state
 FIELD   PAYMENT ERRORS CARD
 VALUE   METHOD         TYPE
    │      │      │      │
    v      v      v      v
  Nuevo estado inmutable
```

### Complejidad

| Tipo | Valor |
|------|-------|
| **Tiempo** | O(1) — sin loops, actualización directa de propiedades |
| **Espacio** | O(1) — spread crea nuevo objeto |

---

## 4.4 Validación con Early Return

### Problema

Validar múltiples campos de tarjeta de crédito (número, nombre, expiración, CVC) de forma clara y sin anidamiento excesivo.

### Solución

Patrón **early return**: cada validación retorna inmediatamente si encuentra un error.

### Código real (`src/features/checkout/application/validation.ts`)

```typescript
export const validateCardInfo = (cardInfo: ICardInfo): IValidationErrors => {
    const { number, name, expiry, cvc } = cardInfo;
    const errors: IValidationErrors = {};
    const sanitizedCardNumber = number.replace(/\s/g, "");

    // 1. Validar Número
    if (!sanitizedCardNumber) {
        errors.number = "El número de tarjeta es requerido";
    } else if (!isValidLuhn(sanitizedCardNumber)) {
        errors.number = "Número de tarjeta inválido";
    }

    // 2. Validar Nombre
    if (!name.trim()) errors.name = "El nombre es requerido";

    // 3. Validar Expiración
    const expiryError = validateExpiry(expiry);
    if (expiryError) errors.expiry = expiryError;

    // 4. Validar CVC
    if (!cvc) errors.cvc = "El CVC es requerido";
    else if (cvc.length < 3) errors.cvc = "El CVC debe tener al menos 3 dígitos";

    return errors;
};
```

### Algoritmo de Luhn (validación de tarjeta)

```typescript
const isValidLuhn = (cardNumber: string): boolean => {
    let sum = 0;
    let shouldDouble = false;
    for (let i = cardNumber.length - 1; i >= 0; i--) {
        let digit = parseInt(cardNumber.charAt(i));
        if (shouldDouble) {
            if ((digit *= 2) > 9) digit -= 9;
        }
        sum += digit;
        shouldDouble = !shouldDouble;
    }
    return cardNumber.length > 0 && sum % 10 === 0;
};
```

| Tipo | Valor |
|------|-------|
| **Tiempo (Luhn)** | O(n) — recorre cada dígito |
| **Tiempo (validate)** | O(n) varias validaciones O(1) |
| **Espacio** | O(k) donde k = número de errores |

---

## 4.5 `useDebounce` para Búsqueda

### Problema

Cada pulsación de tecla en el buscador dispararía una llamada API, saturando la red y empeorando la UX.

### Solución

Retrasar la actualización del valor hasta que el usuario deje de escribir por 350ms.

### Código real (`src/shared/hooks/useDebounce.ts`)

```typescript
export function useDebounce<T>(value: T, delayMs: number = 300): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        const timer = setTimeout(() => setDebouncedValue(value), delayMs);
        return () => clearTimeout(timer); // cleanup: cancela el timer anterior
    }, [value, delayMs]);

    return debouncedValue;
}
```

### Diagrama de flujo

```
Usuario escribe: "laptop"
           │
   value cambia en cada keystroke
   "l" → "la" → "lap" → "lapt" → "lapto" → "laptop"
           │
   useEffect se ejecuta en cada cambio
           │
   setTimeout(350ms)
           │
   ┌───────┴────────┐
   │                 │
  ¿Pasa 350ms       ¿Nuevo cambio
   sin cambio?       antes de 350ms?
   │                 │
   v                 v
  debouncedValue    clearTimeout()
  = "laptop"        (se reinicia)
   │
   v
  Se usa debouncedSearch
  en useMemo/make filter
```

### Complejidad

| Tipo | Valor |
|------|-------|
| **Tiempo** | O(1) — un timer por cambio |
| **Espacio** | O(1) — un valor en estado |

---

## 4.6 Validación de Descuentos

### Problema

Validar códigos de descuento ingresados por el usuario contra una lista predefinida.

### Solución

Búsqueda lineal con `Array.find()` y simulación de validación asíncrona con `setTimeout`.

### Código real (`src/features/checkout/application/useDiscountValidation.ts`)

```typescript
const VALID_CODES: IDiscountCode[] = [
    { code: 'WELCOME10', discount: 10, type: 'percentage' },
    { code: 'SAVE5', discount: 5, type: 'fixed' },
    { code: 'VIP20', discount: 20, type: 'percentage' },
];

const applyDiscount = useCallback(() => {
    if (!code.trim()) return;
    setIsApplying(true);

    setTimeout(() => {
        const found = VALID_CODES.find(
            (c) => c.code.toUpperCase() === code.toUpperCase()
        );
        if (found) setAppliedDiscount(found);
        else setError('Código de descuento inválido');
        setIsApplying(false);
    }, 500);
}, [code]);

export function calculateDiscountAmount(
    appliedDiscount: IDiscountCode | null,
    totalPrice: number
): number {
    if (!appliedDiscount) return 0;
    return appliedDiscount.type === 'percentage'
        ? (totalPrice * appliedDiscount.discount) / 100
        : appliedDiscount.discount;
}
```

| Tipo | Valor |
|------|-------|
| **Tiempo (búsqueda)** | O(k) — k = códigos válidos (3) |
| **Espacio** | O(k) |

---

## 4.7 Lazy Image Loading con IntersectionObserver

### Problema

Cargar todas las imágenes de productos al mismo tiempo bloquea la red y ralentiza la página.

### Solución

Uso del atributo nativo `loading="lazy"` en `<img>` con efecto blur-up (placeholder → fade in de imagen real).

### Código real (`src/shared/ui/LazyImage.tsx`)

```typescript
export function LazyImage({ src, alt, className, aspectRatio = 'aspect-[4/5]' }: ILazyImageProps) {
    const [isLoaded, setIsLoaded] = useState(false);
    const [isError, setIsError] = useState(false);

    const handleLoad = useCallback(() => setIsLoaded(true), []);
    const handleError = useCallback(() => { setIsError(true); setIsLoaded(true); }, []);

    return (
        <div className={cn('relative overflow-hidden bg-muted/30', aspectRatio, className)}>
            {/* Placeholder shimmer */}
            <div className={cn('absolute inset-0 bg-muted/50 transition-opacity duration-500', 
                isLoaded ? 'opacity-0' : 'opacity-100')}>
                <div className="absolute inset-0 bg-gradient-to-br from-muted/50 via-muted/30 to-muted/50 animate-pulse" />
            </div>

            {/* Imagen real con lazy loading nativo */}
            <img
                src={isError ? '/placeholder-image.png' : src}
                alt={alt}
                loading="lazy"
                onLoad={handleLoad}
                onError={handleError}
                className={cn('w-full h-full transition-all duration-500 object-cover',
                    isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105')}
            />
        </div>
    );
}
```

### Diagrama de flujo

```
<img loading="lazy" src="..." />
           │
   Navegador detecta que
   la imagen está cerca del viewport
           │
           v
   Comienza a descargar la imagen
           │
    ┌──────┴──────┐
    │             │
  Éxito         Error
    │             │
    v             v
  onLoad()      onError()
  → isLoaded    → isError=true
    = true        → isLoaded=true
    │             │
    v             v
  Placeholder   Muestra
  fadeOut       "Imagen no
  Imagen        disponible"
  fadeIn
    │
    v
  Imagen visible
  con opacidad 1
  y escala 1
```

### Complejidad

| Tipo | Valor |
|------|-------|
| **Tiempo (render)** | O(1) |
| **Red** | O(1) petición por imagen, bajo demanda |

---

## Enlaces relacionados

- [05-CUSTOM-HOOKS.md](./05-CUSTOM-HOOKS.md) — Hooks que implementan estos algoritmos
- [07-FLUIDO-COMPRA.md](./07-FLUIDO-COMPRA.md) — Flujo completo que integra estos algoritmos
