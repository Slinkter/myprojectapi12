# 🏗️ Arquitectura de Software

## Paradigma
El proyecto sigue una **Arquitectura Basada en Features (Feature-Based Architecture)** inspirada en **Clean Architecture**. El objetivo es agrupar el código por *dominio funcional* (Producto, Carrito) en lugar de *tipo técnico* (Componentes, Hooks).

## Diagrama de Capas (Conceptual)

```mermaid
graph TD
    User((Usuario)) --> View[Capa de Presentación<br>(Components/Pages)]
    
    subgraph Frontend Logic
        View --> Container[Contenedores / Hooks<br>(Application Layer)]
        Container --> Domain[Reglas de Negocio / Entidades<br>(Domain Layer)]
    end
    
    subgraph Infrastructure
        Container --> API[Repositorios / Servicios<br>(Infrastructure Layer)]
        API --> External[API Externa Clean]
    end
```

## Estructura de Directorios

La estructura `src/` se organiza de la siguiente manera:

```text
src/
├── app/                  # Capa "Main" o "Core"
│   ├── config/           # Variables de entorno y configuración estática
│   ├── routes/           # Definición de rutas (React Router)
│   └── api/              # Cliente HTTP base (Axios/Fetch wrapper)
│
├── common/               # UI Kit y utilidades compartidas
│   ├── components/       # Átomos y moléculas UI (Button, Input, Modal)
│   └── utils/            # Funciones puras (formatMoney, dateParsers)
│
├── features/ (o modules/) # Módulos de Negocio Vertical
│   ├── products/
│   │   ├── application/  # Casos de uso: hooks (useProducts), contextos
│   │   ├── infrastructure/ # Gateways: adapters, servicios API
│   │   └── presentation/   # UI Específica: ProductCard, ProductGrid
│   ├── cart/
│   └── checkout/
│
├── pages/                # Composición de Vistas
│   ├── Home.jsx          # Página que orquesta features/products
│   └── Checkout.jsx      # Página que orquesta features/checkout
│
└── main.jsx              # Punto de entrada
```

## Patrones de Diseño Aplicados

### 1. Container / Presentational Pattern (En proceso)
*   **Presentational (Dumb):** Se preocupan de *cómo se ve*. Reciben datos y callbacks por props. No dependen de la API ni del Contexto. (Ej: `ProductCard`).
*   **Container (Smart):** Se preocupan de *cómo funciona*. Conectan con Hooks, Context o Store. Pasan datos a los componentes presentacionales.

### 2. Custom Hooks como Controladores
La lógica de estado y efectos colaterales se extrae a Custom Hooks (`useProducts`), actuando como la capa de "Application" o "Controller" en MVC.

### 3. Context API para Estado Global
Utilizado para estados que deben persistir a través de múltiples vistas (Carrito, Tema), evitando el Prop Drilling excesivo.

### 4. Adapter Pattern (Recomendado)
En la capa de infraestructura, transformar los datos "sucios" de la API (`infrastructure`) a entidades limpias del dominio antes de que lleguen a la UI.
