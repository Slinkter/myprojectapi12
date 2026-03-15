# Tutorial de Testing en React

Este documento te guía paso a paso para escribir tests en el proyecto.

## Herramientas

- **Vitest**: Test runner (como Jest pero más rápido)
- **React Testing Library**: Para probar componentes React
- **Factories**: Para crear datos de prueba

## Estructura de Tests

```
src/
├── features/
│   └── products/
│       ├── presentation/
│       │   └── __tests__/
│       │       └── ProductDetailModal.test.tsx  ← Tests de componente
│       └── application/
│           └── __tests__/
│               └── useProducts.test.tsx          ← Tests de hook
└── test/
    └── factories/
        └── productFactory.ts                     ← Datos de prueba
```

---

## 1. Test de Componente Simple

### Ejemplo: Button

```tsx
// src/components/ui/__tests__/button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Button } from '@/components/ui/button';

describe('Button Component', () => {
  // Test básico: verificar que el botón se renderiza
  it('renderiza el botón con el texto correcto', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
  });

  // Test: verificar que responde al click
  it('llama a onClick cuando se hace click', () => {
    const handleClick = vi.fn(); // Mock de función
    render(<Button onClick={handleClick}>Click me</Button>);
    
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  // Test: verificar variant
  it('renderiza con variant primary', () => {
    render(<Button variant="destructive">Delete</Button>);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });
});
```

---

## 2. Test de Componente con Props

### Ejemplo: CardForm

```tsx
// src/features/checkout/__tests__/CardForm.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import CardForm from '../CardForm';

describe('CardForm Component', () => {
  // Arrange: crear props por defecto
  const defaultProps = {
    cardInfo: { number: '', name: '', expiry: '', cvc: '' },
    errors: {},
    cardType: '',
    onChange: vi.fn(),
  };

  // Test: verificar que se renderizan todos los campos
  it('renderiza todos los campos del formulario', () => {
    render(<CardForm {...defaultProps} />);
    
    expect(screen.getByLabelText(/Número de tarjeta/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Nombre del titular/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Vencimiento/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/CVC/i)).toBeInTheDocument();
  });

  // Test: verificar mensajes de error
  it('muestra errores de validación', () => {
    const propsWithErrors = {
      ...defaultProps,
      errors: { number: 'Número inválido', name: 'Nombre requerido' }
    };
    
    render(<CardForm {...propsWithErrors} />);
    
    expect(screen.getByText('Número inválido')).toBeInTheDocument();
    expect(screen.getByText('Nombre requerido')).toBeInTheDocument();
  });

  // Test: verificar que llama onChange al escribir
  it('llama onChange cuando el usuario escribe', () => {
    const handleChange = vi.fn();
    render(<CardForm {...defaultProps} onChange={handleChange} />);
    
    const input = screen.getByLabelText(/Nombre del titular/i);
    fireEvent.change(input, { target: { value: 'LUIS CUEVA' } });
    
    expect(handleChange).toHaveBeenCalled();
  });
});
```

---

## 3. Test de Componente con Context

### Ejemplo: ProductDetailModal (con CartProvider)

```tsx
// src/features/products/__tests__/ProductDetailModal.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ProductDetailModal from '../ProductDetailModal';
import { CartProvider } from '@/features/cart/application/CartContext';

// Mock de framer-motion (evita problemas con animaciones)
vi.mock('framer-motion', () => ({
  m: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

describe('ProductDetailModal Component', () => {
  // Crear producto de prueba
  const mockProduct = {
    id: 1,
    title: 'Reloj Premium',
    description: 'Un reloj de lujo',
    price: 500,
    stock: 10,
    brand: 'Rolex',
    category: 'Relojes'
  };

  const defaultProps = {
    product: mockProduct,
    isOpen: true,
    onClose: vi.fn(),
  };

  // Test: verificar que renderiza los detalles
  it('renderiza los detalles del producto', () => {
    render(
      <CartProvider>
        <ProductDetailModal {...defaultProps} />
      </CartProvider>
    );

    expect(screen.getByText('Reloj Premium')).toBeInTheDocument();
    expect(screen.getByText('Un reloj de lujo')).toBeInTheDocument();
    expect(screen.getByText('$500.00')).toBeInTheDocument();
  });

  // Test: verificar que cierra al hacer click
  it('llama a onClose al hacer clic en cerrar', () => {
    const onClose = vi.fn();
    render(
      <CartProvider>
        <ProductDetailModal {...defaultProps} onClose={onClose} />
      </CartProvider>
    );

    const closeButton = screen.getByLabelText('Cerrar modal');
    fireEvent.click(closeButton);
    expect(onClose).toHaveBeenCalled();
  });

  // Test: no renderiza si isOpen es false
  it('no renderiza cuando está cerrado', () => {
    const { container } = render(
      <CartProvider>
        <ProductDetailModal {...defaultProps} isOpen={false} />
      </CartProvider>
    );

    expect(container.firstChild).toBeNull();
  });
});
```

