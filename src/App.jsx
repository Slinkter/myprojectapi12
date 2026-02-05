/**
 * Componente raíz de la aplicación.
 * Configura ErrorBoundary, Layout, Cart y enrutamiento.
 */
import Layout from "@/components/common/Layout";
import Cart from "@/features/cart/presentation/Cart";
import AppRouter from "@/app/routing/AppRouter";
import ErrorBoundary from "@/components/common/ErrorBoundary";

const App = () => {
    return (
        <ErrorBoundary>
            <Layout>
                <Cart />
                <AppRouter />
            </Layout>
        </ErrorBoundary>
    );
};

export default App;
