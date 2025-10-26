
import { useState } from "react";
import Layout from "@/component/Layout";
import Cart from "@/component/Cart";
import AppRouter from "./AppRouter";

const App = () => {
    const [isCartOpen, setIsCartOpen] = useState(false);

    const handleCartIconClick = () => {
        setIsCartOpen(true);
    };

    const handleCartClose = () => {
        setIsCartOpen(false);
    };

    return (
        <Layout onCartIconClick={handleCartIconClick}>
            <AppRouter />
            <Cart open={isCartOpen} onClose={handleCartClose} />
        </Layout>
    );
};

export default App;

