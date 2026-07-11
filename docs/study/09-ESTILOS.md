# 09 — Sistema de Estilos (Tailwind CSS v4)

---

## Enfoque CSS-first

Tailwind v4 introduce un enfoque **CSS-first**. No hay archivo `tailwind.config.js`. La configuración se declara en CSS:

```css
/* src/index.css */
@import "tailwindcss";
```

---

## Tokens de diseño con `@theme`

Define tokens personalizados que luego se usan como clases utility.

```css
@theme {
    --color-primary: #059669;
    --color-primary-hover: #047857;
    --color-accent: #d97706;
    --color-background-light: #f4f6f8;
    --color-background-dark: #0b0c15;

    /* Mapeos semánticos */
    --color-background: var(--background);
    --color-foreground: var(--foreground);
    --color-card: var(--card);
    --color-border: var(--border);
    --color-muted: var(--muted);
}
```

**Uso en componentes:**

```html
<div className="bg-primary text-foreground border-border">
<Button className="bg-primary-hover" />
<span className="text-accent" />
```

---

## Variables CSS semánticas

```css
:root {
    --background: #ffffff;
    --foreground: #0f172a;
    --card: #ffffff;
    --muted: #f1f5f9;
    --border: #e2e8f0;
    --ring: #059669;
}

.dark {
    --background: #0b0c15;
    --foreground: #f8fafc;
    --card: #0f172a;
    --muted: #1e293b;
    --border: #1e293b;
}
```

El body usa transiciones suaves al cambiar de tema:

```css
html, body {
    background-color: var(--background);
    color: var(--foreground);
    transition: background-color 0.2s ease, color 0.2s ease;
}
```

---

## Dark Mode

### Activación

Se usa `@custom-variant` y la clase `.dark` en `<html>`:

```css
@custom-variant dark (&:where(.dark, .dark *));
```

### Control desde ThemeContext

```typescript
// themeStorage.ts
export const applyThemeToDocument = (theme: Theme): void => {
    const root = document.documentElement;
    if (theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
};
```

### Detección de preferencia del sistema

```typescript
export const getStoredTheme = (): Theme => {
    const storedTheme = localStorage.getItem("theme") as Theme | null;
    if (storedTheme) return storedTheme;

    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        return "dark";
    }
    return "light";
};
```

### Uso en componentes

```html
<div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">
<p className="text-slate-500 dark:text-slate-400">
```

---

## Glassmorphism

Clase utilitaria `.glass-panel` definida en `index.css`:

```css
.glass-panel {
    background-color: rgba(255, 255, 255, 0.75);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
}

.dark .glass-panel {
    background-color: rgba(11, 12, 21, 0.75);
    backdrop-filter: blur(12px);
}
```

**Usado en:** `Navbar.tsx` — barra de navegación sticky con efecto glass.

```html
<header className="sticky top-0 z-50 glass-panel border-b border-slate-200 dark:border-slate-800">
```

---

## Tipografía

Fuentes cargadas desde Google Fonts en `index.html`:

```html
<link href="https://fonts.googleapis.com/css2?family=Raleway:wght@300;400;500;600;700;800&family=Lora:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap" rel="stylesheet" />
```

- **Raleway** — Títulos y texto funcional (sans-serif)
- **Lora** — Detalles decorativos (serif itálica)

---

## Responsive Design

Enfoque mobile-first con breakpoints de Tailwind:

| Breakpoint | Prefijo | Descripción |
|------------|---------|-------------|
| `640px` | `sm:` | Móvil landscape |
| `768px` | `md:` | Tablet |
| `1024px` | `lg:` | Desktop |
| `1280px` | `xl:` | Desktop grande |

```html
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
<div className="hidden md:flex"> <!-- visible solo en desktop -->
```

---

## Animaciones globales

```css
html, body {
    transition: background-color 0.2s ease, color 0.2s ease;
}
```

Clases de animación de componentes:

| Clase/Patrón | Componente |
|--------------|------------|
| `animate-spin` | Loader |
| `animate-pulse` | LazyImage placeholder |
| `transition-all duration-200` | Botones, enlaces |
| `transition-colors` | Hover en items |

---

## `cn()` utility

Combina `clsx` + `tailwind-merge` para composición de clases sin conflictos.

```typescript
// Uso típico:
className={cn(
    "base-class",
    variant === "primary" && "bg-primary text-white",
    className // clases externas (sobrescriben)
)}
```

---

## Content Security Policy

En `index.html`:

```html
<meta http-equiv="Content-Security-Policy" content="
    default-src 'self';
    script-src 'self' 'unsafe-inline' 'unsafe-eval';
    style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
    font-src 'self' https://fonts.gstatic.com;
    img-src 'self' data: https:;
    connect-src 'self' https://dummyjson.com;">
```

Esto restringe:
- **Scripts** solo desde el mismo origen (con excepción para inline)
- **Estilos** permiten Google Fonts
- **Fuentes** solo desde `fonts.gstatic.com`
- **Imágenes** desde cualquier HTTPS
- **Conexiones** solo a `dummyjson.com`

---

## Enlaces relacionados

- [03-TECNOLOGIAS.md](./03-TECNOLOGIAS.md) — Stack tecnológico
- [08-COMPONENTES-UI.md](./08-COMPONENTES-UI.md) — Componentes que usan estos estilos
- [GLOSARIO.md](./GLOSARIO.md) — Términos: design tokens, glassmorphism, CSP
