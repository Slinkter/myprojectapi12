# 🛠️ Technical Operations & Development Manual

This document is the definitive guide for technical setup, development standards, testing, deployment, and contribution guidelines for **MyProjectAPI12**.

---

## 1. 🚀 Tech Stack Overview

- **Frontend:** React 18.3 + TypeScript 5.9
- **Build Tool:** Vite 5.4
- **Styling:** Tailwind CSS v4 (CSS-first)
- **State Management:** TanStack Query v5 (Server state) + React Context (Client state)
- **Routing:** React Router v7
- **Animations:** Framer Motion v12
- **Icons:** Lucide React
- **Unit Testing:** Vitest 4.0 + React Testing Library 16

---

## 2. 🏁 Getting Started

### Prerequisites:

- **Node.js:** v18.0.0+
- **PNPM:** v8.0.0+

### Installation & Initialization:

```bash
# Clone repository
git clone https://github.com/Slinkter/myprojectapi12.git
cd myprojectapi12

# Install dependencies
pnpm install

# Start local development server (HMR enabled)
pnpm dev
```

### Build & Production:

```bash
# Build the project for production (outputs to `/dist`)
pnpm build

# Preview the production build locally
pnpm preview
```

### Environment Variables:

The project uses `.env` files (natively supported by Vite).

| Variable            | Description              | Default                 |
| ------------------- | ------------------------ | ----------------------- |
| `VITE_API_BASE_URL` | Base URL of the REST API | `https://dummyjson.com` |

---

## 3. 🧠 Technical Explanations (Algorithms & Concepts)

### Infinite Scroll Pagination (TanStack Query)

The project implements an efficient infinite scroll algorithm in `src/features/products/application/useProducts.ts`.

It utilizes TanStack's `useInfiniteQuery`. The core logic lies in `getNextPageParam`:

```typescript
getNextPageParam: (lastPage, allPages) => {
  // Calculates how many products are currently in memory
  const totalFetched = allPages.reduce(
    (acc, page) => acc + page.products.length,
    0,
  );

  // If fetched is less than the total available on the server, load the next page
  return totalFetched < lastPage.total ? allPages.length + 1 : undefined;
};
```

If this returns a number, TanStack Query uses it as `pageParam` for the next query. We use `.flatMap(page => page.products)` in the view layer to squash the arrays into a single list.

### Global State Management (React Context)

The project strongly avoids Prop Drilling by using the Context Pattern safely. Features like the Shopping Cart or the Product Modal are wrapped in a custom provider (`ProductModalProvider`, `CartProvider`).

Consumer hooks are built defensively:

```typescript
const context = useContext(ProductModalContext);
if (context === undefined) {
  throw new Error("Must be used within ProductModalProvider");
}
return context;
```

---

## 4. 📝 Coding & Documenting Standards (JSDoc)

We employ **Concise JSDoc** statements to optimize IDE IntelliSense.

**Rules for JSDoc:**

- Do not state the obvious.
- Be concise (3-5 lines max).
- Include standard params and return types.

**Component Example:**

```javascript
/**
 * Product Card displaying the thumbnail, title, price, and actions.
 *
 * @param {Object} props
 * @param {IProduct} props.product - The product data object
 */
export const ProductCard = ({ product }) => { ... }
```

**Function Example:**

```javascript
/**
 * Adds a product to the cart. Increments quantity if it already exists.
 *
 * @param {IProduct} product - Product to add
 * @param {number} quantity - Quantity to increment
 */
export const addToCart = (product, quantity) => { ... }
```

### Code Style (TypeScript)

- **Functional Components:** Use Arrow Functions.
- **Hook-First Logic:** Side effects and state belong in custom hooks within the `application` layer.
- **Type Safety:** Avoid `any`. Use `unknown` and type guards if necessary.
- **Atomicity:** Keep components < 150 lines. Decompose larger ones. Use composition instead of complex prop drilling.

---

## 5. 🎨 UI & Styling System (Tailwind v4)

We migrated completely to a pure, CSS-first **Tailwind CSS v4** architecture, dropping Material Tailwind, which reduced JS sizes by 74%.

- **CSS Variables First:** `src/styles/variables.css` defines the tokens:
  ```css
  :root {
    --bg-main: #f8fafc;
    --text-primary: #1a1614;
  }
  .dark:root {
    --bg-main: #0f172a;
    --text-primary: #f8fafc;
  }
  ```
- **Component Classes:** Shared components are defined using `@layer components` or Tailwind `@apply` to DRY up templates.
  - **Examples:** `.btn-primary`, `.neumo-card`, `.neumo-input`.
- **Animations:** Modularized in `animations.css` (e.g., `fadeInUp`, `slideInRight`).

---

## 6. 🧪 Testing Strategy

The project employs **Vitest** + **React Testing Library** for an exhaustive testing suite focusing heavily on the domain layer.

- **Unit Tests:** For pure functions in `domain/`.
- **Integration Tests:** For hooks and providers (e.g., `useCart.tsx`) in `application/`.
- **Target Coverage:** We aim to keep domain functions 100% covered.

**Commands:**

```bash
# Run tests
pnpm test

# Check coverage
pnpm test:coverage

# Visual UI mode
pnpm test:ui
```

---

## 7. 🚢 Deployment & CI/CD Guide

The project uses GitHub Actions to seamlessly deploy to GitHub Pages under the `gh-pages` branch on every commit to `main`.

### Simulated Pipeline Flow

1. **Checkout**: Action clones repo.
2. **Install**: `pnpm install --frozen-lockfile` runs.
3. **Lint**: `pnpm lint` ensures static code quality. Build fails if errors exist.
4. **Build**: `pnpm build` outputs to `/dist`.
5. **Deploy**: The built output in `/dist` is pushed to GitHub Pages.

**Live Artifact:** [https://slinkter.github.io/myprojectapi12/](https://slinkter.github.io/myprojectapi12/)

---

_Last updated: 2026-03-06_
