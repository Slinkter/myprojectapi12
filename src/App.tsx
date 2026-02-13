/**
 * @file App.tsx
 * @description Componente raíz que orquesta los proveedores globales y el diseño principal de la UI.
 * @architecture Capa de Aplicación - Componente Raíz
 */

import React from "react";
import { BrowserRouter } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

// Proveedores de Contexto
import { ThemeProvider } from "@/features/theme/application/ThemeContext";
import { CartProvider } from "@/features/cart/application/CartContext";

// Configuración
import { queryClient } from "@/app/config/queryClient";

// Componentes y Enrutamiento
import Layout from "@/components/common/Layout";
import Cart from "@/features/cart/presentation/Cart";
import AppRouter from "@/app/routing/AppRouter";
import ErrorBoundary from "@/components/common/ErrorBoundary";

/**
 * El componente raíz de la aplicación.
 *
 * @remarks
 * Este componente actúa como el centro de configuración para toda la aplicación.
 * Envuelve la aplicación con todos los proveedores necesarios:
 * - `QueryClientProvider`: Para la gestión del estado del servidor con TanStack Query.
 * - `BrowserRouter`: Para la navegación con React Router (con ruta base).
 * - `ThemeProvider`: Para la gestión global del tema (claro/oscuro).
 * - `CartProvider`: Para la lógica de dominio del carrito de compras.
 *
 * También configura el shell de la UI de nivel superior con un `ErrorBoundary` y el `Layout` principal.
 *
 * @returns El árbol completo de elementos de React para la aplicación.
 */
const App: React.FC = () => {
    return (
        <QueryClientProvider client={queryClient}>
            <BrowserRouter basename="/myprojectapi12/">
                <ThemeProvider>
                    <CartProvider>
                        <ErrorBoundary>
                            <Layout>
                                <AppRouter />
                                <Cart />
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
