# Plan de Optimización y Corrección de Errores (`react-doctor`)

Este documento detalla el plan de trabajo en fases para estabilizar la compilación del proyecto (resolviendo los errores de TypeScript) y solucionar todos los diagnósticos críticos y advertencias indicadas por `react-doctor`.

---

## Decisiones que Requieren Revisión del Usuario (User Review Required)

> [!IMPORTANT]
> **Duplicación de componentes base:** En `src/shared/ui` existen actualmente tanto archivos sueltos como carpetas dedicadas para `Button` y `Card`. Mantendremos únicamente las carpetas `Button/` y `Card/` (que están bajo el estándar de `class-variance-authority` y exportadas por el index global) y eliminaremos los archivos duplicados [button.tsx](file:///C:/Users/LJCR/Documents/GitHub/myprojectapi12/src/shared/ui/button.tsx) y [card.tsx](file:///C:/Users/LJCR/Documents/GitHub/myprojectapi12/src/shared/ui/card.tsx) para solucionar de raíz los problemas de duplicación de código y errores de casing en la compilación.

---

## Preguntas Abiertas (Open Questions)

> [!WARNING]
> 1. **Actualización de Vitest:** `react-doctor` marcó la versión actual de `vitest` (`^2.1.9`) con riesgo de seguridad. ¿Deseas actualizar `vitest` a la última versión segura dentro de la rama `^2.x.x` (como `2.1.8` o la última versión menor compatible)?
> 2. **Autofocus en Navbar:** El buscador en [Navbar.tsx](file:///C:/Users/LJCR/Documents/GitHub/myprojectapi12/src/shared/ui/Navbar.tsx#L115) tiene el atributo `autoFocus` activo para enfocar la barra de búsqueda al cargar. Quitarlo mejora la accesibilidad para usuarios con lectores de pantalla. ¿Deseas removerlo o prefieres conservarlo por razones de diseño de interfaz de usuario?

---

## Cambios Propuestos por Fases

### Fase 1: Corrección de Compilación y Limpieza (Errores TypeScript)

Esta fase estabiliza el entorno eliminando archivos duplicados y corrigiendo rutas y tipos rotos detectados en el compilador.

#### [DELETE] [button.tsx](file:///C:/Users/LJCR/Documents/GitHub/myprojectapi12/src/shared/ui/button.tsx)
* Eliminar el archivo para evitar colisiones de casing con el directorio `Button/`.

#### [DELETE] [card.tsx](file:///C:/Users/LJCR/Documents/GitHub/myprojectapi12/src/shared/ui/card.tsx)
* Eliminar el archivo para evitar colisiones de casing con el directorio `Card/`.

#### [MODIFY] [button.test.tsx](file:///C:/Users/LJCR/Documents/GitHub/myprojectapi12/src/shared/ui/button.test.tsx)
* Cambiar la importación de `Button` desde `@/shared/ui/button` hacia `@/shared/ui/Button` (o directamente desde `@/shared/ui`).

#### [MODIFY] [ProductImageGallery.tsx](file:///C:/Users/LJCR/Documents/GitHub/myprojectapi12/src/features/products/presentation/components/ProductImageGallery.tsx)
* Corregir la ruta de importación de `ImageZoom` desde `@/components/common/ImageZoom` a `@/shared/ui/ImageZoom` (que es donde realmente reside).

#### [MODIFY] [OrderItemRow.tsx](file:///C:/Users/LJCR/Documents/GitHub/myprojectapi12/src/features/checkout/presentation/components/OrderItemRow.tsx) y [OrderSummary.tsx](file:///C:/Users/LJCR/Documents/GitHub/myprojectapi12/src/features/checkout/presentation/components/OrderSummary.tsx)
* Cambiar la importación y tipado de `CartItem` por `ICartItem` según lo definido en [cartTypes.ts](file:///C:/Users/LJCR/Documents/GitHub/myprojectapi12/src/features/cart/domain/cartTypes.ts).

---

### Fase 2: Corrección de Errores Críticos (Bugs y Seguridad)

Esta fase se enfoca en resolver las advertencias de lógica y rendimiento severas encontradas por `react-doctor`.

#### [MODIFY] [LoadingProgress.tsx](file:///C:/Users/LJCR/Documents/GitHub/myprojectapi12/src/shared/ui/LoadingProgress.tsx)
* **Performance:** Cambiar la importación completa de `motion` por la importación de `m` (Lazy Motion) y usar `<m.div>` en lugar de `<motion.div>`.
* **State Updates:** Manejar la inicialización y el reseteo del progreso (`setProgress(0)`) y visibilidad (`setIsVisible(false)`) de forma inline durante el renderizado cuando el prop `isLoading` cambia a `false`, evitando efectos adicionales que causan renders con estados obsoletos.

#### [MODIFY] [package.json](file:///C:/Users/LJCR/Documents/GitHub/myprojectapi12/package.json)
* Si el usuario lo aprueba, actualizar la versión de `vitest` para corregir la alerta de seguridad.

---

### Fase 3: Mejoras de Accesibilidad, Buenas Prácticas y UI

Fase final enfocada en semántica HTML, tipos de botones y optimizaciones de accesibilidad WCAG.

#### [MODIFY] [ImageZoom.tsx](file:///C:/Users/LJCR/Documents/GitHub/myprojectapi12/src/shared/ui/ImageZoom.tsx)
* **Accesibilidad:** Agregar el atributo `role="button"` (o similar) y soporte de interacción con teclado al div contenedor interactivo del zoom (línea 63).
* **Botones:** Agregar `type="button"` a todos los botones de acercamiento, alejamiento y restablecimiento del zoom para evitar comportamientos predeterminados de submit.

#### [MODIFY] [Layout.tsx](file:///C:/Users/LJCR/Documents/GitHub/myprojectapi12/src/shared/ui/Layout.tsx)
* **Accesibilidad:** Remover el atributo redundante `role="main"` del elemento `<main>` (línea 21).

#### [MODIFY] [Navbar.tsx](file:///C:/Users/LJCR/Documents/GitHub/myprojectapi12/src/shared/ui/Navbar.tsx)
* **Botones:** Especificar `type="button"` en los botones de interacción de navegación.
* **Accesibilidad:** (Si se aprueba) remover `autoFocus` del input de búsqueda.

#### [MODIFY] [ErrorFallback.tsx](file:///C:/Users/LJCR/Documents/GitHub/myprojectapi12/src/shared/ui/ErrorFallback.tsx) y [ErrorMessage.tsx](file:///C:/Users/LJCR/Documents/GitHub/myprojectapi12/src/shared/ui/ErrorMessage.tsx)
* **Botones:** Añadir `type="button"` a los botones correspondientes.

---

## Plan de Verificación

### Pruebas Automatizadas
- Ejecutar `pnpm type-check` para validar que todos los errores de tipado e importación se hayan corregido.
- Ejecutar `pnpm test` para asegurar que las pruebas unitarias y de integración continúen pasando satisfactoriamente.
- Ejecutar `npx -y react-doctor@latest . --verbose --scope changed` para corroborar que la puntuación de salud de React aumente significativamente (buscando superar 90/100).

### Verificación Manual
- Levantar el servidor de desarrollo (`pnpm dev`) y verificar visualmente que las animaciones de carga, barra de progreso y zoom de imágenes sigan funcionando correctamente.
