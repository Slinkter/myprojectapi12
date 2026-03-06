# 🛍️ MyProjectAPI12

> SPA de comercio electrónico moderna construida con React, TypeScript y Tailwind CSS v4.

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)](https://github.com/Slinkter/myprojectapi12)
[![TypeScript](https://img.shields.io/badge/TypeScript-100%25-blue)](https://www.typescriptlang.org/)
[![Tests](https://img.shields.io/badge/tests-23%20passing-success)](./src/docs/reports/TESTING_REPORT.md)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

Una aplicación de comercio electrónico lista para producción que muestra patrones modernos de React, integración con TypeScript y principios de arquitectura limpia.

---

## 🏗️ Visualización de Arquitectura (ASCII)

### 1. Diagrama de Montaje de Componentes
Representa cómo se ensambla la aplicación desde el punto de entrada hasta las vistas.

```text
[ index.html ]
      |
[ main.tsx ] <--- (Estilos Globales & Fuentes)
      |
[ App.tsx ] (Root)
      |
      +-- [ QueryClientProvider ] (TanStack Query)
      |         |
      |   [ BrowserRouter ] (React Router 7)
      |         |
      |   [ ThemeProvider ] (Light / Dark Mode)
      |         |
      |   [ CartProvider ] (Estado Global Carrito)
      |         |
      |   [ ProductModalProvider ] (Control de Modales)
      |         |
      |   [ ErrorBoundary ] (Resiliencia UI)
      |         |
      +-- [ Layout.tsx ] (Shell de la App)
                |
          +-----+-----+
          |           |
      [ Navbar ]  [ AppRouter ] (Suspense + Lazy Loading)
                      |
                +-----+-----+-----+
                |           |     |
            [ Home ] [ Checkout ] [ Success ]
```

### 2. Diagrama de Capas y Dependencias (FSD + DDD)
Muestra la jerarquía de comunicación entre las capas del sistema.

```text
+-------------------------------------------------------+
|                 PRESENTATION LAYER                    |
|  (Vistas y UI) -> [Pages] -> [Components] -> [UI]     |
+-----------+-------------------------------------------+
            | (consume)
            v
+-----------+-------------------------------------------+
|                  APPLICATION LAYER                    |
|  (Lógica de App) -> [Hooks] -> [Contexts] -> [State]  |
+-----------+-------------------------------------------+
            | (valida con)
            v
+-----------+-------------------------------------------+
|                    DOMAIN LAYER                       |
|  (Reglas de Negocio) -> [Entities] -> [Validators]    |
+-----------+-------------------------------------------+
            | (obtiene de)
            v
+-----------+-------------------------------------------+
|                INFRASTRUCTURE LAYER                   |
|  (Datos Externos) -> [ApiClient] -> [React Query]     |
+-------------------------------------------------------+
```

### 3. Arquitectura Cliente-Servidor
Interacción entre la SPA y la API externa.

```text
       +-----------------------+           +-----------------------+
       |       CLIENTE         |           |       SERVIDOR        |
       |  (React SPA - Vite)   |           |    (DummyJSON API)    |
       |                       |           |                       |
       |  +-----------------+  |   HTTP    |  +-----------------+  |
       |  |  TanStack Query |<-------------->|   REST Endpoints  |  |
       |  +-----------------+  |   JSON    |  +-----------------+  |
       |          |            |           |          |            |
       |  +-----------------+  |           |  +-----------------+  |
       |  |  UI State (DOM) |  |           |  |   Data Store    |  |
       |  +-----------------+  |           |  +-----------------+  |
       +-----------------------+           +-----------------------+
```

---

## 🧠 Complejidad Algorítmica

Explicación del flujo de datos según la dificultad de implementación:

```text
BAJA COMPLEJIDAD (Gestión de Temas)
[Switch UI] -> [ThemeContext] -> [LocalStorage] -> [Update CSS Variables]

MEDIA COMPLEJIDAD (Lógica de Carrito)
[Add Item] -> [Domain Validation (Stock)] -> [Context Merge] -> [Sync Store]

ALTA COMPLEJIDAD (Scroll Infinito & Paginación)
[Scroll Event] -> [Observer Trigger] -> [React Query Fetch] -> 
   [API Request (limit/skip)] -> [JSON Response] -> 
   [Algorithm: Page Flattening (flatMap)] -> [Virtual DOM Diff] -> [UI Render]
```

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

### Testing

- **Vitest 4.0** - Framework de pruebas unitarias.
- **React Testing Library 16** - Pruebas de componentes.

---

## 📚 Documentación Detallada

- **[Manual Técnico Profesional](./src/docs/engineering/TECHNICAL_MANUAL.md)** - Guía exhaustiva técnica.
- **[Análisis y Explicación del Proyecto](./src/docs/engineering/SYSTEM_BEHAVIOR.md)** - Algoritmos y flujos.
- **[Arquitectura DDD y Capas](./src/docs/architecture/ARCHITECTURE.md)** - Diseño moderno del sistema.
- **[Diagramas UML (Ascii/Mermaid)](./src/docs/architecture/DIAGRAMS.md)** - Secuencias y estructura.

---

## 🧪 Pruebas

```bash
pnpm test          # Ejecutar todos los tests
pnpm test:ui       # Ejecutar tests con interfaz UI
pnpm test:coverage # Generar reporte de cobertura
```

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
