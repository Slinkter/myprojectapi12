# 🏗️ PROMPT MAESTRO — REFACTORING FSD COMPLETO
## Proyecto: myprojectapi12 | E-commerce React 18 + TypeScript
## Para: Gemini CLI

---

## ⚠️ REGLA ABSOLUTA — PROTOCOLO DE CAMBIOS

Por cada archivo que modifiques:
1. Léelo completo primero con `cat [archivo]`
2. Muestra ANTES / DESPUÉS antes de escribir
3. Un archivo a la vez — no cambios en batch
4. NUNCA elimines lógica funcional — solo reubícala
5. Si un cambio rompe un import, arréglalo en el mismo paso

---

## 🎯 OBJETIVO

Migrar la arquitectura actual:
```
src/
├── app/           ← mantener, limpiar
├── components/    ← dividir en shared/ui y widgets
├── features/      ← reestructurar a FSD
├── pages/         ← limpiar de lógica
└── lib/           ← mover a shared/lib
```

A Feature-Sliced Design (FSD) estricto:
```
src/
├── app/
├── pages/
├── widgets/
├── features/
├── entities/
└── shared/
```

---

## 📋 FASE 0 — AUDITORÍA INICIAL (SOLO LECTURA, NO TOCAR NADA)

### 0.1 Lee y reporta cada archivo de estas carpetas:

```bash
find src/ -name "*.tsx" -o -name "*.ts" | sort
```

Para cada archivo genera:
```
ARCHIVO: src/[ruta]
  Líneas: [N]
  Responsabilidad actual: [descripción en 1 línea]
  Problemas: [NAMING / TAMAÑO / ACOPLAMIENTO / DUPLICACIÓN / MIXED_CONCERNS]
  Destino FSD: src/[capa]/[feature]/[archivo]
```

### 0.2 Inventario de hooks TanStack Query existentes

Busca todos los useQuery y useMutation:
```bash
grep -rn "useQuery\|useMutation\|useInfiniteQuery" src/ --include="*.ts" --include="*.tsx"
```

Reporta:
```
QUERY: [nombre del hook o variable]
  Archivo actual: src/[ruta]
  queryKey actual: [valor]
  Endpoint: [URL]
  Consumido por: [componentes que lo usan]
  Problema: [queryKey sin centralizar / sin mapper / acoplado a componente]
  Destino FSD: src/features/[feature]/api/use[Name].ts
```

### 0.3 Inventario de tipos e interfaces TypeScript

```bash
grep -rn "interface\|type " src/ --include="*.ts" --include="*.tsx" | grep -v "node_modules"
```

Reporta tipos duplicados o dispersos.

### 0.4 Inventario de componentes en components/

Para cada componente en src/components/:
```
COMPONENTE: [Nombre]
  Líneas: [N]
  Props: [lista]
  Tiene lógica de negocio: [SÍ/NO]
  Tiene llamadas a API: [SÍ/NO]
  Destino FSD: shared/ui / widgets / features/[x]/ui
```

NO ejecutes cambios. Solo reporta y espera aprobación.

---

## 📐 FASE 1 — CREAR ESTRUCTURA FSD VACÍA

Ejecuta este comando para crear la estructura de carpetas:

```bash
# Capa shared
mkdir -p src/shared/ui/{Button,Input,Badge,Spinner,Card,Modal,Select,Skeleton}
mkdir -p src/shared/lib
mkdir -p src/shared/api
mkdir -p src/shared/hooks
mkdir -p src/shared/constants

# Capa entities
mkdir -p src/entities/product/{types,mappers}
mkdir -p src/entities/cart/types
mkdir -p src/entities/order/types

# Capa features (conserva las existentes, agrega subcarpetas)
mkdir -p src/features/products/{api,hooks,ui}
mkdir -p src/features/cart/{api,hooks,ui}
mkdir -p src/features/checkout/{api,hooks,ui}
mkdir -p src/features/theme/hooks

# Capa widgets
mkdir -p src/widgets/{Navbar,ProductGrid,CartDrawer,Footer,ProductCard}

# Capa pages (ya existe, solo limpiar)
# src/pages/ ya existe

# Capa app (ya existe, solo limpiar)
# src/app/ ya existe
```

Verifica que se crearon con:
```bash
find src/ -type d | sort
```

---

## 🔧 FASE 2 — SHARED LAYER

Implementa en este orden exacto. Cada archivo es independiente.

### 2.1 src/shared/lib/cn.ts
```typescript
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}
```