---

## 4. Test de Hook (useState, useEffect)

### Ejemplo: useProducts (con React Query)

```tsx
// src/features/products/__tests__/useProducts.test.tsx
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useProducts } from '../useProducts';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import * as productsApi from '../infrastructure/productsApi';

// Mock de la API
vi.mock('../infrastructure/productsApi', () => ({
  getProducts: vi.fn(),
}));

const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: { retry: false },
  },
});

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={createTestQueryClient()}>
    {children}
  </QueryClientProvider>
);

describe('useProducts hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // Test: obtiene productos correctamente
  it('debe obtener productos inicialmente', async () => {
    const mockResponse = {
      products: [{ id: 1, title: 'Test Product', price: 10, stock: 5, thumbnail: 'img.jpg' }],
      total: 1,
      skip: 0,
      limit: 20
    };
    
    // Configurar el mock
    (productsApi.getProducts as any).mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useProducts(), { wrapper });

    // Verificar que está cargando
    expect(result.current.initialLoading).toBeTrue();

    // Esperar a que termine de cargar
    await waitFor(() => expect(result.current.initialLoading).toBeFalse());

    // Verificar los datos
    expect(result.current.products).toHaveLength(1);
    expect(result.current.products[0].title).toBe('Test Product');
    expect(result.current.error).toBeNull();
  });

  // Test: maneja errores
  it('debe manejar errores de API', async () => {
    (productsApi.getProducts as any).mockRejectedValue(new Error('API Failure'));

    const { result } = renderHook(() => useProducts(), { wrapper });

    await waitFor(() => expect(result.current.initialLoading).toBeFalse());

    expect(result.current.error).toBe('API Failure');
    expect(result.current.products).toHaveLength(0);
  });
});
```

---

## 5. Test de Funciones Puras

### Ejemplo: cartUtils

```tsx
// src/features/cart/domain/__tests__/cartUtils.test.ts
import { describe, it, expect } from 'vitest';
import { calculateTotal, formatPrice, groupItemsById } from '../cartUtils';

describe('cartUtils', () => {
  describe('calculateTotal', () => {
    it('calcula el total correctamente', () => {
      const items = [
        { id: 1, price: 10, quantity: 2 },
        { id: 2, price: 5, quantity: 3 },
      ];
      expect(calculateTotal(items)).toBe(35); // (10*2) + (5*3)
    });

    it('retorna 0 para carrito vacío', () => {
      expect(calculateTotal([])).toBe(0);
    });
  });

  describe('formatPrice', () => {
    it('formatea precio correctamente', () => {
      expect(formatPrice(10)).toBe('$10.00');
    });

    it('formatea precio con decimales', () => {
      expect(formatPrice(10.5)).toBe('$10.50');
    });
  });
});
```

---

## 6. Usar Factories (datos de prueba)

### Crear producto de prueba

```tsx
// src/test/factories/productFactory.ts
import type { Product } from '@/features/products/application/types';

export const makeProduct = (overrides: Partial<Product> = {}): Product => ({
  id: 1,
  title: 'Test Product',
  description: 'Test Description',
  price: 100,
  stock: 10,
  thumbnail: 'https://example.com/image.jpg',
  images: ['https://example.com/image.jpg'],
  category: 'test',
  brand: 'Test Brand',
  discountPercentage: 0,
  rating: 4.5,
  ...overrides,
});

export const makeCartItem = (overrides: Partial<CartItem> = {}): CartItem => ({
  id: 1,
  title: 'Test Product',
  price: 100,
  quantity: 1,
  thumbnail: 'https://example.com/image.jpg',
  stock: 10,
  ...overrides,
});
```

### Usar en tests

```tsx
import { makeProduct } from '@/test/factories/productFactory';

// Mucho más limpio:
const product = makeProduct({ title: 'Custom Product', price: 200 });
```

---

## Comandos Útiles

```bash
# Ejecutar todos los tests
pnpm test

# Ejecutar tests una vez (sin watch)
pnpm test -- --run

# Ejecutar un archivo específico
pnpm test src/features/cart/__tests__/Cart.test.tsx

# Ejecutar tests con coverage
pnpm test:coverage

# Ejecutar tests con UI
pnpm test:ui
```

---

## Buenas Prácticas

1. **Nombre descriptivo**: `it('debe calcular el total correctamente')`
2. **AAA Pattern**: Arrange (preparar) → Act (actuar) → Assert (verificar)
3. **Un solo concepto por test**: No probar varias cosas en un test
4. **Mocks externos**: Mockear APIs, animaciones, etc.
5. **Evitar implementación details**: Probar comportamiento, no implementación
