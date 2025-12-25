import { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";

const Home = lazy(() => import("@/pages/Home"));
const Checkout = lazy(() =>
    import("@/features/checkout/presentation/Checkout")
);
const CheckoutSuccess = lazy(() =>
    import("@/features/checkout/presentation/CheckoutSuccess")
);

import Loader from "@/components/common/Loader";

const AppRouter = () => {
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
