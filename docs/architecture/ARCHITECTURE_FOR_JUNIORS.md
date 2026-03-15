# Architecture Guide for Juniors

Welcome to the team! Our codebase uses **Feature-Sliced Design (FSD)** combined with **Domain-Driven Design (DDD)** concepts.

At first glance, the folder structure might seem strict, but it is designed to keep our project maintainable as it grows. Instead of organizing files by *what they are* (e.g., putting all components in one massive folder), we organize by *what they do for the business*.

---

## The Analogy: The Lego Space Station

Think of our app as building a complex Lego space station.

1.  **`src/shared` (The Standard Bricks):** These are generic, basic pieces like `Button`, `Input`, or `api-client`. They don't know anything about the space station; they are just tools used to build everything else.
2.  **`src/entities` (The Essential Modules):** These are the core business "nouns." For example, a `Product` or a `CartItem`. They hold the data structure and basic logic defining what a "Product" is.
3.  **`src/features` (The Functionality):** These are the "verbs" or actions the user performs. Examples include `AddToCart`, `Checkout`, or `FilterProducts`. A feature might use an entity (e.g., `AddToCart` needs a `Product`) and some shared UI components.

---

## Why these directories?

| Directory | What it is | Goal |
| :--- | :--- | :--- |
| **`src/shared`** | Infrastructure | Reusable tools that don't know about business logic. |
| **`src/entities`** | Business Objects | Definitions of our core data (e.g., `Product`, `User`). |
| **`src/features`** | User Actions | Interactive workflows (e.g., "Add to Cart"). |

### The "Dependency Rule"
To keep our code clean, we follow a strict rule: **Features can use Entities, and Entities can use Shared, but NOT vice versa.**

*   `Features` -> import from -> `Entities`
*   `Entities` -> import from -> `Shared`
*   `Shared` -> **never** imports from `Features` or `Entities`

This prevents "spaghetti code" where everything is connected to everything else, making it much easier to change one part of the app without breaking another.

---

## Key Benefits for You

*   **Locating Files:** If you need to fix the "Add to Cart" button, you know exactly where it is: `src/features/cart/add-to-cart.tsx`. You don't have to hunt through a massive `/components` folder.
*   **Reduced Complexity:** You only need to understand the feature you are working on, not the entire application at once.
*   **Easier Testing:** Because features and entities are isolated, it is much easier to write focused, reliable tests.

---

## Quick Summary

When adding code:
1.  **Is it a generic UI element or utility?** Put it in `src/shared`.
2.  **Does it define a business concept?** Put it in `src/entities`.
3.  **Is it an interactive action?** Put it in `src/features`.

If you aren't sure where something belongs, just ask! We'd rather you ask than put it in the wrong place. Happy coding!
