/**
 * @file App.tsx
 * @description Componente raíz de la estructura de UI.
 * Configura el Layout principal y el Enrutador.
 * @architecture Application Layer - Root Component
 */
import Layout from "@/components/common/Layout";
import Cart from "@/features/cart/presentation/Cart";
import AppRouter from "@/app/routing/AppRouter";
import ErrorBoundary from "@/components/common/ErrorBoundary";
import clsx from 'clsx';

/**
 * Componente principal de la aplicación.
 * Envuelve el contenido en un Boundary de error y layout base.
 *
 * @component
 */
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
