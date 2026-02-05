/**
 * Punto de entrada de la aplicación.
 * Configura providers (QueryClient, Router, Theme, Cart) y renderiza App.
 */
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ThemeProvider } from "@/features/theme/application/ThemeContext";
import { CartProvider } from "@/features/cart/application/CartContext.tsx";
import { queryClient } from "@/app/config/queryClient";
import App from "./App.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <QueryClientProvider client={queryClient}>
            <BrowserRouter basename="/myprojectapi12/">
                <ThemeProvider>
                    <CartProvider>
                        <App />
                    </CartProvider>
                </ThemeProvider>
            </BrowserRouter>
            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
    </React.StrictMode>,
);