### 2.2 src/shared/lib/formatPrice.ts
```typescript
interface FormatPriceOptions {
  currency?: string
  locale?: string
}

export function formatPrice(
  amount: number,
  { currency = 'USD', locale = 'en-US' }: FormatPriceOptions = {}
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(amount)
}
```

### 2.3 src/shared/lib/animations.ts
```typescript
import type { Variants } from 'framer-motion'

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } },
}

export const slideUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
}

export const staggerContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
}

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.2 } },
}

export const slideInFromRight: Variants = {
  hidden: { opacity: 0, x: 60 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.35 } },
  exit: { opacity: 0, x: 60, transition: { duration: 0.25 } },
}
```

### 2.4 src/shared/constants/routes.ts
```typescript
export const ROUTES = {
  HOME: '/',
  PRODUCTS: '/products',
  PRODUCT_DETAIL: (id: string | number) => `/products/${id}`,
  CART: '/cart',
  CHECKOUT: '/checkout',
  NOT_FOUND: '*',
} as const

export type AppRoute = typeof ROUTES[keyof typeof ROUTES]
```

### 2.5 src/shared/constants/queryKeys.ts
```typescript
export const QUERY_KEYS = {
  products: {
    all: ['products'] as const,
    lists: () => [...QUERY_KEYS.products.all, 'list'] as const,
    list: (filters?: Record<string, unknown>) =>
      [...QUERY_KEYS.products.lists(), filters] as const,
    details: () => [...QUERY_KEYS.products.all, 'detail'] as const,
    detail: (id: string | number) =>
      [...QUERY_KEYS.products.details(), id] as const,
    categories: () => [...QUERY_KEYS.products.all, 'categories'] as const,
  },
  cart: {
    all: ['cart'] as const,
  },
  orders: {
    all: ['orders'] as const,
    detail: (id: string) => [...QUERY_KEYS.orders.all, id] as const,
  },
} as const
```

### 2.6 src/shared/api/httpClient.ts
```typescript
const BASE_URL = import.meta.env.VITE_API_URL ?? 'https://fakestoreapi.com'

class HttpError extends Error {
  constructor(
    public readonly status: number,
    public readonly statusText: string,
    message: string
  ) {
    super(message)
    this.name = 'HttpError'
  }
}

interface RequestConfig extends RequestInit {
  params?: Record<string, string>
}

async function request<T>(
  endpoint: string,
  config: RequestConfig = {}
): Promise<T> {
  const { params, headers, ...rest } = config
  const url = new URL(`${BASE_URL}${endpoint}`)

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.set(key, value)
    })
  }

  const response = await fetch(url.toString(), {
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    ...rest,
  })

  if (!response.ok) {
    throw new HttpError(
      response.status,
      response.statusText,
      `Request failed: ${response.status} ${response.statusText}`
    )
  }

  return response.json() as Promise<T>
}

export const httpClient = {
  get: <T>(endpoint: string, config?: RequestConfig) =>
    request<T>(endpoint, { method: 'GET', ...config }),

  post: <T>(endpoint: string, body: unknown, config?: RequestConfig) =>
    request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
      ...config,
    }),

  put: <T>(endpoint: string, body: unknown, config?: RequestConfig) =>
    request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(body),
      ...config,
    }),

  patch: <T>(endpoint: string, body: unknown, config?: RequestConfig) =>
    request<T>(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(body),
      ...config,
    }),

  delete: <T>(endpoint: string, config?: RequestConfig) =>
    request<T>(endpoint, { method: 'DELETE', ...config }),
}
```

### 2.7 src/shared/hooks/useDebounce.ts
```typescript
import { useState, useEffect } from 'react'

export function useDebounce<T>(value: T, delayMs: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delayMs)
    return () => clearTimeout(timer)
  }, [value, delayMs])

  return debouncedValue
}
```

### 2.8 src/shared/hooks/useLocalStorage.ts
```typescript
import { useState, useCallback } from 'react'

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void, () => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? (JSON.parse(item) as T) : initialValue
    } catch {
      return initialValue
    }
  })

  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      try {
        const valueToStore =
          value instanceof Function ? value(storedValue) : value
        setStoredValue(valueToStore)
        window.localStorage.setItem(key, JSON.stringify(valueToStore))
      } catch (error) {
        console.error(`useLocalStorage: error saving key "${key}"`, error)
      }
    },
    [key, storedValue]
  )

  const removeValue = useCallback(() => {
    try {
      window.localStorage.removeItem(key)
      setStoredValue(initialValue)
    } catch (error) {
      console.error(`useLocalStorage: error removing key "${key}"`, error)
    }
  }, [key, initialValue])

  return [storedValue, setValue, removeValue]
}
```

