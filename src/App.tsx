/**
 * @file App.tsx
 * @description Componente raíz de la estructura de UI.
 * Configura el Layout principal y el Enrutador.
 * @architecture Application Layer - Root Component
 */
import Layout from "@/components/common/Layout";
import Cart from "@/features/cart/presentation/Cart";
import AppRouter from "@/app/routing/AppRouter";
import ErrorBoundary from "@/components/common/ErrorBoundary";

/**
 * Componente principal de la aplicación.
 * Envuelve el contenido en un Boundary de error y layout base.
 *
 * @component
 */
import React from "react";
// ... (existing imports)

const App = () => {
    return (
        <React.StrictMode>
            <ErrorBoundary>
                <Layout>
                    <Cart />
                    <AppRouter />
                </Layout>
            </ErrorBoundary>
        </React.StrictMode>
    );
};

export default App;
