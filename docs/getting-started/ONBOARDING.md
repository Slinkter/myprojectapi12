# Onboarding: MyProjectAPI12

Welcome to the **MyProjectAPI12** development team! This guide will help you set up your local environment and get familiar with our project structure.

This project is built using:
*   **Framework**: React 18
*   **Language**: TypeScript
*   **Build Tool**: Vite
*   **Styling**: Tailwind CSS v4
*   **Package Manager**: pnpm

---

## Prerequisites

Before you begin, ensure you have the following installed on your machine:

*   **Node.js**: Version **>= 18** (Check with `node -v`)
*   **pnpm**: Version **>= 8** (Check with `pnpm -v`)

---

## Installation

Follow these steps to get the project running locally:

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/Slinkter/myprojectapi12.git
    cd myprojectapi12
    ```

2.  **Install dependencies**:
    We use `pnpm` to manage project dependencies. Run the following command in the root directory:
    ```bash
    pnpm install
    ```

---

## Development

To start the development server and begin working, run:

```bash
pnpm dev
```

This will launch the application at `http://localhost:5173`. Any changes you make will be hot-reloaded automatically.

---

## Testing & Quality

We maintain high code quality standards. Please run these commands before committing your work:

*   **Run tests**: `pnpm test`
*   **Run linting**: `pnpm lint`
*   **Type checking**: `pnpm type-check`

---

## Folder Structure Overview

Our project follows a feature-based architecture to keep code modular and maintainable:

*   **`src/app/`**: Contains application-level configuration, such as routing, global providers, and theme initialization.
*   **`src/features/`**: Contains business-logic modules grouped by feature (e.g., `cart/`, `products/`, `auth/`). Each feature encapsulates its own components, hooks, and logic.
*   **`src/shared/`**: Contains shared utilities, common API clients, and helper functions used throughout the application.

*Note: You will notice other directories like `components/`, `entities/`, and `widgets/`. These follow the same philosophy of keeping code organized by its responsibility within our feature-based architecture.*

---

If you have any questions, please reach out to the senior developers on the team. Happy coding!
