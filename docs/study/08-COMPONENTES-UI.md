# 08 — Patrones de Componentes UI

---

## 1. Composición de Componentes

Los componentes se construyen por composición, no por herencia. Un componente "smart" orquesta componentes "dumb".

```typescript
// ProductList.tsx — Componente de orquestación
const ProductList = memo((props: IProductListProps) => {
    const { products, isLoading, error, hasMore, loadMoreProducts } = props;

    if (error) return <ErrorMessage message={error} />;
    if (products.length === 0 && !isLoading) return <EmptyState />;

    return (
        <>
            <ProductGrid products={products} />
            <LoadMoreSection ... />
        </>
    );
});
```

---

## 2. Compound Components (Card)

El componente `Card` expone sub-componentes (`CardHeader`, `CardTitle`, `CardContent`, `CardFooter`) que funcionan juntos.

```typescript
// src/shared/ui/Card/Card.tsx
export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }

// Uso:
<Card>
    <CardHeader>
        <CardTitle>Producto</CardTitle>
        <CardDescription>Descripción</CardDescription>
    </CardHeader>
    <CardContent>...</CardContent>
    <CardFooter>
        <Button>Comprar</Button>
    </CardFooter>
</Card>
```

Cada sub-componente usa `forwardRef` para aceptar refs y extiende `React.HTMLAttributes<HTMLDivElement>`.

---

## 3. Variantes con CVA (Button)

`class-variance-authority` (CVA) permite definir variantes de estilo limpias y tipadas.

```typescript
// src/shared/ui/Button/Button.tsx
const buttonVariants = cva(
    "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-semibold transition-all ...",
    {
        variants: {
            variant: {
                default: "bg-emerald-600 hover:bg-emerald-700 text-white ...",
                destructive: "bg-red-600 text-white hover:bg-red-700 ...",
                outline: "border border-slate-200 ...",
                secondary: "bg-slate-100 ...",
                ghost: "hover:bg-slate-100 ...",
                link: "text-emerald-600 hover:text-emerald-700 ...",
            },
            size: {
                default: "h-10 px-4 py-2",
                sm: "h-9 rounded-xl px-3",
                lg: "h-11 rounded-xl px-8",
                icon: "h-10 w-10",
            },
        },
        defaultVariants: { variant: "default", size: "default" },
    }
);

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, ...props }, ref) => {
        return <button className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
    }
);
```

---

## 4. Primitivas Radix UI (Shadcn)

Componentes accesibles y sin estilos predefinidos, envueltos para integrarse con Tailwind.

```typescript
// src/shared/ui/dialog.tsx
import * as DialogPrimitive from "@radix-ui/react-dialog";

const DialogContent = React.forwardRef<
    React.ElementRef<typeof DialogPrimitive.Content>,
    React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
    <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in" />
        <DialogPrimitive.Content
            ref={ref}
            className={cn("fixed left-[50%] top-[50%] z-50 ...", className)}
            {...props}
        >
            {children}
        </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
));
```

Primitivas usadas en el proyecto:

| Archivo | Primitiva Base |
|---------|----------------|
| `dialog.tsx` | `@radix-ui/react-dialog` |
| `dropdown-menu.tsx` | `@radix-ui/react-dropdown-menu` |
| `sheet.tsx` | `@radix-ui/react-dialog` (adaptado como sheet) |
| `scroll-area.tsx` | `@radix-ui/react-scroll-area` |
| `input.tsx` | HTML nativo + estilos |
| `label.tsx` | HTML nativo + estilos |

---

## 5. `cn()` — Merge de Clases Tailwind

Combina `clsx` y `tailwind-merge` para resolver clases contradictorias.

```typescript
// src/shared/lib/cn.ts
export function cn(...inputs: ClassValue[]): string {
    return twMerge(clsx(inputs));
}

// Uso: si dos clases conflictivas llegan, tailwind-merge resuelve
cn('px-4', 'px-2') // => 'px-2' (la última gana)
```

---

## 6. Portal para Modales y Drawers

Componentes que deben salir del flujo normal del DOM usan `createPortal`:

```typescript
// Cart.tsx — Drawer en portal
return createPortal(
    <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px]" onClick={closeCart} />
    <div className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-[380px] ...">
        ...
    </div>,
    document.body
);

// ProductDetailModal.tsx — Modal en portal
return createPortal(
    <div className="fixed inset-0 z-50 overflow-y-auto ...">
        ...
    </div>,
    document.body
);
```

---

## 7. Componentes de Error

Dos niveles de error boundary:

| Componente | Ámbito | Archivo |
|------------|--------|---------|
| `ErrorBoundary` | Global (toda la app) | `shared/ui/ErrorBoundary.tsx` |
| `FeatureErrorBoundary` | Por feature (Products) | `shared/ui/FeatureErrorBoundary.tsx` |

```typescript
// App.tsx — Global
<ErrorBoundary>
    <Layout>...</Layout>
</ErrorBoundary>

// Home.tsx — Por feature
<FeatureErrorBoundary featureName="Products">
    <HomeContent />
</FeatureErrorBoundary>
```

---

## 8. Estados de UI

Cada componente de lista maneja 4 estados:

| Estado | Componente | Archivo |
|--------|------------|---------|
| **Loading** | `SkeletonGrid` / `Loader` | `SkeletonGrid.tsx`, `Loader.tsx` |
| **Error** | `ErrorMessage` | `ErrorMessage.tsx` |
| **Empty** | `EmptyState` | `EmptyState.tsx` |
| **Success** | `ProductGrid` / `ProductList` | `ProductGrid.tsx` |

---

## 9. Animaciones con Framer Motion

Componentes envueltos en `m.` para animaciones declarativas:

```typescript
// ProductCard.tsx
<m.article
    whileHover={{ y: -8, boxShadow: '0 20px 30px -10px rgba(5, 150, 105, 0.15)' }}
    transition={{ duration: 0.25 }}
>
```

Variantes reutilizables en `shared/lib/animations.ts`:

| Variante | Uso |
|----------|-----|
| `fadeIn` | Aparición gradual |
| `slideUp` | Deslizamiento hacia arriba |
| `staggerContainer` | Hijos con retraso escalonado |
| `scaleIn` | Escalado con opacidad |
| `slideInFromRight` | Entrada lateral |
| `modalSlideUp` | Modal con efecto spring |
| `backdropFade` | Fondo oscuro |
| `pageFadeIn` | Transición entre páginas |

---

## Enlaces relacionados

- [05-CUSTOM-HOOKS.md](./05-CUSTOM-HOOKS.md) — Hooks que alimentan estos componentes
- [09-ESTILOS.md](./09-ESTILOS.md) — Sistema de estilos con Tailwind
- [GLOSARIO.md](./GLOSARIO.md) — Términos: composición, compound components, portal
