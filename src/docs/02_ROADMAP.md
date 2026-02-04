# 🗺️ Roadmap del Proyecto

## Estado Actual: Fase 1 (Refactorización & Documentación)
- [x] Auditoría técnica inicial.
- [x] Eliminación de deuda técnica crítica (hardcoded URLs, race conditions).
- [x] Establecimiento de estructura base `Feature-Based`.
- [x] Generación de documentación profesional (JSDoc + Markdown).

## Fase 2: Arquitectura "Clean" Estricta (Próximos Pasos)
### Refactorización de Arquitectura
- [ ] **Separación Container/Presenter:**
    - Dividir `ProductDetailModal` en `ProductDetailContainer` (lógica) y `ProductDetailView` (UI).
    - Aislar `Cart.jsx` de la lógica de negocio directa.
- [ ] **Capa de Servicios:**
    - Transformar `productsApi.js` en una clase/objeto `ProductRepository` que implemente una interfaz clara.
    - Implementar el patrón "Adapter" para normalizar los datos de la API (evitar que el frontend dependa de la estructura exacta de DummyJSON).
- [ ] **Module Pattern:**
    - Renombrar `src/features` a `src/modules` para seguir convenciones empresariales modernas.
    - Crear archivos `index.js` (Barrels) públicos por módulo para encapsulamiento.

## Fase 3: Testing y Calidad
- [ ] **Unit Testing:** Configurar Vitest + React Testing Library.
- [ ] **Tests de Dominio:** Testear los hooks `useProducts` y `useCart` aislados de la UI.
- [ ] **E2E Testing:** Implementar Cypress o Playwright para flujos críticos (Agregar al carrito -> Checkout).

## Fase 4: UX & A11y (Accesibilidad)
- [ ] **Auditoría de Contraste:** Ajustar paleta de colores Neumórfica para cumplir WCAG AA.
- [ ] **Navegación por Teclado:** Asegurar `focus-visible` en todos los elementos interactivos.
- [ ] **ARIA Attributes:** Implementar `aria-labels`, `aria-expanded` y roles correctos en Modales y Drawers.
