import React from "react";
import { BrowserRouter } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { LazyMotion, domAnimation } from "framer-motion";

import { ThemeProvider } from "@/features/theme/application/ThemeContext";
import { CartProvider } from "@/features/cart/application/CartContext";
import { queryClient } from "@/app/config/queryClient";
import Layout from "@/shared/ui/Layout";
import AppRouter from "@/app/routing/AppRouter";
import ErrorBoundary from "@/shared/ui/ErrorBoundary";

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <CartProvider>
          <BrowserRouter basename="/myprojectapi12/">
            <LazyMotion features={domAnimation}>
              <ErrorBoundary>
                <Layout>
                  <AppRouter />
                </Layout>
              </ErrorBoundary>
            </LazyMotion>
          </BrowserRouter>
        </CartProvider>
      </ThemeProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};

export default App;
