/**
 * @file setup.js
 * @description Global test configuration for Vitest and React Testing Library.
 *
 * @remarks
 * This file runs before each test file and is responsible for:
 * 1. Extending Jest DOM matchers.
 * 2. Configuring automatic cleanup after each test.
 * 3. Polyfilling browser APIs not available in JSDOM (e.g., `matchMedia`).
 */

import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

// Automatically clean up the DOM after each test to prevent memory leaks and state pollution.
afterEach(() => {
    cleanup();
});

/**
 * Mock for `window.matchMedia`.
 *
 * @remarks
 * JSDOM does not implement `matchMedia`. This mock is required for components
 * that use media queries or respond to theme changes.
 */
Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
    })),
});
