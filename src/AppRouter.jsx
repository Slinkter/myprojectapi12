import { Routes, Route } from 'react-router-dom';
import Home from '@/pages/Home';
import Checkout from '@/pages/Checkout';
import CheckoutSuccess from '@/pages/CheckoutSuccess';

const AppRouter = () => {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/checkout-success" element={<CheckoutSuccess />} />
        </Routes>
    );
};

export default AppRouter;
