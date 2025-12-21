# Especificación de Requerimientos

## 1. Requerimientos Funcionales (RF)

| ID        | Requerimiento            | Descripción                                                       | Criterio de Aceptación                                                    |
| :-------- | :----------------------- | :---------------------------------------------------------------- | :------------------------------------------------------------------------ |
| **RF-01** | **Listado de Productos** | El sistema debe listar productos obtenidos de una API externa.    | Debe mostrarse imagen, título y precio. Paginación funcional.             |
| **RF-02** | **Detalle de Producto**  | El usuario debe poder ver la descripción completa de un producto. | Al hacer clic en "Ver más", se abre un modal con descripción y stock.     |
| **RF-03** | **Gestión de Carrito**   | El sistema debe permitir añadir y quitar productos.               | El contador de items y el precio total deben actualizarse en tiempo real. |
| **RF-04** | **Validación de Pago**   | El formulario de pago debe validar los inputs antes de procesar.  | Número de tarjeta 19 dígitos, fecha MM/YY válida, CVC numérico.           |
| **RF-05** | **Tema Oscuro**          | El usuario puede alternar entre modo claro y oscuro.              | La preferencia persiste durante la sesión y cambia los colores base.      |

## 2. Requerimientos No Funcionales (RNF)

| ID         | Categoría          | Descripción                                                              | Métrica / Objetivo                                              |
| :--------- | :----------------- | :----------------------------------------------------------------------- | :-------------------------------------------------------------- |
| **RNF-01** | **Rendimiento**    | El tiempo de carga inicial (FCP) debe ser bajo.                          | < 1.5 segundos en 4G. (Uso de Lazy Loading).                    |
| **RNF-02** | **Usabilidad**     | La interfaz debe ser intuitiva y responsive.                             | Funcional en móviles (320px) hasta escritorio (1920px+).        |
| **RNF-03** | **Mantenibilidad** | El código debe seguir estándares de Clean Code.                          | Arquitectura Feature-Based y CSS BEM implementados.             |
| **RNF-04** | **Escalabilidad**  | La arquitectura debe soportar nuevos módulos sin refactorizar el núcleo. | Añadir una feature no debe implicar modificar otras existentes. |

## 3. Requerimientos Técnicos

1.  **Framework:** React v18+.
2.  **Lenguaje:** JavaScript ES6+ (con miras a migración TypeScript).
3.  **Estilos:** Tailwind CSS v3.
4.  **API:** Consumo mediante `fetch` estándar (sin librerías externas pesadas como Axios para este alcance, aunque es viable migrar).
5.  **Entorno:** Node.js v18+ para desarrollo y build.

## 4. Reglas de Negocio

-   **RN-01 (Stock):** No se puede añadir al carrito una cantidad mayor al stock disponible de un producto.
-   **RN-02 (Persistencia):** _[Pendiente]_ El carrito debería persistir si el usuario cierra la pestaña (actualmente volátil).
-   **RN-03 (Moneda):** Todos los precios se manejan y muestran en Dólares Americanos (USD).
