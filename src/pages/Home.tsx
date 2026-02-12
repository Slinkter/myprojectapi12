/**
 * @file Home.tsx
 * @description Página de inicio de la aplicación.
 * Muestra el listado de productos y gestiona el modal de detalles.
 * @architecture Presentation Layer - Pages
 */
import ProductList from "@/features/products/presentation/ProductList";
import { useProducts } from "@/features/products/application/useProducts";
import SkeletonGrid from "@/features/products/presentation/SkeletonGrid";
import {
    ProductModalProvider,
    useProductModalContext,
} from "@/features/products/application/ProductModalContext";
import ProductDetailModal from "@/features/products/presentation/ProductDetailModal";
import FeatureErrorBoundary from "@/components/common/FeatureErrorBoundary";
import { cn } from "@/lib/utils";

/**
 * @component HomeContent
 * @description Contenido principal de la Home.
 * Gestiona la carga de productos y visualización del listado o skeletons.
 *
 * @returns {JSX.Element} El layout principal de la página.
 */
const HomeContent = () => {
    const { products, initialLoading, loading, error, loadMore, hasMore } =
        useProducts();
    const { selectedProduct, isModalOpen, handleCloseModal } =
        useProductModalContext();

    return (
        <div className={cn("page-home container mx-auto px-4 py-8")}>
            <div className={cn("page-home__header flex flex-col items-center text-center mb-12")}>
                <h1 className={cn("page-home__title")}>
                    Product List
                </h1>
                <p className={cn("page-home__subtitle")}>
                    React VITE + Tailwind CSS + DummyJSON API
                </p>
            </div>

            {initialLoading && <SkeletonGrid />}

            {!initialLoading && (
                <ProductList
                    products={products}
                    loading={loading}
                    error={error}
                    hasMore={hasMore}
                    loadMore={loadMore}
                />
            )}

            {selectedProduct && (
                <ProductDetailModal
                    product={selectedProduct}
                    open={isModalOpen}
                    onClose={handleCloseModal}
                />
            )}
        </div>
    );
};

/**
 * @component Home
 * @description Wrapper de la página Home que provee el contexto del modal y el ErrorBoundary.
 * 
 * @returns {JSX.Element} La página Home completa.
 */
const Home = () => (
    <ProductModalProvider>
        <FeatureErrorBoundary featureName="Products">
            <HomeContent />
        </FeatureErrorBoundary>
    </ProductModalProvider>
);

export default Home;
