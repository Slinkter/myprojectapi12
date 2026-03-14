# 🎨 Design System v2 — MyProjectAPI12
> **Versión:** 2.0 | **Última actualización:** 2026-03-13

Este documento es la referencia canónica del sistema de diseño visual del proyecto. Documentado el estado **actual** del código en `src/index.css`.

---

## 1. Filosofía Visual

**Modern Refined Minimalism + Soft Glassmorphism**

- **Claridad sobre decoración**: Espacio negativo generoso, sin elementos superfluos.
- **Profundidad sutil**: Sombras multi-capa suaves, no rígidas.
- **Interacción táctil**: Cada elemento interactivo tiene feedback (scale, color shift).
- **Glassmorphism**: Aplicado a modales y drawers (`backdrop-blur` + fondo semi-transparente).

---

## 2. Paleta de Color Semántica

> ⚠️ **Regla cardinal**: Nunca usar colores hardcodeados de Tailwind (`bg-slate-900`, `text-amber-600`). Usar **siempre** los tokens semánticos.

### Tokens semánticos en `src/index.css`

```css
@theme {
  /* === LIGHT MODE (DEFAULT) === */
  --color-background: #ffffff;        /* Fondo de páginas */
  --color-foreground: #020617;        /* Texto principal */
  --color-card: #ffffff;              /* Superficie de tarjetas */
  --color-card-foreground: #020617;
  --color-muted: #f1f5f9;             /* Fondo de elementos secundarios */
  --color-muted-foreground: #64748b;  /* Texto secundario, placeholders */
  --color-border: #e2e8f0;            /* Bordes y separadores */
  --color-input: #f8fafc;             /* Fondo de inputs */
  --color-ring: rgba(70,81,214,0.4);  /* Focus ring */
  
  /* Brand: Midnight Indigo */
  --color-primary: #4651d6;
  --color-primary-foreground: #ffffff;
  
  /* Secondary */
  --color-secondary: #f1f5f9;
  --color-secondary-foreground: #020617;
  
  /* Accent: Champagne Gold */
  --color-accent: #f8f1e7;
  --color-accent-foreground: #b5945b;
  
  /* Surface (modales y paneles) */
  --color-surface: #fafafa;
  --color-surface-foreground: #020617;
  
  /* Feedback */
  --color-destructive: #ef4444;
  --color-destructive-foreground: #ffffff;
  --color-success: #10b981;
  --color-success-foreground: #ffffff;
  --color-warning: #f59e0b;
  --color-warning-foreground: #020617;
}
```

### Dark Mode overrides (clase `.dark`)

```css
.dark {
  --color-background: #020617;
  --color-foreground: #f8fafc;
  --color-card: #0a0e23;
  --color-muted: #1e293b;
  --color-muted-foreground: #94a3b8;
  --color-border: #1e293b;
  --color-primary: #7389f2;          /* Más brillante para contraste en oscuro */
  --color-primary-foreground: #020617;
  --color-accent: #2c251a;
  --color-accent-foreground: #d8cbaa;
  --color-surface: #0f172a;
  --color-surface-foreground: #f8fafc;
}
```

### Tabla de uso por contexto

| Contexto | Clase correcta |
|---|---|
| Fondo de página | `bg-background` |
| Fondo de tarjeta | `bg-card` |
| Fondo de input / button ghost | `bg-secondary` |
| Fondo hover / accent area | `bg-accent` |
| Texto cuerpo | `text-foreground` |
| Texto secundario / placeholder | `text-muted-foreground` |
| Texto de acento (gold) | `text-accent-foreground` |
| Bordes | `border-border` |
| Focus ring | `ring-primary/30` |
| Precio disponible (stock ok) | `text-success` |
| Stock bajo / advertencia | `text-warning` |
| Errores / eliminar | `text-destructive` / `bg-destructive` |

---

## 3. Tipografía

```css
@theme {
  --font-sans: "Inter", "Raleway", ui-sans-serif, system-ui;
  --font-serif: "Playfair Display", "Lora", Georgia, serif;
}
```

| Categoría | Font | Uso |
|---|---|---|
| Body / UI | `Inter`, `Raleway` | Labels, párrafos, botones |
| Headings editoriales | `Playfair Display`, `Lora` | Títulos de productos, hero banner |

