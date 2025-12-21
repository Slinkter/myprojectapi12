import { Typography, Button } from "@material-tailwind/react";
import ProductGrid from "@/features/products/presentation/ProductGrid";
import { useProducts } from "@/features/products/application/useProducts";
import SkeletonGrid from "@/features/products/presentation/SkeletonGrid";

const Home = () => {
    const { products, initialLoading, loading, error, loadMore, hasMore } =
        useProducts();

    return (
        <>
            <div className="home__header">
                <Typography
                    variant="h1"
                    color="blue-gray"
                    className="home__title"
                >
                    Lista de Productos
                </Typography>
                <Typography
                    variant="lead"
                    color="blue-gray"
                    className="home__subtitle"
                >
                    React VITE + Tailwind CSS + DummyJSON API
                </Typography>
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
                            <Button
                                variant="outlined"
                                onClick={loadMore}
                                disabled={loading}
                                aria-label="Cargar más productos"
                            >
                                {loading ? "Cargando..." : "Ver más"}
                            </Button>
                        )}
                        {!hasMore && <p>Has alcanzado el final de la lista.</p>}
                    </div>
                </div>
            )}
        </>
    );
};

export default Home;
