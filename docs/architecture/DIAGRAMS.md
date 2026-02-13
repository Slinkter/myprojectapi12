# Diagramas de Arquitectura y Flujo - Proyecto API12

Este documento contiene la representación visual de la arquitectura, ciclos de vida y flujos de ejecución del proyecto utilizando **Mermaid**.

## 1. Secuencia de Ejecución y Bootstrapping
Describe el proceso desde que el navegador carga la aplicación hasta el renderizado de la página principal.

```mermaid
sequenceDiagram
    participant Browser as Navegador (DOM)
    participant Main as main.tsx
    participant App as App.tsx (Root)
    participant Providers as Context Providers
    participant Router as AppRouter (Lazy Loading)
    participant Home as Home.tsx

    Browser->>Main: Carga index.html & main.tsx
    Main->>Main: Importa Estilos Globales (CSS)
    Main->>App: ReactDOM.createRoot().render(<App />)
    
    rect rgb(240, 240, 240)
        Note over App, Providers: Inicialización de Proveedores
        App->>Providers: QueryClientProvider (TanStack)
        Providers->>Providers: ThemeProvider (Light/Dark)
        Providers->>Providers: CartProvider (State Management)
    end

    App->>Router: Renderiza Suspense + Routes
    Router->>Browser: Muestra <Loader /> (Fallback)
    
    rect rgb(220, 240, 255)
        Note over Router, Home: Carga Asíncrona (Code Splitting)
        Router->>Home: Dynamic Import lazy()
        Home-->>Router: Componente Cargado
    end
    
    Router->>Browser: Renderiza Home Page
```

---

## 2. Jerarquía de Componentes
Organización estructural de la UI y los proveedores de estado.

```mermaid
graph TD
    subgraph App_Root [App.tsx]
        QC[QueryClientProvider] --> BR[BrowserRouter]
        BR --> TP[ThemeProvider]
        TP --> CP[CartProvider]
        CP --> EB[ErrorBoundary]
        EB --> LY[Layout]
    end

    subgraph UI_Shell [Layout.tsx]
        LY --> NB[Navbar]
        LY --> CT[Cart Slide-over]
        LY --> AR[AppRouter]
    end

    subgraph Routing [AppRouter.tsx]
        AR --> S[Suspense]
        S --> H[Home Page]
        S --> CK[Checkout Page]
        S --> CS[Success Page]
    end
```

---

## 3. Diagrama de Clases UML (Dominio)
Relaciones entre las entidades de datos y la lógica de negocio.

```mermaid
classDiagram
    class Product {
        +number id
        +string title
        +string description
        +number price
        +number stock
        +string thumbnail
        +string[] images
    }

    class CartItem {
        +number quantity
        +validate() ValidationResult
    }

    class CartContext {
        +CartItem[] items
        +number totalAmount
        +addToCart(product)
        +removeFromCart(id)
        +updateQuantity(id, q)
    }

    class ProductsApi {
        +getProducts(limit, skip)
        +searchProducts(query)
    }

    class useProducts {
        +data: Product[]
        +isLoading: boolean
        +error: Error
    }

    Product <|-- CartItem : Extiende
    CartContext "1" *-- "many" CartItem : Agrega
    useProducts ..> ProductsApi : Usa
    useProducts ..> Product : Retorna
    CartContext ..> Product : Transforma
```

---

## 4. Diagrama de Componentes (Capas)
Visión de arquitectura hexagonal / por capas.

```mermaid
componentDiagram
    package "Presentation Layer" {
        [Pages (Home, Checkout)] <<Component>>
        [UI Components (Button, Card)] <<Component>>
    }

    package "Application Layer" {
        [Contexts (Cart, Theme)] <<Service>>
        [Hooks (useProducts, useCart)] <<Logic>>
    }

    package "Domain Layer" {
        [Entities (Product, CartItem)] <<Entity>>
        [Validation Logic] <<Utility>>
    }

    package "Infrastructure Layer" {
        [ApiClient (Axios/Fetch)] <<Interface>>
        [QueryClient (TanStack)] <<Cache>>
    }

    [Pages] --> [Hooks]
    [Hooks] --> [Contexts]
    [Hooks] --> [ApiClient]
    [Contexts] --> [Entities]
    [ApiClient] --> [External API (DummyJSON)]
```

---

## 5. Ciclo de Vida del Componente y Datos
Estados de React Query e integración con el ciclo de vida de React.

```mermaid
stateDiagram-v2
    [*] --> Initialized: Componente se carga
    Initialized --> Rendered: Render inicial
    
    state Rendered {
        [*] --> Mounting
        Mounting --> UseEffect: ComponentDidMount
    }
    
    Rendered --> Updated: Cambio de Props/Estado
    Updated --> UseEffect: ComponentDidUpdate
    
    Rendered --> Unmounted: Navegación/Cierre
    Unmounted --> Cleanup: Effect Cleanup
    Cleanup --> [*]

    state "React Query Integration" as RQ {
        [*] --> Loading
        Loading --> Success
        Loading --> Error
        Success --> Stale: Tiempo expira
        Stale --> Refetching
        Refetching --> Success
    }
```

---

## 6. Flujo de Renderización
Cómo React maneja las actualizaciones en el DOM.

```mermaid
flowchart LR
    State[Cambio de Estado/Prop] --> Reconciliation{Virtual DOM Diffing}
    Reconciliation --> |Sin Cambios| NoRender[Evita Re-render]
    Reconciliation --> |Cambios Detectados| Commit[Fase de Commit]
    
    subgraph Render_Phase
        Commit --> UpdateDOM[Actualiza el DOM Real]
        UpdateDOM --> LayoutEffect[useLayoutEffect]
        LayoutEffect --> Paint[Navegador Pinta en Pantalla]
        Paint --> Effect[useEffect]
    end
```

---

## 7. Diagrama de Despliegue
Infraestructura física de la solución.

```mermaid
deploymentDiagram
    node "Cliente (Browser)" {
        artifact "React App (JS/HTML/CSS)"
    }

    node "GitHub Pages (CDN)" {
        [Build Artifacts]
    }

    node "DummyJSON API" {
        [Product Service]
    }

    [Cliente] -- "HTTPS" --> [GitHub Pages] : Descarga App
    [Cliente] -- "REST/JSON" --> [DummyJSON API] : Consume Datos
```
