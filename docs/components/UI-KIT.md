# UI Kit — Componentes Compartidos

Todos los componentes de UI primitivos residen en `src/shared/ui/`. Son reutilizables en todas las features.

---

## Button (`src/shared/ui/Button/Button.tsx`)

Botón reutilizable con variantes de estilo y tamaño, implementado con `class-variance-authority`.

### Variantes

| Variante | Descripción | Clases |
|----------|-------------|--------|
| `default` | Fondo verde esmeralda | `bg-emerald-600 hover:bg-emerald-700` |
| `destructive` | Fondo rojo | `bg-red-600 hover:bg-red-700` |
| `outline` | Borde con fondo transparente | `border border-slate-200` |
| `secondary` | Fondo gris claro | `bg-slate-100 hover:bg-slate-200` |
| `ghost` | Sin fondo, hover sutil | `hover:bg-slate-100` |
| `link` | Estilo de enlace subrayado | `underline-offset-4 hover:underline` |

### Tamaños

| Tamaño | Clases |
|--------|--------|
| `default` | `h-10 px-4 py-2` |
| `sm` | `h-9 rounded-xl px-3` |
| `lg` | `h-11 rounded-xl px-8` |
| `icon` | `h-10 w-10` |

```tsx
<Button variant="outline" size="sm" onClick={handleClick}>
  Cancelar
</Button>
```

## Card (`src/shared/ui/Card/Card.tsx`)

Conjunto de componentes para tarjetas:

| Componente | Descripción |
|------------|-------------|
| `Card` | Contenedor con borde, sombra y fondo |
| `CardHeader` | Encabezado con padding |
| `CardTitle` | Título semibold |
| `CardDescription` | Descripción secundaria |
| `CardContent` | Contenido principal |
| `CardFooter` | Pie con acciones |

```tsx
<Card>
  <CardHeader>
    <CardTitle>Mi Tarjeta</CardTitle>
    <CardDescription>Descripción</CardDescription>
  </CardHeader>
  <CardContent>Contenido</CardContent>
  <CardFooter>
    <Button>Acción</Button>
  </CardFooter>
</Card>
```

## Dialog (`src/shared/ui/dialog.tsx`)

Modal de diálogo con portal, overlay y tecla Escape.

| Componente | Descripción |
|------------|-------------|
| `Dialog` | Raíz controlada/no controlada |
| `DialogTrigger` | Botón que abre |
| `DialogPortal` | Portal a document.body |
| `DialogOverlay` | Fondo semitransparente |
| `DialogContent` | Cuerpo del diálogo |
| `DialogHeader` | Encabezado |
| `DialogFooter` | Pie |
| `DialogTitle` | Título |
| `DialogDescription` | Descripción |
| `DialogClose` | Botón de cierre |

## Sheet (`src/shared/ui/sheet.tsx`)

Panel lateral deslizable con soporte para 4 direcciones.

| Componente | Descripción |
|------------|-------------|
| `Sheet` | Raíz controlada/no controlada |
| `SheetTrigger` | Botón que abre |
| `SheetClose` | Botón que cierra |
| `SheetPortal` | Portal a document.body |
| `SheetOverlay` | Fondo semitransparente |
| `SheetContent` | Panel lateral (side: top/bottom/left/right) |
| `SheetHeader` | Encabezado |
| `SheetFooter` | Pie |
| `SheetTitle` | Título |
| `SheetDescription` | Descripción |

## Input (`src/shared/ui/input.tsx`)

Campo de texto con estilos consistentes:

```tsx
<Input type="text" placeholder="Nombre" className="w-full" />
```

## Label (`src/shared/ui/label.tsx`)

Etiqueta de formulario con estilo semibold:

```tsx
<Label htmlFor="email">Correo electrónico</Label>
<Input id="email" type="email" />
```

## ScrollArea (`src/shared/ui/scroll-area.tsx`)

Contenedor con scrollbar personalizada:

```tsx
<ScrollArea className="h-[200px]">
  <div>Contenido extenso...</div>
</ScrollArea>
```

