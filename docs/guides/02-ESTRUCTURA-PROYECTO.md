# 📂 Estructura del Proyecto - Explicado Paso a Paso

En esta guía te explico cómo está organizado el código. Piensa en esto como el "mapa" del proyecto.

---

## 🎯 ¿Por qué es importante entender la estructura?

Cuando trabajas en un proyecto real, no puedes poner todo en un solo archivo. Imagina tener 10,000 líneas de código en un archivo... ¡sería un caos!

Por eso dividimos el código en **carpetas organizadas**. Así:
- Es más fácil encontrar lo que buscas
- Puedes trabajar en equipo sin pisarte
- El código está ordenado y limpio

---

## 🏠 La estructura principal

```
src/
├── features/          ← LAS FUNCIONALIDADES (lo más importante)
├── components/       ← COMPONENTES REUTILIZABLES
├── pages/            ← PÁGINAS QUE EL USUARIO VE
├── app/              ← CONFIGURACIÓN PRINCIPAL
├── shared/           ← CÓDIGO COMPARTIDO
└── lib/              ← HERRAMIENTAS UTILITARIAS
```

Vamos a ver cada uno en detalle...

---

## 📦 Features (Funcionalidades)

Aquí están las **características** de nuestra tienda. Cada feature es como un "módulo" independiente.

### Estructura de una feature

```
features/
└── products/                    ← Ejemplo: la sección de productos
    ├── domain/                  ← Las "reglas del negocio"
    │   ├── productTypes.ts      ← ¿Qué es un producto?
    │   └── stockUtils.ts        ← Lógica del inventario
    ├── application/             ← La "lógica" de la aplicación
    │   ├── useProducts.ts       ← Hook para obtener productos
    │   └── types.ts             ← Tipos específicos
    ├── infrastructure/          ← Conexión con el "mundo exterior"
    │   └── productsApi.ts       ← Llamadas al servidor
    └── presentation/            ← Lo que el usuario VE
        ├── ProductCard.tsx      ← Tarjeta de producto
        ├── ProductGrid.tsx      ← Grilla de productos
        └── ProductDetailModal.tsx ← Ventana de detalles
```

### ¿Qué son estas capas?

| Carpeta | ¿Qué hace? | Ejemplo |
|---------|------------|---------|
| **domain** | Define qué es cada cosa | "Un producto tiene nombre, precio, imagen..." |
| **application** | La lógica de negocio | "Si el stock es 0, no se puede comprar" |
| **infrastructure** | Comunicación externa | "Pedir productos al servidor" |
| **presentation** | Lo que se ve en pantalla | "Mostrar una tarjeta con la imagen del producto" |

> 💡 **Nota**: Esta estructura se llama "Clean Architecture" o "Arquitectura Limpia". Es un estándar profesional.

---

## 🧩 Components (Componentes)

Aquí van piezas **reutilizables** de la interfaz. Un componente es como un "bloque de Lego" que puedes usar en muchos lugares.

```
components/
├── ui/                    ← Componentes "básicos"
│   ├── button.tsx         ← Un botón
│   ├── input.tsx          ← Un campo de texto
│   ├── card.tsx           ← Una tarjeta
│   └── dialog.tsx         ← Una ventana modal
└── common/                ← Componentes "comunes"
    ├── Layout.tsx         ← El diseño general de la página
    ├── Navbar.tsx         ← La barra de navegación
    ├── Loader.tsx         ← El indicador de carga
    └── ErrorBoundary.tsx  ← Manejo de errores
```

### ¿Cuál es la diferencia?

| Tipo | Descripción |
|------|-------------|
| **ui** | Son los bloques más básicos. Un Button siempre se ve igual, sin importar dónde lo uses. |
| **common** | Son componentes más grandes que pueden tener lógica. El Navbar necesita saber cuántas cosas hay en el carrito. |

---

## 📄 Pages (Páginas)

