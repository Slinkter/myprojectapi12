# 🚀 Getting Started Guide

**Project:** MyProjectAPI12  
**Last Updated:** February 5, 2026

---

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** >= 18.0.0
- **pnpm** >= 8.0.0 (recommended) or npm/yarn

### Check Versions

```bash
node --version # Should be >= 18
pnpm --version # Should be >= 8
```

### Install pnpm (if needed)

```bash
npm install -g pnpm
```

---

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/Slinkter/myprojectapi12.git
cd myprojectapi12
```

### 2. Install Dependencies

```bash
pnpm install
```

This will install all dependencies including:

- React 18
- TypeScript
- Tailwind CSS
- Vite
- React Query
- Vitest
- And more...

### 3. Start Development Server

```bash
pnpm dev
```

The app will be available at `http://localhost:5173`

---

## Project Structure

```text
myprojectapi12/
├─ src/
│  ├─ app/ # App configuration
│  │  ├─ config/ # Environment & clients
│  │  └─ routing/ # Routes
│  │
│  ├─ features/ # Feature modules
│  │  ├─ cart/ # Shopping cart
│  │  ├─ products/ # Product catalog
│  │  ├─ checkout/ # Checkout flow
│  │  └─ theme/ # Theme management
│  │
│  ├─ components/ # Shared components
│  ├─ styles/ # CSS modules
│  ├─ pages/ # Page components
│  └─ test/ # Test utilities
│
├─ docs/ # Documentation
│  ├─ guides/ # How-to guides
│  ├─ reports/ # Analysis reports
│  └─ architecture/ # Architecture docs
│
├─ public/ # Static assets
├─ dist/ # Build output
│
├─ tsconfig.json # TypeScript config
├─ tailwind.config.js # Tailwind config
├─ vite.config.js # Vite config
└─ package.json # Dependencies
```

---

## Available Scripts

### Development

```bash

# Start dev server (hot reload)

pnpm dev

# Build for production

pnpm build

# Preview production build

pnpm preview
```

### Code Quality

```bash

# Run ESLint

pnpm lint

# Run TypeScript type-check

pnpm type-check
```

### Testing

```bash

# Run tests once

pnpm test -- --run

# Run tests in watch mode

pnpm test

# Run tests with UI

pnpm test:ui

# Generate coverage report

pnpm test:coverage
```

### Deployment

```bash

# Deploy to GitHub Pages

pnpm deploy
```

---

## Development Workflow

### 1. Create a Feature Branch

```bash
git checkout -b feature/my-new-feature
```

### 2. Make Your Changes

Follow the project structure:

```text
src/features/my-feature/
├─ application/
│  ├─ MyFeatureContext.tsx
│  └─ useMyFeature.ts
├─ domain/
│  ├─ myFeatureTypes.ts
│  └─ myFeatureUtils.ts
└─ presentation/
   └─ MyFeature.jsx
```

### 3. Write Tests

```typescript
// src/features/my-feature/domain/**tests**/myFeatureUtils.test.ts
import { describe, test, expect } from 'vitest';
import { myFunction } from '../myFeatureUtils';

describe('myFunction', () => {
test('does something', () => {
expect(myFunction()).toBe(expected);
});
});
```

### 4. Run Quality Checks

```bash

# Type-check

pnpm type-check

# Lint

pnpm lint

# Test

pnpm test -- --run

# Build

pnpm build
```

### 5. Commit Your Changes

```bash
git add .
git commit -m "feat: add my new feature"
```

**Commit Convention:**

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation
- `style:` Formatting
- `refactor:` Code refactoring
- `test:` Tests
- `chore:` Maintenance

### 6. Push and Create PR

```bash
git push origin feature/my-new-feature
```

Then create a Pull Request on GitHub.

---

## Common Tasks

### Adding a New Feature

1. **Create feature folder:**
   ```bash
   mkdir -p src/features/my-feature/{application,domain,presentation}
   ```

