# 🧪 Estrategia de Testing - MyProjectAPI12

**Fecha:** 5 de Febrero, 2026  
**Objetivo:** Detectar bugs antes de producción

---

## 🎯 Por qué el Bug del Carrito no fue Detectado

### Análisis del Problema

**Bug:** El botón del carrito no abría el panel.

**Causa Raíz:**

```javascript
// ❌ ANTES (Cart.jsx y CartIcon.jsx)
import { useContext } from "react";
import { CartContext } from "@/features/cart/application/CartContext";
const { cart } = useContext(CartContext);

// ✅ DESPUÉS
import { useCart } from "@/features/cart/application/useCart";
const { cart } = useCart();
```

### Por qué no lo detecté en el análisis inicial

1. **Análisis estático vs Runtime**
    - ✅ Revisé código fuente
    - ✅ Revisé estructura
    - ❌ NO ejecuté la app en el navegador
    - ❌ NO probé funcionalidad manualmente

2. **El bug se introdujo en la Fase 3**
    - Creé `useCart()` hook
    - Refactoricé `CartContext.jsx`
    - Olvidé actualizar `Cart.jsx` y `CartIcon.jsx`

3. **Falta de tests de integración**
    - Test actual: Solo `CartContext` aislado
    - Faltaba: Tests de componentes que usan el contexto

---

## 🧪 Tipos de Testing en React

### 1. Tests Unitarios (Funciones Puras)

**¿Qué testear?**

- Funciones del domain layer
- Utilidades
- Helpers

**Ejemplo:**

```javascript
// src/features/cart/domain/__tests__/cartUtils.test.js

import { calculateTotal, addItemToCart, validateCartItem } from "../cartUtils";

describe("cartUtils", () => {
    describe("calculateTotal", () => {
        test("calcula el total correctamente", () => {
            const cart = [
                { price: 10, quantity: 2 },
                { price: 5, quantity: 3 },
            ];
            expect(calculateTotal(cart)).toBe(35);
        });

        test("retorna 0 para carrito vacío", () => {
            expect(calculateTotal([])).toBe(0);
        });
    });

    describe("addItemToCart", () => {
        test("agrega nuevo producto", () => {
            const cart = [];
            const product = { id: 1, title: "Test", price: 10 };
            const result = addItemToCart(cart, product, 1);

            expect(result).toHaveLength(1);
            expect(result[0]).toEqual({ ...product, quantity: 1 });
        });

        test("incrementa cantidad si producto existe", () => {
            const cart = [{ id: 1, title: "Test", price: 10, quantity: 1 }];
            const product = { id: 1, title: "Test", price: 10 };
            const result = addItemToCart(cart, product, 2);

            expect(result).toHaveLength(1);
            expect(result[0].quantity).toBe(3);
        });
    });

    describe("validateCartItem", () => {
        test("valida producto correcto", () => {
            const product = { id: 1, stock: 10 };
            const result = validateCartItem(product, 5);

            expect(result.valid).toBe(true);
            expect(result.error).toBeNull();
        });

        test("rechaza cantidad mayor al stock", () => {
            const product = { id: 1, stock: 5 };
            const result = validateCartItem(product, 10);

            expect(result.valid).toBe(false);
            expect(result.error).toBe("Insufficient stock");
        });
    });
});
```

---

### 2. Tests de Hooks (React Hooks)

**¿Qué testear?**

- Hooks personalizados
- Lógica de estado
- Side effects

**Ejemplo:**

```javascript
// src/features/cart/application/hooks/__tests__/useCartActions.test.js

import { renderHook, act } from "@testing-library/react";
import { useCartActions } from "../useCartActions";
import toast from "react-hot-toast";

jest.mock("react-hot-toast");

describe("useCartActions", () => {
    let setCart;
    let openCart;

    beforeEach(() => {
        setCart = jest.fn();
        openCart = jest.fn();
        toast.success = jest.fn();
        toast.error = jest.fn();
    });

    test("addToCart agrega producto y muestra toast", () => {
        const { result } = renderHook(() => useCartActions(setCart, openCart));
        const product = { id: 1, title: "Test", price: 10 };

        act(() => {
            result.current.addToCart(product, 1);
        });

        expect(setCart).toHaveBeenCalled();
        expect(toast.success).toHaveBeenCalledWith("Product added to cart!");
        expect(openCart).toHaveBeenCalled();
    });

    test("removeFromCart elimina producto", () => {
        const { result } = renderHook(() => useCartActions(setCart, openCart));

        act(() => {
            result.current.removeFromCart(1);
        });

        expect(setCart).toHaveBeenCalled();
        expect(toast.error).toHaveBeenCalledWith("Product removed from cart.");
    });

    test("clearCart vacía el carrito", () => {
        const { result } = renderHook(() => useCartActions(setCart, openCart));

        act(() => {
            result.current.clearCart();
        });

        expect(setCart).toHaveBeenCalledWith([]);
        expect(toast.success).toHaveBeenCalledWith(
            "The cart has been emptied.",
        );
    });
});
```

