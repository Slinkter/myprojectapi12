import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider as MTThemeProvider } from "@material-tailwind/react";
import { ThemeProvider } from "@/features/theme/application/ThemeContext";
import { CartProvider } from "@/features/cart/application/CartContext";
import App from "./App.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter basename="/myprojectapi12/">
      <ThemeProvider>
        <MTThemeProvider>
          <CartProvider>
            <App />
          </CartProvider>
        </MTThemeProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);
