/**
 * @file App.jsx
 * @component
 * @description Root component of the application.
 *   It sets up the main layout, error boundaries, cart display, and application routing.
 * @architecture Wraps the entire application with ErrorBoundary, Layout, and AppRouter for core structure.
 * @returns {JSX.Element} The main application layout with integrated features.
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
