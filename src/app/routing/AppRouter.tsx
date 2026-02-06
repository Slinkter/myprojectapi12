// src/app/routing/AppRouter.tsx
import React, { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import Loader from "@/components/common/Loader"; // Loader is now typed

// Lazy-loaded components (now .tsx after migration)
const Home = lazy(() => import("@/pages/Home"));
const Checkout = lazy(() =>
  import("@/features/checkout/presentation/Checkout"),
);
const CheckoutSuccess = lazy(() =>
  import("@/features/checkout/presentation/CheckoutSuccess"),
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