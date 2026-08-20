/**
 * @file main.tsx
 * @description Punto de entrada de la aplicación. Renderiza el componente App
 * en el elemento raíz del DOM con React.StrictMode.
 */
import React from "react";
import ReactDOM from "react-dom/client";
import App from "@/App";
import "./index.css";
import "@/shared/lib/firebase";

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("No se pudo encontrar el elemento raíz");

ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
);
