# Guide: Adding a New Feature

This guide outlines the standardized process for adding a new feature to this React/TypeScript project using the [Feature-Sliced Design (FSD)](https://feature-sliced.design/) architecture.

---

### 1. Identify or Create the Feature Folder
All features reside in `src/features/`. If your feature is new, create a folder using kebab-case.

```text
src/features/
└── my-new-feature/       # Kebab-case name
    ├── components/       # Feature-specific components
    ├── hooks/            # Feature-specific hooks
    ├── types/            # TypeScript interfaces/types
    ├── index.ts          # Public API (exports only what is needed)
    └── __tests__/        # Feature tests
```

### 2. Define Types
Define the data structures used by your feature within `src/features/my-new-feature/types/`. If the entity already exists in `src/entities/`, import it rather than redefining it.

```typescript
// src/features/my-new-feature/types/index.ts
export interface FeatureData {
  id: string;
  label: string;
}
```

### 3. Create Hooks and Logic
Place business logic and state management hooks in `src/features/my-new-feature/hooks/`. This keeps components clean and focused on rendering.

```typescript
// src/features/my-new-feature/hooks/useFeature.ts
export const useFeature = () => {
  // Logic here
};
```

### 4. Create Components
Create React components in `src/features/my-new-feature/components/`. Use Tailwind CSS v4 for styling.

```tsx
// src/features/my-new-feature/components/FeatureButton.tsx
export const FeatureButton = () => {
  return <button className="bg-slate-900 text-white">Click me</button>;
};
```

### 5. Export from `index.ts`
The `index.ts` file acts as the public API for the feature. Only export what is necessary for other modules to use. This encapsulates the internal structure.

```typescript
// src/features/my-new-feature/index.ts
export { FeatureButton } from "./components/FeatureButton";
export { useFeature } from "./hooks/useFeature";
```

### 6. Add Tests
Tests should be co-located or within `__tests__/` inside the feature folder. Use Vitest and React Testing Library.

```tsx
// src/features/my-new-feature/__tests__/FeatureButton.test.tsx
import { render, screen } from "@testing-library/react";
import { FeatureButton } from "../components/FeatureButton";

test("renders correctly", () => {
  render(<FeatureButton />);
  expect(screen.getByRole("button")).toBeDefined();
});
```

---

### Final Checklist Before Committing
1.  **Type Check:** Run `pnpm type-check` to ensure no TypeScript errors.
2.  **Lint:** Run `pnpm lint` to check for violations.
3.  **Test:** Run `pnpm test -- --run` to ensure all tests pass.
4.  **Formatting:** Ensure all files follow project naming and style conventions.
