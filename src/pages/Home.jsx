import ProductGrid from "@/features/products/presentation/ProductGrid";
import { useProducts } from "@/features/products/application/useProducts";
import SkeletonGrid from "@/features/products/presentation/SkeletonGrid";

const Home = () => {
    const { products, initialLoading, loading, error, loadMore, hasMore } =
        useProducts();

    return (
        <div className="page-home">
            <div className="page-home__header">
                <h1 className="page-home__title text-3xl font-bold">
                    Lista de Productos
                </h1>
                <p className="page-home__subtitle text-base">
                    React VITE + Tailwind CSS + DummyJSON API
                </p>
            </div>

            {initialLoading && <SkeletonGrid />}

            {error && <p className="page-home__error-message">{error}</p>}

            {!initialLoading && !error && products.length === 0 && (
                <p className="page-home__info-message">No se encontraron productos.</p>
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
                                aria-label="Cargar más productos"
                            >
                                {loading ? (
                                    <span className="page-home__load-more-spinner" />
                                ) : (
                                    "Ver más"
                                )}
                            </button>
                        )}
                        {!hasMore && <p className="page-home__info-message">Has alcanzado el final de la lista.</p>}
                    </div>
                </>
            )}
        </div>
    );
};

export default Home;
