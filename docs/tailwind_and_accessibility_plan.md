# Plan de Trabajo - Tailwind CSS y Accesibilidad (Best Practices)

Este plan detalla la optimización de los componentes interactivos del flujo de compra y catálogo para alinearlos con las mejores prácticas de Tailwind CSS v4 y las guías de accesibilidad WCAG.

---

## Decisiones que Requieren Revisión del Usuario (User Review Required)

> [!IMPORTANT]
> **Accesibilidad en Radio Buttons de Pago:** El componente [PaymentMethodRadio.tsx](file:///C:/Users/LJCR/Documents/GitHub/myprojectapi12/src/features/checkout/presentation/components/PaymentMethodRadio.tsx) utiliza un input de radio oculto y un `<label>` con `tabIndex={0}` y `role="button"`. Esto altera la navegación por teclado estándar de los radio buttons.
>
> Proponemos:
> 1. Remover `tabIndex={0}`, `role="button"` y `onKeyDown` de la etiqueta `<label>`.
> 2. Convertir el input de radio oculto en el foco principal de teclado agregándole las clases de Tailwind `peer` y `focus-visible`.
> 3. Utilizar selectores del estado del input (`peer-checked`, `peer-focus-visible`) en el `<label>` para pintar los bordes activos y el anillo de foco cuando el usuario navegue nativamente con las teclas de flechas, cumpliendo al 100% con los estándares de accesibilidad para lectores de pantalla.

---

## Cambios Propuestos

### Fase 1: Optimización de Componentes y Accesibilidad

#### [MODIFY] [PaymentMethodRadio.tsx](file:///C:/Users/LJCR/Documents/GitHub/myprojectapi12/src/features/checkout/presentation/components/PaymentMethodRadio.tsx)
* **Tailwind v4 & A11y:** Cambiar la estructura de clases del input y del label.
* Usar `className="sr-only peer"` en el `<input type="radio">`.
* Remover `role="button"`, `tabIndex={0}`, y `onKeyDown={handleKeyDown}` de `<label>`.
* Agregar clases dinámicas en el label para reaccionar al estado del peer: `peer-checked:border-primary peer-checked:bg-primary/5 peer-focus-visible:ring-2 peer-focus-visible:ring-primary peer-focus-visible:ring-offset-2`.

#### [MODIFY] [ProductCard.tsx](file:///C:/Users/LJCR/Documents/GitHub/myprojectapi12/src/features/products/presentation/ProductCard.tsx)
* **Accesibilidad:** Remover `role="button"`, `tabIndex={0}` y `onKeyDown` de la etiqueta `<article>` contenedora (líneas 41-43).
* Esto resuelve el problema de controles interactivos anidados (ya que dentro de la tarjeta existe el botón "Ver más"), permitiendo que los usuarios de teclado naveguen directamente al botón de acción del producto.

---

## Plan de Verificación

### Pruebas Automatizadas
- Ejecutar `pnpm type-check` para validar la coherencia del tipado.
- Ejecutar `pnpm test` para asegurar que las pruebas sigan pasando tras remover los eventos de teclado artificiales de los labels.
- Ejecutar `react-doctor` para validar que los avisos de accesibilidad de estos componentes hayan desaparecido.

### Verificación Manual
- Abrir la página del catálogo de productos y presionar `Tab` para verificar que el foco va directamente al botón "Ver más" de cada producto de manera accesible.
- En el Checkout, verificar que se puede navegar entre los métodos de pago (Visa, Mastercard, Bitcoin) usando las teclas de flechas (Up/Down/Left/Right) tras tabular al grupo de radio buttons, y que el anillo de foco se dibuja correctamente.