### 2.9 Componentes shared/ui — Patrón CVA

Para CADA componente en src/components/ui/ que ya exista,
migra a shared/ui/ aplicando este patrón:

```typescript
// src/shared/ui/Button/Button.tsx
import { cva, type VariantProps } from 'class-variance-authority'
import { Slot } from '@radix-ui/react-slot'
import { forwardRef, type ButtonHTMLAttributes } from 'react'
import { cn } from '@/shared/lib/cn'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        sm: 'h-8 px-3 text-xs',
        md: 'h-10 px-4',
        lg: 'h-12 px-6 text-base',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: { variant: 'default', size: 'md' },
  }
)

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'

export { buttonVariants }
```

Regla: cada componente en shared/ui/ debe tener su index.ts:
```typescript
// src/shared/ui/Button/index.ts
export { Button, buttonVariants } from './Button'
export type { ButtonProps } from './Button'
```

Y un barrel en src/shared/ui/index.ts:
```typescript
export * from './Button'
export * from './Input'
export * from './Badge'
export * from './Card'
export * from './Spinner'
export * from './Modal'
```

---

## 🗂️ FASE 3 — ENTITIES LAYER

### 3.1 Lee el código existente y extrae tipos

Lee todos los archivos en src/features/products/ y src/features/cart/
Identifica qué interfaces/types existen y dónde están definidos.

### 3.2 src/entities/product/types/product.types.ts

Basándote en lo que encontraste en la Fase 0, crea los tipos de dominio.
Ejemplo base (ajusta según la API real del proyecto):

```typescript
export interface ProductRating {
  rate: number
  count: number
}

// Tipo de dominio — lo que usa la UI
export interface Product {
  id: string
  title: string
  description: string
  price: number
  image: string
  category: string
  rating: ProductRating
}

// Lo que devuelve la API (puede diferir)
export interface ProductApiResponse {
  id: number
  title: string
  description: string
  price: number
  image: string
  category: string
  rating: { rate: number; count: number }
}

export type ProductCategory = string

export interface ProductFilters {
  category?: ProductCategory
  minPrice?: number
  maxPrice?: number
  sortBy?: 'price-asc' | 'price-desc' | 'rating' | 'title'
}
```

### 3.3 src/entities/product/mappers/product.mapper.ts

```typescript
import type { Product, ProductApiResponse } from '../types/product.types'

export function mapProductFromApi(raw: ProductApiResponse): Product {
  return {
    id: String(raw.id),
    title: raw.title ?? 'Sin título',
    description: raw.description ?? '',
    price: typeof raw.price === 'number' ? raw.price : 0,
    image: raw.image ?? '',
    category: raw.category ?? 'general',
    rating: {
      rate: raw.rating?.rate ?? 0,
      count: raw.rating?.count ?? 0,
    },
  }
}

export function mapProductsFromApi(rawList: ProductApiResponse[]): Product[] {
  if (!Array.isArray(rawList)) return []
  return rawList.map(mapProductFromApi)
}
```

### 3.4 src/entities/cart/types/cart.types.ts

```typescript
import type { Product } from '@/entities/product/types/product.types'

export interface CartItem {
  product: Product
  quantity: number
}

export interface CartState {
  items: CartItem[]
  isOpen: boolean
}

export interface CartSummary {
  totalItems: number
  totalPrice: number
  itemCount: number
}
```

---

## ⚡ FASE 4 — FEATURES LAYER

### Regla SOLID para features:
- **S** — Un hook = una responsabilidad
- **O** — Extensible via opciones, no modificando el hook
- **D** — Depende de httpClient y QUERY_KEYS, no de fetch directo

### 4.1 Migra los useQuery existentes a features/products/api/

Lee src/features/products/ actual y reescribe cada hook así:

```typescript
// src/features/products/api/useGetProducts.ts
import { useQuery } from '@tanstack/react-query'
import { QUERY_KEYS } from '@/shared/constants/queryKeys'
import { httpClient } from '@/shared/api/httpClient'
import { mapProductsFromApi } from '@/entities/product/mappers/product.mapper'
import type { ProductApiResponse } from '@/entities/product/types/product.types'
import type { ProductFilters } from '@/entities/product/types/product.types'

export function useGetProducts(filters?: ProductFilters) {
  return useQuery({
    queryKey: QUERY_KEYS.products.list(filters),
    queryFn: async () => {
      const params: Record<string, string> = {}
      if (filters?.category) params.category = filters.category

      const raw = await httpClient.get<ProductApiResponse[]>('/products', {
        params,
      })
      return mapProductsFromApi(raw)
    },
    staleTime: 1000 * 60 * 5,
  })
}
```

