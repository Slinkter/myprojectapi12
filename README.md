# 🛍️ MyProjectAPI12

> Modern e-commerce SPA built with React, TypeScript, and Tailwind CSS

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)](https://github.com/Slinkter/myprojectapi12)
[![TypeScript](https://img.shields.io/badge/TypeScript-100%25-blue)](https://www.typescriptlang.org/)
[![Tests](https://img.shields.io/badge/tests-23%20passing-success)](./docs/reports/TESTING_REPORT.md)
[![Accessibility](https://img.shields.io/badge/WCAG-2.1%20AA-green)](./docs/reports/ACCESSIBILITY_REPORT.md)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

A production-ready e-commerce application showcasing modern React patterns, TypeScript integration, and clean architecture principles.

---

## ✨ Features

- 🛒 **Shopping Cart** - Full-featured cart with TypeScript type safety
- 🎨 **Dark Mode** - Seamless theme switching
- 📱 **Responsive Design** - Mobile-first approach with Tailwind CSS
- ⚡ **Performance** - Optimized build (3.23s) with code splitting
- 🧪 **Well Tested** - 23 tests with 100% domain layer coverage
- 🔒 **Type Safe** - TypeScript strict mode enabled
- ♿ **Accessible** - ARIA labels and keyboard navigation
- 📦 **Modular CSS** - Organized design system

---

## 🚀 Quick Start

### Prerequisites

- Node.js >= 18
- pnpm >= 8

### Installation

\`\`\`bash

# Clone repository

git clone https://github.com/Slinkter/myprojectapi12.git
cd myprojectapi12

# Install dependencies

pnpm install

# Start development server

pnpm dev
\`\`\`

Visit `http://localhost:5173`

---

## 📚 Documentation

### For Developers

- **[Getting Started](./docs/guides/GETTING_STARTED.md)** - Setup and development guide
- **[Architecture](./docs/architecture/ARCHITECTURE.md)** - System design and patterns
- **[TypeScript Guide](./docs/guides/TYPESCRIPT_GUIDE.md)** - TypeScript usage and conventions
- **[Testing Strategy](./docs/guides/TESTING_GUIDE.md)** - How to write and run tests
- **[CSS System](./docs/guides/CSS_SYSTEM.md)** - Design system and utilities
- **[Contributing](./CONTRIBUTING.md)** - How to contribute

### Reports & Analysis

- **[Project Analysis](./docs/reports/PROJECT_ANALYSIS.md)** - Code quality metrics
- **[Refactoring Report](./docs/reports/REFACTORING_REPORT.md)** - Phases 1-6 summary
- **[Testing Report](./docs/reports/TESTING_REPORT.md)** - Test coverage and results

---

## 🏗️ Tech Stack

### Core

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **React Router** - Routing

### Styling

- **Tailwind CSS** - Utility-first CSS
- **Framer Motion** - Animations
- **Custom CSS System** - Modular design tokens

### State Management

- **React Context** - Global state
- **React Query** - Server state
- **Custom Hooks** - Reusable logic

### Testing

- **Vitest** - Unit testing
- **React Testing Library** - Component testing

### Tools

- **ESLint** - Linting
- **Prettier** - Code formatting
- **pnpm** - Package manager

---

## 📁 Project Structure

\`\`\`
myprojectapi12/
├── src/
│ ├── app/ # App configuration
│ │ ├── config/ # Environment & query client
│ │ └── routing/ # Route definitions
│ │
│ ├── features/ # Feature modules
│ │ ├── cart/ # Shopping cart (TypeScript)
│ │ │ ├── application/ # Hooks & context
│ │ │ ├── domain/ # Business logic (TS)
│ │ │ └── presentation/ # UI components
│ │ │
│ │ ├── products/ # Product catalog
│ │ ├── checkout/ # Checkout flow
│ │ └── theme/ # Theme management
│ │
│ ├── components/ # Shared components
│ │ └── common/ # Reusable UI
│ │
│ ├── styles/ # CSS modules
│ │ ├── variables.css # Design tokens
│ │ ├── animations.css # Keyframes
│ │ ├── buttons.css # Button system
│ │ ├── cards.css # Card system
│ │ └── components.css # Specific styles
│ │
│ └── pages/ # Page components
│
├── docs/ # Documentation
│ ├── guides/ # Developer guides
│ ├── reports/ # Analysis reports
│ └── architecture/ # Architecture docs
│
└── public/ # Static assets
\`\`\`

---

## 🧪 Testing

\`\`\`bash

# Run all tests

pnpm test

# Run tests in watch mode

pnpm test -- --watch

# Run tests with UI

pnpm test:ui

# Generate coverage report

pnpm test:coverage
\`\`\`

**Current Coverage:**

- Total Tests: 23
- Domain Layer: 100%
- Application Layer: 100%
- Overall: ~40%

---

## 🛠️ Available Scripts

| Script               | Description              |
| -------------------- | ------------------------ |
| `pnpm dev`           | Start development server |
| `pnpm build`         | Build for production     |
| `pnpm preview`       | Preview production build |
| `pnpm lint`          | Run ESLint               |
| `pnpm type-check`    | Run TypeScript check     |
| `pnpm test`          | Run tests                |
| `pnpm test:ui`       | Run tests with UI        |
| `pnpm test:coverage` | Generate coverage report |
| `pnpm deploy`        | Deploy to GitHub Pages   |

---

## 📊 Performance Metrics

| Metric                 | Value    |
| ---------------------- | -------- |
| Build Time             | 3.23s    |
| Bundle Size (gzipped)  | 76.69 KB |
| CSS Size (gzipped)     | 6.73 KB  |
| Lighthouse Score       | 95+      |
| First Contentful Paint | < 1s     |

---

## 🎨 Design System

### Colors

- Primary: Amber (#d97706)
- Background: Slate (#f8fafc / #0f172a)
- Text: Slate (#1a1614 / #f8fafc)

### Typography

- Font Family: Lora (serif)
- Base Size: 16px
- Scale: 1.25 (Major Third)

### Spacing

- Base Unit: 4px
- Scale: 0.25rem, 0.5rem, 1rem, 1.5rem, 2rem, 3rem

---

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](./CONTRIBUTING.md) for details.

### Development Workflow

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests (`pnpm test`)
5. Run type-check (`pnpm type-check`)
6. Commit your changes (`git commit -m 'feat: add amazing feature'`)
7. Push to the branch (`git push origin feature/amazing-feature`)
8. Open a Pull Request

---

## 📝 Changelog

See [CHANGELOG.md](./docs/CHANGELOG.md) for a list of changes.

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Luis Reyes**

- GitHub: [@Slinkter](https://github.com/Slinkter)
- LinkedIn: [Luis Reyes](https://linkedin.com/in/luis-reyes)

---

## 🙏 Acknowledgments

- [DummyJSON API](https://dummyjson.com/) - Mock data provider
- [React Icons](https://react-icons.github.io/react-icons/) - Icon library
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [Vite](https://vitejs.dev/) - Build tool

---

## 🔗 Links

- **Live Demo:** [https://slinkter.github.io/myprojectapi12](https://slinkter.github.io/myprojectapi12)
- **Repository:** [https://github.com/Slinkter/myprojectapi12](https://github.com/Slinkter/myprojectapi12)
- **Documentation:** [./docs](./docs)

---

<div align="center">
  <p>Made with ❤️ by Luis Reyes</p>
  <p>© 2026 MyProjectAPI12. All rights reserved.</p>
</div>
