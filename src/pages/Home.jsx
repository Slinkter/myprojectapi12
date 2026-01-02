import ProductGrid from "@/features/products/presentation/ProductGrid";
import { useProducts } from "@/features/products/application/useProducts";
import SkeletonGrid from "@/features/products/presentation/SkeletonGrid";
import { ProductModalProvider, useProductModalContext } from "@/features/products/application/ProductModalContext";
import ProductDetailModal from "@/features/products/presentation/ProductDetailModal";

const HomeContent = () => {
    const { products, initialLoading, loading, error, loadMore, hasMore } = useProducts();
    const { selectedProduct, isModalOpen, handleCloseModal } = useProductModalContext();

    return (
        <div className="page-home">
            <div className="page-home__header">
                <h1 className="page-home__title text-3xl font-bold">
                    Product List
                </h1>
                <p className="page-home__subtitle text-base">
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
                    <ProductGrid products={products} />
                    <div className="page-home__pagination">
                        {hasMore && (
                            <button
                                onClick={loadMore}
                                disabled={loading}
                                className="page-home__load-more-button"
                                aria-label="Load more products"
                            >
                                {loading ? (
                                    <span className="page-home__load-more-spinner" />
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
                <ProductDetailModal
                    product={selectedProduct}
                    open={isModalOpen}
                    onClose={handleCloseModal}
                />
            )}
        </div>
    );
};


const Home = () => {
    return (
        <ProductModalProvider>
            <HomeContent />
        </ProductModalProvider>
    );
};

export default Home;