```typescript
// src/features/products/api/useGetProductById.ts
import { useQuery } from '@tanstack/react-query'
import { QUERY_KEYS } from '@/shared/constants/queryKeys'
import { httpClient } from '@/shared/api/httpClient'
import { mapProductFromApi } from '@/entities/product/mappers/product.mapper'
import type { ProductApiResponse } from '@/entities/product/types/product.types'

export function useGetProductById(id: string) {
  return useQuery({
    queryKey: QUERY_KEYS.products.detail(id),
    queryFn: async () => {
      const raw = await httpClient.get<ProductApiResponse>(`/products/${id}`)
      return mapProductFromApi(raw)
    },
    enabled: Boolean(id),
    staleTime: 1000 * 60 * 10,
  })
}
```

```typescript
// src/features/products/api/useGetCategories.ts
import { useQuery } from '@tanstack/react-query'
import { QUERY_KEYS } from '@/shared/constants/queryKeys'
import { httpClient } from '@/shared/api/httpClient'

export function useGetCategories() {
  return useQuery({
    queryKey: QUERY_KEYS.products.categories(),
    queryFn: () => httpClient.get<string[]>('/products/categories'),
    staleTime: 1000 * 60 * 30,
  })
}
```

### 4.2 src/features/products/hooks/useProductFilters.ts

```typescript
import { useState, useCallback } from 'react'
import { useDebounce } from '@/shared/hooks/useDebounce'
import type { ProductFilters } from '@/entities/product/types/product.types'

interface UseProductFiltersReturn {
  filters: ProductFilters
  searchQuery: string
  debouncedSearchQuery: string
  setCategory: (category: string | undefined) => void
  setSearchQuery: (query: string) => void
  setSortBy: (sortBy: ProductFilters['sortBy']) => void
  resetFilters: () => void
}

const DEFAULT_FILTERS: ProductFilters = {}

export function useProductFilters(): UseProductFiltersReturn {
  const [filters, setFilters] = useState<ProductFilters>(DEFAULT_FILTERS)
  const [searchQuery, setSearchQuery] = useState('')
  const debouncedSearchQuery = useDebounce(searchQuery, 350)

  const setCategory = useCallback((category: string | undefined) => {
    setFilters(prev => ({ ...prev, category }))
  }, [])

  const setSortBy = useCallback((sortBy: ProductFilters['sortBy']) => {
    setFilters(prev => ({ ...prev, sortBy }))
  }, [])

  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS)
    setSearchQuery('')
  }, [])

  return {
    filters,
    searchQuery,
    debouncedSearchQuery,
    setCategory,
    setSearchQuery,
    setSortBy,
    resetFilters,
  }
}
```

### 4.3 Divide el carrito en 3 hooks atómicos:

```typescript
// src/features/cart/hooks/useCartItems.ts
// Responsabilidad: agregar, quitar, actualizar items
import { useLocalStorage } from '@/shared/hooks/useLocalStorage'
import type { CartItem } from '@/entities/cart/types/cart.types'
import type { Product } from '@/entities/product/types/product.types'

export function useCartItems() {
  const [items, setItems] = useLocalStorage<CartItem[]>('cart-items', [])

  const addItem = (product: Product, quantity = 1) => {
    setItems(prev => {
      const existing = prev.find(item => item.product.id === product.id)
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      }
      return [...prev, { product, quantity }]
    })
  }

  const removeItem = (productId: string) => {
    setItems(prev => prev.filter(item => item.product.id !== productId))
  }

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId)
      return
    }
    setItems(prev =>
      prev.map(item =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    )
  }

  const clearCart = () => setItems([])

  return { items, addItem, removeItem, updateQuantity, clearCart }
}
```

```typescript
// src/features/cart/hooks/useCartSummary.ts
// Responsabilidad: solo cálculos derivados
import type { CartItem } from '@/entities/cart/types/cart.types'

export function useCartSummary(items: CartItem[]) {
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  )

  return { totalItems, totalPrice }
}
```

