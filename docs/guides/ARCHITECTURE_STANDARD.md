# Estándar de Estructura de Proyecto React + TypeScript

Este documento define la estructura de carpetas y convenciones del proyecto.

---

## Estructura General

```
src/
├── app/                    # Configuración global de la aplicación
│   ├── config/             # Configuración (queryClient, etc.)
│   ├── api/                # Clientes API globales
│   └── routing/            # Configuración de rutas
│
├── components/             # Componentes reutilizables (UI)
│   ├── ui/                 # Componentes base (Button, Input, Card...)
│   │   ├── Button/
│   │   ├── Input/
│   │   └── ...
│   └── common/             # Componentes compartidos (Layout, Navbar, ErrorBoundary)
│
├── features/               # Funcionalidades por módulo (Feature-Sliced)
│   ├── cart/
│   │   ├── application/    # Hooks, Context, estado (useCart, CartProvider)
│   │   ├── domain/         # Lógica de negocio (types, utils)
│   │   ├── infrastructure/ # APIs, adaptadores
│   │   └── presentation/   # Componentes UI del feature
│   │
│   ├── products/
│   │   ├── application/
│   │   ├── domain/
│   │   ├── infrastructure/
│   │   └── presentation/
│   │
│   ├── checkout/
│   │   └── ...
│   │
│   └── theme/
│       └── ...
│
├── shared/                 # Código compartido entre features
│   ├── api/                # Clientes API globales
│   ├── hooks/              # Hooks reutilizables
│   ├── lib/                # Utilidades (utils, formatters)
│   ├── constants/          # Constantes globales
│   └── ui/                 # Componentes UI compartidos
│
├── pages/                  # Componentes de página (Route handlers)
│   ├── Home.tsx
│   ├── Checkout.tsx
│   └── ...
│
├── test/                   # Utilidades de testing
│   ├── factories/          # Fabricas de datos (makeProduct, makeCartItem)
│   ├── setup.js            # Configuración global de tests
│   └── utils.tsx           # Utilidades para tests
│
├── widgets/                # Componentes compuestos (combinan múltiples features)
│
├── App.tsx                 # Componente raíz
├── main.tsx                # Entry point
└── vite-env.d.ts           # Tipos de Vite
```

---

## Convenciones por Tipo de Archivo

### 1. Features (Feature-Sliced Design)

Cada feature sigue la arquitectura de capas:

```
feature-name/
├── application/      # "¿Cómo funciona?" - Hooks, Context, Estado
│   ├── useXxx.ts              # Hook personalizado
│   ├── XxxContext.tsx         # React Context
│   ├── XxxProvider.tsx        # Provider component
│   └── __tests__/             # Tests de aplicación
│
├── domain/           # "¿Qué es?" - Entidades, reglas de negocio
│   ├── types.ts               # Tipos/interfaces de la entidad
│   ├── xxxUtils.ts           # Funciones puras
│   ├── constants.ts          # Constantes del dominio
│   └── __tests__/            # Tests de dominio
│
├── infrastructure/   # "¿Con qué se conecta?" - APIs externas
│   ├── xxxApi.ts             # Funciones API
│   ├── adapters/             # Adaptadores de datos
│   └── mocks/                # Mocks para testing
│
└── presentation/     # "¿Cómo se ve?" - Componentes UI
    ├── XxxComponent.tsx      # Componente principal
    ├── components/           # Subcomponentes específicos
    │   ├── ComponentA.tsx
    │   └── ComponentB.tsx
    └── __tests__/            # Tests de presentación
```

### 2. Componentes UI (`components/ui/`)

```
Button/
├── Button.tsx               # Componente
├── button.test.tsx         # Tests
└── index.ts                # Export (opcional)

Input/
├── Input.tsx
├── input.test.tsx
└── index.ts
```

### 3. Hooks (`shared/hooks/`)

```
hooks/
├── useLogLifecycle.ts      # Hook de debug
├── useDebounce.ts          # Hook utilitario
└── index.ts                # Export barrel
```

---

## Reglas de Naming

### Archivos

| Tipo | Naming | Ejemplo |
|------|--------|---------|
| Componentes | PascalCase | `ProductCard.tsx` |
| Hooks | camelCase con `use` | `useCart.ts` |
| Utilidades | camelCase | `formatPrice.ts` |
| Types/Interfaces | PascalCase | `Product.ts` |
| Constants | UPPER_SNAKE_CASE | `API_ENDPOINTS.ts` |
| Tests | `.test.tsx` | `ProductCard.test.tsx` |

### Imports

```typescript
// 1. External libraries (React, npm)
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';

// 2. Internal - Components
import { Button } from '@/components/ui/button';
import { Layout } from '@/components/common/layout';

// 3. Internal - Features
import { useCart } from '@/features/cart/application/useCart';
import { ProductCard } from '@/features/products/presentation/ProductCard';

// 4. Internal - Shared
import { cn } from '@/lib/utils';
import { formatPrice } from '@/shared/lib/formatters';

// 5. Relative imports
import { MyComponent } from './MyComponent';
```

---

## Patrón de Componente

```tsx
// 1. Imports
import { useState } from 'react';
import { cn } from '@/lib/utils';
import type { Product } from '@/features/products/domain/types';

// 2. Types
interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
}

// 3. Component (usar React.memo para optimize)
const ProductCard = React.memo(({ product, onAddToCart }: ProductCardProps) => {
  // 4. Hooks
  const [isLoading, setIsLoading] = useState(false);

  // 5. Handlers
  const handleClick = () => {
    onAddToCart?.(product);
  };

  // 6. Render
  return (
    <div className={cn("product-card", isLoading && "loading")}>
      <h3>{product.title}</h3>
      <p>${product.price}</p>
      <button onClick={handleClick}>Add</button>
    </div>
  );
});

// 7. Display name para debugging
ProductCard.displayName = 'ProductCard';

export default ProductCard;
```

---

## Patrón de Hook

```typescript
// useCart.ts
import { useContext } from 'react';
import { CartContext } from './CartContext';

export const useCart = () => {
  const context = useContext(CartContext);
  
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  
  return context;
};
```

---

## Patrón de Test

```typescript
// __tests__/ProductCard.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ProductCard from '../ProductCard';
import { makeProduct } from '@/test/factories/productFactory';

describe('ProductCard', () => {
  // Arrange
  const product = makeProduct({ title: 'Test Product', price: 100 });
  const onAddToCart = vi.fn();

  it('renderiza el producto', () => {
    // Act
    render(<ProductCard product={product} onAddToCart={onAddToCart} />);
    
    // Assert
    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('$100.00')).toBeInTheDocument();
  });

  it('llama a onAddToCart al hacer click', () => {
    render(<ProductCard product={product} onAddToCart={onAddToCart} />);
    
    fireEvent.click(screen.getByRole('button'));
    
    expect(onAddToCart).toHaveBeenCalledWith(product);
  });
});
```

---

## Alias de Path

El proyecto usa `@/` como alias para `./src/`:

```json
// tsconfig.json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

**Uso:**
```typescript
// En lugar de:
import { Button } from '../../../components/ui/button';

// Usar:
import { Button } from '@/components/ui/button';
```

---

## Recursos

- [Feature-Sliced Design](https://feature-sliced.design/)
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)
- [Clean Architecture en React](https://www.patterns.dev/posts/presentational-container-state/)
