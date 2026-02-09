/**
 * @file AppRouter.tsx
 * @description Configuración de rutas de la aplicación.
 * Implementa Lazy Loading para optimizar el rendimiento inicial.
 * @architecture Application Layer - Routing
 */
import React, { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import Loader from "@/components/common/Loader";
import clsx from 'clsx';

// Lazy-loaded components (now .tsx after migration)
const Home = lazy(() => import("@/pages/Home"));
const Checkout = lazy(
    () => import("@/features/checkout/presentation/Checkout"),
);
const CheckoutSuccess = lazy(
    () => import("@/features/checkout/presentation/CheckoutSuccess"),
);

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
