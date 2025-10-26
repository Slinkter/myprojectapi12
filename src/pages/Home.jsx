import { Typography, Button } from "@material-tailwind/react";
import Products from "@/component/Products";
import { useProducts } from "@/hooks/useProducts";
import SkeletonGrid from "@/component/SkeletonGrid";

const Home = () => {
    const { products, initialLoading, loading, error, loadMore, hasMore } = useProducts();

    return (
        <>
            {initialLoading && <SkeletonGrid />}
            {error && <p className="text-center text-red-500">Error: {error}</p>}
            {!initialLoading && !error && products.length === 0 && (
                <p className="text-center text-gray-500">No se encontraron productos.</p>
            )}
            {!initialLoading && !error && products.length > 0 && (
                <div className="text-center">
                    <Typography variant="h1" color="blue-gray" className="text-4xl font-bold text-custom-dark-gray dark:text-dark-text mb-2">
                        Lista de Productos
                    </Typography>
                    <Typography variant="lead" color="blue-gray" className="text-lg text-gray-600 dark:text-gray-400 mb-8">
                        React VITE + Tailwind CSS + DummyJSON API
                    </Typography>
                    <Products products={products} />
                    <div className="mt-8">
                        {hasMore && (
                            <Button
                                className="w-full md:w-96 mx-auto flex items-center justify-center py-3 px-6 border border-custom-blue text-custom-blue hover:bg-custom-blue hover:text-white transition-colors duration-300 rounded-lg shadow-md"
                                variant="outlined"
                                onClick={loadMore}
                                disabled={loading}
                                aria-label="Cargar más productos"
                            >
                                {loading ? <div className="h-5 w-5 animate-spin rounded-full border-b-2 border-custom-blue"></div> : "Ver más"}
                            </Button>
                        )}
                        {!hasMore && <p className="text-gray-500">Has alcanzado los 100 productos</p>}
                    </div>
                </div>
            )}
        </>
    );
};

export default Home;
