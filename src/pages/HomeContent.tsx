import { useProducts } from "@/features/products/application/useProducts";
import { useProductModalContext } from "@/features/products/application/ProductModalContext";
/*  */
import SkeletonGrid from "@/features/products/presentation/SkeletonGrid";
import ProductList from "@/features/products/presentation/ProductList";
import ProductDetailModal from "@/features/products/presentation/ProductDetailModal";
import Homehead from "./Homehead";

export const HomeContent = () => {
  const { products, initialLoading, loading, error, loadMore, hasMore } =
    useProducts();
  const { selectedProduct, isModalOpen, handleCloseModal } =
    useProductModalContext();

  return (
    <div className="container mx-auto px-4 py-8">
      <Homehead />

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
