# Modelo C4 de Arquitectura

Diagramas de arquitectura basados en el modelo C4 (*Context, Container, Component, Code*) de Simon Brown.

---

## Nivel 1: Diagrama de Contexto (System Context)

Muestra el sistema software y sus interacciones con actores y sistemas externos.

```mermaid
C4Context
  title System Context — myprojectapi12

  Person(usuario, "Usuario", "Comprador que navega productos y realiza compras")

  System_Boundary(spa, "myprojectapi12 (SPA)") {
    System(app, "Aplicación E-Commerce", "React SPA que muestra productos, gestiona carrito y procesa pagos simulados")
  }

  System_Ext(dummy, "DummyJSON API", "API pública REST que provee catálogo de productos")
  System_Ext(ghpages, "GitHub Pages", "Hosting estático para la SPA")
  System_Ext(browser, "Navegador Web", "Chrome, Firefox, Safari, Edge")

  Rel(usuario, app, "Navega, busca, compra")
  Rel(app, dummy, "GET /products, GET /categories", "HTTPS JSON")
  Rel(browser, ghpages, "Sirve index.html + assets", "CDN")
  UpdateLayoutConfig($c4ShapeInRow="3", $c4BoundaryInRow="1")
```

## Nivel 2: Diagrama de Contenedores (Containers)

Muestra los contenedores que ejecutan el sistema y sus responsabilidades.

```mermaid
C4Container
  title Diagrama de Contenedores — myprojectapi12

  Person(usuario, "Usuario", "Comprador")

  Container_Boundary(spa, "SPA Frontend") {
    Container(vite, "Vite Dev Server", "Node.js", "Sirve la app en desarrollo con HMR")
    Container(react, "React SPA", "TypeScript, React 18", "Renderiza UI, gestiona estado, animaciones")
    Container(tanstack, "TanStack Query Cache", "Memoria JS", "Cachea respuestas de API, staleTime 5min")
    Container(storage, "localStorage", "Navegador", "Persiste carrito y preferencia de tema")
  }

  ContainerDb(dummy, "DummyJSON API", "REST API", "Catálogo de productos, categorías, búsqueda")
  Container(gh, "GitHub Pages", "CDN", "Hosting de archivos estáticos")

  Rel(usuario, react, "Interactúa con la UI")
  Rel(react, tanstack, "Lee y escribe caché")
  Rel(react, storage, "Persiste carrito y tema")
  Rel(tanstack, dummy, "Peticiones HTTP", "HTTPS")
  Rel(vite, react, "Sirve en desarrollo")
  Rel(gh, react, "Sirve en producción")
  UpdateLayoutConfig($c4ShapeInRow="3", $c4BoundaryInRow="1")
```

## Nivel 3: Diagrama de Componentes (Components)

Muestra los componentes principales de React y cómo se relacionan.

```mermaid
C4Component
  title Diagrama de Componentes — React SPA

  Person(usuario, "Usuario")

  Container_Boundary(app, "Aplicación React") {
    Component(root, "App.tsx", "React Component", "Raíz: monta providers y layout")
    Component(providers, "Provider Chain", "Context API", "QueryClient → Theme → Cart → BrowserRouter → LazyMotion → ErrorBoundary")
    Component(layout, "Layout", "React Component", "Navbar + main + Toaster")
    Component(router, "AppRouter", "React Router 7", "Enrutamiento con lazy() y AnimatePresence")
    Component(navbar, "Navbar", "React Component", "Logo, nav, búsqueda, categorías, tema, carrito, menú móvil")
    Component(cart, "Cart Drawer", "React Portal", "Drawer lateral con slide-in spring")
    Component(home, "Home Page", "Lazy Loaded", "Grid de productos, búsqueda, modal")
    Component(checkout, "Checkout Page", "Lazy Loaded", "Formulario de pago, resumen de orden")
    Component(success, "CheckoutSuccess", "Lazy Loaded", "Confirmación con resumen de compra")
  }

  Container_Boundary(api, "API Layer") {
    Component(apiClient, "apiClient", "Fetch wrapper", "Cliente específico de productos")
    Component(httpClient, "httpClient", "Fetch wrapper", "Cliente HTTP genérico")
    Component(queryClient, "QueryClient", "TanStack Query", "Configura cache, retry, staleTime")
  }

  Container_Boundary(store, "State Layer") {
    Component(cartContext, "CartContext", "React Context", "Estado global del carrito + localStorage")
    Component(themeContext, "ThemeContext", "React Context", "Tema claro/oscuro + localStorage")
    Component(modalContext, "ProductModalContext", "React Context", "Estado del modal de producto")
  }

  Rel(usuario, navbar, "Navega, busca")
  Rel(usuario, home, "Ve productos")
  Rel(usuario, cart, "Gestiona carrito")
  Rel(usuario, checkout, "Paga")
  Rel(usuario, success, "Ve confirmación")
  Rel(root, providers, "Monta")
  Rel(providers, layout, "Envuelve")
  Rel(layout, router, "Renderiza rutas")
  Rel(layout, navbar, "Incluye")
  Rel(router, home, "Carga")
  Rel(router, checkout, "Carga")
  Rel(router, success, "Carga")
  Rel(home, apiClient, "Obtiene productos")
  Rel(apiClient, queryClient, "Cachea respuestas")
  Rel(apiClient, httpClient, "Usa")
  Rel(cartContext, cart, "Provee estado")
  Rel(themeContext, navbar, "Provee tema")
  Rel(modalContext, home, "Provee modal")
  UpdateLayoutConfig($c4ShapeInRow="3", $c4BoundaryInRow="2")
```

## Nivel 4: Diagrama de Código (Code)

Ejemplo concreto del flujo de carga de productos, desde el componente hasta la API.

```mermaid
sequenceDiagram
  participant PC as ProductCard (memo)
  participant PG as ProductGrid
  participant PL as ProductList
  participant HC as HomeContent
  participant HP as useProducts (hook)
  participant PA as productsApi
  participant AC as apiClient
  participant API as DummyJSON API

  Note over PL: initialLoading = true
  HC->>HP: useProducts(category?)
  HP->>PA: getProducts({ limit: 20, skip: 0 })
  PA->>AC: apiClient.get<IProductsApiResponse>(url)
  AC->>API: GET /products?limit=20&skip=0
  API-->>AC: JSON { products: [...], total: 100 }
  AC-->>PA: IProductsApiResponse
  PA-->>HP: IProductsApiResponse
  HP-->>HC: products = data.pages.flatMap(p => p.products)

  Note over PL: initialLoading = false
  HC->>PL: <ProductList products={filteredProducts} />
  PL->>PG: <ProductGrid products={products} />
  PG->>PC: <ProductCard product={product} /> x N
  Note over PG,PC: Animaciones staggered + scroll-reveal

  rect rgb(240, 240, 240)
    Note right of HC: Load More
    PL->>HP: loadMoreProducts()
    HP->>PA: getProducts({ limit: 20, skip: 20 })
    PA->>AC: apiClient.get(url)
    AC->>API: GET /products?limit=20&skip=20
    API-->>AC: JSON
    AC-->>PA: IProductsApiResponse
    PA-->>HP: IProductsApiResponse
    HP-->>HC: products = [...prev, ...newItems]
    HC-->>PL: re-render con productos nuevos
    PL-->>PG: re-render grid
    PG-->>PC: nuevos <ProductCard> con whileInView
  end
```
