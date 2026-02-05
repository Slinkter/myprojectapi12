# 🤝 Contributing to MyProjectAPI12

Thank you for your interest in contributing to MyProjectAPI12! This document provides guidelines and instructions for contributing.

---

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Testing Guidelines](#testing-guidelines)
- [Documentation](#documentation)

---

## 📜 Code of Conduct

### Our Pledge

We are committed to providing a welcoming and inspiring community for all. Please be respectful and constructive in your interactions.

### Our Standards

**Positive behavior includes:**

- Using welcoming and inclusive language
- Being respectful of differing viewpoints
- Gracefully accepting constructive criticism
- Focusing on what is best for the community

**Unacceptable behavior includes:**

- Harassment of any kind
- Trolling or insulting comments
- Public or private harassment
- Publishing others' private information

---

## 🚀 Getting Started

### Prerequisites

- Node.js >= 18
- pnpm >= 8
- Git

### Setup

1. **Fork the repository**
   \`\`\`bash

    # Click "Fork" on GitHub

    \`\`\`

2. **Clone your fork**
   \`\`\`bash
   git clone https://github.com/YOUR_USERNAME/myprojectapi12.git
   cd myprojectapi12
   \`\`\`

3. **Add upstream remote**
   \`\`\`bash
   git remote add upstream https://github.com/Slinkter/myprojectapi12.git
   \`\`\`

4. **Install dependencies**
   \`\`\`bash
   pnpm install
   \`\`\`

5. **Start development server**
   \`\`\`bash
   pnpm dev
   \`\`\`

---

## 💻 Development Workflow

### 1. Create a Branch

\`\`\`bash

# Update your fork

git checkout main
git pull upstream main

# Create feature branch

git checkout -b feature/your-feature-name
\`\`\`

**Branch naming convention:**

- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation
- `refactor/` - Code refactoring
- `test/` - Adding tests
- `chore/` - Maintenance

### 2. Make Your Changes

Follow the [project architecture](./docs/architecture/ARCHITECTURE.md):

\`\`\`
src/features/your-feature/
├── application/ # Hooks & context
├── domain/ # Business logic (TypeScript)
├── infrastructure/ # API clients
└── presentation/ # UI components
\`\`\`

### 3. Write Tests

\`\`\`typescript
// src/features/your-feature/domain/**tests**/yourFeatureUtils.test.ts
import { describe, test, expect } from 'vitest';
import { yourFunction } from '../yourFeatureUtils';

describe('yourFunction', () => {
test('does what it should', () => {
expect(yourFunction(input)).toBe(expected);
});
});
\`\`\`

### 4. Run Quality Checks

\`\`\`bash

# Type-check

pnpm type-check

# Lint

pnpm lint

# Tests

pnpm test -- --run

# Build

pnpm build
\`\`\`

### 5. Commit Your Changes

See [Commit Guidelines](#commit-guidelines) below.

### 6. Push and Create PR

\`\`\`bash
git push origin feature/your-feature-name
\`\`\`

Then create a Pull Request on GitHub.

---

## 📏 Coding Standards

### TypeScript

**Use TypeScript for new code:**

✅ **Do:**
\`\`\`typescript
// Domain layer - always TypeScript
export interface User {
id: number;
name: string;
}

export const getUser = (id: number): User => {
// Implementation
};
\`\`\`

❌ **Don't:**
\`\`\`javascript
// Don't use plain JS for new domain code
export const getUser = (id) => {
// No type safety
};
\`\`\`

### Code Style

**Follow existing patterns:**

✅ **Do:**
\`\`\`typescript
// Use existing hooks
const { cart, addToCart } = useCart();

// Follow naming conventions
const handleAddToCart = () => {
addToCart(product, quantity);
};
\`\`\`

❌ **Don't:**
\`\`\`typescript
// Don't create inconsistent patterns
const cartData = useContext(CartContext);
const add = () => cartData.add(product);
\`\`\`

### File Organization

**Follow the layer architecture:**

\`\`\`
features/my-feature/
├── domain/
│ ├── myFeatureTypes.ts # Types first
│ ├── myFeatureUtils.ts # Pure functions
│ └── **tests**/
│ └── myFeatureUtils.test.ts
├── application/
│ ├── MyFeatureContext.tsx
│ └── useMyFeature.ts
└── presentation/
└── MyFeature.jsx
\`\`\`

### CSS

**Use the modular CSS system:**

✅ **Do:**
\`\`\`css
/_ Extend base classes _/
.my-button {
@apply btn-base;
/_ Add specific styles _/
}

/_ Use CSS variables _/
.my-component {
background-color: var(--bg-card);
}
\`\`\`

❌ **Don't:**
\`\`\`css
/_ Don't duplicate base styles _/
.my-button {
@apply px-5 py-2.5 rounded-xl font-medium...;
}

/_ Don't hard-code colors _/
.my-component {
background-color: #ffffff;
}
\`\`\`

---

## 📝 Commit Guidelines

### Conventional Commits

We use [Conventional Commits](https://www.conventionalcommits.org/):

\`\`\`
<type>(<scope>): <subject>

<body>

<footer>
\`\`\`

### Types

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation only
- `style:` - Code style (formatting, missing semi-colons, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

### Examples

\`\`\`bash

# Feature

git commit -m "feat(cart): add quantity selector to cart items"

# Bug fix

git commit -m "fix(checkout): validate email format before submission"

# Documentation

git commit -m "docs(readme): update installation instructions"

# Refactoring

git commit -m "refactor(products): extract product card logic to hook"

# Tests

git commit -m "test(cart): add tests for calculateTotal function"
\`\`\`

### Commit Message Guidelines

**Subject line:**

- Use imperative mood ("add" not "added")
- Don't capitalize first letter
- No period at the end
- Max 72 characters

**Body (optional):**

- Explain what and why, not how
- Wrap at 72 characters

**Footer (optional):**

- Reference issues: `Closes #123`
- Breaking changes: `BREAKING CHANGE: ...`

---

## 🔄 Pull Request Process

### Before Submitting

- [ ] Code follows project standards
- [ ] Tests pass (`pnpm test -- --run`)
- [ ] Type-check passes (`pnpm type-check`)
- [ ] Lint passes (`pnpm lint`)
- [ ] Build succeeds (`pnpm build`)
- [ ] Documentation updated
- [ ] Commits follow convention

### PR Template

\`\`\`markdown

## Description

Brief description of changes

## Type of Change

- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing

- [ ] Unit tests added/updated
- [ ] All tests passing
- [ ] Manual testing done

## Checklist

- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] No new warnings generated
      \`\`\`

### Review Process

1. **Automated checks** - CI/CD runs tests and linting
2. **Code review** - Maintainer reviews code
3. **Feedback** - Address review comments
4. **Approval** - Maintainer approves PR
5. **Merge** - PR merged to main

---

## 🧪 Testing Guidelines

### Test Coverage Goals

- **Domain layer:** 100%
- **Application layer:** 90%
- **Presentation layer:** 80%
- **Overall:** 80%

### Writing Tests

**Test pure functions first:**

\`\`\`typescript
// Domain layer test
describe('calculateTotal', () => {
test('sums cart items correctly', () => {
const cart = [
{ price: 10, quantity: 2 },
{ price: 5, quantity: 3 }
];
expect(calculateTotal(cart)).toBe(35);
});

    test('returns 0 for empty cart', () => {
        expect(calculateTotal([])).toBe(0);
    });

});
\`\`\`

**Test hooks with context:**

\`\`\`typescript
// Application layer test
test('useCart throws error outside provider', () => {
expect(() => {
renderHook(() => useCart());
}).toThrow('useCart must be used within CartProvider');
});
\`\`\`

### Running Tests

\`\`\`bash

# All tests

pnpm test -- --run

# Watch mode

pnpm test

# Coverage

pnpm test:coverage

# Specific file

pnpm test cartUtils
\`\`\`

---

## 📚 Documentation

### When to Update Docs

Update documentation when you:

- Add a new feature
- Change existing behavior
- Add new patterns or conventions
- Fix bugs that affect usage

### What to Document

- **Code comments** - Complex logic
- **JSDoc** - Public APIs
- **Guides** - New patterns or features
- **README** - Major changes
- **CHANGELOG** - All changes

### Documentation Style

**JSDoc:**
\`\`\`typescript
/\*\*

- Calculates the total price of all items in the cart.
-
- @param cart - Array of cart items
- @returns Total price
  _/
  export const calculateTotal = (cart: CartItem[]): number => {
  return cart.reduce((sum, item) => sum + item.price _ item.quantity, 0);
  };
  \`\`\`

**Inline comments:**
\`\`\`typescript
// Only comment complex logic
const result = complexCalculation(); // Why, not what
\`\`\`

---

## 🐛 Reporting Bugs

### Before Reporting

- Check existing issues
- Try latest version
- Verify it's reproducible

### Bug Report Template

\`\`\`markdown
**Describe the bug**
Clear description of the bug

**To Reproduce**
Steps to reproduce:

1. Go to '...'
2. Click on '...'
3. See error

**Expected behavior**
What should happen

**Screenshots**
If applicable

**Environment:**

- OS: [e.g. macOS]
- Browser: [e.g. Chrome 120]
- Version: [e.g. 2.0.0]
  \`\`\`

---

## 💡 Feature Requests

### Before Requesting

- Check existing requests
- Consider if it fits project scope
- Think about implementation

### Feature Request Template

\`\`\`markdown
**Is your feature request related to a problem?**
Description of the problem

**Describe the solution**
How you'd like it to work

**Describe alternatives**
Other solutions considered

**Additional context**
Any other information
\`\`\`

---

## 🎯 Good First Issues

Look for issues labeled:

- `good first issue`
- `help wanted`
- `documentation`

These are great starting points for new contributors!

---

## 📞 Getting Help

- **Documentation:** [./docs](./docs/README.md)
- **Issues:** [GitHub Issues](https://github.com/Slinkter/myprojectapi12/issues)
- **Discussions:** [GitHub Discussions](https://github.com/Slinkter/myprojectapi12/discussions)

---

## 🙏 Thank You!

Your contributions make this project better. Thank you for taking the time to contribute!

---

_Last updated: February 5, 2026_
