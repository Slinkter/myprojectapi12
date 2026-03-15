# Tutorial Completo de Testing en React

```
╔══════════════════════════════════════════════════════════════════════════════╗
║                           GUÍA DE TESTING EN REACT                          ║
║                    Vitest + React Testing Library + Factories               ║
╚══════════════════════════════════════════════════════════════════════════════╝
```

---

## Índice

1. [Arquitectura de Testing](#1-arquitectura-de-testing)
2. [Setup y Configuración](#2-setup-y-configuración)
3. [Factories (Datos de Prueba)](#3-factories-datos-de-prueba)
4. [Test de Funciones Puras](#4-test-de-funciones-puras)
5. [Test de Componentes UI](#5-test-de-componentes-ui)
6. [Test de Componentes con Context](#6-test-de-componentes-con-context)
7. [Test de Hooks Personalizados](#7-test-de-hooks-personalizados)
8. [Test de Funciones Asíncronas](#8-test-de-funciones-asíncronas)
9. [Mocks y Spies](#9-mocks-y-spies)
10. [Patrones Avanzados](#10-patrones-avanzados)
11. [Comandos Útiles](#11-comandos-útiles)

---

## 1. Arquitectura de Testing

### Estructura del Proyecto

```
src/
├── test/
│   ├── factories/              ← Fábricas de datos de prueba
│   │   └── productFactory.ts
│   ├── setup.js               ← Configuración global de tests
│   └── utils.tsx              ← Utilidades para tests
│
├── features/
│   └── products/
│       ├── domain/            ← Lógica de negocio
│       │   └── __tests__/
│       │       └── productUtils.test.ts
│       ├── application/       ← Hooks y estado
│       │   ├── __tests__/
│       │   │   └── useProducts.test.tsx
│       │   └── useProducts.ts
│       └── presentation/      ← Componentes UI
│           ├── __tests__/
│           │   ├── ProductCard.test.tsx
│           │   ├── ProductList.test.tsx
│           │   └── ProductDetailModal.test.tsx
│           ├── ProductCard.tsx
│           └── ProductList.tsx
```

### Flujo de Testing

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        FLUJO DE UN TEST                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   ┌──────────────┐     ┌──────────────┐     ┌──────────────┐              │
│   │   ARRANGE    │ ──▶ │     ACT      │ ──▶ │   ASSERT     │              │
│   │  (Preparar)  │     │   (Actuar)   │     │ (Verificar)  │              │
│   └──────────────┘     └──────────────┘     └──────────────┘              │
│         │                     │                     │                        │
│         ▼                     ▼                     ▼                        │
│   • Crear datos        • Ejecutar           • Verificar                     │
│   • Mockear APIs       • Interactuar        • expect()                     │
│   • Renderizar         • Simular eventos    • toBe(), toHaveBeenCalled()   │
│   • Configurar props   • Click, input, etc.                                │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Setup y Configuración

### Configuración de Vitest

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    environment: 'jsdom',           // Simula el DOM del navegador
    globals: true,                  // Permite describe, it, expect sin imports
    setupFiles: ['./src/test/setup.js'],
    include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

### Setup Global

```javascript
// src/test/setup.js
import '@testing-library/jest-dom';

// Mock de window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock de scrollIntoView
Element.prototype.scrollIntoView = vi.fn();
```

---

## 3. Factories (Datos de Prueba)

### Por qué usar Factories?

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         SIN FACTORY (❌)                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   // En cada test, crear objeto manualmente                                 │
│   const product = {                                                         │
│     id: 1,                                                                  │
│     title: 'Test Product',                                                 │
│     price: 100,                                                            │
│     stock: 10,    ← Se repite en cada test                                 │
│     thumbnail: '...',                                                       │
│     // ... muchos más campos                                                │
│   };                                                                        │
│                                                                             │
│   // Si cambias la interfaz, ¡tienes que actualizar TODOS los tests!        │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                         CON FACTORY (✅)                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   // Crear con valores por defecto                                          │
│   const product = makeProduct();                                            │
│                                                                             │
│   // Sobrescribir solo lo que necesitas                                     │
│   const cheapProduct = makeProduct({ price: 10 });                         │
│   const outOfStock = makeProduct({ stock: 0 });                            │
│                                                                             │
│   // Un solo lugar para cambiar → actualiza TODOS los tests automáticamente│
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Implementación de Factory

```typescript
// src/test/factories/productFactory.ts
import type { IProduct } from '@/features/products/domain/productTypes';
import type { ICartItem } from '@/features/cart/domain/cartTypes';

/**
 * Factory para crear productos de prueba.
 * 
 * @param overrides - Campos a sobrescribir
 * @returns IProduct válido
 * 
 * @example
 * const product = makeProduct({ price: 99.99, stock: 5 });
 */
export const makeProduct = (overrides: Partial<IProduct> = {}): IProduct => ({
  id: 1,
  title: 'Test Product',
  description: 'A product used in unit tests.',
  price: 100,
  stock: 10,
  thumbnail: 'https://example.com/img.jpg',
  images: ['https://example.com/img.jpg'],
  category: 'test',
  brand: 'Test Brand',
  discountPercentage: 0,
  rating: 4.5,
  ...overrides,  // Sobrescribe los valores por defecto
});

/**
 * Factory para crear items del carrito.
 * 
 * @param overrides - Campos a sobrescribir
 * @returns ICartItem válido
 */
export const makeCartItem = (overrides: Partial<ICartItem> = {}): ICartItem => ({
  ...makeProduct(),     // Hereda todas las propiedades de producto
  quantity: 1,          // + quantity específica del carrito
  ...overrides,
});
```

### Usar Factories en Tests

```typescript
import { makeProduct, makeCartItem } from '@/test/factories/productFactory';

describe('Ejemplos de uso', () => {
  // Valores por defecto
  const product = makeProduct();
  // { id: 1, title: 'Test Product', price: 100, stock: 10, ... }

  // Sobrescribir algunos campos
  const cheapProduct = makeProduct({ price: 10 });
  // { id: 1, title: 'Test Product', price: 10, stock: 10, ... }

  const outOfStock = makeProduct({ stock: 0 });
  // { id: 1, title: 'Test Product', price: 100, stock: 0, ... }

  // Carrito
  const cartItem = makeCartItem({ quantity: 5, price: 25 });
  // { id: 1, quantity: 5, price: 25, ... }
});
```

---

## 4. Test de Funciones Puras

### Qué son Funciones Puras?

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    FUNCIÓN PURA vs IMPURA                                   │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   PURA (✅)                              IMPURA (❌)                         │
│   ─────────                              ──────────                         │
│   • Mismo entrada → Mismo salida         • Depende de estado externo       │
│   • No tiene efectos secundarios         • Puede modificar el estado       │
│   • Fácil de testear                     • Difícil de testear               │
│   • Determinista                         • No determinista                 │
│                                                                             │
│   function sum(a, b) {                   let count = 0;                   │
│     return a + b;                        function increment() {           │
│   }                                        count++;                       │
│                                            return count;                   │
│                                           }                                 │
│   // Test: sum(2,3) siempre es 5         // Test: increment() varía       │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Ejemplo: cartUtils

```typescript
// src/features/cart/domain/cartUtils.ts
export const calculateTotal = (items: CartItem[]): number => {
  return items.reduce((total, item) => total + (item.price * item.quantity), 0);
};

export const addItemToCart = (cart: CartItem[], product: Product, quantity: number): CartItem[] => {
  const existingItem = cart.find(item => item.id === product.id);
  
  if (existingItem) {
    return cart.map(item => 
      item.id === product.id 
        ? { ...item, quantity: item.quantity + quantity }
        : item
    );
  }
  
  return [...cart, { ...product, quantity }];
};

export const removeItemFromCart = (cart: CartItem[], productId: number): CartItem[] => {
  return cart.filter(item => item.id !== productId);
};

export const validateCartItem = (product: Product | null | undefined, quantity: number) => {
  if (!product) return { isValid: false, error: 'Producto inválido' };
  if (quantity <= 0) return { isValid: false, error: 'La cantidad debe ser mayor a 0' };
  if (quantity > product.stock) return { isValid: false, error: 'Stock insuficiente' };
  return { isValid: true, error: null };
};
```

### Tests Completos

```typescript
// src/features/cart/domain/__tests__/cartUtils.test.ts
import { describe, test, expect } from 'vitest';
import {
  calculateTotal,
  addItemToCart,
  removeItemFromCart,
  validateCartItem,
} from '../cartUtils';
import { makeProduct, makeCartItem } from '@/test/factories/productFactory';

describe('cartUtils', () => {
  // ═══════════════════════════════════════════════════════════════════════
  // calculateTotal
  // ═══════════════════════════════════════════════════════════════════════
  
  describe('calculateTotal', () => {
    test('calcula el total correctamente', () => {
      // Arrange: Crear items de carrito
      const cart = [
        makeCartItem({ id: 1, price: 10, quantity: 2 }),  // 20
        makeCartItem({ id: 2, price: 5, quantity: 3 }),   // 15
      ];
      
      // Act: Ejecutar la función
      const total = calculateTotal(cart);
      
      // Assert: Verificar resultado (20 + 15 = 35)
      expect(total).toBe(35);
    });

    test('retorna 0 para carrito vacío', () => {
      expect(calculateTotal([])).toBe(0);
    });

    test('maneja decimales correctamente', () => {
      const cart = [makeCartItem({ price: 9.99, quantity: 3 })];
      expect(calculateTotal(cart)).toBeCloseTo(29.97, 2);
    });
  });

  // ═══════════════════════════════════════════════════════════════════════
  // addItemToCart
  // ═══════════════════════════════════════════════════════════════════════
  
  describe('addItemToCart', () => {
    test('agrega nuevo producto al carrito vacío', () => {
      // Arrange
      const cart: ReturnType<typeof makeCartItem>[] = [];
      const product = makeProduct({ id: 1, price: 10 });
      
      // Act
      const result = addItemToCart(cart, product, 1);
      
      // Assert
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({ ...product, quantity: 1 });
    });

    test('incrementa cantidad si producto ya existe', () => {
      // Arrange
      const cart = [makeCartItem({ id: 1, price: 10, quantity: 2 })];
      const product = makeProduct({ id: 1, price: 10 });
      
      // Act
      const result = addItemToCart(cart, product, 3);
      
      // Assert
      expect(result).toHaveLength(1);
      expect(result[0].quantity).toBe(5); // 2 + 3 = 5
    });

    test('agrega nuevo producto sin afectar existentes', () => {
      // Arrange
      const cart = [makeCartItem({ id: 1, price: 10, quantity: 1 })];
      const product = makeProduct({ id: 2, price: 20 });
      
      // Act
      const result = addItemToCart(cart, product, 1);
      
      // Assert
      expect(result).toHaveLength(2);
      expect(result[0].id).toBe(1);  // Original mantiene su ID
      expect(result[1].id).toBe(2);  // Nuevo producto
    });
  });

  // ═══════════════════════════════════════════════════════════════════════
  // removeItemFromCart
  // ═══════════════════════════════════════════════════════════════════════
  
  describe('removeItemFromCart', () => {
    test('elimina producto del carrito', () => {
      const cart = [
        makeCartItem({ id: 1, quantity: 1 }),
        makeCartItem({ id: 2, quantity: 1 }),
      ];
      
      const result = removeItemFromCart(cart, 1);
      
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(2);
    });

    test('retorna carrito vacío si se elimina el único producto', () => {
      const cart = [makeCartItem({ id: 1, quantity: 1 })];
      const result = removeItemFromCart(cart, 1);
      expect(result).toHaveLength(0);
    });

    test('no afecta el carrito si el ID no existe', () => {
      const cart = [makeCartItem({ id: 1, quantity: 1 })];
      const result = removeItemFromCart(cart, 999);
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(1);
    });
  });

  // ═══════════════════════════════════════════════════════════════════════
  // validateCartItem
  // ═══════════════════════════════════════════════════════════════════════
  
  describe('validateCartItem', () => {
    test('valida producto correcto', () => {
      const product = makeProduct({ stock: 10 });
      const result = validateCartItem(product, 5);
      
      expect(result.isValid).toBe(true);
      expect(result.error).toBeNull();
    });

    test('rechaza producto null', () => {
      const result = validateCartItem(null, 1);
      
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Producto inválido');
    });

    test('rechaza producto undefined', () => {
      const result = validateCartItem(undefined, 1);
      
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Producto inválido');
    });

    test('rechaza cantidad cero', () => {
      const product = makeProduct({ stock: 10 });
      const result = validateCartItem(product, 0);
      
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('La cantidad debe ser mayor a 0');
    });

    test('rechaza cantidad negativa', () => {
      const product = makeProduct({ stock: 10 });
      const result = validateCartItem(product, -5);
      
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('La cantidad debe ser mayor a 0');
    });

    test('rechaza cantidad mayor al stock', () => {
      const product = makeProduct({ stock: 5 });
      const result = validateCartItem(product, 10);
      
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Stock insuficiente');
    });

    test('acepta cantidad igual al stock', () => {
      const product = makeProduct({ stock: 5 });
      const result = validateCartItem(product, 5);
      
      expect(result.isValid).toBe(true);
      expect(result.error).toBeNull();
    });
  });
});
```

---

## 5. Test de Componentes UI

### render, screen, fireEvent

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    ANATOMÍA DE UN TEST DE COMPONENTE                         │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   import { render, screen, fireEvent } from '@testing-library/react';       │
│                                                                             │
│   ┌─────────────────────────────────────────────────────────────────┐       │
│   │  render()  →  Crea el componente en un DOM virtual            │       │
│   │                Devuelve: { container, rerender, unmount }        │       │
│   └─────────────────────────────────────────────────────────────────┘       │
│                                                                             │
│   ┌─────────────────────────────────────────────────────────────────┐       │
│   │  screen    →  Objeto con métodos para buscar elementos         │       │
│   │                • getByText()     - Busca por texto             │       │
│   │                • getByLabelText()- Busca por label de input    │       │
│   │                • getByRole()     - Busca por rol semántico      │       │
│   │                • getByTestId()   - Busca por data-testid        │       │
│   └─────────────────────────────────────────────────────────────────┘       │
│                                                                             │
│   ┌─────────────────────────────────────────────────────────────────┐       │
│   │  fireEvent  →  Simula eventos del usuario                      │       │
│   │                • click()       - Clic en elemento               │       │
│   │                • change()      - Cambio en input               │       │
│   │                • submit()      - Envío de formulario            │       │
│   │                • keyDown()     - Presionar tecla               │       │
│   └─────────────────────────────────────────────────────────────────┘       │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Test de Button

```typescript
// src/components/ui/__tests__/button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Button } from '@/components/ui/button';

describe('Button Component', () => {
  // Test básico: verificar que el botón se renderiza con el texto correcto
  it('renderiza el botón con el texto proporcionado', () => {
    // Arrange + Act
    render(<Button>Click me</Button>);
    
    // Assert
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
  });

  // Test: verificar que responde al click
  it('llama a onClick cuando se hace click', () => {
    // Arrange: Crear función mock
    const handleClick = vi.fn(); // vi.fn() = mock function
    
    // Act
    render(<Button onClick={handleClick}>Click me</Button>);
    fireEvent.click(screen.getByRole('button'));
    
    // Assert
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  // Test: verificar variant
  it('renderiza con variant destructive', () => {
    render(<Button variant="destructive">Delete</Button>);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  // Test: verificar que está deshabilitado
  it('no llama a onClick cuando está deshabilitado', () => {
    const handleClick = vi.fn();
    
    render(<Button disabled onClick={handleClick}>Disabled</Button>);
    fireEvent.click(screen.getByRole('button'));
    
    expect(handleClick).not.toHaveBeenCalled();
  });

  // Test: con icono
  it('renderiza con icono', () => {
    const icon = <span data-testid="icon">🔔</span>;
    render(<Button>{icon} Notificar</Button>);
    
    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });
});
```

### Test de Input

```typescript
// src/components/ui/__tests__/input.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Input } from '@/components/ui/input';

describe('Input Component', () => {
  // Test: renderiza correctamente
  it('renderiza el input', () => {
    render(<Input placeholder="Escribe aquí" />);
    expect(screen.getByPlaceholderText(/escribe aquí/i)).toBeInTheDocument();
  });

  // Test: tiene el label correcto
  it('asocia correctamente el label con el input', () => {
    render(
      <>
        <label htmlFor="email-input">Email</label>
        <Input id="email-input" type="email" />
      </>
    );
    
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
  });

  // Test: llama onChange al escribir
  it('llama onChange cuando el usuario escribe', () => {
    const handleChange = vi.fn();
    
    render(<Input onChange={handleChange} />);
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'Hola' } });
    
    expect(handleChange).toHaveBeenCalled();
  });

  // Test: muestra valor controlado
  it('muestra el valor controlado', () => {
    render(<Input value="Valor inicial" readOnly />);
    expect(screen.getByDisplayValue('Valor inicial')).toBeInTheDocument();
  });

  // Test: muestra error
  it('renderiza con estado de error', () => {
    render(<Input error="Campo requerido" />);
    expect(screen.getByText('Campo requerido')).toBeInTheDocument();
  });
});
```

---

## 6. Test de Componentes con Context

### Estructura del Provider

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    COMPONENTE CON CONTEXT                                   │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   ┌────────────────────────────────────────────────────────────────┐       │
│   │                     App                                         │       │
│   │  ┌──────────────────────────────────────────────────────────┐  │       │
│   │  │              ThemeProvider                                │  │       │
│   │  │  ┌────────────────────────────────────────────────────┐   │  │       │
│   │  │  │         ThemeSwitcher                               │   │  │       │
│   │  │  │         (usa useTheme)                              │   │  │       │
│   │  │  └────────────────────────────────────────────────────┘   │  │       │
│   │  └──────────────────────────────────────────────────────────┘  │       │
│   └────────────────────────────────────────────────────────────────┘       │
│                                                                             │
│   TEST: Envolvemos el componente en su Provider                            │
│   ┌────────────────────────────────────────────────────────────────┐       │
│   │  render(                                                        │       │
│   │    <ThemeProvider>                                            │       │
│   │      <ThemeSwitcher />                                         │       │
│   │    </ThemeProvider>                                           │       │
│   │  )                                                             │       │
│   └────────────────────────────────────────────────────────────────┘       │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Ejemplo: ThemeSwitcher con Context

```typescript
// src/features/theme/presentation/__tests__/ThemeSwitcher.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ThemeSwitcher from '../ThemeSwitcher';
import { ThemeProvider } from '@/features/theme/application/ThemeContext';

describe('ThemeSwitcher Component', () => {
  // ═══════════════════════════════════════════════════════════════════════
  // IMPORTANTE: Envolver en el Provider
  // ═══════════════════════════════════════════════════════════════════════
  
  const renderWithTheme = (component: React.ReactElement) => {
    return render(
      <ThemeProvider>
        {component}
      </ThemeProvider>
    );
  };

  it('alterna el tema al hacer clic', () => {
    // Arrange + Act
    renderWithTheme(<ThemeSwitcher />);

    const button = screen.getByRole('button');
    
    // Assert inicial (theme por defecto = light)
    expect(button).toHaveAttribute('aria-label', 'Cambiar a modo oscuro');

    // Act: Click para cambiar a dark
    fireEvent.click(button);
    
    // Assert: Ahora debe decir "Cambiar a modo claro"
    expect(button).toHaveAttribute('aria-label', 'Cambiar a modo claro');

    // Act: Click para volver a light
    fireEvent.click(button);
    
    // Assert: Debe decir "Cambiar a modo oscuro" otra vez
    expect(button).toHaveAttribute('aria-label', 'Cambiar a modo oscuro');
  });
});
```

### Ejemplo: ProductDetailModal con CartContext

```typescript
// src/features/products/presentation/__tests__/ProductDetailModal.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ProductDetailModal from '../ProductDetailModal';
import { CartProvider } from '@/features/cart/application/CartContext';

// ════════════════════════════════════════════════════════════════════════════
// IMPORTANTE: Mock de framer-motion
// Las animaciones pueden causar problemas en tests, las mockeamos
// ════════════════════════════════════════════════════════════════════════════
vi.mock('framer-motion', () => ({
  m: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

describe('ProductDetailModal Component', () => {
  // ═══════════════════════════════════════════════════════════════════════
  // Setup: Crear datos de prueba
  // ═══════════════════════════════════════════════════════════════════════
  
  const mockProduct = {
    id: 1,
    title: 'Reloj Premium',
    description: 'Un reloj de lujo',
    price: 500,
    stock: 10,
    brand: 'Rolex',
    category: 'Relojes',
    thumbnail: 'https://example.com/reloj.jpg',
    images: ['https://example.com/reloj.jpg'],
  };

  const defaultProps = {
    product: mockProduct,
    isOpen: true,
    onClose: vi.fn(),
  };

  // Helper para renderizar con CartProvider
  const renderWithCart = (component: React.ReactElement) => {
    return render(
      <CartProvider>
        {component}
      </CartProvider>
    );
  };

  // ═══════════════════════════════════════════════════════════════════════
  // Tests
  // ═══════════════════════════════════════════════════════════════════════
  
  it('renderiza los detalles del producto cuando está abierto', () => {
    // Arrange + Act
    renderWithCart(<ProductDetailModal {...defaultProps} />);

    // Assert: Verificar que muestra la información del producto
    expect(screen.getByText('Reloj Premium')).toBeInTheDocument();
    expect(screen.getByText('Un reloj de lujo')).toBeInTheDocument();
    expect(screen.getByText('$500.00')).toBeInTheDocument();
  });

  it('llama a onClose al hacer clic en el botón de cierre', () => {
    // Arrange
    const onClose = vi.fn();
    
    // Act
    renderWithCart(<ProductDetailModal {...defaultProps} onClose={onClose} />);
    
    const closeButton = screen.getByLabelText('Cerrar modal');
    fireEvent.click(closeButton);
    
    // Assert
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('no renderiza nada si isOpen es false', () => {
    // Arrange
    const { container } = renderWithCart(
      <ProductDetailModal {...defaultProps} isOpen={false} />
    );

    // Assert: No debe renderizar nada
    expect(container.firstChild).toBeNull();
  });

  it('incrementa cantidad al hacer click en +', () => {
    renderWithCart(<ProductDetailModal {...defaultProps} />);
    
    const plusButton = screen.getByRole('button', { name: /incrementar/i });
    fireEvent.click(plusButton);
    
    // Verificar que la cantidad cambió (según implementación)
    expect(screen.getByText('2')).toBeInTheDocument();
  });
});
```

---

## 7. Test de Hooks Personalizados

### Estructura de un Hook Test

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    TEST DE HOOK CON REACT QUERY                            │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   ┌─────────────────────────────────────────────────────────────────┐       │
│   │  renderHook()  →  Renderiza el hook en un componente de prueba  │       │
│   │                   (similar a render pero para hooks)            │       │
│   │                                                                   │       │
│   │  const { result } = renderHook(() => useMiHook());              │       │
│   │                                                                   │       │
│   │  result.current        →  Accede a valores devueltos              │       │
│   │  result.current.fn()  →  Llama a funciones devueltas           │       │
│   └─────────────────────────────────────────────────────────────────┘       │
│                                                                             │
│   ┌─────────────────────────────────────────────────────────────────┐       │
│   │  waitFor()      →  Espera a que una condición sea verdadera    │       │
│   │                   (importante para código asíncrono)            │       │
│   │                                                                   │       │
│   │  await waitFor(() => expect(result.current.data).toBeDefined())│       │
│   └─────────────────────────────────────────────────────────────────┘       │
│                                                                             │
│   ┌─────────────────────────────────────────────────────────────────┐       │
│   │  wrapper        →  Componente que envuelve el hook (Provider)  │       │
│   │                                                                   │       │
│   │  const wrapper = ({ children }) => (                           │       │
│   │    <QueryClientProvider client={queryClient}>                   │       │
│   │      {children}                                                 │       │
│   │    </QueryClientProvider>                                       │       │
│   │  );                                                             │       │
│   │                                                                   │       │
│   │  renderHook(() => useProducts(), { wrapper })                  │       │
│   └─────────────────────────────────────────────────────────────────┘       │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Ejemplo: useProducts con React Query

```typescript
// src/features/products/application/__tests__/useProducts.test.tsx
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useProducts } from '../useProducts';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import * as productsApi from '../infrastructure/productsApi';

// ════════════════════════════════════════════════════════════════════════════
// Mock de la API
// ════════════════════════════════════════════════════════════════════════════
vi.mock('../infrastructure/productsApi', () => ({
  getProducts: vi.fn(),
}));

describe('useProducts hook', () => {
  // ════════════════════════════════════════════════════════════════════════
  // Setup: Crear QueryClient de prueba
  // ════════════════════════════════════════════════════════════════════════
  
  const createTestQueryClient = () => new QueryClient({
    defaultOptions: {
      queries: { retry: false },  // No reintentar en tests
    },
  });

  // Wrapper para envolver el hook con el Provider
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={createTestQueryClient()}>
      {children}
    </QueryClientProvider>
  );

  // Cleanup entre tests
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ════════════════════════════════════════════════════════════════════════
  // Tests
  // ════════════════════════════════════════════════════════════════════════

  it('debe obtener productos inicialmente', async () => {
    // Arrange: Configurar mock
    const mockResponse = {
      products: [{ 
        id: 1, 
        title: 'Test Product', 
        price: 10, 
        stock: 5, 
        thumbnail: 'img.jpg' 
      }],
      total: 1,
      skip: 0,
      limit: 20
    };
    (productsApi.getProducts as any).mockResolvedValue(mockResponse);

    // Act: Renderizar hook
    const { result } = renderHook(() => useProducts(), { wrapper });

    // Assert inicial: Debe estar cargando
    expect(result.current.initialLoading).toBe(true);

    // Esperar a que termine de cargar (importante para código asíncrono)
    await waitFor(() => expect(result.current.initialLoading).toBeFalse());

    // Assert finales: Verificar datos
    expect(result.current.products).toHaveLength(1);
    expect(result.current.products[0].title).toBe('Test Product');
    expect(result.current.error).toBeNull();
  });

  it('debe manejar errores de API', async () => {
    // Arrange: Configurar mock para error
    (productsApi.getProducts as any).mockRejectedValue(new Error('API Failure'));

    // Act
    const { result } = renderHook(() => useProducts(), { wrapper });

    // Esperar a que termine de cargar
    await waitFor(() => expect(result.current.initialLoading).toBeFalse());

    // Assert: Verificar manejo de error
    expect(result.current.error).toBe('API Failure');
    expect(result.current.products).toHaveLength(0);
  });

  it('refresca productos cuando se llama a refetch', async () => {
    // Arrange
    const mockResponse = {
      products: [{ id: 1, title: 'Product 1', price: 10, stock: 5, thumbnail: 'img.jpg' }],
      total: 1,
      skip: 0,
      limit: 20
    };
    (productsApi.getProducts as any).mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useProducts(), { wrapper });
    await waitFor(() => expect(result.current.initialLoading).toBeFalse());

    // Arrange para segundo fetch
    const updatedResponse = {
      products: [{ id: 2, title: 'Product 2', price: 20, stock: 3, thumbnail: 'img2.jpg' }],
      total: 1,
      skip: 0,
      limit: 20
    };
    (productsApi.getProducts as any).mockResolvedValue(updatedResponse);

    // Act: Llamar refetch
    await result.current.refetch();

    // Assert
    expect(result.current.products[0].title).toBe('Product 2');
  });
});
```

---

## 8. Test de Funciones Asíncronas

### Ejemplo: OrderSummary con waitFor

```typescript
// src/features/checkout/presentation/components/__tests__/OrderSummary.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { OrderSummary } from '../OrderSummary';
import { makeCartItem } from '@/test/factories/productFactory';

describe('OrderSummary Component', () => {
  const mockItems = [
    makeCartItem({ id: 1, title: 'Producto A', price: 20, quantity: 2 }),
  ];
  const totalPrice = 40;

  // Test síncrono simple
  it('calcula y muestra el subtotal correctamente', () => {
    render(<OrderSummary items={mockItems} totalPrice={totalPrice} />);
    
    expect(screen.getByText(/subtotal/i)).toBeInTheDocument();
    expect(screen.getAllText('$40.00').length).toBeGreaterThan(0);
  });

  // Test con setTimeout (waitFor)
  it('permite aplicar un código de descuento válido (WELCOME10)', async () => {
    render(<OrderSummary items={mockItems} totalPrice={100} />);
    
    const input = screen.getByPlaceholderText(/ingresa tu código/i);
    const button = screen.getByText('aplicar');
    
    // Act: Escribir y aplicar descuento
    fireEvent.change(input, { target: { value: 'WELCOME10' } });
    fireEvent.click(button);
    
    // Assert: Esperar a que el setTimeout termine (el componente tiene 500ms delay)
    await waitFor(() => {
      expect(screen.getByText(/WELCOME10/i)).toBeInTheDocument();
      expect(screen.getByText(/10\.00/)).toBeInTheDocument();
    }, { timeout: 3000 }); // Timeout de 3 segundos

    // Verificar total con descuento
    expect(screen.getAllText('$90.00').length).toBeGreaterThan(0);
  });
});
```

---

## 9. Mocks y Spies

### Tipos de Mocks

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           TIPOS DE MOCKS                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   vi.fn()              →  Función mock vacía                                │
│                          Útil para callbacks/onClick                        │
│                                                                             │
│   vi.fn(() => valor)  →  Mock que retorna un valor                         │
│                                                                             │
│   vi.fn(() => {...})  →  Mock con implementación personalizada            │
│                                                                             │
│   vi.mock()           →  Mock de módulo completo                           │
│                          (se usa antes de los imports)                     │
│                                                                             │
│   vi.spyOn(obj, 'fn') →  Espía una función existente                       │
│                          Mantiene el comportamiento original                │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Ejemplos de Mocks

```typescript
import { describe, it, expect, vi } from 'vitest';

// ════════════════════════════════════════════════════════════════════════════
// vi.fn() - Función mock básica
// ════════════════════════════════════════════════════════════════════════════
const callback = vi.fn();

callback();                    // Llama la función
callback('arg1', 'arg2');      // Llama con argumentos

expect(callback).toHaveBeenCalled();                    // ¿Se llamó?
expect(callback).toHaveBeenCalledTimes(2);             // ¿Cuántas veces?
expect(callback).toHaveBeenCalledWith('arg1', 'arg2'); // ¿Con qué argumentos?

// ════════════════════════════════════════════════════════════════════════════
// vi.fn(() => valor) - Retornar valor
// ════════════════════════════════════════════════════════════════════════════
const fetchUser = vi.fn(() => Promise.resolve({ id: 1, name: 'John' }));

const result = await fetchUser();
expect(result.name).toBe('John');

// ════════════════════════════════════════════════════════════════════════════
// vi.fn() con implementación
// ════════════════════════════════════════════════════════════════════════════
const calculateDiscount = vi.fn((price: number, code: string) => {
  if (code === 'WELCOME10') return price * 0.1;
  return 0;
});

expect(calculateDiscount(100, 'WELCOME10')).toBe(10);
expect(calculateDiscount(100, 'INVALID')).toBe(0);

// ════════════════════════════════════════════════════════════════════════════
// vi.mock() - Mock de módulo completo
// ════════════════════════════════════════════════════════════════════════════
// Se coloca ANTES de los imports
vi.mock('../api/productsApi', () => ({
  getProducts: vi.fn().mockResolvedValue([
    { id: 1, title: 'Mock Product', price: 100 }
  ]),
  getProductById: vi.fn().mockResolvedValue({ id: 1, title: 'Mock' }),
}));

// Luego se usa normalmente
import { getProducts } from '../api/productsApi';

// ════════════════════════════════════════════════════════════════════════════
// vi.spyOn() - Espiar funciones existentes
// ════════════════════════════════════════════════════════════════════════════
import * as storageUtils from '@/lib/storageUtils';

describe('storage', () => {
  it('guarda en localStorage', () => {
    const spy = vi.spyOn(localStorage, 'setItem');
    
    // Llamar la función que usa localStorage
    // setItem('key', 'value')
    
    expect(spy).toHaveBeenCalledWith('key', 'value');
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
```

---

## 10. Patrones Avanzados

### Test de Error Boundary

```typescript
// src/components/common/__tests__/ErrorBoundary.test.tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ErrorBoundary } from '../ErrorBoundary';
import { ComponentThatThrows } from './test-utils/ComponentThatThrows';

describe('ErrorBoundary', () => {
  it('renderiza children cuando no hay error', () => {
    render(
      <ErrorBoundary>
        <div>Contenido normal</div>
      </ErrorBoundary>
    );
    
    expect(screen.getByText('Contenido normal')).toBeInTheDocument();
  });

  it('renderiza fallback cuando hay error', () => {
    const Fallback = () => <div>Error occurred</div>;
    
    render(
      <ErrorBoundary fallback={<Fallback />}>
        <ComponentThatThrows />
      </ErrorBoundary>
    );
    
    expect(screen.getByText('Error occurred')).toBeInTheDocument();
  });
});
```

### Test con renderHook de estado

```typescript
// Test de useState custom
import { useState } from 'react';
import { renderHook, act } from '@testing-library/react';

const useCounter = (initialValue = 0) => {
  const [count, setCount] = useState(initialValue);
  return {
    count,
    increment: () => setCount(c => c + 1),
    decrement: () => setCount(c => c - 1),
    reset: () => setCount(initialValue),
  };
};

describe('useCounter', () => {
  it('incrementa el contador', () => {
    const { result } = renderHook(() => useCounter(0));
    
    act(() => {
      result.current.increment();
    });
    
    expect(result.current.count).toBe(1);
  });

  it('decrementa el contador', () => {
    const { result } = renderHook(() => useCounter(10));
    
    act(() => {
      result.current.decrement();
    });
    
    expect(result.current.count).toBe(9);
  });

  it('resetea al valor inicial', () => {
    const { result } = renderHook(() => useCounter(5));
    
    act(() => {
      result.current.increment();
      result.current.increment();
      result.current.reset();
    });
    
    expect(result.current.count).toBe(5);
  });
});
```

---

## 11. Comandos Útiles

```bash
# ════════════════════════════════════════════════════════════════════════════
# EJECUTAR TESTS
# ════════════════════════════════════════════════════════════════════════════

# Ejecutar todos los tests (modo watch por defecto)
pnpm test

# Ejecutar tests una sola vez (sin watch)
pnpm test -- --run

# Ejecutar un archivo específico
pnpm test src/features/cart/__tests__/Cart.test.tsx

# Ejecutar tests que coincidan con un patrón (nombre)
pnpm test -- Cart

# Ejecutar tests con UI interactiva
pnpm test:ui

# Ejecutar tests con coverage
pnpm test:coverage

# Ejecutar tests en modo headless (para CI)
pnpm test -- --run --reporter=dot

# Ver coverage en HTML
open coverage/index.html
```

---

## Checklist de Buenas Prácticas

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    CHECKLIST DE TESTING                                     │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   □ Nombres descriptivos: describe('describe', it('debe hacer X'))         │
│   □ AAA Pattern: Arrange → Act → Assert                                    │
│   □ Un test = Un concepto                                                   │
│   □ Mockear dependencias externas (APIs, animations)                      │
│   □ Usar factories para datos de prueba                                    │
│   □ Tests deterministas (mismo input = mismo output)                       │
│   □ Limpiar estado entre tests (beforeEach, vi.clearAllMocks)              │
│   □ Probar casos edge: empty, null, undefined, 0, negativo                │
│   □ Probar errores: API fails, validación, límites                         │
│   □ Evitar implementación details → probar comportamiento                   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Recursos Adicionales

- [Vitest Docs](https://vitest.dev/)
- [React Testing Library Docs](https://testing-library.com/docs/react-testing-library/intro/)
- [Vitest Cheat Sheet](https://vitest.dev/guide/testing-types.html)
- [Testing Library Cheat Sheet](https://testing-library.com/docs/dom-testing-library/cheatsheet)

---

**Última actualización**: 2026-03-15
