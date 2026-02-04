/**
 * @file App
 * @architecture Root component - wraps entire app with ErrorBoundary, Layout, and Router
 * @side-effects None - pure composition
 * @perf No optimization needed - renders once
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
