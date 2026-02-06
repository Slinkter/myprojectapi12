# Glosario Técnico del Proyecto

Este documento sirve como un diccionario de referencia para los términos, tecnologías y conceptos clave utilizados en este proyecto.

---

## A

### Arquitectura Limpia (Clean Architecture)

Una filosofía de diseño de software que separa el código en capas (Presentación, Aplicación, Dominio, Infraestructura) para reducir el acoplamiento y aumentar la mantenibilidad. En este proyecto, se adapta separando la **UI (Presentación)**, los **Hooks (Aplicación)** y los **Servicios (Infraestructura)**.

### `@apply`

Una directiva de Tailwind CSS que permite "extraer" clases de utilidad de tu HTML y componerlas en una nueva clase semántica dentro de un archivo CSS. Es la base de nuestra estrategia de estilos.

### API (Application Programming Interface)

Un contrato que permite a dos piezas de software comunicarse. En nuestro caso, es la URL (`dummyjson.com`) a la que nuestro frontend le pide datos de productos.

## B

### BEM (Block, Element, Modifier)

Una metodología para nombrar clases de CSS de manera que sean semánticas, mantenibles y se eviten colisiones de nombres. La sintaxis es `.bloque__elemento--modificador`.

-   **Ejemplo:** `.product-card__title--highlighted`

## C

### CI/CD (Integración Continua / Despliegue Continuo)

Prácticas de DevOps para automatizar las fases de construcción, prueba y despliegue del software. En este proyecto, se implementa con **GitHub Actions**.

### CSR (Client-Side Rendering)

Renderizado del Lado del Cliente. El navegador descarga un archivo JavaScript mínimo y es este el que construye y renderiza la página completa. Es el modelo que usan las **SPAs**.

### Componente

En React, un componente es una pieza de UI reutilizable e independiente (una función o clase que devuelve JSX).

### Context API

Una herramienta de React para compartir estado entre componentes sin tener que pasar `props` manualmente a través de todos los niveles del árbol de componentes (evita el "prop drilling").

### Code Splitting (División de Código)

La práctica de dividir el código de la aplicación en "trozos" (chunks) más pequeños que se cargan bajo demanda. Se implementa en nuestro router con `React.lazy`.

## F

### Feature-Based Architecture

Arquitectura Basada en Funcionalidades. Una estrategia para estructurar el código donde los archivos se agrupan por dominio de negocio (`products`, `cart`) en lugar de por tipo (`components`, `hooks`). Es la arquitectura principal de este proyecto.

## G

### Git

Un sistema de control de versiones distribuido. Permite rastrear cambios en el código, colaborar en equipo y revertir a estados anteriores.

### GitHub Actions

Una plataforma de automatización integrada en GitHub que nos permite implementar flujos de **CI/CD**.

## H

### Hook

Una función especial de React que te permite "engancharte" a sus características. Los más comunes son `useState` (para añadir estado) y `useEffect` (para efectos secundarios). Los "Custom Hooks" (`useProducts`) son hooks creados por nosotros para reutilizar lógica.

## J

### JSX (JavaScript XML)

Una extensión de la sintaxis de JavaScript que permite escribir una estructura similar a HTML dentro del código JavaScript. Es lo que usan los componentes de React para definir la UI.

## L

### Lazy Loading (Carga Perezosa)

Una técnica de optimización que retrasa la carga o inicialización de un recurso hasta que es realmente necesario. En nuestro proyecto, se usa para cargar la página de `Checkout` solo cuando el usuario navega a ella.

### Linter (ESLint)

Una herramienta que analiza el código fuente para detectar errores programáticos, bugs, errores de estilo y construcciones sospechosas.

## N

### Neumorfismo (Neumorphism)

Un estilo de diseño de UI que busca crear una apariencia "suave", donde los elementos parecen emerger del fondo. Se caracteriza por el uso sutil de luces y sombras para definir los componentes. Es el sistema de diseño principal de este proyecto.

### `node_modules`

La carpeta donde `npm` o `pnpm` instalan todas las dependencias (librerías externas) de un proyecto. **Nunca** se debe subir a Git.

## P

### `package.json`

El "manifiesto" de un proyecto Node.js. Contiene los metadatos del proyecto y la lista de dependencias necesarias.

### `pnpm`

Un gestor de paquetes para Node.js, alternativa a `npm`. Es conocido por ser más rápido y eficiente en el uso del espacio en disco.

### Props (Propiedades)

La forma en que los componentes de React se comunican entre sí, pasando datos de un componente padre a un componente hijo. Son de solo lectura.

### PWA (Progressive Web App)

Una aplicación web que utiliza tecnologías modernas para ofrecer una experiencia similar a la de una aplicación nativa, incluyendo la capacidad de funcionar offline y ser "instalable".

## S

### SPA (Single Page Application)

Aplicación de Página Única. Una aplicación web que carga una sola página HTML y luego actualiza dinámicamente el contenido a medida que el usuario interactúa con ella, sin recargar la página completa. Este proyecto es una SPA.

### Estado (State)

Datos que un componente mantiene y que pueden cambiar con el tiempo. Cuando el estado de un componente cambia, React lo vuelve a renderizar.

## T

### Tailwind CSS

Un framework de CSS "utility-first" que proporciona clases de bajo nivel para construir diseños directamente en el marcado, sin escribir CSS personalizado.

## V

### Vite

Una herramienta de construcción de frontend moderna y extremadamente rápida que sirve como servidor de desarrollo y empaquetador para producción.
