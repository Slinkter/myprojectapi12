# 📖 Glosario Técnico

## Términos de Dominio

*   **SKU:** Stock Keeping Unit. Identificador único de producto (En este proyecto usamos `id`).
*   **Cart Session:** Estado temporal de los productos seleccionados por el usuario durante su visita.
*   **Checkout:** Proceso final de confirmación de compra.

## Términos Técnicos y de Diseño

*   **Material Tailwind:** Librería de componentes para React que combina la filosofía de Material Design con la facilidad de personalización de Tailwind CSS.
*   **Clean UI:** Filosofía de diseño que elimina elementos decorativos innecesarios (sombras pesadas, gradientes complejos) para enfocar la atención del usuario en el contenido y la acción.
*   **Feature-Based Architecture:** Patrón de organización de código donde la estructura de carpetas refleja las funcionalidades del negocio (Cart, Product) y no los roles técnicos (Components, Reducers).
*   **Prop Drilling:** Anti-patrón que consiste en pasar datos a través de múltiples capas de componentes que no los necesitan, solo para llegar a un componente hijo profundo.
*   **Dumb Component:** Componente puramente visual que no tiene estado ni lógica compleja; solo recibe props y renderiza.
*   **Smart Component (Container):** Componente que gestiona estado, llama a APIs o Hooks y pasa la información a los componentes Dumb.
*   **HMR (Hot Module Replacement):** Capacidad de Vite para actualizar módulos en el navegador sin recargar la página completa, manteniendo el estado de la aplicación.