```typescript
// src/features/cart/hooks/useCart.ts
// Responsabilidad: componer useCartItems + useCartSummary (facade)
import { useCartItems } from './useCartItems'
import { useCartSummary } from './useCartSummary'

export function useCart() {
  const { items, addItem, removeItem, updateQuantity, clearCart } = useCartItems()
  const { totalItems, totalPrice } = useCartSummary(items)

  return {
    items,
    totalItems,
    totalPrice,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
  }
}
```

---

## 🖥️ FASE 5 — PAGES LAYER (solo composición)

Lee cada archivo en src/pages/ actual.
Si tiene lógica de negocio, extráela a features/.
La página debe quedar SOLO con composición:

```typescript
// src/pages/ProductListPage/index.tsx
// ✅ CORRECTO — cero lógica, solo layout
import { ProductGrid } from '@/widgets/ProductGrid'
import { ProductFiltersBar } from '@/features/products/ui/ProductFiltersBar'

export default function ProductListPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Productos</h1>
      <ProductFiltersBar />
      <ProductGrid />
    </main>
  )
}
```

Regla: si ves useState, useEffect, fetch, o useQuery en un archivo de pages/,
MUÉVELO a la feature correspondiente antes de continuar.

---

## 🔤 FASE 6 — NAMING CONVENTIONS

Recorre todos los archivos y aplica:

### Variables y funciones → camelCase
```typescript
// ❌ → ✅
const Product_List    → const productList
const get_products    → const getProducts
const UserID          → const userId
let Is_Loading        → let isLoading
```

### Componentes y tipos → PascalCase
```typescript
// ❌ → ✅
function product_card()  → function ProductCard()
interface product_type   → interface ProductType
type cart_item           → type CartItem
```

### Archivos
```
ProductCard.tsx       ← componentes React (PascalCase)
useProductFilters.ts  ← hooks (camelCase + prefijo use)
product.types.ts      ← tipos (kebab-case)
product.mapper.ts     ← mappers (kebab-case)
queryKeys.ts          ← utils/constantes (camelCase)
```

### Constantes globales → SCREAMING_SNAKE_CASE
```typescript
const MAX_CART_ITEMS = 10
const API_TIMEOUT_MS = 5000
const FREE_SHIPPING_THRESHOLD = 50
```

---

## ⚛️ FASE 7 — ATOMICIDAD DE COMPONENTES

### Regla: 1 componente = 1 responsabilidad

Si un componente hace más de una cosa, divídelo:

```
// ❌ ProductCard hace TODO
ProductCard.tsx (imagen + info + precio + botón + rating + badge)

// ✅ Dividido
ProductCard.tsx          ← solo compone los atoms
  ├── ProductImage.tsx   ← solo la imagen con lazy load
  ├── ProductInfo.tsx    ← título + categoría
  ├── ProductPrice.tsx   ← precio formateado + descuento
  ├── ProductRating.tsx  ← estrellas + count
  └── AddToCartButton.tsx ← botón con estado loading
```

Criterio para dividir: si puedes describir el componente con "y" → divídelo.
"Muestra la imagen Y el precio Y el botón" → 3 componentes separados.

### Patrón para componentes atómicos con Framer Motion:

```typescript
// src/widgets/ProductCard/ProductCard.tsx
import { motion } from 'framer-motion'
import { scaleIn } from '@/shared/lib/animations'
import { ProductImage } from './ProductImage'
import { ProductInfo } from './ProductInfo'
import { ProductPrice } from './ProductPrice'
import { AddToCartButton } from '@/features/cart/ui/AddToCartButton'
import type { Product } from '@/entities/product/types/product.types'

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <motion.article
      variants={scaleIn}
      initial="hidden"
      animate="visible"
      className="rounded-lg border bg-card overflow-hidden hover:shadow-md transition-shadow"
    >
      <ProductImage src={product.image} alt={product.title} />
      <div className="p-4 flex flex-col gap-3">
        <ProductInfo title={product.title} category={product.category} />
        <ProductPrice price={product.price} />
        <AddToCartButton product={product} />
      </div>
    </motion.article>
  )
}
```

---

## 🧹 FASE 8 — DRY AUDIT

Busca código duplicado:

```bash
# Busca patrones repetidos de fetch/useQuery sin httpClient
grep -rn "fetch(" src/ --include="*.ts" --include="*.tsx"

# Busca clsx/cn usados directamente sin pasar por shared
grep -rn "clsx\|twMerge" src/ --include="*.ts" --include="*.tsx"

# Busca formateo de precios duplicado
grep -rn "toFixed\|currency\|\.format" src/ --include="*.ts" --include="*.tsx"

# Busca animaciones Framer duplicadas
grep -rn "opacity: 0\|y: 20\|scale: 0" src/ --include="*.ts" --include="*.tsx"
```

