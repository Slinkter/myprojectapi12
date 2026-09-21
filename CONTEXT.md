# CONTEXT.md — Glosario Dominial y Arquitectura del Sistema

Este documento establece el vocabulario dominial compartido y la especificación de módulos para el proyecto `myprojectapi12`. Debe mantenerse actualizado conforme evolucionan los límites y costuras de la aplicación.

---

## 1. Vocabulario Dominial

### Cart (Carrito de Compras)
- **Definición:** Colección reactiva y persistida en almacenamiento local de los productos del catálogo que el usuario ha seleccionado para adquirir.
- **Entidad principal:** [`ICartItem`](file:///home/user/github/myprojectapi12/src/features/cart/domain/cartTypes.ts), que extiende `IProduct` incorporando la propiedad `quantity`.
- **Módulo:** [`src/features/cart`](file:///home/user/github/myprojectapi12/src/features/cart).
- **Invariantes:** Cantidades estrictamente positivas, deduplicación por `id`, y segregación entre estado reactivo (`CartStateContext`) y acciones (`CartActionsContext`).

### Order Intake (Admisión de Pedidos)
- **Definición:** Módulo profundo responsable de orquestar la captura de datos de pago, la aplicación de cupones promocionales validados, el cálculo financiero determinista y la ejecución transaccional del cobro.
- **Interfaz canónica:** Hook [`useCheckoutOrder`](file:///home/user/github/myprojectapi12/src/features/checkout/application/useCheckoutOrder.ts) en la capa de aplicación y [`CheckoutFacade`](file:///home/user/github/myprojectapi12/src/features/checkout/application/CheckoutFacade.ts) para la orquestación de pasarelas y repositorios.
- **Módulo:** [`src/features/checkout`](file:///home/user/github/myprojectapi12/src/features/checkout).

### Order Financials (Desglose Financiero)
- **Definición:** Estructura de datos inmutable y determinista que computa y unifica los montos de una orden.
- **Campos:** `subtotal`, `totalItems`, `discountAmount`, `discountedSubtotal`, `shippingCost`, `finalTotal`, `isFreeShipping`, `progressToFreeShipping`.
- **Módulo de cálculo puro:** [`calculateOrderFinancials`](file:///home/user/github/myprojectapi12/src/features/checkout/domain/financials.ts).
- **Regla:** Es la única fuente de verdad matemática tanto para el componente visual [`OrderSummary`](file:///home/user/github/myprojectapi12/src/features/checkout/presentation/components/OrderSummary.tsx) como para la pasarela de cobro [`CheckoutFacade`](file:///home/user/github/myprojectapi12/src/features/checkout/application/CheckoutFacade.ts), previniendo discrepancias por redondeo.

### Catalog (Catálogo de Productos)
- **Definición:** Repositorio de productos disponibles para visualización, búsqueda, filtrado por categorías y compra.
- **Modelo:** [`IProduct`](file:///home/user/github/myprojectapi12/src/entities/product/model/types.ts).
- **Infraestructura:** Consulta primaria en Firestore (`products`) con siembra automática y degradación elegante (*fallback*) hacia DummyJSON si la base de datos no está disponible.

### Order Lifecycle (Ciclo de Vida de Órdenes)
- **Definición:** Máquina de estados que gestiona una compra desde su registro (`compras`), asociación con el usuario autenticado, y eventual cancelación o reembolso.
- **Invariante de Inventario:** La creación de la orden descuenta el stock disponible de forma atómica en Firestore; la anulación de la orden restituye dicho stock.
- **Módulos:** [`src/features/checkout/infrastructure/FirestoreCheckoutRepository.ts`](file:///home/user/github/myprojectapi12/src/features/checkout/infrastructure/FirestoreCheckoutRepository.ts) y [`src/features/orders`](file:///home/user/github/myprojectapi12/src/features/orders).

---

## 2. Decisiones de Diseño y Costuras (Seams)

1. **Localidad del Carrito:** `ICartItem` vive dentro de `@/features/cart/domain/cartTypes` tras la eliminación de la micro-capa pasante `src/entities/cart-item`.
2. **Cálculo Financiero Centralizado:** No se permite realizar aritmética de subtotales, cupones o envíos en componentes de presentación (`OrderSummary.tsx`). Toda cifra monetaria emana de `calculateOrderFinancials`.
3. **Consolidación de Hooks:** La vista de checkout consume el hook profundo `useCheckoutOrder`, evitando la orquestación dispersa de múltiples hooks individuales en la capa de presentación.
