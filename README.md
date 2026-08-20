# 🛍️ MyProjectAPI12

> **Plataforma de comercio electrónico de nivel empresarial** construida con React 18, TypeScript 5.9, Firebase v12 y Tailwind CSS v4. Diseñada para Alta Gerencia con arquitectura limpia (FSD + Clean Architecture), 5 patrones de diseño GoF, optimización algorítmica Big-O y excelencia de código certificada.

[![Build](https://img.shields.io/badge/build-exitoso-brightgreen)](https://github.com/Slinkter/myprojectapi12/actions)
[![React Doctor](https://img.shields.io/badge/react--doctor-97%2F100-brightgreen)](https://react.doctor)
[![ESLint](https://img.shields.io/badge/eslint-0%20errores-brightgreen)](https://eslint.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react&logoColor=white)](https://react.dev)
[![Firebase](https://img.shields.io/badge/Firebase-v12-FFCA28?logo=firebase&logoColor=black)](https://firebase.google.com)
[![Tailwind](https://img.shields.io/badge/Tailwind-v4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![License](https://img.shields.io/badge/licencia-MIT-green)](LICENSE)

---

## 📊 Métricas de Calidad — Sprint v1.3.0

| Métrica | Resultado | Objetivo | Estado |
| :--- | :---: | :---: | :---: |
| React Doctor (Salud del código React) | **97 / 100** | ≥ 90 / 100 | ✅ Superado |
| ESLint — Errores | **0** | 0 | ✅ |
| ESLint — Warnings | **0** | 0 | ✅ |
| TypeScript — Errores de tipos | **0** | 0 | ✅ |
| Build de producción | **✅ Exitoso** | Exitoso | ✅ |
| Cobertura de JSDoc en español | **100%** | 100% | ✅ |
| Patrones de diseño GoF implementados | **5 / 5** | 5 | ✅ |
| Accesibilidad WCAG 2.1 AA | **Cumple** | Cumple | ✅ |

---

## 🏗️ Arquitectura — Feature-Sliced Design (FSD) + Clean Architecture

```
src/
├── app/            ← Providers globales, enrutador y configuración
├── entities/       ← Tipos de dominio puros (product, cart-item, order)
├── features/       ← Módulos funcionales desacoplados y auto-contenidos
│   ├── auth/       ← Autenticación Firebase + roles
│   ├── cart/       ← Estado y acciones del carrito (CartState / CartActions)
│   ├── checkout/   ← CheckoutFacade + Estrategias de pago y descuento
│   ├── orders/     ← Historial de pedidos y tracking en tiempo real
│   ├── products/   ← Repositorio de productos + paginación infinita
│   ├── theme/      ← Selector de temas (claro/oscuro) con persistencia
│   └── users/      ← Gestión de perfiles y roles de usuario (admin)
├── pages/          ← Composición de features por ruta (Home, CheckoutPage, FAQ, Orders, etc.)
├── shared/         ← UI atómica, hooks, EventBus, firebase lib
└── widgets/        ← Navbar, CartDrawer (widgets compuestos)
```

### Patrones de Diseño Implementados (GoF)

| Patrón | Ubicación | Beneficio |
| :--- | :--- | :--- |
| **Repository** | `features/*/domain/repositories/` | Desacopla dominio de Firebase/API |
| **Strategy** | `features/checkout/domain/strategies/` | Intercambia métodos de pago y descuento |
| **Observer/EventBus** | `shared/infrastructure/eventBus.ts` | Comunicación desacoplada entre features |
| **Factory** | `features/*/domain/factories/` | Construcción normalizada de entidades |
| **Facade** | `features/checkout/application/CheckoutFacade.ts` | API simple para flujo de checkout complejo |

---

## 📖 1. ¿Qué es MyProjectAPI12 y cómo funciona por dentro?

MyProjectAPI12 es una **SPA** (_Single Page Application_ — aplicación de una sola página). A diferencia de las páginas web tradicionales donde cada clic pide un HTML nuevo al servidor, aquí **todo el código se descarga una sola vez** y la página se re-pinta sola en el navegador.

**Flujo de una SPA:**

```
1. El usuario escribe la URL → el servidor envía index.html + JS
2. El navegador ejecuta React → React construye el DOM virtual
3. El usuario hace clic en "Carrito" → React actualiza SOLO la parte que cambió
4. Nunca se recarga la página entera
```

**¿Qué es React exactamente?**

React es una librería que organiza la interfaz en **componentes**. Un componente es una función que devuelve HTML (JSX). Ejemplo:

```jsx
function TarjetaProducto({ titulo, precio }) {
    return (
        <div className="tarjeta">
            <h2>{titulo}</h2>
            <p>${precio}</p>
        </div>
    );
}
```

Cada componente tiene su propio **estado** (state) y **propiedades** (props). Cuando el estado cambia, React vuelve a pintar solo ese componente sin tocar el resto.

**La app se conecta a DummyJSON**, una API pública que devuelve productos falsos (como si fuera una base de datos de prueba). Usa `fetch` por debajo, pero en vez de llamar a `fetch` directamente, usa **TanStack Query** que guarda los resultados en caché para no pedirlos dos veces. Adicionalmente, se integra con **Firebase** para gestionar el estado de autenticación y persistir de forma distribuida las órdenes generadas.

### 📝 Resumen Cornell

| Cue (Pregunta clave)          | Notes (Respuesta)                                         |
| ----------------------------- | --------------------------------------------------------- |
| ¿Qué tipo de app es?          | SPA — una sola página que se re-pinta sola                |
| ¿Qué hace React?              | Divide la pantalla en componentes, cada uno con su estado |
| ¿De dónde saca los productos? | De DummyJSON (API pública de pruebas) vía TanStack Query  |
| ¿Qué es un componente?        | Una función que devuelve JSX (HTML escrito en JavaScript) |

### ❓ Preguntas y Respuestas

**P: ¿Por qué se llama SPA?**  
R: Porque solo carga UNA página HTML (`index.html`). Todo lo demás lo hace React cambiando partes de esa página sin recargar.

**P: ¿Qué diferencia hay entre una SPA y una página normal?**  
R: Una página normal pide un HTML nuevo al servidor cada vez que haces clic. Una SPA cambia el contenido sola sin molestar al servidor.

**P: ¿Qué pasa si no tengo internet?**  
R: La app no cargará contenido nuevo porque depende de DummyJSON y Firebase. Pero TanStack Query guarda datos en caché, así que si ya visitaste una página, la muestra aunque estés sin conexión (hasta que cierres el navegador).

**P: ¿Por qué no usamos `fetch` directamente?**  
R: Porque TanStack Query hace cosas extras: guarda en caché, reintenta si falla, actualiza cuando cambia la página, y evita pedir lo mismo dos veces.

---

## 🚀 2. ¿Cómo bajo el proyecto y lo enciendo?

Antes de empezar, necesitas tener instalados **Node.js (versión 18 o superior)** y **pnpm (versión 11 recomendada)**.

### Instrucciones de Inicio Rápido

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/Slinkter/myprojectapi12.git
   cd myprojectapi12
   ```

2. **Configurar variables de entorno:**
   Crea un archivo `.env` en la raíz del proyecto copiando el archivo de ejemplo:
   ```bash
   cp .env.example .env
   ```
   > [!IMPORTANT]
   > Asegúrate de rellenar las credenciales de Firebase en el archivo `.env` (`VITE_FIREBASE_API_KEY`, etc.) para asegurar el correcto funcionamiento de los módulos de autenticación y pedidos.

3. **Instalar dependencias:**
   ```bash
   pnpm install --no-frozen-lockfile
   ```

4. **Iniciar servidor de desarrollo:**
   ```bash
   pnpm dev
   ```
   La aplicación se servirá localmente en `http://localhost:5173`.

### 📝 Resumen Cornell

| Cue                       | Notes                                                                           |
| ------------------------- | ------------------------------------------------------------------------------- |
| ¿Qué es Node.js?          | Un programa que corre JavaScript fuera del navegador                            |
| ¿Qué es pnpm?             | Un instalador automático de librerías JS súper rápido y eficiente               |
| ¿Qué hace `pnpm install`? | Descarga todas las dependencias del proyecto especificadas en `package.json`     |
| ¿Qué es Vite?             | Herramienta de compilación rápida que sirve los archivos y soporta HMR           |
| ¿Qué es HMR?              | Hot Module Replacement — los cambios se reflejan al instante sin recargar la pág.|

---

## 🏗️ 3. ¿Cómo se conectan todas las piezas de la app?

La aplicación se estructura como un pastel de capas. En React, la inyección global de dependencias se realiza mediante **providers**. Un provider es un componente que envuelve a otros y les comparte información de contexto.

**Cadena completa de providers (de afuera hacia adentro):**

```
index.html
  └── main.tsx — renderiza <App /> dentro del div#root
        └── App.tsx — envuelve todo en los siguientes providers ordenados:
              ├── QueryClientProvider  ← Datos e integraciones de internet (caché)
              ├── ThemeProvider        ← Configuración visual del tema (modo claro/oscuro)
              ├── AuthProvider         ← Control del estado de autenticación de usuarios de Firebase
              ├── CartProvider         ← Control y estado reactivo de ítems en el carrito
              ├── BrowserRouter        ← Manejo dinámico de rutas e historial
              ├── LazyMotion           ← Framework optimizado de animaciones (Framer Motion)
              ├── ErrorBoundary        ← Capturador de excepciones imprevistas
              ├── Layout               ← Provee el Navbar global y estructura del viewport
              └── AppRouter            ← Resuelve qué componente de página renderizar
                    └── ReactQueryDevtools  ← Panel de desarrollo de TanStack Query
```

### 📝 Resumen Cornell

| Cue                                  | Notes                                                                |
| ------------------------------------ | -------------------------------------------------------------------- |
| ¿Qué es un provider?                 | Un componente que envuelve a otros y les comparte datos contextuales  |
| ¿Quién maneja los datos de internet? | QueryClientProvider (TanStack Query)                                 |
| ¿Quién maneja el tema?               | ThemeProvider (Context API + localStorage)                           |
| ¿Quién maneja la sesión de usuario?  | AuthProvider (Firebase Authentication)                               |
| ¿Quién maneja el carrito?            | CartProvider (Context API + useReducer + localStorage)               |
| ¿Quién maneja las rutas?             | BrowserRouter + AppRouter                                            |

---

## ✨ 4. ¿Qué funciones tiene la tienda?

### 🛒 Carrito de compras
El carrito es un **contexto global**. Cualquier componente puede leerlo o modificarlo de forma limpia a través de `useCart`.
- `CartContext` guarda: `items[]`, `totalPrice`, `freeShippingThreshold`, `discount`.
- `useReducer` procesa acciones de forma inmutable: `ADD_ITEM`, `REMOVE_ITEM`, `UPDATE_QUANTITY`, `CLEAR_CART`, `APPLY_DISCOUNT`.
- Se auto-persiste en el almacenamiento local (`localStorage`) en cada actualización de estado.

### 🔐 Autenticación y Perfil
Integrado de manera nativa con **Firebase Auth**, permite el registro, inicio de sesión (email/password) y gestión dinámica de roles (usuarios finales y administradores) mediante `AuthProvider`.

### 📦 Historial y Pedidos en Tiempo Real
Permite a los usuarios realizar pedidos que se persisten y se actualizan en tiempo real mediante observables, integrando pantallas dedicadas para el seguimiento de órdenes (`/orders`) y panel de control del administrador (`/admin`).

### 🌙 Modo oscuro / claro
Aplica de forma global modificando dinámicamente el atributo `data-theme` en la etiqueta de nivel raíz `<html>`, sincronizando variables de diseño CSS nativas.

### 🎞️ Animaciones optimizadas
Impulsadas por **Framer Motion** de forma diferida (`LazyMotion` de bajo peso). Incluye transiciones de página sutiles, menús deslizables fluidos, y retroalimentación interactiva en botones.

### ♿ Accesibilidad (WCAG 2.1 AA)
La interfaz soporta control total por teclado, navegación semántica, focus trapping para componentes modales/carrito y respeto a configuraciones de movimiento reducido en el sistema operativo.

---

## 🎮 5. ¿Qué hace cada comando de la terminal?

Todos los scripts ejecutables están centralizados y optimizados en `package.json`:

| Comando | Acción |
| :--- | :--- |
| `pnpm dev` | Levanta el servidor de desarrollo en Vite localmente. |
| `pnpm build` | Compila, optimiza y minimiza el código a código JS estático en `dist/`. |
| `pnpm type-check` | Ejecuta el validador de tipos de TypeScript sin emitir código compilado. |
| `pnpm lint` | Analiza estáticamente el código mediante ESLint con un tope estricto de `--max-warnings 2`. |
| `pnpm preview` | Sirve de forma local el directorio de distribución compilado (`dist/`) para testing previo. |
| `pnpm deploy` | Compila (`pnpm build`) y publica la aplicación estática en GitHub Pages. |
| `pnpm deploy:firebase` | Compila (`pnpm build`) y despliega la aplicación de forma segura en Firebase Hosting. |
| `pnpm py` | Compila, valida tipos de TypeScript y levanta un servidor de pruebas rápido en el puerto `5001` vía Python. |

> [!NOTE]
> El hook de pre-commit (`Husky`) ejecuta de forma obligatoria `pnpm lint && pnpm type-check` antes de permitir guardar cambios a nivel local en Git.

---

## 📁 6. ¿Por qué el código está dividido así (FSD)?

El proyecto utiliza **Feature-Sliced Design (FSD)**, una metodología arquitectónica avanzada que previene el acoplamiento y distribuye el proyecto en capas bien estructuradas:

```
       🔝 app/        ← Configuración global de la app (providers, router, estilos globales)
          📄 pages/    ← Páginas completas formadas por la composición de widgets y features
             🧩 features/ ← Funcionalidades completas de negocio auto-contenidas (cart, checkout, etc.)
                🏢 entities/ ← Modelos y tipos de negocio puros (product, order, cart-item)
                   🧰 shared/ ← Bloques de construcción reutilizables y utilidades sin lógica de negocio
```

### Reglas estrictas de Dependencias en FSD

1. **Jerarquía descendente:** Una capa solo puede importar de capas inferiores a ella. Por ejemplo, `features` puede importar de `shared`, pero `shared` jamás puede importar de `features`.
2. **Aislamiento horizontal:** Los módulos de la misma capa (por ejemplo, dos features diferentes como `cart` y `auth`) no pueden importarse entre sí directamente. Toda comunicación horizontal debe resolverse mediante delegación de callbacks o a través de contratos en `shared` (como el `EventBus`).

---

## 📚 Documentación adicional

El proyecto cuenta con una rica suite de documentación técnica en la carpeta `docs/`:
- **Arquitectura y Diseño:** `docs/architecture/OVERVIEW.md`
- **Guías Operacionales:** `docs/operations/DEPLOYMENT.md` y `docs/operations/TROUBLESHOOTING.md`
- **Módulos de Estudio Paso a Paso:** Carpeta `docs/study/` con un recorrido interactivo de 13 módulos.

---

## 🤖 Créditos y Autoría

Desarrollado y mantenido por **Luis J Cueva**:
- **GitHub:** [@Slinkter](https://github.com/Slinkter)
- **LinkedIn:** [Luis J Cueva](https://linkedin.com/in/luis-cueva)
