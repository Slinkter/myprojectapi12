# 📘 Guía de Estudio y Análisis Técnico: MyProjectAPI12

Este documento está diseñado para desglosar la complejidad técnica del proyecto `MyProjectAPI12`. Se centra en explicar los algoritmos, la arquitectura y los patrones de diseño utilizados, ideal para entender el flujo de datos y la interacción entre componentes.

---

## 1. 🏗️ Arquitectura del Proyecto

El proyecto sigue una estructura basada en **DDD (Domain-Driven Design)** simplificado o "Vertical Slicing" (Por características), lo cual organiza el código por funcionalidad en lugar de por tipo de archivo.

### Estructura de Carpetas (Inferida)

Observando los archivos, vemos rutas como `src/features/products/application/...`. Esto indica:

- **`features/`**: Contiene módulos independientes (ej. `products`, `cart`).
- **`application/`**: Contiene la lógica de negocio y casos de uso (Hooks, Contextos, Tipos). Aquí es donde "suceden las cosas".
- **`infrastructure/`**: (Mencionado en los imports) Contiene la comunicación con el mundo exterior (API calls).
- **`domain/`**: (Implícito en `types.ts`) Definiciones de las entidades (ej. `IProduct`).

**¿Por qué es difícil de entender al principio?**
A diferencia de una estructura clásica (`components/`, `hooks/`, `utils/`), aquí los archivos relacionados con "Productos" están todos juntos. Esto hace que el código sea más escalable pero requiere navegar más entre carpetas al principio.

---

## 2. 🔄 Algoritmo de Paginación Infinita (TanStack Query)

El archivo más complejo y crítico es `src/features/products/application/useProducts.ts`. Implementa un patrón de **Scroll Infinito** eficiente.

### Desglose del Hook `useProducts`

Este hook no solo "pide datos", sino que gestiona un caché inteligente y calcula páginas automáticamente.

#### A. Configuración de `useInfiniteQuery`

```typescript
useInfiniteQuery<
  IProductsApiResponse, // Tipo de datos que devuelve la API por página
  Error, // Tipo de error
  InfiniteData<IProductsApiResponse>, // Tipo de la estructura completa de datos infinitos
  ["products"], // Query Key: Identificador único en caché
  number // Tipo del parámetro de página (pageParam)
>;
```

#### B. El Algoritmo `getNextPageParam` (El corazón de la lógica)

Esta función es la que decide si hay más datos que cargar y qué página sigue. Es donde muchos estudiantes se pierden.

```typescript
getNextPageParam: (lastPage, allPages) => {
  // 1. Calcula cuántos productos tenemos ya en memoria.
  // Suma la longitud del array 'products' de cada página descargada.
  const totalFetched = allPages.reduce(
    (acc, page) => acc + page.products.length,
    0,
  );

  // 2. Compara con el total que la API dice que existen en el servidor.
  // Si tenemos menos productos de los que existen (totalFetched < lastPage.total),
  // significa que hay más páginas.
  // La siguiente página es la cantidad de páginas actuales + 1.
  return totalFetched < lastPage.total ? allPages.length + 1 : undefined;
},
```

- **Si devuelve un número:** TanStack Query sabe que hay una página siguiente y usará ese número como `pageParam` en la próxima llamada a `queryFn`.
- **Si devuelve `undefined`:** Se establece `hasNextPage` en `false` y se detiene la paginación.

#### C. Aplanamiento de Datos (`flatMap`)

La API devuelve un array de páginas (arrays de arrays). La UI necesita una lista simple.

```typescript
// Transforma: [[p1, p2], [p3, p4], [p5]]
// A: [p1, p2, p3, p4, p5]
const products: IProduct[] = data?.pages.flatMap((page) => page.products) ?? [];
```

---

## 3. 🧠 Gestión de Estado Global (Context Pattern)

El proyecto utiliza **React Context** para manejar el estado del Modal de Producto, evitando el "Prop Drilling" (pasar props por muchos componentes innecesarios).

### Piezas del Rompecabezas

1.  **El Estado (`useProductModal.ts`)**:
    - Es un Custom Hook normal.
    - Maneja `isModalOpen` (booleano) y `selectedProduct` (objeto o null).
    - Usa `useCallback` para memorizar las funciones `handleOpenModal` y `handleCloseModal`, evitando re-renderizados innecesarios en componentes hijos.

2.  **La Definición (`ProductModalContext.ts`)**:
    - Crea el "tubo" por donde pasarán los datos.
    - `createContext<IUseProductModalResult | undefined>(undefined)`: Se inicializa como `undefined` para forzar a que se use dentro de un Provider.

3.  **El Consumidor Seguro (`useProductModalContext.ts`)**:
    - Este es un patrón de diseño llamado **"Custom Context Hook"**.
    - En lugar de usar `useContext(ProductModalContext)` directamente en los componentes, usas este hook.
    - **Ventaja:** Valida que el contexto exista. Si intentas usar el modal fuera del `ProductModalProvider`, lanzará un error útil en lugar de fallar silenciosamente con `undefined`.

```typescript
// Patrón de seguridad
const context = useContext(ProductModalContext);
if (context === undefined) {
  throw new Error("Debe usarse dentro de un ProductModalProvider");
}
return context;
```

---

## 4. 🚀 CI/CD (Integración y Despliegue Continuo)

El archivo `.github/workflows/deploy.yml` automatiza la publicación de tu app.

### Flujo de Trabajo Explicado

1.  **Disparador (`on: push`)**: Cada vez que subes código a la rama `main`, este script se despierta.
2.  **Job `build`**:
    - Levanta una máquina virtual Ubuntu.
    - Instala `pnpm` y `node`.
    - Instala dependencias (`pnpm install`).
    - **Linting**: Revisa si hay errores de código (`pnpm run lint`). Si esto falla, el despliegue se cancela (¡Seguridad!).
    - **Build**: Compila el proyecto (`pnpm run build`) creando la carpeta `dist`.
    - **Upload**: Sube la carpeta `dist` a una nube temporal de GitHub.
3.  **Job `deploy`**:
    - Toma la carpeta `dist` subida anteriormente.
    - La publica en GitHub Pages.

---

## 5. 📝 Glosario Rápido para el Estudiante

- **Hook**: Una función que permite "engancharse" al ciclo de vida y estado de React (ej. `useProducts`).
- **Interface (`IProduct`)**: Un contrato que define qué forma debe tener un objeto. Si el objeto no cumple, TypeScript avisa.
- **Query Key**: Una etiqueta (array) que React Query usa para saber si los datos que tiene en memoria pertenecen a esa petición específica.
- **FlatMap**: Método de array que primero mapea cada elemento y luego aplana el resultado en un nuevo array (elimina un nivel de anidamiento).