---

### 3. Tests de Componentes (React Components)

**¿Qué testear?**

- Renderizado
- Interacciones del usuario
- Integración con contextos/hooks

**Ejemplo que habría detectado el bug:**

```javascript
// src/features/cart/presentation/__tests__/Cart.test.jsx

import { render, screen, fireEvent } from "@testing-library/react";
import { CartProvider } from "@/features/cart/application/CartContext";
import Cart from "../Cart";

const renderWithProvider = (component) => {
    return render(<CartProvider>{component}</CartProvider>);
};

describe("Cart Component", () => {
    test("renderiza correctamente cuando está cerrado", () => {
        renderWithProvider(<Cart />);

        const drawer = screen.getByRole("dialog");
        expect(drawer).toHaveClass("translate-x-full"); // Cerrado
    });

    test("se abre cuando isCartOpen es true", () => {
        // Este test habría detectado el bug!
        renderWithProvider(<Cart />);

        // Simular apertura del carrito
        // (necesitaríamos un botón para abrir)
        const drawer = screen.getByRole("dialog");

        // Verificar que tiene las clases correctas
        expect(drawer).toBeInTheDocument();
    });

    test("muestra productos del carrito", () => {
        // Mock del contexto con productos
        renderWithProvider(<Cart />);

        // Agregar producto primero
        // Verificar que se muestra
    });

    test("botón de cerrar funciona", () => {
        renderWithProvider(<Cart />);

        const closeButton = screen.getByLabelText("Close shopping cart");
        fireEvent.click(closeButton);

        // Verificar que se cierra
    });
});
```

**Este test habría fallado y detectado el bug!** ❌

---

### 4. Tests de Integración

**¿Qué testear?**

- Flujos completos
- Múltiples componentes trabajando juntos

**Ejemplo:**

```javascript
// src/features/cart/__tests__/cart-integration.test.jsx

import { render, screen, fireEvent } from "@testing-library/react";
import { CartProvider } from "@/features/cart/application/CartContext";
import Cart from "../presentation/Cart";
import CartIcon from "../presentation/CartIcon";

describe("Cart Integration", () => {
    test("flujo completo: abrir carrito, agregar producto, cerrar", () => {
        const { container } = render(
            <CartProvider>
                <CartIcon onClick={() => {}} />
                <Cart />
            </CartProvider>,
        );

        // 1. Verificar que carrito está cerrado
        const drawer = screen.getByRole("dialog");
        expect(drawer).toHaveClass("translate-x-full");

        // 2. Abrir carrito (esto habría fallado con el bug!)
        const cartIcon = container.querySelector('[role="button"]');
        fireEvent.click(cartIcon);

        // 3. Verificar que se abrió
        expect(drawer).toHaveClass("translate-x-0");

        // 4. Cerrar carrito
        const closeButton = screen.getByLabelText("Close shopping cart");
        fireEvent.click(closeButton);

        // 5. Verificar que se cerró
        expect(drawer).toHaveClass("translate-x-full");
    });
});
```

---

## 📋 Estrategia de Testing Recomendada

### Pirámide de Testing

```
        /\
       /  \      E2E Tests (10%)
      /____\     - Playwright
     /      \    - Flujos críticos
    /        \
   /__________\  Integration Tests (20%)
  /            \ - Múltiples componentes
 /              \- Contextos + Componentes
/________________\
Unit Tests (70%)  - Funciones puras
                  - Hooks
                  - Componentes aislados
```

### Cobertura Mínima Recomendada

