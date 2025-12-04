import { Typography, Button } from "@material-tailwind/react";
import Products from "@/features/products/components/Products";
import { useProducts } from "@/features/products/hooks/useProducts";
import SkeletonGrid from "@/features/products/components/SkeletonGrid";

const Home = () => {
    const { products, initialLoading, loading, error, loadMore, hasMore } = useProducts();

    return (
        <>
            {initialLoading && <SkeletonGrid />}
            {error && <p className="home__error-message">Error: {error}</p>}
            {!initialLoading && !error && products.length === 0 && (
                <p className="home__info-message">No se encontraron productos.</p>
            )}
            {!initialLoading && !error && products.length > 0 && (
                <div className="home">
                    <Typography variant="h1" color="blue-gray" className="home__title">
                        Lista de Productos
                    </Typography>
                    <Typography variant="lead" color="blue-gray" className="home__subtitle">
                        React VITE + Tailwind CSS + DummyJSON API
                    </Typography>
                    <Products products={products} />
                    <div className="home__load-more-container">
                        {hasMore && (
                            <Button
                                className="home__load-more-button"
                                variant="outlined"
                                onClick={loadMore}
                                disabled={loading}
                                aria-label="Cargar más productos"
                            >
                                {loading ? <div className="home__load-more-spinner"></div> : "Ver más"}
                            </Button>
                        )}
                        {!hasMore && <p className="home__info-message">Has alcanzado los 100 productos</p>}
                    </div>
                </div>
            )}
        </>
    );
};

export default Home;
