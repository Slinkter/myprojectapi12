# 📘 TypeScript Guide

**Project:** MyProjectAPI12  
**Last Updated:** February 5, 2026

---

## Overview

MyProjectAPI12 uses **TypeScript** in strict mode for type safety, better developer experience, and fewer runtime errors. Currently, the **cart feature is 100% TypeScript**, with plans to migrate other features gradually.

---

## TypeScript Configuration

### tsconfig.json

\`\`\`json
{
"compilerOptions": {
"target": "ES2020",
"lib": ["ES2020", "DOM", "DOM.Iterable"],
"jsx": "react-jsx",

    "module": "ESNext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "allowImportingTsExtensions": true,

    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    },

    "noEmit": true,
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "noImplicitReturns": true,

    "esModuleInterop": true,
    "allowJs": true,
    "checkJs": false,
    "isolatedModules": true,
    "skipLibCheck": true

},
"include": ["src"],
"exclude": ["node_modules", "dist"]
}
\`\`\`

### Key Settings

- **`strict: true`** - Enable all strict type-checking options
- **`noUnusedLocals: true`** - Report unused local variables
- **`noImplicitReturns: true`** - Ensure all code paths return a value
- **`allowJs: true`** - Allow JavaScript files (for gradual migration)

---

## Type Definitions

### Domain Types

**Location:** `src/features/*/domain/*Types.ts`

\`\`\`typescript
// src/features/cart/domain/cartTypes.ts

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

export interface ValidationResult {
valid: boolean;
error: string | null;
}
\`\`\`

### Function Types

\`\`\`typescript
// Pure function with explicit types
export const calculateTotal = (cart: CartItem[]): number => {
return cart.reduce((sum, item) => sum + item.price \* item.quantity, 0);
};

// Function with multiple parameters
export const addItemToCart = (
cart: CartItem[],
product: Product,
quantity: number
): CartItem[] => {
// Implementation
};
\`\`\`

### Hook Types

\`\`\`typescript
// Hook return type
interface UseCartDrawerReturn {
isCartOpen: boolean;
openCart: () => void;
closeCart: () => void;
toggleCart: () => void;
}

export const useCartDrawer = (): UseCartDrawerReturn => {
const [isCartOpen, setIsCartOpen] = useState(false);

    const openCart = useCallback(() => setIsCartOpen(true), []);
    const closeCart = useCallback(() => setIsCartOpen(false), []);
    const toggleCart = useCallback(() => setIsCartOpen(prev => !prev), []);

    return { isCartOpen, openCart, closeCart, toggleCart };

};
\`\`\`

### Context Types

\`\`\`typescript
// Context value type
interface CartContextValue {
cart: CartItem[];
addToCart: (product: Product, quantity: number) => void;
removeFromCart: (productId: number) => void;
clearCart: () => void;
isCartOpen: boolean;
openCart: () => void;
closeCart: () => void;
toggleCart: () => void;
totalPrice: number;
}

// Context with undefined (before provider)
export const CartContext = createContext<CartContextValue | undefined>(
undefined
);

// Provider props type
interface CartProviderProps {
children: ReactNode;
}

export const CartProvider = ({ children }: CartProviderProps) => {
// Implementation
};
\`\`\`

---

## Type Safety Patterns

### 1. Strict Null Checks

✅ **Do:**
\`\`\`typescript
export const validateCartItem = (
product: Product | null | undefined,
quantity: number
): ValidationResult => {
if (!product || !product.id) {
return { valid: false, error: "Invalid product" };
}

    // TypeScript knows product is not null here
    return { valid: true, error: null };

};
\`\`\`

❌ **Don't:**
\`\`\`typescript
export const validateCartItem = (product: any, quantity: any) => {
// No type safety
};
\`\`\`

### 2. Type Guards

\`\`\`typescript
// Type guard function
function isCartItem(item: unknown): item is CartItem {
return (
typeof item === 'object' &&
item !== null &&
'id' in item &&
'quantity' in item
);
}

// Usage
if (isCartItem(data)) {
// TypeScript knows data is CartItem here
console.log(data.quantity);
}
\`\`\`

### 3. Discriminated Unions

\`\`\`typescript
type LoadingState =
| { status: 'idle' }
| { status: 'loading' }
| { status: 'success'; data: Product[] }
| { status: 'error'; error: string };

function handleState(state: LoadingState) {
switch (state.status) {
case 'idle':
return 'Not started';
case 'loading':
return 'Loading...';
case 'success':
return state.data; // TypeScript knows data exists
case 'error':
return state.error; // TypeScript knows error exists
}
}
\`\`\`

### 4. Generic Types

\`\`\`typescript
// Generic hook
function useLocalStorage<T>(key: string, initialValue: T) {
const [value, setValue] = useState<T>(() => {
const item = localStorage.getItem(key);
return item ? JSON.parse(item) : initialValue;
});

    return [value, setValue] as const;

}

// Usage with type inference
const [cart, setCart] = useLocalStorage<CartItem[]>('cart', []);
\`\`\`

---

## React + TypeScript

### Component Props

\`\`\`typescript
// Props interface
interface ButtonProps {
children: ReactNode;
onClick: () => void;
variant?: 'primary' | 'secondary';
disabled?: boolean;
}

// Component with typed props
export const Button = ({
children,
onClick,
variant = 'primary',
disabled = false
}: ButtonProps) => {
return (
<button
onClick={onClick}
disabled={disabled}
className={\`btn-\${variant}\`} >
{children}
</button>
);
};
\`\`\`

### Event Handlers

\`\`\`typescript
// Form event
const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
e.preventDefault();
// Handle form
};

// Input change event
const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
setValue(e.target.value);
};

// Button click event
const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
console.log(e.currentTarget);
};
\`\`\`

### Ref Types

\`\`\`typescript
// Ref to DOM element
const inputRef = useRef<HTMLInputElement>(null);

// Ref to component instance
const modalRef = useRef<ModalHandle>(null);

// Usage
useEffect(() => {
inputRef.current?.focus();
}, []);
\`\`\`

---

## Common Patterns

### 1. Optional Chaining

\`\`\`typescript
// Safe property access
const price = product?.price ?? 0;
const name = user?.profile?.name ?? 'Guest';
\`\`\`

### 2. Non-Null Assertion (use sparingly)

\`\`\`typescript
// When you're 100% sure value exists
const element = document.getElementById('root')!;
\`\`\`

### 3. Type Assertions

\`\`\`typescript
// When you know more than TypeScript
const data = response as Product[];

// Or using angle bracket syntax
const data = <Product[]>response;
\`\`\`

### 4. Const Assertions

\`\`\`typescript
// Make object readonly and literal types
const config = {
apiUrl: 'https://api.example.com',
timeout: 5000,
} as const;

// config.apiUrl is type 'https://api.example.com', not string
\`\`\`

---

## Migration Strategy

### Phase 1: Domain Layer (✅ Complete)

Migrate pure functions first:

\`\`\`typescript
// Before: cartUtils.js
export const calculateTotal = (cart) => {
return cart.reduce((sum, item) => sum + item.price \* item.quantity, 0);
};

// After: cartUtils.ts
export const calculateTotal = (cart: CartItem[]): number => {
return cart.reduce((sum, item) => sum + item.price \* item.quantity, 0);
};
\`\`\`

### Phase 2: Application Layer (✅ Complete)

Migrate hooks and contexts:

\`\`\`typescript
// Before: CartContext.jsx
export const CartContext = createContext();

// After: CartContext.tsx
export const CartContext = createContext<CartContextValue | undefined>(
undefined
);
\`\`\`

### Phase 3: Presentation Layer (In Progress)

Migrate components:

\`\`\`typescript
// Before: Cart.jsx
const Cart = () => {
const { cart } = useCart();
// ...
};

// After: Cart.tsx
const Cart: React.FC = () => {
const { cart } = useCart();
// ...
};
\`\`\`

---

## Type-Checking

### Run Type-Check

\`\`\`bash

# Check all files

pnpm type-check

# Check specific file

pnpm tsc --noEmit src/path/to/file.ts

# Watch mode

pnpm tsc --noEmit --watch
\`\`\`

### CI/CD Integration

\`\`\`yaml

# .github/workflows/ci.yml

- name: Type-check
  run: pnpm type-check
  \`\`\`

---

## Best Practices

### 1. Prefer Interfaces Over Types

✅ **Do:**
\`\`\`typescript
interface User {
id: number;
name: string;
}
\`\`\`

❌ **Don't (unless you need union/intersection):**
\`\`\`typescript
type User = {
id: number;
name: string;
};
\`\`\`

### 2. Avoid `any`

✅ **Do:**
\`\`\`typescript
function processData(data: unknown) {
if (typeof data === 'string') {
return data.toUpperCase();
}
}
\`\`\`

❌ **Don't:**
\`\`\`typescript
function processData(data: any) {
return data.toUpperCase(); // No type safety
}
\`\`\`

### 3. Use Readonly When Appropriate

\`\`\`typescript
interface Config {
readonly apiUrl: string;
readonly timeout: number;
}

// Or for arrays
function sum(numbers: readonly number[]): number {
return numbers.reduce((a, b) => a + b, 0);
}
\`\`\`

### 4. Leverage Type Inference

✅ **Do:**
\`\`\`typescript
const cart = []; // TypeScript infers never[]
const cart: CartItem[] = []; // Better
\`\`\`

---

## Troubleshooting

### Common Errors

#### 1. "Cannot find module"

\`\`\`typescript
// Error
import { CartItem } from './cartTypes';

// Fix: Add .ts extension or configure paths
import { CartItem } from './cartTypes.ts';
\`\`\`

#### 2. "Type 'undefined' is not assignable"

\`\`\`typescript
// Error
const context = useContext(CartContext); // CartContextValue | undefined

// Fix: Add type guard
const context = useContext(CartContext);
if (!context) {
throw new Error("Must be used within provider");
}
// Now context is CartContextValue
\`\`\`

#### 3. "Property does not exist on type"

\`\`\`typescript
// Error
const name = product.name; // Property 'name' does not exist

// Fix: Check interface definition
interface Product {
title: string; // It's 'title', not 'name'
}
\`\`\`

---

## Resources

- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)
- [TypeScript Deep Dive](https://basarat.gitbook.io/typescript/)
- [Total TypeScript](https://www.totaltypescript.com/)

---

_Last updated: February 5, 2026_
