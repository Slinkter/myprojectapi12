import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { ThemeProvider } from "@/context/ThemeContext";
import { CartProvider } from "@/context/CartContext";
import { BrowserRouter } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <BrowserRouter basename="/myprojectapi12/">
            <ThemeProvider>
                <CartProvider>
                    <App />
                </CartProvider>
            </ThemeProvider>
        </BrowserRouter>
    </React.StrictMode>
);
