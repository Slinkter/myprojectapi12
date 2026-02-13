/**
 * @file AppRouter.tsx
 * @description Configuración de rutas de la aplicación.
 * Implementa Carga Diferida (Lazy Loading) para optimizar el rendimiento inicial.
 * @architecture Capa de Aplicación - Enrutamiento
 */
import React, { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import Loader from "@/components/common/Loader";

// Componentes cargados de forma diferida (ahora .tsx tras la migración)
const Home = lazy(() => import("@/pages/Home"));
const Checkout = lazy(
    () => import("@/features/checkout/presentation/Checkout"),
);
const CheckoutSuccess = lazy(
    () => import("@/features/checkout/presentation/CheckoutSuccess"),
);

/**
 * Componente que define la estructura de enrutamiento de la aplicación.
 * Utiliza Suspense para mostrar un indicador de carga mientras se cargan los componentes.
 */
const AppRouter: React.FC = () => {
    return (
        <Suspense fallback={<Loader />}>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/checkout-success" element={<CheckoutSuccess />} />
            </Routes>
        </Suspense>
    );
};

export default AppRouter;
