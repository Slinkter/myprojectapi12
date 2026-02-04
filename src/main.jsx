/**
 * @file main.jsx
 * @description Entry point of the React application.
 *   It sets up essential providers like QueryClientProvider, BrowserRouter, ThemeProvider, and CartProvider,
 *   and renders the root `App` component within `React.StrictMode` for development checks.
 * @architecture Responsible for initializing the global context and routing necessary for the application to function.
 * @sideeffects Performs DOM manipulation via `ReactDOM.createRoot().render()`, and initializes the React Query client cache.
 * @perf Enables `React.StrictMode` to help identify potential problems in the application during development.
 * @returns {void} This file does not export anything; it renders the React application directly to the DOM.
 */
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ThemeProvider } from "@/features/theme/application/ThemeContext";
import { CartProvider } from "@/features/cart/application/CartContext";
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
  </React.StrictMode>
);
