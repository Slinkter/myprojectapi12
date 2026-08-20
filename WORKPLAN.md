# Plan de Trabajo E-commerce Completo con Firebase

Este archivo actúa como el estado de transferencia e hilo conductor para los agentes de IA. Se actualiza después de cada cambio significativo.

---

## 🛠️ Estado General

* **Rama Activa:** `feat/auth` (Fase 1)
* **Punto de Retorno:** Terminada la inicialización de Firebase Auth/Firestore y creado el flujo de Autenticación (`AuthProvider.tsx` + `LoginModal.tsx` + `Navbar.tsx`). Falta validar la compilación final de la Fase 1 y pasar a la Fase 2 (`feat/crud-products`).

---

## 📅 Fases y Progreso

### 🔑 Fase 1: Autenticación & Roles [EN PROGRESO]
* **Rama:** `feat/auth`
* **Archivos creados/modificados:**
  * [MODIFY] `src/shared/lib/firebase.ts` (Inicializado Auth y Firestore `db` / `auth`)
  * [NEW] `src/features/auth/domain/authTypes.ts` (Tipos e interfaces de Auth)
  * [NEW] `src/features/auth/application/AuthContext.ts` (Definición del context y hook `useAuth`)
  * [NEW] `src/features/auth/application/AuthProvider.tsx` (Proveedor con soporte de registro de roles en colección `users`)
  * [NEW] `src/features/auth/presentation/LoginModal.tsx` (Componente UI de Login/Registro con selector de rol e input de confirmación)
  * [MODIFY] `src/App.tsx` (Integrado `AuthProvider` en el orden de wrappers)
  * [MODIFY] `src/widgets/Navbar.tsx` (Botón de Login/Logout, badge de rol de usuario en header, e integración del Modal)
* **Siguiente paso en esta fase:**
  1. Validar que la compilación pase 100% (`pnpm lint` y `pnpm type-check`).
  2. Hacer commit de la Fase 1 en `feat/auth`.

---

### 📦 Fase 2: Catálogo & CRUD de Productos (Admin) [PENDIENTE]
* **Rama:** `feat/crud-products`
* **Objetivos:**
  * Crear interfaz de formulario para crear/editar productos (con url de imagen/placeholder).
  * Crear colección `products` en Firestore.
  * Implementar el script de seeding automático (Opción A) para copiar los productos actuales de DummyJSON a Firestore en la primera carga.
  * Cambiar `ProductList.tsx` y `useProducts.ts` para leer del Firestore en lugar de la API externa.

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