| Tipo                         | Coverage Mínimo | Prioridad |
| ---------------------------- | --------------- | --------- |
| **Domain (funciones puras)** | 100%            | 🔴 Alta   |
| **Hooks**                    | 90%             | 🔴 Alta   |
| **Componentes**              | 80%             | 🟡 Media  |
| **Integración**              | 50%             | 🟢 Baja   |

---

## 🎯 Plan de Testing para el Proyecto

### Fase 4: Testing (4 horas)

#### 4.1 Tests Unitarios (1.5 hrs)

- [ ] `cartUtils.test.js` - Funciones puras
    - calculateTotal
    - addItemToCart
    - removeItemFromCart
    - validateCartItem

#### 4.2 Tests de Hooks (1 hr)

- [ ] `useCartActions.test.js`
- [ ] `useCartDrawer.test.js`
- [ ] `useCart.test.js`

#### 4.3 Tests de Componentes (1 hr)

- [ ] `Cart.test.jsx` ⭐ (habría detectado el bug)
- [ ] `CartIcon.test.jsx`
- [ ] `ProductCard.test.jsx`

#### 4.4 Tests de Integración (30 min)

- [ ] `cart-integration.test.jsx`
- [ ] `checkout-flow.test.jsx`

---

## 🔧 Configuración de Testing

### Comandos útiles

```bash
# Ejecutar todos los tests
pnpm test

# Ejecutar con coverage
pnpm test:coverage

# Ejecutar en modo watch
pnpm test -- --watch

# Ejecutar tests específicos
pnpm test cartUtils

# Ver coverage en el navegador
pnpm test:coverage && open coverage/index.html
```

### Configurar coverage mínimo

```javascript
// vitest.config.js
export default {
    test: {
        coverage: {
            provider: "v8",
            reporter: ["text", "html", "lcov"],
            statements: 80,
            branches: 80,
            functions: 80,
            lines: 80,
            exclude: [
                "node_modules/",
                "src/test/",
                "**/*.test.{js,jsx}",
                "**/__tests__/**",
            ],
        },
    },
};
```

---

## 💡 Lecciones Aprendidas

### 1. El análisis estático NO es suficiente

- ✅ Revisar código
- ✅ Revisar estructura
- ❌ NO detecta bugs de runtime
- ❌ NO detecta problemas de integración

### 2. Los tests deben cubrir la integración

- ✅ Test de `CartContext` aislado
- ❌ Faltaba test de componentes que lo usan
- ❌ Faltaba test de flujo completo

### 3. Refactoring sin tests es arriesgado

- Cuando refactorizas (Fase 3)
- DEBES tener tests primero
- O agregar tests inmediatamente después

### 4. Testing es para TODO

- ✅ Funciones JS puras
- ✅ Hooks de React
- ✅ Componentes React
- ✅ Integraciones

---

## 🚀 Próximos Pasos

### Recomendación

**Hacer Fase 6 (TypeScript) ANTES de Fase 4 (Testing)**

¿Por qué?

1. TypeScript detecta errores de tipos en tiempo de desarrollo
2. Los tests con TypeScript son más robustos
3. Mejor autocompletado al escribir tests

### Orden sugerido

1. **Fase 6: TypeScript** (3 hrs)
    - Migrar domain layer
    - Migrar hooks
    - Type-check automático

2. **Fase 4: Testing** (4 hrs)
    - Tests con TypeScript
    - Coverage > 80%
    - CI/CD con tests

3. **Fase 7: Accessibility** (2 hrs)
    - ARIA labels
    - Tests de accesibilidad

---

## ✅ Conclusión

### El bug del carrito se habría detectado con:

1. **Test de componente Cart.jsx**

    ```javascript
    test("el carrito se abre correctamente", () => {
        // Este test habría fallado ❌
    });
    ```

2. **Test de integración**

    ```javascript
    test("CartIcon abre el Cart", () => {
        // Este test habría fallado ❌
    });
    ```

3. **Ejecución manual en el navegador**
    - Probar cada funcionalidad después de refactorizar

### Testing es ESENCIAL para:

- ✅ Detectar bugs temprano
- ✅ Refactorizar con confianza
- ✅ Documentar comportamiento esperado
- ✅ Prevenir regresiones

**El testing NO es opcional, es parte del desarrollo profesional.** 🧪

---

_Creado por Antigravity AI - 5 de Febrero, 2026_