2. **Create domain layer (TypeScript):**
   ```typescript
   // src/features/my-feature/domain/myFeatureTypes.ts
   export interface MyData {
   id: number;
   name: string;
   }
   ```

3. **Create business logic:**
   ```typescript
   // src/features/my-feature/domain/myFeatureUtils.ts
   import type { MyData } from './myFeatureTypes';

    export const processData = (data: MyData): MyData => {
    // Pure function logic
    return data;
    };
    ```

4. **Create context/hooks:**
   ```typescript
   // src/features/my-feature/application/MyFeatureContext.tsx
   import { createContext } from 'react';

    export const MyFeatureContext = createContext(undefined);
    ```

5. **Create UI components:**
   ```jsx
   // src/features/my-feature/presentation/MyFeature.jsx
   export const MyFeature = () => {
   return <div>My Feature</div>;
   };
   ```

### Adding a New Component

```jsx
// src/components/common/MyComponent.jsx
export const MyComponent = ({ children }) => {
return (
<div className="card-base">
{children}
</div>
);
};
```

### Adding New Styles

1. **Determine category:**
    - Design token → `src/styles/variables.css`
    - Animation → `src/styles/animations.css`
    - Button → `src/styles/buttons.css`
    - Card → `src/styles/cards.css`
    - Component → `src/styles/components.css`

2. **Add styles:**
   ```css
   /_ src/styles/components.css _/
   .my-component {
   @apply bg-white rounded-lg;
   box-shadow: var(--shadow-soft);
   }
   ```

### Adding a New Route

```javascript
// src/app/routing/AppRouter.jsx
import { lazy } from 'react';

const MyPage = lazy(() => import('@/pages/MyPage'));

const routes = [
// ...existing routes
{
path: '/my-page',
element: <MyPage />,
},
];
```

---

## Environment Variables

Create a `.env` file in the root:

```env
VITE_API_URL=https://dummyjson.com
VITE_APP_NAME=MyProjectAPI12
```

Access in code:

```javascript
const apiUrl = import.meta.env.VITE_API_URL;
```

---

## Troubleshooting

### Port Already in Use

```bash

# Kill process on port 5173

lsof -ti:5173 | xargs kill -9

# Or use a different port

pnpm dev -- --port 3000
```

### Module Not Found

```bash

# Clear node_modules and reinstall

rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### Build Errors

```bash

# Clear Vite cache

rm -rf node_modules/.vite

# Rebuild

pnpm build
```

### TypeScript Errors

```bash

# Run type-check to see all errors

pnpm type-check

# Check specific file

pnpm tsc --noEmit src/path/to/file.ts
```

---

## IDE Setup

### VS Code (Recommended)

**Extensions:**

- ESLint
- Prettier
- Tailwind CSS IntelliSense
- TypeScript Vue Plugin (Volar)

**Settings:**
```json
{
"editor.formatOnSave": true,
"editor.codeActionsOnSave": {
"source.fixAll.eslint": true
},
"typescript.tsdk": "node_modules/typescript/lib"
}
```

---

## Learning Resources

### Documentation

- [Architecture Guide](../architecture/ARCHITECTURE.md)
- [CSS System](./CSS_SYSTEM.md)
- [TypeScript Guide](./TYPESCRIPT_GUIDE.md)
- [Testing Guide](./TESTING_GUIDE.md)

### External Resources

- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Vite Guide](https://vitejs.dev/guide/)
- [Vitest](https://vitest.dev/)

---

## Next Steps

1. ✅ Read the [Architecture Guide](../architecture/ARCHITECTURE.md)
2. ✅ Explore the codebase
3. ✅ Run the tests
4. ✅ Make a small change
5. ✅ Create your first feature

---

## Getting Help

- **Issues:** [GitHub Issues](https://github.com/Slinkter/myprojectapi12/issues)
- **Discussions:** [GitHub Discussions](https://github.com/Slinkter/myprojectapi12/discussions)
- **Documentation:** [./docs](../README.md)

---

_Last updated: February 5, 2026_
