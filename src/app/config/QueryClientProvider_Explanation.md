# Explicación de `QueryClientProvider` y `queryClient`

Este documento explica cómo funciona `QueryClientProvider` en este proyecto, utilizando la configuración definida en `src/app/config/queryClient.js`.

## ¿Qué es `QueryClientProvider`?

`QueryClientProvider` es un componente de la librería `@tanstack/react-query` (anteriormente React Query). Su propósito principal es **hacer que una instancia de `QueryClient` esté disponible para todos los componentes de React que se encuentren dentro de su árbol de componentes**.

En esencia, actúa como un "proveedor" de contexto para todas las funcionalidades de gestión de estado de servidor que ofrece React Query, como el fetching de datos, el caching, la sincronización y la actualización.

## ¿Qué es `queryClient`?

`queryClient` es una instancia de la clase `QueryClient` de `@tanstack/react-query`. Es el **corazón de React Query**, donde se almacena la configuración global para todas las *queries* y *mutations* de la aplicación, y donde se gestiona la caché de datos.

En este proyecto, la instancia de `queryClient` se crea y exporta desde `src/app/config/queryClient.js`.

## Configuración de `queryClient` en este proyecto

La configuración de `queryClient` en `src/app/config/queryClient.js` está optimizada con las siguientes `defaultOptions` para `queries`:

*   **`staleTime: 1000 * 60 * 5` (5 minutos)**:
    *   Este ajuste define el tiempo que los datos de una *query* se consideran "frescos".
    *   Mientras los datos están frescos, React Query no los volverá a solicitar al servidor, incluso si el componente se remonta o la *query* se vuelve a activar.
    *   Después de 5 minutos, los datos se marcan como "stale" (obsoletos). Cuando una *query* obsoleta se activa (por ejemplo, un componente se monta o la ventana recupera el foco), React Query intentará volver a solicitar los datos en segundo plano para asegurarse de que estén actualizados, pero seguirá mostrando los datos obsoletos mientras tanto.

*   **`gcTime: 1000 * 60 * 30` (30 minutos)**:
    *   `gcTime` (garbage collection time) define el tiempo que los datos en caché se mantendrán en memoria *después de que la última instancia activa de esa query se haya desmontado*.
    *   Si una *query* no está siendo utilizada por ningún componente y ha pasado más de 30 minutos desde la última vez que fue activa, React Query la eliminará de la caché para liberar memoria.
    *   Es importante destacar que `gcTime` siempre debe ser mayor que `staleTime` para evitar que los datos se eliminen de la caché antes de que puedan ser reutilizados mientras aún podrían ser considerados relevantes.

*   **`retry: 2`**:
    *   Si una *query* falla (por ejemplo, debido a un error de red o del servidor), React Query intentará automáticamente realizar la solicitud 2 veces más antes de reportar un error definitivo. Esto mejora la robustez de la aplicación frente a fallos transitorios.

*   **`refetchOnWindowFocus: false`**:
    *   Por defecto, React Query volvería a solicitar los datos cada vez que la ventana del navegador recupera el foco. En este proyecto, esta opción se ha desactivado (`false`) para evitar refetches innecesarios y proporcionar un mayor control sobre cuándo se actualizan los datos. Esto puede ser útil para escenarios donde el estado de la aplicación no cambia tan frecuentemente o donde los refetches automáticos pueden ser disruptivos.

*   **`refetchOnReconnect: true`**:
    *   Cuando la aplicación detecta que la conexión a internet se ha restablecido, React Query intentará automáticamente volver a solicitar todas las *queries* que estén obsoletas. Esto asegura que la aplicación se sincronice rápidamente con el servidor una vez que la conectividad vuelve.

## Cómo se usa en el proyecto (`main.jsx`)

En `src/main.jsx`, el `QueryClientProvider` envuelve la aplicación principal de React (`<App />`):

```jsx
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/app/config/queryClient";
import App from "./App.jsx";

// ...

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      {/* Toda la aplicación tiene acceso a React Query */}
      <App />
    </QueryClientProvider>
  </React.StrictMode>
);
```

Al hacer esto, cualquier componente dentro de `<App />` puede utilizar los hooks de React Query (como `useQuery`, `useMutation`, `useInfiniteQuery`, etc.) y acceder a la instancia de `queryClient` y su configuración, así como a la caché de datos que gestiona.

## Beneficios clave

El uso de `QueryClientProvider` y `queryClient` con la configuración anterior proporciona los siguientes beneficios:

*   **Gestión automática de la caché**: Los datos se almacenan y se invalidan de forma inteligente, reduciendo la necesidad de gestionar manualmente el estado de carga y error.
*   **Optimización del rendimiento**: `staleTime` y `gcTime` aseguran que las solicitudes de red sean mínimas y que la memoria se gestione eficientemente.
*   **Mejor experiencia de usuario**: `retry` y `refetchOnReconnect` hacen que la aplicación sea más robusta y reactiva a los cambios de red.
*   **Desarrollo simplificado**: Los desarrolladores pueden enfocarse en la lógica de negocio en lugar de la gestión de la sincronización de datos con el servidor.