### Escala tipográfica recomendada

```tsx
<h1 className="text-5xl md:text-7xl font-serif font-black tracking-tighter">
<h2 className="text-3xl font-serif font-black">
<h3 className="text-lg font-serif leading-tight">
<p  className="text-sm text-muted-foreground leading-relaxed">
<span className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">
```

---

## 4. Componentes Base

### Card

```tsx
// Card.tsx — base siempre es rounded-2xl + border-border
<Card className="bg-card border-border rounded-2xl shadow-soft" />

// Grid de cards — items-stretch para alturas uniformes
<div className="grid grid-cols-4 gap-6 items-stretch">
  <div className="h-full"><ProductCard /></div>
</div>
```

### Button (variantes)

```tsx
// Primary — Indigo sólido con shadow
<Button>Explorar Ahora</Button>

// Outline — Transparente, borde sutil → pill para CTAs hero y cards
<Button variant="outline" className="rounded-full">Ver detalles</Button>

// Ghost — Sin border, hover con bg-accent
<Button variant="ghost">Cancelar</Button>

// Destructive — Fondo rojo translúcido
<Button variant="destructive">Eliminar</Button>
```

> ⚠️ **No usar `<div>` como botón**. Usar siempre `<Button>` para accesibilidad (focus, keyboard, disabled).

### SearchInput (Focus Ring Correcto)

El ring de foco debe estar en el **wrapper** con el mismo `border-radius` que el input:

```tsx
// ❌ Ring rectangular (bug anterior)
<div className="ring-2 ring-primary/50">  {/* sin border-radius */}
  <input className="rounded-xl" />
</div>

// ✅ Ring redondeado (correcto)
<div className={cn(
  'rounded-xl border',    // ← border-radius aquí
  isFocused && 'ring-2 ring-primary/30 border-primary'
)}>
  <input className="bg-transparent focus:outline-none" />  {/* transparente */}
</div>
```

### Glassmorphism (Modales / Drawers)

```tsx
// Backdrop
<div className="fixed inset-0 bg-neutral-950/60 backdrop-blur-md" />

// Panel glass
<div className="bg-card border border-border rounded-3xl shadow-2xl backdrop-blur-xl" />
```

---

## 5. Motion & Animaciones

Todas las animaciones se definen en `src/shared/lib/animations.ts` y se consumen via `framer-motion`:

```tsx
import { staggerContainer, slideUp, MODAL_SLIDE_UP, BACKDROP_FADE } from "@/shared/lib/animations";

// Grid animado
<m.div variants={staggerContainer} initial="hidden" animate="visible">
  <m.div variants={slideUp} className="h-full">...</m.div>
</m.div>

// Modal
<m.div variants={BACKDROP_FADE} ...>
  <m.div variants={MODAL_SLIDE_UP} ...>
```

### Tokens CSS de animación

```css
--animate-fade-in: fadeIn 0.4s ease-out;
--animate-fade-in-up: fadeInUp 0.5s ease-out;
```

---

## 6. Sombras

```css
shadow-soft     /* Cards en reposo: 0 2px 4px rgba(0,0,0,0.02) */
shadow-premium  /* Cards en hover / cabeceras */
shadow-glass    /* Modales / drawers glassmorphism */
```

---

## 7. Tokens Inexistentes — Lista de Prohibidos

Los siguientes tokens fueron usados incorrectamente en el código y provocaban colores invisibles. **No usar**:

| ❌ Token incorrecto | ✅ Reemplazar por |
|---|---|
| `text-foreground-muted` | `text-muted-foreground` |
| `text-foreground-subtle` | `text-muted-foreground` |
| `bg-surface` | `bg-card` o `bg-background` |
| `bg-slate-900` (hardcode) | `bg-background` |
| `text-slate-500` (hardcode) | `text-muted-foreground` |
| `border-slate-200` (hardcode) | `border-border` |
| `text-amber-600` (hardcode) | `text-primary` |
| `text-green-600` (hardcode) | `text-success` |

---

_Documento reescrito: 2026-03-13 | Reemplaza versión con paleta Amber (obsoleta)_
