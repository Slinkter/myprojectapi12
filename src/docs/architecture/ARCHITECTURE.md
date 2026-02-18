# 🏗️ Architecture Guide

**Project:** MyProjectAPI12  
**Last Updated:** February 5, 2026

---

## Overview

MyProjectAPI12 follows a **feature-based architecture** with clear separation of concerns, inspired by Clean Architecture and Domain-Driven Design principles.

---

## Architecture Layers

The architecture is designed around the **SOLID** and **DRY** principles, ensuring high cohesion and low coupling between modules.

### 1. Domain Layer (Business Logic)
**Location:** `src/features/*/domain/`
**Purpose:** Pure business logic, independent of frameworks.
**SOLID:** Implements the *Single Responsibility Principle* by isolating rules from the UI.

### 2. Application Layer (Use Cases)
**Location:** `src/features/*/application/`
**Purpose:** Orchestrate business logic and manage state.
**SOLID:** Implements *Dependency Inversion* by using Context/Hooks to provide data to components.
**DRY:** Centralizes logic in Custom Hooks to avoid duplication across views.

**Example:**
\`\`\`typescript
// src/features/cart/application/useCart.ts
export const useCart = () => {
const context = useContext(CartContext);
if (!context) {
throw new Error("useCart must be used within CartProvider");
}
return context;
};
\`\`\`

---

### 3. Presentation Layer (UI)

**Location:** `src/features/*/presentation/`

**Purpose:** User interface components

**Characteristics:**

- React components
- UI logic only
- Consumes application layer
- Styled with Tailwind CSS

**Example:**
\`\`\`jsx
// src/features/cart/presentation/Cart.jsx
const Cart = () => {
const { cart, removeFromCart } = useCart();
return (
<div>
{cart.map(item => (
<CartItem key={item.id} item={item} onRemove={removeFromCart} />
))}
</div>
);
};
\`\`\`

---

### 4. Infrastructure Layer

**Location:** `src/features/*/infrastructure/`

**Purpose:** External services and APIs

**Characteristics:**

- API clients
- Data fetching
- External integrations
- Adapters

**Example:**
\`\`\`javascript
// src/features/products/infrastructure/productsApi.js
export const fetchProducts = async (limit = 30, skip = 0) => {
const response = await fetch(
\`https://dummyjson.com/products?limit=\${limit}&skip=\${skip}\`
);
return response.json();
};
\`\`\`

---

## Feature Structure

Each feature follows this structure:

\`\`\`
features/[feature-name]/
├── application/ # Use cases & state
│ ├── [Feature]Context.tsx
│ ├── use[Feature].ts
│ ├── hooks/
│ │ ├── use[Feature]Actions.ts
│ │ └── use[Feature]State.ts
│ └── **tests**/
│ └── [Feature]Context.test.jsx
│
├── domain/ # Business logic
│ ├── [feature]Types.ts
│ ├── [feature]Utils.ts
│ └── **tests**/
│ └── [feature]Utils.test.ts
│
├── infrastructure/ # External services
│ └── [feature]Api.js
│
└── presentation/ # UI components
├── [Feature].jsx
├── [Feature]Item.jsx
└── [Feature]List.jsx
\`\`\`

---

## Data Flow

\`\`\`
User Interaction
↓
Presentation Layer (UI Component)
↓
Application Layer (Hook/Context)
↓
Domain Layer (Pure Function)
↓
Infrastructure Layer (API)
↓
External Service
\`\`\`

**Example: Adding to Cart**

\`\`\`

1. User clicks "Add to Cart" button
   → Presentation: <ProductCard onClick={handleAddToCart} />

2. Component calls hook
   → Application: const { addToCart } = useCart()

3. Hook calls domain function
   → Domain: addItemToCart(cart, product, quantity)

4. Domain returns new state
   → Pure function with no side effects

5. Hook updates context
   → Application: setCart(newCart)

6. UI re-renders
   → Presentation: Cart displays updated items
   \`\`\`

---

## Design Patterns

### 1. Custom Hooks Pattern

**Purpose:** Encapsulate reusable logic

**Example:**
\`\`\`typescript
// Drawer control hook
export const useCartDrawer = () => {
const [isOpen, setIsOpen] = useState(false);
const open = useCallback(() => setIsOpen(true), []);
const close = useCallback(() => setIsOpen(false), []);
const toggle = useCallback(() => setIsOpen(prev => !prev), []);

    return { isOpen, open, close, toggle };

};
\`\`\`

### 2. Context + Hooks Pattern

**Purpose:** Global state management

**Example:**
\`\`\`typescript
// Context definition
const CartContext = createContext<CartContextValue | undefined>(undefined);

// Provider component
export const CartProvider = ({ children }: CartProviderProps) => {
const [cart, setCart] = useState<CartItem[]>([]);
const value = useMemo(() => ({ cart, setCart }), [cart]);
return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

// Consumer hook
export const useCart = () => {
const context = useContext(CartContext);
if (!context) throw new Error("useCart must be used within CartProvider");
return context;
};
\`\`\`

### 3. Pure Functions Pattern

**Purpose:** Predictable, testable business logic

**Example:**
\`\`\`typescript
// Pure function - no side effects
export const calculateTotal = (cart: CartItem[]): number => {
return cart.reduce((sum, item) => sum + item.price \* item.quantity, 0);
};

// Easy to test
test('calculateTotal sums correctly', () => {
const cart = [
{ price: 10, quantity: 2 },
{ price: 5, quantity: 3 }
];
expect(calculateTotal(cart)).toBe(35);
});
\`\`\`

---

## State Management Strategy

### Local State

- Component-specific state
- Use `useState` or `useReducer`
- Example: Form inputs, UI toggles

### Global State (Context)

- Cross-component state
- Use Context + Hooks
- Example: Cart, Theme, User

### Server State (React Query)

- Remote data
- Use `@tanstack/react-query`
- Example: Products, Orders

\`\`\`typescript
// Server state with React Query
const { data: products, isLoading } = useQuery({
queryKey: ['products', limit, skip],
queryFn: () => fetchProducts(limit, skip),
staleTime: 5 _ 60 _ 1000, // 5 minutes
});
\`\`\`

---

## TypeScript Integration

### Type Definitions

**Location:** `src/features/*/domain/*Types.ts`

**Example:**
\`\`\`typescript
// Domain types
export interface CartItem {
id: number;
title: string;
price: number;
quantity: number;
thumbnail: string;
stock: number;
}

export interface Product {
id: number;
title: string;
price: number;
thumbnail: string;
stock: number;
}
\`\`\`

### Type Safety Benefits

1. **Compile-time errors**
   \`\`\`typescript
   // Error: Argument of type 'string' is not assignable to parameter of type 'number'
   calculateTotal("invalid"); // ❌
   \`\`\`

2. **Better IDE support**
    - Autocomplete
    - IntelliSense
    - Refactoring tools

3. **Self-documenting code**
   \`\`\`typescript
   // Types document the function signature
   function addItemToCart(
   cart: CartItem[],
   product: Product,
   quantity: number
   ): CartItem[]
   \`\`\`

## CSS Architecture

### Modern Utility System (Tailwind 4)

The project leverages **Tailwind CSS 4**, which is a CSS-first utility framework. Configuration is primarily handled within the CSS itself using the `@theme` block, reducing reliance on JavaScript configuration files.

### Design Tokens with CSS Variables

We use a "shadcn/ui" style approach for theming, where semantic design tokens are defined as CSS variables. This allows for easy dark mode support and consistent styling across components.

```css
/* src/index.css */
@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-primary: var(--primary);
  --color-accent: var(--accent);
  --radius-lg: var(--radius);
}

