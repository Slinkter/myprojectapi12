# Guía de Estilos y Convenciones CSS (BEM)

Este proyecto utiliza la metodología **BEM** (Block, Element, Modifier) combinada con **Tailwind CSS** a través de `@apply` en `index.css`.

## 1. Principios Básicos

-   **Bloque**: Componente independiente funcionalmente.
-   **Elemento**: Parte de un bloque que no puede usarse sola.
-   **Modificador**: Variación en apariencia, estado o comportamiento.

### Sintaxis

```css
.bloque {
}
.bloque__elemento {
}
.bloque--modificador {
}
```

## 2. Implementación en este proyecto

### Regla de Oro

**NUNCA** escribir clases de utilidad de Tailwind (`flex`, `text-center`, `mt-4`) directamente en el JSX de los componentes principales.
**SIEMPRE** crear una clase BEM en `index.css` y usar `@apply`.

### Ejemplo Incorrecto (JSX)

```jsx
// ❌ No hacer esto
<div className="flex justify-center items-center h-screen bg-gray-100">
    <h1 className="text-2xl font-bold text-blue-500">Título</h1>
</div>
```

### Ejemplo Correcto (JSX + CSS)

**En `Component.jsx`:**

```jsx
// ✅ Hacer esto
<div className="hero-banner">
    <h1 className="hero-banner__title">Título</h1>
</div>
```

**En `index.css`:**

```css
.hero-banner {
    @apply flex justify-center items-center h-screen bg-gray-100;
}

.hero-banner__title {
    @apply text-2xl font-bold text-blue-500;
}
```

## 3. Estructura de Clases Existentes

### Home (`.home`)

-   `.home__header`: Contenedor del título y subtítulo principal.
-   `.home__title`: Título principal H1.
-   `.home__subtitle`: Subtítulo descriptivo.
-   `.home__error`: Mensajes de error.
-   `.home__empty`: Mensaje de estado vacío.
-   `.home__pagination`: Contenedor de botones de "Ver más".

### Product Card (`.product-card`)

-   `.product-card__header`: Cabecera con imagen.
-   `.product-card__body`: Cuerpo con título y descripción.
-   `.product-card__footer`: Pie con precio y acciones.
-   `.product-card__price`: Precio destacado.
-   `.product-card__out-of-stock`: Indicador de falta de stock.

### Cart (`.cart-drawer`)

-   `.cart-drawer__header`: Encabezado del drawer.
-   `.cart-drawer__item`: Elemento individual del carrito.
-   `.cart-drawer__total-row`: Fila de totales.
-   `.cart-drawer__button`: Botones de acción (Checkout/Limpiar).

## 4. Convenciones de Nombres

-   Usar **kebab-case** para todos los nombres de clases.
-   Nombres semánticos en inglés (`product-card`, `checkout-form`).
-   Evitar abreviaciones oscuras (`btn`, `nav` son aceptables por ser estándar).

## 5. Mantenimiento

Al crear un nuevo componente:

1. Definir el nombre del bloque.
2. Identificar sus elementos.
3. Escribir las clases en `index.css` usando `@apply`.
4. Usar las clases en el JSX.
