# AGENTS.md - Project Guidelines for AI Agents

## Project Overview

This is a React 18 + TypeScript + Vite e-commerce application with Tailwind CSS v4, using feature-based architecture.

---

## Commands

### Development
```bash
npm run dev          # Start development server
npm run preview      # Preview production build
```

### Building
```bash
npm run build        # Build for production (outputs to dist/)
npm run deploy       # Build and deploy to GitHub Pages
npm run predeploy    # Runs build before deploy
```

### Testing
```bash
npm run test              # Run all tests (Vitest)
npm run test -- --run     # Run tests once (no watch mode)
npm run test:ui           # Run tests with Vitest UI
npm run test:coverage      # Run tests with coverage report
npm run test:run src/components/ui/button.test.tsx  # Run single test file
```

### Linting & Type Checking
```bash
npm run lint             # Run ESLint
npm run type-check       # Run TypeScript type checking (tsc --noEmit)
```

---

## Code Style Guidelines

### TypeScript
- **Strict mode enabled** in `tsconfig.json`
- Always define explicit types; avoid `any`
- Use interfaces for object shapes (prefix with `I`): `interface IProduct { ... }`
- Use type for unions/aliases: `type StockStatus = 'ok' | 'low' | 'out'`

### Naming Conventions
- **Components**: PascalCase (`ProductCard`, `CartProvider`)
- **Hooks**: camelCase with `use` prefix (`useCart`, `useProductModal`)
- **Interfaces**: PascalCase with `I` prefix (`IProduct`, `ICartItem`)
- **Files**: kebab-case (`product-card.tsx`, `cart-context.tsx`)
- **Constants**: UPPER_SNAKE_CASE for runtime constants, camelCase for compile-time
- **CSS Classes**: Tailwind utility classes (see below)

### Imports
- Use path aliases: `@/` maps to `./src/`
- Group imports: external → internal → relative
- Use named exports for utilities
- Avoid barrel files (index.ts) that re-export everything

```typescript
// Good
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/features/cart/application/CartContext";
import type { IProduct } from "@/features/products/application/types";
```

### React Patterns
- Use `React.memo()` for expensive components
- Use `useMemo()` for expensive calculations
- Use `useCallback()` for stable callback references
- Use functional state updates: `setItems(prev => [...prev, item])`
- Use lazy initialization for expensive `useState` initial values
- Define component displayName for debugging

```typescript
const ProductCard = React.memo(({ product }: IProductCardProps) => {
  // ... component logic
});
ProductCard.displayName = "ProductCard";
export default ProductCard;
```

### Error Handling
- Wrap async operations in try-catch
- Use ErrorBoundary components for catching render errors
- Use `react-hot-toast` for user notifications
- Throw descriptive errors in hooks when used incorrectly

```typescript
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
```

### Component Structure
1. Imports (external → internal)
2. Type definitions
3. Component definition
4. JSX return
5. Export

```typescript
import React from "react";
import { cn } from "@/lib/utils";
import type { IProduct } from "@/features/products/application/types";

interface IProductCardProps {
  product: IProduct;
}

const ProductCard = React.memo(({ product }: IProductCardProps) => {
  return (
    <div className="...">
      {/* JSX */}
    </div>
  );
});

ProductCard.displayName = "ProductCard";
export default ProductCard;
```

### Tailwind CSS v4
- Use utility classes directly in components
- Use `@/lib/utils` for conditional classes via `cn()` function
- Follow dark mode: `dark:bg-slate-900`
- Use design tokens: colors (slate, amber, green), spacing, border-radius

```typescript
import { cn } from "@/lib/utils";

<div className={cn(
  "base-classes",
  isActive && "active-classes",
  variant === "primary" ? "primary-classes" : "secondary-classes"
)} />
```

---

## Architecture

### Directory Structure
```
src/
├── app/                 # App configuration (routing, providers)
├── components/
│   ├── ui/             # Reusable UI components (Button, Card, Input)
│   └── common/         # Common components (Layout, Navbar, ErrorBoundary)
├── features/           # Feature-based modules
│   └── {feature}/
│       ├── application/    # Hooks, Context, Providers, Types
│       ├── presentation/  # React components
│       └── domain/        # Business logic, utilities
├── lib/                # Shared utilities (utils.ts)
└── pages/              # Page-level components
```

### State Management
- Use Context API for global state (Cart, Theme)
- Use TanStack Query for server state
- Keep contexts focused and split when growing

### Testing
- Test files co-located: `Component.tsx` and `Component.test.tsx`
- Vitest + React Testing Library
- Use `renderHook` for testing custom hooks
- Mock external dependencies (react-hot-toast, etc.)

---

## Best Practices (Vercel React Guidelines)

Reference: `.agents/skills/vercel-react-best-practices/AGENTS.md`

### Critical Performance Rules
1. **Eliminate waterfalls**: Use `Promise.all()` for independent async operations
2. **Avoid barrel imports**: Import directly from source files
3. **Memoize expensive components**: Use `React.memo()` and `useMemo()`
4. **Use functional state updates**: `setState(prev => ...)`
5. **Lazy initialize state**: `useState(() => expensiveInit())`

### Additional Guidelines
- Use `startTransition` for non-urgent updates
- Subscribe to derived boolean state, not continuous values
- Put interaction logic in event handlers, not effects
- Use passive event listeners for scroll/wheel events

---

## Configuration Files

| File | Purpose |
|------|---------|
| `tsconfig.json` | TypeScript config (strict, paths: @/*) |
| `.eslintrc.cjs` | ESLint rules |
| `vite.config.js` | Vite + React + Tailwind config |
| `package.json` | Dependencies and scripts |

---

## Key Dependencies

- **React 18** with TypeScript
- **Vite** for building
- **Tailwind CSS v4** for styling
- **Vitest** for testing
- **TanStack Query** for data fetching
- **React Router DOM** for routing
- **Radix UI** for accessible components
- **Framer Motion** for animations
- **Lucide React** for icons

---

## Notes for Agents

1. Always run `npm run lint` and `npm run type-check` before committing
2. Test changes with `npm run test` or single test file
3. Use path alias `@/` for imports (not relative paths when possible)
4. Follow the feature-based folder structure
5. Add JSDoc comments to exported functions and components
6. Use semantic HTML and accessibility attributes (`aria-label`, `role`)
