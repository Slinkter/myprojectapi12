/**
 * @file App.tsx
 * @description Componente raíz que orquesta los proveedores globales y el diseño principal de la UI.
 * @architecture Capa de Aplicación - Componente Raíz
 */

import React from "react";
import { BrowserRouter } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { LazyMotion, domAnimation } from "framer-motion";

// Proveedores de Contexto
import { ThemeProvider } from "@/features/theme/application/ThemeContext";
import { CartProvider } from "@/features/cart/application/CartContext";

// Configuración
import { queryClient } from "@/app/config/queryClient";

// Componentes y Enrutamiento
import Layout from "@/components/common/Layout";
import AppRouter from "@/app/routing/AppRouter";
import ErrorBoundary from "@/components/common/ErrorBoundary";

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter basename="/myprojectapi12/">
        <LazyMotion features={domAnimation}>
          <ThemeProvider>
            <CartProvider>
              <ErrorBoundary>
                <Layout>
                  <AppRouter />
                </Layout>
              </ErrorBoundary>
            </CartProvider>
          </ThemeProvider>
        </LazyMotion>
      </BrowserRouter>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};

export default App;
