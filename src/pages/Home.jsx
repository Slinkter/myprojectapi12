import ProductGrid from "@/features/products/presentation/ProductGrid";
import { useProducts } from "@/features/products/application/useProducts";
import SkeletonGrid from "@/features/products/presentation/SkeletonGrid";

const Home = () => {
    const { products, initialLoading, loading, error, loadMore, hasMore } =
        useProducts();

    return (
        <>
            <div className="home__header">
                <h1 className="home__title text-3xl font-bold">
                    Lista de Productos
                </h1>
                <p className="home__subtitle text-base">
                    React VITE + Tailwind CSS + DummyJSON API
                </p>
            </div>

            {initialLoading && <SkeletonGrid />}

            {error && <p className="home__error">{error}</p>}

            {!initialLoading && !error && products.length === 0 && (
                <p className="home__empty">No se encontraron productos.</p>
            )}

            {!initialLoading && products.length > 0 && (
                <div className="home">
                    <ProductGrid products={products} />
                    <div className="home__pagination">
                        {hasMore && (
                            <button
                                onClick={loadMore}
                                disabled={loading}
                                className="neumo-button px-8 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                                aria-label="Cargar más productos"
                            >
                                {loading ? "Cargando..." : "Ver más"}
                            </button>
                        )}
                        {!hasMore && <p>Has alcanzado el final de la lista.</p>}
                    </div>
                </div>
            )}
        </>
    );
};

export default Home;
