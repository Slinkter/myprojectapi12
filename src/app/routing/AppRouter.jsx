/**
 * @file AppRouter.jsx
 * @component
 * @description Manages the application's routing using `react-router-dom`.
 *   It employs lazy loading for pages (`Home`, `Checkout`, `CheckoutSuccess`) to enable code splitting,
 *   improving initial load performance.
 * @architecture Acts as the central routing layer, defining paths and rendering corresponding page components
 *   wrapped in `Suspense` for a smooth loading experience.
 * @sideeffects Dynamic imports within `lazy` calls trigger network requests for JavaScript chunks as pages are accessed.
 * @perf Utilizes lazy loading to reduce the initial bundle size and `Suspense` to prevent UI waterfalls
 *   by providing a fallback `Loader` component.
 * @returns {JSX.Element} A React component that renders the appropriate page based on the current URL.
 */
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
