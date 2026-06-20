/**
 * @file App.tsx
 * @description Componente raíz que orquesta los proveedores globales y el diseño principal de la UI.
 * @architecture Capa de Aplicación - Componente Raíz
 *
 * @provider-order
 * 1. QueryClientProvider - Caché de datos (TanStack Query)
 * 2. ThemeProvider - Tema claro/oscuro
 * 3. CartProvider - Estado global del carrito
 * 4. BrowserRouter - Navegación SPA
 * 5. LazyMotion - Animaciones optimizadas
 * 6. ErrorBoundary - Captura errores de renderizado
 * 7. Layout - Estructura (Navbar + Outlet)
 * 8. AppRouter - Definición de rutas
 *
 * @best-practices Los providers de contexto (Theme, Cart) deben estar fuera del BrowserRouter
 * para que sus hooks estén disponibles antes de la navegación.
 */

import React from "react";
import { BrowserRouter } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { LazyMotion, domAnimation } from "framer-motion";

import { Theme as RadixTheme } from "@radix-ui/themes";
import "@radix-ui/themes/styles.css";

// Proveedores de Contexto
import { ThemeProvider, useTheme } from "@/features/theme/application/ThemeContext";
import { CartProvider } from "@/features/cart/application/CartContext";

// Configuración
import { queryClient } from "@/app/config/queryClient";

// Componentes y Enrutamiento
import Layout from "@/shared/ui/Layout";
import AppRouter from "@/app/routing/AppRouter";
import ErrorBoundary from "@/shared/ui/ErrorBoundary";

/**
 * Componente interno para acceder a useTheme y configurar Radix Themes.
 */
const AppContent: React.FC = () => {
  const { theme } = useTheme();
  return (
    <RadixTheme
      appearance={theme}
      accentColor="purple"
      grayColor="olive"
      panelBackground="solid"
      radius="full"
    >
      <BrowserRouter basename="/myprojectapi12/">
        <LazyMotion features={domAnimation}>
          <ErrorBoundary>
            <Layout>
              <AppRouter />
            </Layout>
          </ErrorBoundary>
        </LazyMotion>
      </BrowserRouter>
    </RadixTheme>
  );
};

/**
 * Componente raíz de la aplicación.
 * Orchestrates global providers y estructura principal de la UI.
 *
 * @returns Componente React con todos los providers involucrados en orden específico.
 */
const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <CartProvider>
          <AppContent />
        </CartProvider>
      </ThemeProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};

export default App;
