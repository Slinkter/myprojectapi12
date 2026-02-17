import { useProducts } from "@/features/products/application/useProducts";
import { useProductModalContext } from "@/features/products/application/ProductModalContext";
/*  */
import SkeletonGrid from "@/features/products/presentation/SkeletonGrid";
import ProductList from "@/features/products/presentation/ProductList";
import ProductDetailModal from "@/features/products/presentation/ProductDetailModal";

export const HomeContent = () => {
  const { products, initialLoading, loading, error, loadMore, hasMore } =
    useProducts();
  const { selectedProduct, isModalOpen, handleCloseModal } =
    useProductModalContext();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col items-center text-center mb-12">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground mb-4 animate-fade-in-up">
          Listado de Productos
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground font-light max-w-2xl mx-auto italic animate-fade-in [animation-delay:200ms]">
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
