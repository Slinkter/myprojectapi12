# 🛍️ NexCommerce — Enterprise Serverless E-Commerce & Admin

[![React](https://img.shields.io/badge/React-18.3-61DAFB?style=flat&logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=flat&logo=typescript)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?style=flat&logo=vite)](https://vitejs.dev)
[![Firebase](https://img.shields.io/badge/Firebase-v12-FFCA28?style=flat&logo=firebase)](https://firebase.google.com)
[![TanStack Query](https://img.shields.io/badge/TanStack_Query-v5-FF4154?style=flat&logo=react-query)](https://tanstack.com/query)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-06B6D4?style=flat&logo=tailwindcss)](https://tailwindcss.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

Plataforma de comercio electrónico de nivel empresarial construida con **React 18**, **TypeScript 5.9**, **Firebase v12 Backend-as-a-Service** y **Tailwind CSS v4**. Diseñada bajo **Clean Architecture** y **Feature-Sliced Design (FSD)**, con patrones de diseño GoF, transacciones ACID para control de inventario y panel administrativo.

---

## 🎯 Características Principales

- **Catálogo y Búsqueda de Productos**: Exploración facetada con filtrado por categorías, rangos de precio y ordenamiento.
- **Transacciones ACID en Firebase**: Gestión de stock y generación de órdenes con consistencia garantizada en Firestore.
- **Panel Administrativo & Métricas**: Gestión de inventario, cambio de roles en vivo (Modo Demo Reclutador: Cliente vs. Admin) e impresión de tickets sanitizados.
- **Autenticación Completa con Firebase Auth**: Registro, inicio de sesión seguro y persistencia de sesión.
- **Tipado Estricto con TypeScript 5.9**: Interfaces completas de dominio eliminando cualquier riesgo de errores de tipo en tiempo de ejecución.
- **Optimización de Caché**: TanStack Query para sincronización de estado remoto y reducción de latencia en peticiones.

---

## 🛠️ Stack Tecnológico

| Herramienta | Rol en el Sistema |
| :--- | :--- |
| **React 18.3** | UI basada en componentes funcionales |
| **TypeScript 5.9** | Tipado estático estricto y contratos de dominio |
| **Vite 5.4** | Bundler de alto rendimiento |
| **Firebase v12** | Autenticación, Firestore Database y Cloud Storage |
| **TanStack Query v5** | Estado asíncrono, mutaciones y caché |
| **Tailwind CSS v4** | Sistema de diseño de última generación |
| **Framer Motion** | Microinteracciones y transiciones |

---

## 🏗️ Arquitectura (FSD + Clean Architecture)

```text
src/
├── app/          # Configuración de Firebase, providers, router y estilos globales
├── pages/        # Vistas completas: Home, Catalog, ProductDetail, Cart, Orders, Admin
├── widgets/      # Bloques autónomos de interfaz (Navbar, Footer, ProductGrid)
├── features/     # Casos de uso (auth, cart, checkout, admin-inventory)
├── entities/     # Modelos de dominio (Product, Order, User) y adaptadores
└── shared/       # UI Kit reutilizable (Button, Modal, Input, Badge), lib y helpers
```

---

## 🚀 Inicio Rápido

### Requisitos Previos
- **Node.js**: v18.0 o superior
- **pnpm**: v9.0 o superior
- **Proyecto de Firebase** (Gratuito)

### Instalación y Ejecución

1. **Instalar dependencias:**
   ```bash
   pnpm install
   ```

2. **Configurar variables de entorno:**
   ```bash
   cp .env.example .env
   ```
   *Consulta [.env.example](.env.example) para la guía paso a paso para configurar tu proyecto en la consola de Firebase.*

3. **Verificación de tipos (TypeScript):**
   ```bash
   pnpm run type-check
   ```

4. **Iniciar en modo desarrollo:**
   ```bash
   pnpm run dev
   ```

5. **Compilar para producción:**
   ```bash
   pnpm run build
   ```

---

## 📄 Licencia

Este proyecto está bajo la Licencia **MIT**. Consulta el archivo `LICENSE` para más información.
