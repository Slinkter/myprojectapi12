/**
 * @file main.tsx
 * @description Punto de entrada principal de la aplicación.
 * Inicializa el árbol de React y monta el componente raíz en el DOM.
 * @architecture Capa de Aplicación - Punto de Entrada
 */
import React from "react";
import ReactDOM from "react-dom/client";

// Componente Raíz
import App from "./App";

// Estilos Globales
import "./index.css";
import "@/styles/variables.css";
import "@/styles/animations.css";
import "@/styles/buttons.css";
import "@/styles/cards.css";
import "@/styles/components.css";

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("No se pudo encontrar el elemento raíz");

ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
);