## Navbar (`src/shared/ui/Navbar.tsx`)

Barra de navegación principal:

- Logo "ShopAPI" con icono animado
- Enlaces: Inicio, Categorías (dropdown)
- Búsqueda expandible con animación
- Toggle de tema (Sol/Luna)
- Carrito con badge de cantidad animado
- Menú responsive para móvil
- Categorías desde `useCategories`

## Layout (`src/shared/ui/Layout.tsx`)

Layout principal que envuelve todas las páginas:

```tsx
const Layout = ({ children }: ILayoutProps) => (
  <div className="min-h-screen bg-background text-foreground">
    <Toaster position="top-center" />
    <Navbar />
    <main className="mx-auto max-w-5xl px-4 py-6">{children}</main>
  </div>
);
```

## Loader (`src/shared/ui/Loader.tsx`)

Spinner de carga fullscreen con backdrop blur:

```tsx
<Loader text="Cargando productos..." />
```

## ErrorBoundary (`src/shared/ui/ErrorBoundary.tsx`)

Boundary de error global (componente de clase):

- `getDerivedStateFromError` y `componentDidCatch`
- Fallback por defecto: `ErrorFallback`
- Fallback personalizable mediante prop

## FeatureErrorBoundary (`src/shared/ui/FeatureErrorBoundary.tsx`)

Boundary por feature con nombre identificable:

```tsx
<FeatureErrorBoundary featureName="Products">
  <ProductList />
</FeatureErrorBoundary>
```

## ErrorFallback (`src/shared/ui/ErrorFallback.tsx`)

Pantalla completa de error con:

- Icono de advertencia
- Título "¡Oops! Algo salió mal"
- Detalles técnicos en modo desarrollo
- Botones "Reintentar" e "Ir al Inicio"

## ErrorMessage (`src/shared/ui/ErrorMessage.tsx`)

Alerta de error inline con acción opcional:

```tsx
<ErrorMessage
  message="Error al cargar productos"
  action={{ label: "Reintentar", onClick: retry }}
/>
```

## EmptyState (`src/shared/ui/EmptyState.tsx`)

Vista de estado vacío con icono, título, descripción y botón:

```tsx
<EmptyState
  icon={<Archive size={40} />}
  title="No hay resultados"
  description="Intenta con otros términos"
  actionLabel="Recargar"
  onAction={handleReload}
/>
```

## LazyImage (`src/shared/ui/LazyImage.tsx`)

Imagen con lazy loading y efecto blur-up:

- Placeholder con shimmer animado
- Transición suave al cargar
- Estado de error con fallback visual
- `loading="lazy"` nativo

## ImageZoom (`src/shared/ui/ImageZoom.tsx`)

Visor de imágenes con zoom interactivo:

- Zoom hasta 3x con scroll/rueda
- Arrastre para navegar cuando ampliado
- Controles táctiles: Acercar, Alejar, Restablecer
- Atajo de teclado (Enter/Espacio)
- Indicador de modo: "Click para zoom" / "Arrastra para mover"

## DropdownMenu (`src/shared/ui/dropdown-menu.tsx`)

Menú desplegable completo con:

| Componente | Descripción |
|------------|-------------|
| `DropdownMenu` | Raíz |
| `DropdownMenuTrigger` | Botón que abre |
| `DropdownMenuContent` | Panel flotante |
| `DropdownMenuItem` | Elemento |
| `DropdownMenuCheckboxItem` | Elemento checkbox |
| `DropdownMenuRadioItem` | Elemento radio |
| `DropdownMenuLabel` | Etiqueta |
| `DropdownMenuSeparator` | Separador |
| `DropdownMenuShortcut` | Atajo de teclado |
| `DropdownMenuGroup` | Grupo |
| `DropdownMenuPortal` | Portal |
| `DropdownMenuSub` | Submenú |
| `DropdownMenuSubContent` | Contenido submenú |
| `DropdownMenuSubTrigger` | Trigger submenú |
| `DropdownMenuRadioGroup` | Grupo radio |
