# 🛍️ MyProjectAPI12

> SPA de comercio electrónico moderna construida con React, TypeScript y Tailwind CSS v4.

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)](https://github.com/Slinkter/myprojectapi12)
[![TypeScript](https://img.shields.io/badge/TypeScript-100%25-blue)](https://www.typescriptlang.org/)
[![Tests](https://img.shields.io/badge/tests-23%20passing-success)](./docs/reports/TESTING_REPORT.md)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

Una aplicación de comercio electrónico lista para producción que muestra patrones modernos de React, integración con TypeScript y principios de arquitectura limpia.

---

## ✨ Características

- 🛒 **Carrito de Compras** - Funcionalidad completa con seguridad de tipos de TypeScript.
- 🎨 **Modo Oscuro** - Cambio de tema fluido (Light/Dark).
- 📱 **Diseño Responsivo** - Enfoque mobile-first con Tailwind CSS v4.
- ⚡ **Rendimiento** - Carga optimizada con división de código (Lazy Loading).
- 🧪 **Bien Testeado** - Cobertura del 100% en la capa de dominio.
- 🔒 **Type Safe** - Uso estricto de TypeScript en todo el proyecto.
- ♿ **Accesible** - Etiquetas ARIA y navegación por teclado (Radix UI / Shadcn).

---

## 🚀 Inicio Rápido

### Requisitos Previos

- Node.js >= 18
- pnpm >= 8

### Instalación

```bash
# Clonar el repositorio
git clone https://github.com/Slinkter/myprojectapi12.git
cd myprojectapi12

# Instalar dependencias
pnpm install

# Iniciar servidor de desarrollo
pnpm dev
```

Visita `http://localhost:5173`

---

## 🏗️ Tech Stack

### Core

- **React 18.3** - Librería de UI.
- **TypeScript 5.9** - Tipado estático.
- **Vite 5.4** - Herramienta de compilación rápida.
- **React Router 7** - Enrutamiento dinámico.

### Estilos y UI

- **Tailwind CSS 4.1** - Framework de utilidades CSS-first.
- **Framer Motion 12** - Animaciones fluidas.
- **Shadcn/UI** - Primitivas de componentes accesibles.
- **Sistema CSS Moderno** - Tokens de diseño mediante variables CSS (OKLCH).

### Gestión de Estado

- **TanStack Query v5** - Estado del servidor y fetching de datos.
- **React Context** - Estado global de la interfaz (Carrito, Tema).
- **Custom Hooks** - Lógica de negocio encapsulada.

### Testing

- **Vitest 4.0** - Framework de pruebas unitarias.
- **React Testing Library 16** - Pruebas de componentes.

---

## 📁 Estructura del Proyecto

```
myprojectapi12/
├── src/
│   ├── app/                # Configuraciones globales
│   │   ├── api/            # Cliente de TanStack Query y API base
│   │   ├── config/         # Configuración de la app y proveedores
│   │   └── routing/        # Definiciones de React Router 7
│   │
│   ├── features/           # Módulos basados en dominios (DDD)
│   │   ├── cart/           # Funcionalidad del carrito
│   │   ├── products/       # Catálogo de productos
│   │   ├── checkout/       # Proceso de pago
│   │   └── theme/          # Gestión de temas
│   │
│   ├── components/         # Componentes compartidos
│   │   ├── common/         # Layout y límites de error
│   │   └── ui/             # Primitivas de Shadcn/UI
│   │
│   ├── styles/             # Estilos globales y variables
│   │   ├── variables.css   # Tokens de diseño modernos
│   │   └── index.css       # Configuración de Tailwind 4
│   │
│   └── pages/              # Puntos de entrada de rutas
│
├── docs/                   # Documentación del sistema
└── public/                 # Activos estáticos
```

---

## 📚 Documentación Detallada

- **[Manual Técnico Profesional](./src/docs/TECHNICAL_MANUAL.md)** - Guía exhaustiva de arquitectura, patrones y estándares (Actualizado Feb 2026).
- **[Arquitectura](./src/docs/architecture/ARCHITECTURE.md)** - Diseño del sistema y capas (DDD).
- **[Guía de Estilos](./src/docs/guides/JSDOC_GUIDE.md)** - Estándares de código y JSDoc.
- **[Changelog](./src/docs/CHANGELOG.md)** - Historial de cambios y versiones.

---

## 🧪 Pruebas

```bash
# Ejecutar todos los tests
pnpm test

# Ejecutar tests con interfaz UI
pnpm test:ui

# Generar reporte de cobertura
pnpm test:coverage
```

---

## 🛠️ Scripts Disponibles

| Script            | Descripción                               |
| :---------------- | :---------------------------------------- |
| `pnpm dev`        | Inicia el servidor de desarrollo          |
| `pnpm build`      | Compila para producción                   |
| `pnpm preview`    | Previsualiza la compilación de producción |
| `pnpm lint`       | Ejecuta el linter (ESLint)                |
| `pnpm type-check` | Ejecuta la verificación de tipos de TS    |
| `pnpm deploy`     | Despliega en GitHub Pages                 |

---

## 👨‍💻 Autor

**Luis J Cueva**

- GitHub: [@Slinkter](https://github.com/Slinkter)
- LinkedIn: [Luis J Cueva](https://linkedin.com/in/luis-cueva)

---

<div align="center">
  <p>Hecho con ❤️ por Luis J Cueva</p>
  <p>© 2026 MyProjectAPI12. Todos los derechos reservados.</p>
</div>
