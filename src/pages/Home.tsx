/**
 * @file Home.tsx
 * @description Página principal que envuelve el contenido con el proveedor de modal de productos
 * y el boundary de errores para la feature de productos.
 */
import { ProductModalProvider } from "@/features/products/application/ProductModalProvider";
import FeatureErrorBoundary from "@/shared/ui/FeatureErrorBoundary";
import { HomeContent } from "@/pages/HomeContent";
import { useLogLifecycle } from "@/shared/hooks";

/**
 * Componente de la página principal.
 * Renderiza el contenido principal con el proveedor de modal de productos
 * y el boundary de errores para la feature de productos.
 *
 * @returns Elemento JSX de la página principal.
 */
const Home = () => {
    useLogLifecycle("Home");
    return (
        <ProductModalProvider>
            <FeatureErrorBoundary featureName="Products">
                <HomeContent />
            </FeatureErrorBoundary>
        </ProductModalProvider>
    );
};

export default Home;
