import Layout from "@/components/common/Layout";
import Cart from "@/features/cart/presentation/Cart";
import AppRouter from "./AppRouter";

const App = () => {
    return (
        <Layout>
            <Cart />
            <AppRouter />
        </Layout>
    );
};

export default App;
