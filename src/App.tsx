/**
 * @file App.tsx
 * @description Root component that orchestrates global providers and main UI layout.
 * @architecture Application Layer - Root Component
 */

import React from "react";
import { BrowserRouter } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

// Context Providers
import { ThemeProvider } from "@/features/theme/application/ThemeContext";
import { CartProvider } from "@/features/cart/application/CartContext";

// Configuration
import { queryClient } from "@/app/config/queryClient";

// Components & Routing
import Layout from "@/components/common/Layout";
import Cart from "@/features/cart/presentation/Cart";
import AppRouter from "@/app/routing/AppRouter";
import ErrorBoundary from "@/components/common/ErrorBoundary";

/**
 * The root Application component.
 *
 * @remarks
 * This component acts as the configuration hub for the entire application.
 * It wraps the application with all necessary providers:
 * - `QueryClientProvider`: For TanStack Query server state management.
 * - `BrowserRouter`: For React Router navigation (with base path).
 * - `ThemeProvider`: For global theme management (dark/light).
 * - `CartProvider`: For the shopping cart domain logic.
 *
 * It also sets up the top-level UI shell with an `ErrorBoundary` and the main `Layout`.
 *
 * @returns The complete React element tree for the application.
 */
const App: React.FC = () => {
    return (
        <QueryClientProvider client={queryClient}>
            <BrowserRouter basename="/myprojectapi12/">
                <ThemeProvider>
                    <CartProvider>
                        <ErrorBoundary>
                            <Layout>
                                <Cart />
                                <AppRouter />
                            </Layout>
                        </ErrorBoundary>
                    </CartProvider>
                </ThemeProvider>
            </BrowserRouter>
            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
    );
};

export default App;
