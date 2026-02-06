// src/pages/Home.tsx
import ProductGrid from "@/features/products/presentation/ProductGrid";
import { useProducts } from "@/features/products/application/useProducts";
import SkeletonGrid from "@/features/products/presentation/SkeletonGrid";
import { ProductModalProvider, useProductModalContext } from "@/features/products/application/ProductModalContext";
import ProductDetailModal from "@/features/products/presentation/ProductDetailModal";
import { Product } from "@/features/products/application/types"; // Importamos la interfaz Product

const HomeContent = () => {
    // useProducts hook is already typed, so these are correctly inferred
    const { products, initialLoading, loading, error, loadMore, hasMore } = useProducts();
    // useProductModalContext hook is already typed, so these are correctly inferred
    const { selectedProduct, isModalOpen, handleCloseModal } = useProductModalContext();

    return (
        <div className="page-home">
            <div className="page-home__header px-4 sm:px-0">
                <h1 className="page-home__title text-2xl sm:text-3xl lg:text-4xl font-bold">
                    Product List
                </h1>
                <p className="page-home__subtitle text-sm sm:text-base text-gray-600 dark:text-gray-400">
                    React VITE + Tailwind CSS + DummyJSON API
                </p>
            </div>

            {initialLoading && <SkeletonGrid />}

            {error && <p className="page-home__error-message">{error}</p>}

            {!initialLoading && !error && products.length === 0 && (
                <p className="page-home__info-message">No products found.</p>
            )}

            {!initialLoading && products.length > 0 && (
                <>
                    {/* ProductGrid will need to be migrated to accept typed products */}
                    <ProductGrid products={products as any} /> {/* Temporarily cast to any */}
                    <div className="page-home__pagination">
                        {hasMore && (
                            <button
                                onClick={() => loadMore()} // Ensure loadMore is called as a function
                                disabled={loading}
                                className="page-home__load-more-button flex items-center justify-center gap-2"
                                aria-label="Load more products"
                            >
                                {loading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                        <span>Loading...</span>
                                    </>
                                ) : (
                                    "Load More"
                                )}
                            </button>
                        )}
                        {!hasMore && <p className="page-home__info-message">You have reached the end of the list.</p>}
                    </div>
                </>
            )}
            {selectedProduct && (
                // ProductDetailModal will need to be migrated to accept typed product
                <ProductDetailModal
                    product={selectedProduct as any} // Temporarily cast to any
                    open={isModalOpen}
                    onClose={handleCloseModal}
                />
            )}
        </div>
    );
};

const Home = () => {
    return (
        // ProductModalProvider is already typed
        <ProductModalProvider>
            <HomeContent />
        </ProductModalProvider>
    );
};

export default Home;