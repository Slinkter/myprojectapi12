# 📖 Manual Técnico de Software: MyProjectAPI12

Este documento proporciona una visión profunda y detallada de la arquitectura, decisiones de diseño y estándares técnicos del proyecto `MyProjectAPI12`.

---

## 1. 🏗️ Arquitectura del Sistema

El proyecto implementa una **Arquitectura Basada en Features (Feature-Based Architecture)** con influencias de **Domain-Driven Design (DDD)**. Esta estructura permite un escalado horizontal fácil y mantiene el código desacoplado.

### Capas de la Aplicación

Cada feature (módulo) se divide en las siguientes capas:

1.  **Domain (Dominio)**: Definiciones de modelos de datos, interfaces y lógica de negocio pura.
    - Ejemplo: `src/features/products/application/types.ts`
2.  **Application (Aplicación)**: Custom hooks y lógica de orquestación de datos. Maneja el estado y los efectos.
    - Ejemplo: `src/features/products/application/useProducts.ts`
3.  **Infrastructure (Infraestructura)**: Servicios que interactúan con el exterior (API clients).
    - Ejemplo: `src/features/products/infrastructure/productsApi.ts`
4.  **Presentation (Presentación)**: Componentes de React que renderizan la UI. Se subdivide en componentes específicos de la feature.
    - Ejemplo: `src/features/products/presentation/ProductList.tsx`

---

## 2. 🧩 Patrones de Diseño Core

### Paginación Infinita (TanStack Query)

Se utiliza `useInfiniteQuery` para gestionar la carga progresiva de productos.

- **Estrategia**: Se calcula la siguiente página basándose en el total de elementos descargados vs. el total disponible en el servidor.
- **Optimización**: Se utiliza `flatMap` para convertir las páginas de la API en una lista plana para la UI.

### Context API para Estado de Feature

Para evitar el _Prop Drilling_, el estado de modales y carritos se gestiona mediante contextos locales a la feature.

- **Seguridad**: Se implementa un patrón de "Safe Hook" que valida si el contexto está dentro de su respectivo `Provider`.

### Componentes de Presentación vs. Contenedores

Aunque no usamos la división estricta, los componentes como `ProductList` actúan como contenedores (lógica de estados de error/carga), mientras que `ProductCard` es puramente presentacional.

---

## 3. 🛠️ Estándares de Código y Refactorización

Recientemente (Febrero 2024), el proyecto pasó por una fase de refactorización profesional para cumplir con:

### DRY (Don't Repeat Yourself)

- **Lógica de Stock**: Centralizada en `stockUtils.ts`. Ya no existen comparaciones manuales de stock en los componentes.
- **Componentes UI**: Los controles de cantidad y botones de paginación se extrajeron a componentes reutilizables (`QuantityControl.tsx`, `ButtonMore.tsx`).

### SOLID

- **S (Single Responsibility)**: Se dividió el `ProductDetailModal` para separar la lógica de UI de la lógica de negocio.
- **I (Interface Segregation)**: Las interfaces de props son específicas para cada componente, evitando pasar objetos gigantes innecesariamente.

### Clean Code

- **Naming**: Se utiliza prefijo `I` para interfaces y nombres descriptivos para funciones.
- **Documentación Inline**: Todo el código crítico cuenta con JSDoc en español.
- **Cero Logs en Producción**: Se eliminaron todos los `console.log` de desarrollo.

---

## 🎨 4. Sistema de Diseño y Estilos

- **Tailwind CSS v4**: Utilizamos la última versión de Tailwind para un sistema de diseño basado en utilidades, con una configuración avanzada que incluye animaciones personalizadas.
- **Radix UI**: Proporciona la base accesible para componentes complejos como Modales (Dialog) y Menús desplegables.
- **Framer Motion**: Implementado para transiciones de alta calidad en modales y hover effects, mejorando la experiencia premium del usuario.

---

## 🔬 5. Pruebas y Calidad

- **Testing**: Se utiliza `Vitest` y `React Testing Library`.
- **Linting**: Reglas estrictas de ESLint para TypeScript y React Refresh.
- **Type-Check**: Verificación estática con `tsc --noEmit` integrada en el pipeline de CI/CD.

---

## 🚀 6. Workflow de Desarrollo

1.  **Instalación**: `pnpm install`
2.  **Desarrollo**: `pnpm dev`
3.  **Verificación**: `pnpm run lint` && `pnpm type-check`
4.  **Pruebas**: `pnpm test`
5.  **Construcción**: `pnpm run build`

---

## 📝 7. Mejoras Recientes (Fases A y B) - Feb 2026

1.  **Limpieza de Infraestructura**: Eliminación de imports de Node en el cliente (browser security).
2.  **Abstracción de UI**: Extracción de componentes internos repetidos a archivos independientes en `features/products/presentation/components/`.
3.  **Unificación Lingüística**: Toda la interfaz de usuario se tradujo al español para garantizar consistencia.
4.  **Optimización Semántica**: Mejora de los estados de carga en el hook de productos para reflejar correctamente la actividad de la red.

---

_Manual generado y actualizado por Antigravity AI._
