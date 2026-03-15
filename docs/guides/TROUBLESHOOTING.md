# Troubleshooting Guide

Welcome! This guide is designed to help you quickly identify and resolve common issues you might encounter while working on this project.

## 1. How to Read Error Logs

When something goes wrong, don't panic! The error message is usually your best clue.

### Terminal (Build/Dev Server)
If you see errors when running `pnpm dev` or `pnpm build`, these are usually compilation, syntax, or type errors.
*   **Focus on the first error**: Often, one error causes a cascade of others. Fix the first one, then check if others disappear.
*   **Read the stack trace**: Look for file paths inside `src/` to pinpoint exactly where the error originated.

### Browser Console
If the app renders but features aren't working as expected:
*   Open Developer Tools (F12) and go to the **Console** tab.
*   Look for red error messages. These will often show JavaScript exceptions, failed API calls, or warnings about invalid props.

---

## 2. Common Issues & Solutions

### "Module not found"
If TypeScript or Vite complains it cannot find a file or module:
*   **Check Path Aliases**: We use `@/` to map to `src/`. Ensure your imports use this (e.g., `import { Button } from "@/components/ui/button"`).
*   **Check File Case**: Linux/macOS file systems are case-sensitive. Ensure your import filename matches the actual file on disk exactly (e.g., `ProductCard` vs `product-card`).
*   **Missing `index.ts`**: If importing a directory, check if an `index.ts` file exists to export the module.

### "Type Errors"
If your code works in the browser but fails build/CI, or VS Code shows squiggly red lines:
*   **Run `pnpm type-check`**: This runs the TypeScript compiler independently to give you a full list of type issues in the codebase.
*   **Avoid `any`**: Explicitly type your variables and component props. If you are stuck, check how similar components in the same feature folder define their interfaces.
*   **Check `tsconfig.json`**: Ensure you are following strict mode rules.

### Component Not Updating
If your UI doesn't reflect the state changes:
*   **Immutability**: React relies on immutability. Ensure you are creating *new* objects/arrays when updating state instead of mutating them directly (e.g., `setItems(prev => [...prev, newItem])`).
*   **Context Provider Issues**: Check if your component is wrapped by the correct Provider. If it's outside the Provider, it will receive the default value (often `undefined`), leading to errors or silent failures.
*   **Memoization (`React.memo`)**: If you've used `React.memo` or `useMemo`, ensure the dependency arrays are correct. If a dependency is missing, the component might not re-render when it should.

### Testing Failures
If your tests are failing:
*   **Check Mocks**: Vitest tests often mock API calls or external libraries. Ensure your mocks accurately reflect the actual implementation you are testing against. If the API schema changed, your mock must be updated.
*   **Wait for Async**: If testing asynchronous code, ensure you are using `await` with `waitFor` or `findBy...` queries from React Testing Library.
*   **Isolated Tests**: Run only the failing test file to save time: `pnpm test src/path/to/file.test.tsx`.

---

## Still Stuck?

1.  **Search the Codebase**: Use your editor's search function to see how similar components handle the task.
2.  **Isolate the Issue**: Try to create a minimal reproduction of the bug. If you can't reproduce it in a clean test, the issue might be environmental.
3.  **Ask for Help**: If you've spent more than 30-60 minutes stuck, reach out to the team with:
    *   What you are trying to achieve.
    *   What you've already tried.
    *   The exact error message you are seeing.
