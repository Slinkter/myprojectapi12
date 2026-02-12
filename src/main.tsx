/**
 * @file main.tsx
 * @description Application entry point.
 * @architecture Infrastructure Layer - Entry Point
 */

import React from "react";
import ReactDOM from "react-dom/client";

// Root Component
import App from "./App";

// Global Styles
import "./index.css";
import "@/styles/variables.css";
import "@/styles/animations.css";
import "@/styles/buttons.css";
import "@/styles/cards.css";
import "@/styles/components.css";

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Failed to find the root element");

/**
 * Mounts the React application to the DOM.
 *
 * @remarks
 * The application is wrapped in `React.StrictMode` to help identify potential
 * problems during development. The `<App />` component handles all providers
 * and internal routing.
 */
ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
);