Para cada duplicación encontrada:
1. Identifica el patrón común
2. Extráelo a shared/lib/ o shared/hooks/
3. Reemplaza todas las ocurrencias con la versión compartida

---

## 🔌 FASE 9 — BARREL EXPORTS Y PATH ALIASES

### 9.1 Verifica que vite.config.ts tiene los aliases:

```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@shared': resolve(__dirname, './src/shared'),
      '@features': resolve(__dirname, './src/features'),
      '@entities': resolve(__dirname, './src/entities'),
      '@widgets': resolve(__dirname, './src/widgets'),
      '@pages': resolve(__dirname, './src/pages'),
    },
  },
})
```

### 9.2 Verifica que tsconfig.json tiene los paths:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@shared/*": ["./src/shared/*"],
      "@features/*": ["./src/features/*"],
      "@entities/*": ["./src/entities/*"],
      "@widgets/*": ["./src/widgets/*"],
      "@pages/*": ["./src/pages/*"]
    }
  }
}
```

### 9.3 Crea index.ts en cada capa con barrel exports:

```typescript
// src/features/products/index.ts
export * from './api/useGetProducts'
export * from './api/useGetProductById'
export * from './api/useGetCategories'
export * from './hooks/useProductFilters'

// src/entities/product/index.ts
export * from './types/product.types'
export * from './mappers/product.mapper'

// src/shared/ui/index.ts
export * from './Button'
export * from './Input'
export * from './Badge'
export * from './Card'
export * from './Spinner'
```

---

## ✅ FASE 10 — VERIFICACIÓN FINAL

Ejecuta estos checks y reporta el resultado:

```bash
# TypeScript sin errores
npx tsc --noEmit

# ESLint sin warnings
npx eslint src/ --ext ts,tsx --max-warnings 0

# Tests pasan
npx vitest run

# Build exitoso
npx vite build
```

Para cada error reportado, corrígelo antes de marcar la fase como completa.

---

## 📊 RESULTADO ESPERADO

### Estructura final:
```
src/
├── app/
│   ├── providers/
│   │   ├── QueryProvider.tsx
│   │   ├── RouterProvider.tsx
│   │   └── index.tsx
│   └── main.tsx
│
├── pages/
│   ├── HomePage/index.tsx          ← solo composición
│   ├── ProductListPage/index.tsx   ← solo composición
│   ├── ProductDetailPage/index.tsx ← solo composición
│   ├── CartPage/index.tsx          ← solo composición
│   ├── CheckoutPage/index.tsx      ← solo composición
│   └── NotFoundPage/index.tsx
│
├── widgets/
│   ├── Navbar/
│   ├── ProductCard/
│   ├── ProductGrid/
│   ├── CartDrawer/
│   └── Footer/
│
├── features/
│   ├── products/
│   │   ├── api/           ← useQuery hooks
│   │   ├── hooks/         ← lógica de negocio
│   │   └── ui/            ← componentes propios de la feature
│   ├── cart/
│   │   ├── hooks/         ← useCart, useCartItems, useCartSummary
│   │   └── ui/            ← AddToCartButton, CartItem
│   ├── checkout/
│   │   ├── api/           ← useMutation para crear orden
│   │   └── hooks/
│   └── theme/
│       └── hooks/         ← useTheme
│
├── entities/
│   ├── product/
│   │   ├── types/         ← Product, ProductApiResponse, ProductFilters
│   │   └── mappers/       ← mapProductFromApi
│   ├── cart/
│   │   └── types/         ← CartItem, CartState
│   └── order/
│       └── types/
│
└── shared/
    ├── ui/                ← Button, Input, Badge, Card, Spinner, Modal
    ├── lib/               ← cn, formatPrice, animations
    ├── api/               ← httpClient
    ├── hooks/             ← useDebounce, useLocalStorage, useMediaQuery
    └── constants/         ← ROUTES, QUERY_KEYS
```

### Checklist de calidad:
```
□ cero useQuery fuera de src/features/
□ cero fetch() directo fuera de src/shared/api/httpClient.ts
□ cero tipos duplicados — todos en src/entities/
□ cero imports con rutas relativas profundas (../../..)
□ cero componentes que hagan más de 1 cosa
□ cero lógica de negocio en src/pages/
□ todos los nombres en camelCase / PascalCase correctamente
□ tsc --noEmit sin errores
□ eslint sin warnings
□ tests pasando
```
