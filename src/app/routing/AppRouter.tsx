import React, { Suspense, lazy } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, m } from "framer-motion";
import Loader from "@/shared/ui/Loader";
import Cart from "@/features/cart/presentation/Cart";
import { useLogLifecycle } from "@/shared/hooks";
import { pageFadeIn } from "@/shared/lib/animations";

const Home = lazy(() => import("@/pages/Home"));

const Checkout = lazy(
    () => import("@/features/checkout/presentation/Checkout"),
);

const CheckoutSuccess = lazy(
    () => import("@/features/checkout/presentation/CheckoutSuccess"),
);

const Orders = lazy(() => import("@/pages/Orders"));
const FAQ = lazy(() => import("@/pages/FAQ"));
const AdminDashboard = lazy(() => import("@/pages/AdminDashboard"));

const AnimatedPage = ({ children }: { children: React.ReactNode }) => (
    <m.div variants={pageFadeIn} initial="hidden" animate="visible" exit="exit">
        {children}
    </m.div>
);

const AppRouter: React.FC = () => {
    useLogLifecycle("AppRouter");
    const location = useLocation();
    return (
        <Suspense fallback={<Loader />}>
            <AnimatePresence mode="wait">
                <Routes location={location} key={location.pathname}>
                    <Route
                        path="/"
                        element={
                            <AnimatedPage>
                                <Home />
                            </AnimatedPage>
                        }
                    />
                    <Route
                        path="/checkout"
                        element={
                            <AnimatedPage>
                                <Checkout />
                            </AnimatedPage>
                        }
                    />
                    <Route
                        path="/checkout-success"
                        element={
                            <AnimatedPage>
                                <CheckoutSuccess />
                            </AnimatedPage>
                        }
                    />
                    <Route
                        path="/orders"
                        element={
                            <AnimatedPage>
                                <Orders />
                            </AnimatedPage>
                        }
                    />
                    <Route
                        path="/faq"
                        element={
                            <AnimatedPage>
                                <FAQ />
                            </AnimatedPage>
                        }
                    />
                    <Route
                        path="/admin"
                        element={
                            <AnimatedPage>
                                <AdminDashboard />
                            </AnimatedPage>
                        }
                    />
                    <Route
                        path="*"
                        element={
                            <AnimatedPage>
                                <Home />
                            </AnimatedPage>
                        }
                    />
                </Routes>
            </AnimatePresence>
            <Cart />
        </Suspense>
    );
};

export default AppRouter;