@layer base {
  :root {
    --background: oklch(1 0 0);
    --foreground: oklch(0.145 0 0);
    --primary: oklch(0.205 0 0);
    --accent: oklch(0.97 0 0);
    --radius: 0.5rem;
  }

  .dark {
    --background: oklch(0.145 0 0);
    --foreground: oklch(0.985 0 0);
    --primary: oklch(0.985 0 0);
  }
}
```

### Component Primitives

Shared UI components are built using **Shadcn/UI** primitives, which are unstyled, accessible components powered by Radix UI and styled with Tailwind classes.

```tsx
// Example using tailwind-merge and cva
const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
      },
    },
  }
);
```

---

## Testing Strategy

### Test Pyramid

\`\`\`
/\
 /E2E\ (10%) - Critical user flows
/\_**\_\
 / \
 /Integration\ (20%) - Feature interactions
/**\_\_\_\_****\
 / \
 / Unit Tests \ (70%) - Pure functions & hooks
/******\_\_\_\_******\
\`\`\`

### Unit Tests (Domain Layer)

\`\`\`typescript
// Test pure functions
describe('calculateTotal', () => {
test('sums cart items correctly', () => {
const cart = [
{ price: 10, quantity: 2 },
{ price: 5, quantity: 3 }
];
expect(calculateTotal(cart)).toBe(35);
});
});
\`\`\`

### Integration Tests (Application Layer)

\`\`\`jsx
// Test hooks with context
test('useCart throws error outside provider', () => {
expect(() => {
renderHook(() => useCart());
}).toThrow('useCart must be used within CartProvider');
});
\`\`\`

---

## Performance Optimization

### Code Splitting

\`\`\`javascript
// Lazy load routes
const Home = lazy(() => import('./pages/Home'));
const Checkout = lazy(() => import('./features/checkout/presentation/Checkout'));
\`\`\`

### Memoization

\`\`\`typescript
// Memoize expensive calculations
const totalPrice = useMemo(() => calculateTotal(cart), [cart]);

// Memoize callbacks
const addToCart = useCallback((product, quantity) => {
setCart(prev => addItemToCart(prev, product, quantity));
}, []);
\`\`\`

### React Query Caching

\`\`\`typescript
const queryClient = new QueryClient({
defaultOptions: {
queries: {
staleTime: 5 _ 60 _ 1000, // 5 minutes
cacheTime: 10 _ 60 _ 1000, // 10 minutes
},
},
});
\`\`\`

---

## Error Handling

### Error Boundary

\`\`\`jsx
<ErrorBoundary fallback={<ErrorFallback />}>
<App />
</ErrorBoundary>
\`\`\`

### Hook Error Handling

\`\`\`typescript
export const useCart = () => {
const context = useContext(CartContext);

    if (!context) {
        throw new Error("useCart must be used within CartProvider");
    }

    return context;

};
\`\`\`

---

## Best Practices

### 1. Keep Domain Layer Pure

✅ **Do:**
\`\`\`typescript
export const calculateTotal = (cart: CartItem[]): number => {
return cart.reduce((sum, item) => sum + item.price \* item.quantity, 0);
};
\`\`\`

❌ **Don't:**
\`\`\`typescript
export const calculateTotal = () => {
const cart = useCart(); // ❌ No hooks in domain layer
return cart.reduce(...);
};
\`\`\`

### 2. Use TypeScript Strictly

✅ **Do:**
\`\`\`typescript
interface CartItem {
id: number;
quantity: number;
}
\`\`\`

❌ **Don't:**
\`\`\`typescript
const cart: any = []; // ❌ Avoid 'any'
\`\`\`

### 3. Test Pure Functions First

✅ **Do:**
\`\`\`typescript
// Easy to test
test('addItemToCart adds new item', () => {
const cart = [];
const product = { id: 1, price: 10 };
const result = addItemToCart(cart, product, 1);
expect(result).toHaveLength(1);
});
\`\`\`

### 4. Keep Components Small

✅ **Do:**
\`\`\`jsx
// Small, focused component
const CartItem = ({ item, onRemove }) => (
<div>
<h3>{item.title}</h3>
<button onClick={() => onRemove(item.id)}>Remove</button>
</div>
);
\`\`\`

---

## References

- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Domain-Driven Design](https://martinfowler.com/bliki/DomainDrivenDesign.html)
- [React Patterns](https://reactpatterns.com/)
- [TypeScript Best Practices](https://www.typescriptlang.org/docs/handbook/declaration-files/do-s-and-don-ts.html)

---

_Last updated: February 5, 2026_
