# Plan de Trabajo E-commerce Completo con Firebase

Este archivo actúa como el estado de transferencia e hilo conductor para los agentes de IA. Se actualiza después de cada cambio significativo.

---

## 🛠️ Estado General

* **Rama Activa:** `feat/crud-products` (Fase 2)
* **Punto de Retorno:** Fase 2 (Catálogo & CRUD de Productos en Firestore) completada con éxito. Compilación, lints y tests estáticos al 100%. Catálogo alimentado desde Firestore con seeding automático y CRUD administrativo operativo.

---

## 📅 Fases y Progreso

### 🔑 Fase 1: Autenticación & Roles [COMPLETADA]
* **Rama:** `feat/auth`
* **Archivos creados/modificados:**
  * [MODIFY] `src/shared/lib/firebase.ts` (Inicializado Auth y Firestore `db` / `auth`)
  * [NEW] `src/features/auth/domain/authTypes.ts` (Tipos e interfaces de Auth)
  * [NEW] `src/features/auth/application/AuthContext.ts` (Definición del context y hook `useAuth`)
  * [NEW] `src/features/auth/application/AuthProvider.tsx` (Proveedor con soporte de registro de roles en colección `users`)
  * [NEW] `src/features/auth/presentation/LoginModal.tsx` (Componente UI de Login/Registro con selector de rol e input de confirmación)
  * [MODIFY] `src/App.tsx` (Integrado `AuthProvider` en el orden de wrappers)
  * [MODIFY] `src/widgets/Navbar.tsx` (Botón de Login/Logout, badge de rol de usuario en header, e integración del Modal)

---

### 📦 Fase 2: Catálogo & CRUD de Productos (Admin) [COMPLETADA]
* **Rama:** `feat/crud-products`
* **Archivos creados/modificados:**
  * [MODIFY] `index.html` (Actualizada CSP para autorizar endpoints de Firestore y Firebase Auth)
  * [NEW] `src/features/products/infrastructure/productsFirestore.ts` (Servicio de datos Firestore con batch seeding de DummyJSON a Firestore, lectura paginada, categorías y CRUD)
  * [MODIFY] `src/features/products/infrastructure/productsApi.ts` (Canalizado hacia Firestore con re-exportación de funciones CRUD)
  * [NEW] `src/features/products/presentation/ProductFormModal.tsx` (Modal de creación y edición de productos con validaciones y campos accesibles)
  * [MODIFY] `src/features/products/application/types.ts` (Actualizado `IProductDetailModalProps` con callbacks opcionales `onEdit` y `onDelete`)
  * [MODIFY] `src/features/products/presentation/ProductDetailModal.tsx` (Integradas acciones de editar y eliminar visibles solo para rol `admin`)
  * [MODIFY] `src/pages/HomeContent.tsx` (Botón de "Nuevo Producto (Admin)", integración de `ProductFormModal`, invalidación de caché TanStack Query)

---

### 💳 Fase 3: Checkout y Colección Compras [PENDIENTE]
* **Rama:** `feat/purchases`
* **Objetivos:**
  * Exigir login para acceder al checkout.
  * Al pagar, registrar la transacción en la colección `compras` y actualizar el stock en la colección `products`.
  * Vaciar el carrito.

---

### 🎫 Fase 4: Historial, Tickets y Estados de Envío [PENDIENTE]
* **Rama:** `feat/tickets-status`
* **Objetivos:**
  * Vista de compras para el Cliente con línea de tiempo y estados de envío detallados.
  * Vista administrativa para gestionar los estados del pedido.

---

### 🏁 Fase 5: QA final y Despliegue [PENDIENTE]
* **Rama:** `feat/qa-integration`
* **Objetivos:**
  * Verificación global con React Doctor.
  * Despliegue final a Firebase Hosting.
