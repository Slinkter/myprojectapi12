# 🛍️ Modern React E-Commerce Architecture

> A professional, scalable, and high-performance E-Commerce application built with **React**, **Vite**, and **Tailwind CSS**, following **Clean Architecture** and **Feature-Based** design patterns.

![Project Banner](./api12.png)

## 🚀 Introduction

This project demonstrates a production-ready frontend architecture for a React application. It moves away from the traditional "file-type" grouping (components, hooks, pages) to a **Feature-Based Architecture**, making it highly scalable and maintainable.

It includes a fully functional shopping cart, product listing with pagination, and a checkout flow with validation, all styled with **Tailwind CSS** and **BEM methodology**.

## 🛠️ Tech Stack

-   **Core**: React 18, Vite
-   **Styling**: Tailwind CSS, @material-tailwind/react
-   **Routing**: React Router DOM ^7.10.1
-   **Architecture**: Feature-Based, Clean Architecture principles
-   **State Management**: Context API + Reducers
-   **Performance**: React.lazy, Suspense, React.memo, Set-based deduplication

## 📂 Project Structure

The project is organized by **features**, ensuring that code related to a specific domain (like Cart or Checkout) stays together.

```text
src/
├── components/         # Shared/Generic UI components
│   └── common/         # Layouts, ThemeSwitcher
├── features/           # Feature-based modules
│   ├── cart/           # Cart domain
│   │   ├── components/ # Cart, CartIcon
│   │   └── context/    # CartContext
│   ├── checkout/       # Checkout domain
│   │   ├── hooks/      # useCheckout (Business Logic)
│   │   └── pages/      # Checkout, CheckoutSuccess
│   └── products/       # Product domain
│       ├── components/ # Product, ProductGrid, etc.
│       ├── hooks/      # useProducts
│       └── services/   # API calls
├── pages/              # Main entry pages (Lazy Loaded)
├── context/            # Global app state (Theme)
├── utils/              # Helper functions
└── AppRouter.jsx       # Route definitions
```

## ✨ Key Features

-   **Feature-Based Architecture**: Modular and decoupled code.
-   **Custom Hooks**: Logic extracted from UI components (e.g., `useCheckout`, `useProducts`).
-   **Lazy Loading**: Route-based code splitting for faster initial load.
-   **BEM + Tailwind**: Organized CSS classes using `@apply` for clean JSX.
-   **Responsive Design**: Mobile-first approach.
-   **Dark Mode**: Built-in theme switcher.

## 🚀 Getting Started

### Prerequisites

-   Node.js (v16+)
-   npm or pnpm

### Installation

1.  **Clone the repository**

    ```bash
    git clone https://github.com/yourusername/myprojectapi12.git
    cd myprojectapi12
    ```

2.  **Install dependencies**

    ```bash
    npm install
    # or
    pnpm install
    ```

3.  **Run the development server**
    ```bash
    npm run dev
    ```

## 📐 Architecture Decisions

### Why Feature-Based?

As applications grow, grouping by file type (`/components`, `/hooks`) becomes unmanageable. Grouping by **Feature** (`/features/cart`, `/features/products`) allows developers to work on a specific domain without jumping between distant folders.

### Separation of Concerns

We strictly separate **UI** from **Logic**.

-   **UI**: Components only render data and handle user events.
-   **Logic**: Custom hooks (`useCheckout`) handle state, validation, and side effects.

### BEM with Tailwind

We use Tailwind for utility classes but organize them using **BEM** in `index.css` with `@apply`. This keeps our JSX clean and semantic:

**Before:**

```jsx
<div className="flex justify-between items-center p-4 bg-gray-50 border-t">
    ...
</div>
```

**After:**

```jsx
<div className="product-card__footer">...</div>
```

## 🔮 Roadmap

-   [x] Refactor Styles to BEM + Tailwind (Completed)
-   [ ] Add Unit Tests (Vitest + React Testing Library)
-   [ ] Implement Authentication (Auth0 or Firebase)
-   [ ] Add Global Error Boundary
-   [ ] Integrate a real Payment Gateway (Stripe)

---