Las páginas son lo que el usuario ve cuando entra a una URL.

```
pages/
├── Home.tsx           ← La página de inicio (localhost:5173/)
└── ...               ← Otras páginas
```

Normalmente, una página es una combinación de:
1. Un **Layout** (el diseño base)
2. **Componentes** (las piezas)
3. **Features** (las funcionalidades)

---

## ⚙️ App (Configuración)

Aquí está la configuración general de la aplicación:

```
app/
├── api/
│   └── apiClient.ts        ← Cliente HTTP (para hacer peticiones)
├── config/
│   └── queryClient.ts     ← Configuración de TanStack Query
└── routing/
    └── AppRouter.tsx      ← Las rutas de la aplicación
```

No necesitas tocar estos archivos frecuentemente. Son como el "motor" del coche.

---

## 🔧 Shared (Compartido)

Código que se usa en varias partes del proyecto:

```
shared/
├── api/                   ← Funciones para pedir datos
├── constants/            ← Constantes (texto fijo)
├── lib/                  ← Funciones utilities
│   ├── utils.ts          ← Funciones auxiliares (clases CSS)
│   └── stockUtils.ts     ← Lógica de inventario
└── ui/                   ← Componentes UI compartidos
```

---

## 🛠️ Lib (Utilidades)

Aquí van funciones "helpers" que nos facilitan la vida:

```typescript
// src/lib/utils.ts
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combina clases de Tailwind de forma inteligente
 * Si hay clases repetidas, usa la última
 */
export function cn(...inputs: (string | undefined)[]) {
  return twMerge(clsx(inputs));
}
```

Esta función `cn()` se usa **en todas partes** para combinar clases de CSS.

---

## 🎨 ¿Cómo se conecta todo?

Imagina que el usuario entra a la página de productos:

```
1. AppRouter decide qué página mostrar
   ↓
2. La página (Home.tsx) se carga
   ↓
3. Usa el hook useProducts para pedir datos
   ↓
4. useProducts llama a productsApi (infraestructura)
   ↓
5. productsApi hace la petición HTTP al servidor
   ↓
6. Los datos vuelven... y se muestran en ProductGrid
   ↓
7. ProductGrid usa ProductCard para cada producto
   ↓
8. ProductCard usa componentes UI (Button, Card, etc.)
```

¡Cada parte tiene su responsabilidad!

---

## 📋 Resumen visual

```
┌─────────────────────────────────────────────┐
│                   PÁGINA                     │
│              (pages/Home.tsx)                │
└──────────────────┬──────────────────────────┘
                   │
        ┌──────────┴──────────┐
        ▼                     ▼
┌───────────────┐    ┌─────────────────┐
│  COMPONENTES  │    │    FEATURES     │
│  (components) │    │   (products)    │
└───────┬───────┘    └────────┬────────┘
        │                     │
        │            ┌────────┼────────┐
        ▼            ▼        ▼        ▼
     ┌──────┐    ┌───────┐ ┌──────┐ ┌────────┐
     │ ui/  │    │domain │ │ app  │ │ infra  │
     └──────┘    └───────┘ └──────┘ └────────┘
```

---

## ✅ Checklist de verificación

- [ ] Entiendo qué son las **features**
- [ ] Sé dónde van los **componentes**
- [ ] Conozco la diferencia entre **ui** y **common**
- [ ] Sé que **domain** define las "reglas del negocio"

---

## ❓ Ejercicio para practicar

Busca en el proyecto:
1. Un archivo en `features/cart/` - ¿Qué hace?
2. Un componente en `components/ui/` - ¿Cómo se usa?
3. Un archivo en `shared/lib/` - ¿Qué función tiene?

---

## 🎯 Siguiente paso

Ahora que conoces la estructura, aprende a agregar nuevas funcionalidades:

👉 **[03-COMO-AGREGAR-FEATURE.md](03-COMO-AGREGAR-FEATURE.md)**
