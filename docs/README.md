# 📚 Índice Maestro y Guía de Lectura — MyProjectAPI12

> **¿No sabes por dónde empezar?** Sigue esta guía enumerada paso a paso.  
> Está ordenada cronológicamente desde lo más sencillo (para aprender sin saber nada) hasta los detalles técnicos avanzados.

---

## 🗺️ Mapa de Lectura Sugerido

```
PASO 1: APRENDER DESDE CERO  ──→  PASO 2: ARQUITECTURA
(docs/study/)                     (docs/architecture/)
        │                                 │
        ▼                                 ▼
PASO 3: LAS FUNCIONALIDADES  ──→  PASO 4: INTERFAZ Y COMPONENTES
(docs/features/)                  (docs/components/)
        │                                 │
        ▼                                 ▼
PASO 5: PATRONES Y HOOKS     ──→  PASO 6: COMUNICACIÓN Y API
(docs/patterns/)                  (docs/api/)
        │                                 │
        ▼                                 ▼
PASO 7: INGENIERÍA AVANZADA  ──→  PASO 8: OPERACIONES Y PUBLICACIÓN
(docs/engineering/)               (docs/operations/)
```

---

## 1️⃣ PASO 1: Aprender desde Cero (Carpeta: `docs/study/`)
*Comienza aquí si eres estudiante o acabas de llegar al proyecto.*

| Orden | Documento | ¿Qué aprenderás? |
| :---: | :--- | :--- |
| **1.1** | 🌟 [**Manual Escolar desde Cero**](study/MANUAL_DESDE_CERO.md) | **¡EMPIEZA AQUÍ!** Explicación sencilla con analogías de la vida real (supermercado, LEGOs, carritos). |
| **1.2** | [Prerrequisitos](study/00-PRERREQUISITOS.md) | Qué programas necesitas tener en tu computadora antes de programar. |
| **1.3** | [Inicio Rápido](study/01-INICIO-RAPIDO.md) | Cómo clonar, instalar y encender la tienda en 5 minutos. |
| **1.4** | [Guía de Estudio Completa](study/GUIA_DE_ESTUDIO_COMPLETA.md) | Manual extendido con 14 módulos interactivos. |
| **1.5** | [Glosario de Términos](study/GLOSARIO.md) | Diccionario de palabras técnicas explicadas fácil. |

---

## 2️⃣ PASO 2: Entender la Arquitectura (Carpeta: `docs/architecture/`)
*Para entender cómo se divide el proyecto en capas limpias.*

| Orden | Documento | ¿Qué aprenderás? |
| :---: | :--- | :--- |
| **2.1** | [Vista General de Arquitectura](architecture/OVERVIEW.md) | Qué es Feature-Sliced Design (FSD) y cómo se organizan las carpetas. |
| **2.2** | [Stack Tecnológico](architecture/TECH-STACK.md) | Por qué usamos React 18, Vite 8, TypeScript 5 y Tailwind v4. |
| **2.3** | [Reporte Visual de Arquitectura](architecture/architecture-review.html) | Dashboard interactivo con métricas de salud del código. |

---

## 3️⃣ PASO 3: Las Funcionalidades de la Tienda (Carpeta: `docs/features/`)
*Para ver cómo funciona cada módulo de negocio.*

| Orden | Documento | ¿Qué aprenderás? |
| :---: | :--- | :--- |
| **3.1** | [Productos y Catálogo](features/PRODUCTS.md) | Cómo se muestran los productos, paginación infinita y búsqueda. |
| **3.2** | [Carrito de Compras](features/CART.md) | Cómo se guardan los productos que el cliente selecciona. |
| **3.3** | [Proceso de Pago (Checkout)](features/CHECKOUT.md) | Cómo se aplican cupones, cálculo de envío gratis y pago seguro. |
| **3.4** | [Selector de Tema](features/THEME.md) | Cómo funciona el modo oscuro (Dark Mode). |

---

## 4️⃣ PASO 4: Componentes Visuales (Carpeta: `docs/components/`)
*Para ver los botones, tarjetas y elementos de diseño.*

| Orden | Documento | ¿Qué aprenderás? |
| :---: | :--- | :--- |
| **4.1** | [UI Kit de Componentes](components/UI-KIT.md) | Catálogo de botones, tarjetas, modales y barras de navegación. |

---

## 5️⃣ PASO 5: Patrones de Diseño y Hooks (Carpeta: `docs/patterns/`)
*Para programadores intermedios que quieren ver buenas prácticas.*

| Orden | Documento | ¿Qué aprenderás? |
| :---: | :--- | :--- |
| **5.1** | [Custom Hooks](patterns/HOOKS.md) | Funciones mágicas reutilizables (`useCart`, `useProducts`, `useCheckoutOrder`). |
| **5.2** | [Contextos Globales](patterns/CONTEXTS.md) | Cómo compartir información entre componentes sin enredos. |

---

## 6️⃣ PASO 6: Conexión con el Servidor y APIs (Carpeta: `docs/api/`)
*Para saber cómo viajan los datos entre la web e Internet.*

| Orden | Documento | ¿Qué aprenderás? |
| :---: | :--- | :--- |
| **6.1** | [Cliente HTTP](api/API-CLIENT.md) | La herramienta que hace las solicitudes a la red. |
| **6.2** | [API de Productos](api/PRODUCTS-API.md) | Conexión con DummyJSON y Firestore. |
| **6.3** | [Referencia Completa](api/API-REFERENCE.md) | Lista de todas las funciones que piden datos. |

---

## 7️⃣ PASO 7: Ingeniería de Software Avanzada (Carpeta: `docs/engineering/`)
*Para arquitectos de software y revisión de calidad.*

| Orden | Documento | ¿Qué aprenderás? |
| :---: | :--- | :--- |
| **7.1** | [Casos de Uso](engineering/USE-CASES.md) | Historias de usuario formales de la tienda. |
| **7.2** | [Diagramas C4 y UML](engineering/ARCHITECTURE-C4.md) | Planos y diagramas gráficos del sistema. |
| **7.3** | [Decisiones Técnicas (ADR)](engineering/ARCHITECTURE-DECISIONS.md) | Las 10 decisiones clave tomadas en el proyecto. |
| **7.4** | [Auditoría SOLID y DRY](engineering/SOLID-DRY-AUDIT.md) | Comprobación de que no hay código repetido. |

---

## 8️⃣ PASO 8: Operaciones y Publicación (Carpeta: `docs/operations/`)
*Para cuando quieras subir la web a Internet.*

| Orden | Documento | ¿Qué aprenderás? |
| :---: | :--- | :--- |
| **8.1** | [Despliegue a Producción](operations/DEPLOYMENT.md) | Cómo publicar gratis en GitHub Pages o Firebase Hosting. |
| **8.2** | [Solución de Problemas](operations/TROUBLESHOOTING.md) | Guía de auxilio si algo no compila o sale un error. |

---
*Índice interactivo mantenido para el proyecto MyProjectAPI12.*
