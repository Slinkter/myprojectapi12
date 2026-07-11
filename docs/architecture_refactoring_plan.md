# Plan de Trabajo - Refactorización de Arquitectura y Eliminación de Duplicación (DRY)

Este plan de trabajo detalla la consolidación de utilidades del sistema para cumplir estrictamente con los principios de Clean Architecture + DDD del proyecto y las guías de `software-architecture`.

---

## Decisiones que Requieren Revisión del Usuario (User Review Required)

> [!IMPORTANT]
> **Consolidación de Utilidades (DRY):** Actualmente existen dos archivos idénticos para la utilidad de clases condicionales `cn()`:
> * [src/lib/utils.ts](file:///C:/Users/LJCR/Documents/GitHub/myprojectapi12/src/lib/utils.ts) (general de Vite)
> * [src/shared/lib/cn.ts](file:///C:/Users/LJCR/Documents/GitHub/myprojectapi12/src/shared/lib/cn.ts) (del módulo `shared` en la arquitectura)
>
> Proponemos eliminar por completo [utils.ts](file:///C:/Users/LJCR/Documents/GitHub/myprojectapi12/src/lib/utils.ts) (y el directorio `src/lib`), y redirigir todos los componentes para que utilicen [cn.ts](file:///C:/Users/LJCR/Documents/GitHub/myprojectapi12/src/shared/lib/cn.ts) de forma directa, mejorando el rendimiento de compilación y respetando la estructura de carpetas modular (DDD/FSD).

---

## Cambios Propuestos

### Fase 1: Redirección de Importaciones a `shared/lib/cn`

Modificar todos los archivos que actualmente importan `cn` de `@/lib/utils` para que importen directamente de `@/shared/lib/cn`. Esto también optimiza el empaquetado al evitar archivos barril (`@/shared/lib` index).

#### [MODIFY] Archivos de la capa Features:
* [Cart.tsx](file:///C:/Users/LJCR/Documents/GitHub/myprojectapi12/src/features/cart/presentation/Cart.tsx)
* [CardInputField.tsx](file:///C:/Users/LJCR/Documents/GitHub/myprojectapi12/src/features/checkout/presentation/components/CardInputField.tsx)
* [CardTypeIndicator.tsx](file:///C:/Users/LJCR/Documents/GitHub/myprojectapi12/src/features/checkout/presentation/components/CardTypeIndicator.tsx)
* [PaymentMethodRadio.tsx](file:///C:/Users/LJCR/Documents/GitHub/myprojectapi12/src/features/checkout/presentation/components/PaymentMethodRadio.tsx)
* [ProductCard.tsx](file:///C:/Users/LJCR/Documents/GitHub/myprojectapi12/src/features/products/presentation/ProductCard.tsx)
* [ProductImageGallery.tsx](file:///C:/Users/LJCR/Documents/GitHub/myprojectapi12/src/features/products/presentation/components/ProductImageGallery.tsx)
* [ProductStockInfo.tsx](file:///C:/Users/LJCR/Documents/GitHub/myprojectapi12/src/features/products/presentation/components/ProductStockInfo.tsx)
* [ThemeSwitcher.tsx](file:///C:/Users/LJCR/Documents/GitHub/myprojectapi12/src/features/theme/presentation/ThemeSwitcher.tsx)

#### [MODIFY] Archivos de la capa Shared/UI:
* [EmptyState.tsx](file:///C:/Users/LJCR/Documents/GitHub/myprojectapi12/src/shared/ui/EmptyState.tsx)
* [ErrorMessage.tsx](file:///C:/Users/LJCR/Documents/GitHub/myprojectapi12/src/shared/ui/ErrorMessage.tsx)
* [LazyImage.tsx](file:///C:/Users/LJCR/Documents/GitHub/myprojectapi12/src/shared/ui/LazyImage.tsx)
* [Loader.tsx](file:///C:/Users/LJCR/Documents/GitHub/myprojectapi12/src/shared/ui/Loader.tsx)
* [Navbar.tsx](file:///C:/Users/LJCR/Documents/GitHub/myprojectapi12/src/shared/ui/Navbar.tsx)
* [dialog.tsx](file:///C:/Users/LJCR/Documents/GitHub/myprojectapi12/src/shared/ui/dialog.tsx)
* [dropdown-menu.tsx](file:///C:/Users/LJCR/Documents/GitHub/myprojectapi12/src/shared/ui/dropdown-menu.tsx)
* [input.tsx](file:///C:/Users/LJCR/Documents/GitHub/myprojectapi12/src/shared/ui/input.tsx)
* [label.tsx](file:///C:/Users/LJCR/Documents/GitHub/myprojectapi12/src/shared/ui/label.tsx)
* [scroll-area.tsx](file:///C:/Users/LJCR/Documents/GitHub/myprojectapi12/src/shared/ui/scroll-area.tsx)
* [sheet.tsx](file:///C:/Users/LJCR/Documents/GitHub/myprojectapi12/src/shared/ui/sheet.tsx)

---

### Fase 2: Limpieza y Remoción de Duplicados

Una vez que todas las importaciones apunten a la estructura limpia:

#### [DELETE] [utils.ts](file:///C:/Users/LJCR/Documents/GitHub/myprojectapi12/src/lib/utils.ts)
* Eliminar el archivo de utilidad obsoleto.

#### [DELETE] Directorio `src/lib`
* Remover la carpeta vacía de la raíz de `src/` para mantener una estructura de archivos limpia y minimalista.

---

## Plan de Verificación

### Pruebas Automatizadas
- Ejecutar `pnpm type-check` para garantizar que no queden importaciones rotas hacia `@/lib/utils`.
- Ejecutar `pnpm test` para asegurar que las pruebas unitarias y de integración de todos los componentes sigan pasando con el nuevo import de `cn`.
