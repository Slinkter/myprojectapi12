# AGENTS.md - Project Guidelines for AI Agents

## Project Overview

This is a React 18 + TypeScript + Vite e-commerce application with Tailwind CSS v4, using feature-based architecture. The project uses pnpm as package manager.

---

## Commands

### Development
```bash
pnpm dev          # Start development server (http://localhost:5173)
pnpm preview      # Preview production build
```

### Building
```bash
pnpm build        # Build for production (outputs to dist/)
pnpm deploy       # Build and deploy to GitHub Pages
pnpm predeploy    # Runs build before deploy
```

### Testing
```bash
pnpm test              # Run all tests in watch mode
pnpm test -- --run     # Run tests once (no watch mode)
pnpm test src/path/to/file.test.tsx    # Run single test file
pnpm test -- fileName  # Run tests matching filename
pnpm test:ui           # Run tests with Vitest UI
pnpm test:coverage     # Run tests with coverage report
```

### Linting & Type Checking
```bash
pnpm lint           # Run ESLint (reports unused disable directives)
pnpm type-check     # Run TypeScript type checking (tsc --noEmit)
```

---

## Code Style Guidelines

### TypeScript
- **Strict mode enabled** in `tsconfig.json`
- Avoid `any` - use explicit types
- Use interfaces for object shapes (optional `I` prefix): `interface Product { ... }`
- Use type for unions/aliases: `type Status = 'ok' | 'low' | 'out'`

### Naming Conventions
- **Components**: PascalCase (`ProductCard`, `CartDrawer`)
- **Hooks**: camelCase with `use` prefix (`useCart`, `useProducts`)
- **Interfaces**: PascalCase (`Product`, `CartItem`)
- **Files**: kebab-case (`product-card.tsx`, `cart-context.tsx`)
- **Constants**: UPPER_SNAKE_CASE for runtime, camelCase for compile-time

### Imports
- Use path alias `@/` maps to `./src/`
- Group imports: external → internal → relative
- Use named exports for utilities

```typescript
// Good
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Product } from "@/entities/cart/types/cart.types";
```

### ESLint Rules (from .eslintrc.cjs)
- `react-refresh/only-export-components`: warn (allow constant export)
- `@typescript-eslint/no-unused-vars`: warn (ignore args starting with `_`)
- `@typescript-eslint/no-explicit-any`: warn
- `react/prop-types`: off (TypeScript handles this)

### React Patterns
- Use `React.memo()` for expensive components
- Use `useMemo()` for expensive calculations
- Use `useCallback()` for stable callback references
- Use functional state updates: `setItems(prev => [...prev, item])`
- Use lazy initialization for expensive `useState` initial values
- Define component displayName for debugging

```typescript
const ProductCard = React.memo(({ product }: ProductCardProps) => {
  return <div className="...">{product.name}</div>;
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

### Tailwind CSS v4
- Use utility classes directly in components
- Use `@/lib/utils` `cn()` function for conditional classes
- Follow dark mode: `dark:bg-slate-900`
- Use design tokens: colors (slate, amber, green), spacing, border-radius

```typescript
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
│   ├── ui/              # Reusable UI components (Button, Card, Input)
│   └── common/          # Common components (Layout, Navbar, ErrorBoundary)
├── features/            # Feature-based modules (cart, products)
├── shared/              # Shared utilities and API clients
├── entities/            # Entity types and business logic
├── widgets/             # Composite widgets
├── pages/               # Page-level components
└── lib/                 # Shared utilities (utils.ts)
```

### State Management
- Use Context API for global state (Cart, Theme)
- Use TanStack Query (`@tanstack/react-query`) for server state
- Keep contexts focused and split when growing

### Testing
- Test files co-located: `Component.tsx` and `Component.test.tsx` or `__tests__/`
- Vitest + React Testing Library + jsdom
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
| `vitest.config.js` | Vitest config (jsdom, aliases) |
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
- **React Icons** (lucide-react, react-icons) for icons

---

## Commit Convention

Use Conventional Commits:
```
<type>(<scope>): <subject>

Types: feat, fix, docs, style, refactor, test, chore
```

Examples:
- `feat(cart): add quantity selector`
- `fix(checkout): validate email format`
- `test(cart): add calculateTotal tests`

---

## Notes for Agents

1. Always run `pnpm lint` and `pnpm type-check` before committing
2. Test changes with `pnpm test -- --run` or single test file
3. Use path alias `@/` for imports when possible
4. Follow the feature-based folder structure
5. Use semantic HTML and accessibility attributes (`aria-label`, `role`)
