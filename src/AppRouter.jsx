import { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Spinner } from "@material-tailwind/react";

const Home = lazy(() => import('@/pages/Home'));
const Checkout = lazy(() => import('@/features/checkout/pages/Checkout'));
const CheckoutSuccess = lazy(() => import('@/features/checkout/pages/CheckoutSuccess'));

const AppRouter = () => {
    return (
        <Suspense fallback={<div className="flex justify-center items-center h-screen"><Spinner className="h-12 w-12" /></div>}>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/checkout-success" element={<CheckoutSuccess />} />
            </Routes>
        </Suspense>
    );
};

export default AppRouter;
