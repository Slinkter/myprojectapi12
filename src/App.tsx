// src/App.tsx
import Layout from "@/components/common/Layout"; // Layout is now typed
import Cart from "@/features/cart/presentation/Cart"; // Cart is now typed
import AppRouter from "@/app/routing/AppRouter"; // Will be AppRouter.tsx after migration
import ErrorBoundary from "@/components/common/ErrorBoundary"; // ErrorBoundary is now typed

const App = () => {
    return (
        <ErrorBoundary>
            <Layout>
                <Cart />
                {/* AppRouter will be AppRouter.tsx after migration */}
                <AppRouter />
            </Layout>
        </ErrorBoundary>
    );
};

export default App;
