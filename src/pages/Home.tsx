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
import clsx from 'clsx';

/**
 * Contenido principal de la Home.
 * Gestiona la carga de productos y visualización del listado o skeletons.
 *
 * @component
 */
const HomeContent = () => {
    const { products, initialLoading, loading, error, loadMore, hasMore } =
        useProducts();
    const { selectedProduct, isModalOpen, handleCloseModal } =
        useProductModalContext();

    return (
        <div className={clsx("page-home")}>
            <div className={clsx("page-home__header px-4 sm:px-0")}>
                <h1 className={clsx("page-home__title text-2xl sm:text-3xl lg:text-4xl font-bold")}>
                    Product List
                </h1>
                <p className={clsx("page-home__subtitle text-sm sm:text-base text-gray-600 dark:text-gray-400")}>
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

const Home = () => (
    <ProductModalProvider>
        <FeatureErrorBoundary featureName="Products">
            <HomeContent />
        </FeatureErrorBoundary>
    </ProductModalProvider>
);

export default Home;
