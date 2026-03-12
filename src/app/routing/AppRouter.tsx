import React, { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import Loader from "@/components/common/Loader";
import { CartDrawer } from "@/widgets/CartDrawer";

const Home = lazy(() => import("@/pages/Home"));
// Direct import instead of lazy to debug
import Checkout from "@/features/checkout/presentation/Checkout";
const CheckoutSuccess = lazy(() => import("@/features/checkout/presentation/CheckoutSuccess"));

const AppRouter: React.FC = () => {
  return (
    <Suspense fallback={<Loader />}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/checkout-success" element={<CheckoutSuccess />} />
        <Route path="*" element={<Home />} />
      </Routes>
      <CartDrawer />
    </Suspense>
  );
};

export default AppRouter;
