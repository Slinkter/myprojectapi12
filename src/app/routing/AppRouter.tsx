import React, { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import Loader from "@/shared/ui/Loader";
import Cart from "@/features/cart/presentation/Cart";
import { useLogLifecycle } from "@/shared/hooks";

const Home = lazy(() => import("@/pages/Home"));

const Checkout = lazy(
  () => import("@/features/checkout/presentation/Checkout"),
);

const CheckoutSuccess = lazy(
  () => import("@/features/checkout/presentation/CheckoutSuccess"),
);

const AppRouter: React.FC = () => {
  useLogLifecycle("AppRouter");
  return (
    <Suspense fallback={<Loader />}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/checkout-success" element={<CheckoutSuccess />} />
        <Route path="*" element={<Home />} />
      </Routes>
      <Cart />
    </Suspense>
  );
};

export default AppRouter;
