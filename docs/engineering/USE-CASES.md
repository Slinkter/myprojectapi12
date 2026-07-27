# Casos de Uso

Documentación formal de casos de uso siguiendo el estándar de Alistair Cockburn (*Writing Effective Use Cases*).

---

## UC-01: Explorar Catálogo de Productos

| Atributo | Valor |
|---|---|
| **Actor principal** | Usuario no autenticado |
| **Precondiciones** | La aplicación está cargada en el navegador |
| **Postcondiciones** | El usuario visualiza productos del catálogo |
| **Disparador** | El usuario ingresa a la página principal |
| **Prioridad** | Alta |

### Flujo principal
1. El sistema carga los productos desde DummyJSON API usando `useInfiniteQuery`
2. El sistema muestra el grid de productos con animación de entrada (`staggerContainer` + `slideUp`)
3. El usuario hace scroll o presiona "Cargar más productos"
4. El sistema solicita la siguiente página de 20 productos
5. El sistema agrega los nuevos productos al grid con animación `whileInView`
6. El usuario puede ver la tarjeta de cada producto (imagen, precio, descuento, calificación, stock)

### Flujos alternos
- **2a. Error de red**: El sistema muestra `<ErrorMessage>` con botón "Reintentar"
- **2b. Sin productos**: El sistema muestra `<EmptyState>` con mensaje "No se encontraron productos"
- **5a. Sin más páginas**: El sistema oculta el botón "Cargar más" y muestra "Has visto todos los productos"

---

## UC-02: Buscar Productos

| Atributo | Valor |
|---|---|
| **Actor principal** | Usuario no autenticado |
| **Precondiciones** | El catálogo de productos está visible |
| **Postcondiciones** | El usuario visualiza resultados filtrados |
| **Disparador** | El usuario escribe en el campo de búsqueda |
| **Prioridad** | Alta |

### Flujo principal
1. El usuario escribe en `<SearchInput>` (en navbar o en la página principal)
2. El sistema aplica debounce de 350ms (`useDebounce`)
3. El sistema filtra localmente los productos por título, descripción, categoría o marca
4. El sistema actualiza el grid mostrando solo los productos que coinciden
5. El sistema muestra el contador "X resultados para 'consulta'"

### Flujos alternos
- **2a. Consulta vacía**: El sistema muestra todos los productos sin filtrar
- **4a. Sin resultados**: El sistema muestra `<EmptyState>` con mensaje de búsqueda sin resultados
- **5a. Búsqueda desde navbar**: El sistema navega al home y enfoca el input de búsqueda

---

## UC-03: Gestionar Carrito de Compras

| Atributo | Valor |
|---|---|
| **Actor principal** | Usuario no autenticado |
| **Precondiciones** | Hay productos disponibles en el catálogo |
| **Postcondiciones** | El carrito refleja los cambios realizados |
| **Disparador** | El usuario presiona "Añadir" en una tarjeta de producto |
| **Prioridad** | Alta |

### Flujo principal — Agregar producto
1. El usuario presiona "Añadir" en `ProductCard` o "Añadir al Carrito" en `ProductDetailModal`
2. El sistema valida el stock disponible (`validateCartItem`)
3. El sistema agrega el producto al carrito usando `addItemToCart`
4. El sistema abre el drawer del carrito con animación slide-in spring
5. El sistema muestra un toast de confirmación
6. El usuario visualiza el item en el drawer con su precio, cantidad y subtotal

### Flujo principal — Modificar cantidad
1. El usuario presiona `+` o `-` en `CartItemRow`
2. El sistema actualiza la cantidad vía `updateQuantity`
3. El sistema recalcula subtotales y total
4. Si la cantidad llega a 0, el sistema elimina el item del carrito

### Flujo principal — Eliminar producto
1. El usuario presiona el ícono de papelera en `CartItemRow`
2. El sistema elimina el producto usando `removeItemFromCart`
3. El sistema recalcula el total
4. El sistema muestra un toast de confirmación

### Flujo alterno
- **2a. Stock insuficiente**: El sistema muestra toast de error y no agrega el producto

---

## UC-04: Realizar Pago

| Atributo | Valor |
|---|---|
| **Actor principal** | Usuario no autenticado |
| **Precondiciones** | El carrito contiene al menos un producto |
| **Postcondiciones** | El carrito se vacía y se genera una orden de compra |
| **Disparador** | El usuario presiona "Proceder al Pago" en el drawer del carrito |
| **Prioridad** | Alta |

### Flujo principal
1. El usuario presiona "Proceder al Pago"
2. El sistema navega a `/checkout`
3. El usuario selecciona método de pago (tarjeta crédito/débito o Bitcoin)
4. **Si es tarjeta**: El usuario completa los campos (número, nombre, expiry, CVC)
5. El sistema valida en tiempo real (Luhn, formato expiry, CVC)
6. El usuario ingresa código de descuento (opcional)
7. El usuario revisa el resumen del pedido (items, subtotal, descuento, envío, total)
8. El usuario presiona "Pagar"
9. El sistema valida todos los campos
10. El sistema genera un ID de orden (`ORD-{timestamp}-{random}`)
11. El sistema vacía el carrito (`clearCart`)
12. El sistema navega a `/checkout-success` con datos de la orden
13. El sistema muestra el resumen de la compra con ID, items, total y método de pago

### Flujos alternos
- **3a. Bitcoin**: El sistema omite el formulario de tarjeta y permite pagar directamente
- **7a. Código inválido**: El sistema muestra error "Código de descuento no válido"
- **9a. Validación falla**: El sistema marca los campos inválidos y muestra errores específicos
- **9b. Carrito vacío**: El sistema redirige al home

---

## UC-05: Cambiar Tema (Claro/Oscuro)

| Atributo | Valor |
|---|---|
| **Actor principal** | Usuario no autenticado |
| **Precondiciones** | La aplicación está cargada en el navegador |
| **Postcondiciones** | El tema visual cambia y se persiste la preferencia |
| **Disparador** | El usuario presiona el botón de sol/luna en la navbar |
| **Prioridad** | Media |

### Flujo principal
1. El usuario presiona el botón de tema en la navbar
2. El sistema detecta el tema actual
3. El sistema cambia al tema opuesto (claro ↔ oscuro)
4. El sistema persiste la preferencia en localStorage (`theme`)
5. El sistema aplica la clase `.dark` al elemento `<html>`
6. El sistema anima la transición del ícono (sol ↔ luna con rotación)

### Flujo alterno
- **1a. Primera visita**: El sistema detecta `prefers-color-scheme` del sistema operativo y aplica ese tema por defecto

---

## Matriz de trazabilidad

| Caso de Uso | Feature | Componentes principales | Hooks principales |
|---|---|---|---|
| UC-01 | products | ProductList, ProductGrid, ProductCard, SkeletonGrid, LoadMoreSection | useProducts, useCategories |
| UC-02 | products | SearchInput, ProductList | useDebounce, useProductSearch |
| UC-03 | cart | Cart (drawer), CartHeader, CartItemRow, CartFooter, CartEmptyState | useCart, useCartActions, useCartDrawer |
| UC-04 | checkout | Checkout, PaymentMethodSelector, CardForm, OrderSummary, CheckoutSteps, CheckoutSuccess | useCheckout, useDiscountValidation |
| UC-05 | theme | ThemeSwitcher | useTheme |
