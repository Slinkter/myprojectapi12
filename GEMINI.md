# 🤖 Gemini CLI Instructional Context: MyProjectAPI12

## 🛍️ Project Overview
**MyProjectAPI12** is a production-ready, high-fidelity SPA eCommerce application built with **React 18.3**, **TypeScript 5.9**, and **Tailwind CSS v4**. It implements a sophisticated feature-based architecture (DDD + FSD hybrid) focusing on performance, accessibility (WCAG), and modern UI patterns like Neumorphism and Glassmorphism.

- **Primary Goal:** Provide a seamless, type-safe, and visually stunning shopping experience.
- **Main Features:** Product catalog, infinite scrolling, advanced cart management, multi-theme support (Light/Dark), and responsive design.

---

## 🏗️ Architecture & Patterns
The project follows a **Feature-Based Clean Architecture** with four distinct layers per feature (found in `src/features/*`):

1.  **Domain (`/domain`):** Pure business logic, interfaces, and utilities. **Must be 100% pure and framework-agnostic.**
2.  **Application (`/application`):** Use cases, React Context, and Custom Hooks that orchestrate domain logic and state.
3.  **Infrastructure (`/infrastructure`):** External services, API clients (using `fetch` + `apiClient`), and data mapping.
4.  **Presentation (`/presentation`):** React components styled with Tailwind CSS v4 and animated with Framer Motion.

### Global Folders
- `src/app`: Global configurations (API client, routing with React Router 7, Providers).
- `src/components/ui`: Primitive, accessible components based on Shadcn/UI and Radix UI.
- `src/docs`: Comprehensive technical manual, architecture guides, and reports.

---

## 🛠️ Tech Stack & Tooling
- **Core:** React 18.3, TypeScript 5.9 (Strict Mode), Vite 5.4.
- **Routing:** React Router 7.
- **Server State:** TanStack Query v5 (React Query).
- **Styling:** Tailwind CSS v4.1 (CSS-first configuration via `@theme` in `src/index.css`).
- **Animations:** Framer Motion 12 + Tailwind Animate.
- **Testing:** Vitest 4.0 + React Testing Library 16.
- **Documentation:** Advanced JSDoc/TypeDoc for IDE IntelliSense.

---

## 🚀 Development Workflows

### Build & Run Commands
- `pnpm dev`: Start development server (Vite).
- `pnpm build`: Production build.
- `pnpm test`: Run Vitest suite.
- `pnpm test:ui`: Vitest with UI dashboard.
- `pnpm lint`: ESLint check.
- `pnpm type-check`: TypeScript compiler check.

### Coding Standards
1.  **Type Safety:** Always define interfaces in the feature's `domain` layer. Avoid `any` at all costs.
2.  **CSS v4:** Use the `@theme` block in `src/index.css` for design tokens. Prefer utility classes but leverage `@apply` for complex, repetitive patterns.
3.  **Hooks First:** Encapsulate logic in custom hooks (`useCart`, `useProducts`) within the `application` layer.
4.  **JSDoc Documentation:** Every function, interface, and hook **must** have JSDoc comments for elite IntelliSense support.
5.  **Pure Domain:** Never import React hooks or UI components into the `domain` layer.
6.  **Surgical Edits:** When modifying components, respect the existing **Neumorphic/Glassmorphic** aesthetic and **Framer Motion** transitions.

---

## 🧪 Testing Strategy
- **Domain Layer:** Aim for 100% coverage of pure functions and utilities.
- **Application Layer:** Test hooks using `renderHook` from `@testing-library/react`.
- **Presentation Layer:** Test critical UI interactions and accessibility roles.

---

## 📚 Key Documentation Files
- `src/docs/engineering/TECHNICAL_MANUAL.md`: The "Source of Truth" for technical decisions.
- `src/docs/architecture/ARCHITECTURE.md`: Detailed breakdown of layers and data flow.
- `src/docs/architecture/DESIGN_SYSTEM.md`: Visual guidelines and design tokens.
- `src/docs/guides/JSDOC_GUIDE.md`: Standards for documentation.

---

## ⚠️ Safety & Security
- **API Base URL:** Managed in `src/app/config/env.ts`.
- **Secrets:** Do not commit `.env` files or expose keys in the frontend.
- **Credentials:** Use `apiClient.ts` for standardized, secure requests.
