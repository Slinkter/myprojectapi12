import LoadMoreButton from "@/features/products/presentation/components/LoadMoreButton";
import { IProduct } from "@/features/products/application/types";
import { useLogLifecycle } from "@/shared/hooks";

interface ILoadMoreSectionProps {
  products: IProduct[];
  hasMore: boolean;
  isLoading: boolean;
  loadMoreProducts: () => void;
}

const LoadMoreSection = (props: ILoadMoreSectionProps) => {
  useLogLifecycle("LoadMoreSection");
  const { products, hasMore, loadMoreProducts, isLoading } = props;
  return (
    <div className="flex flex-col items-center justify-center w-full mt-6 mb-4">
      {hasMore && <LoadMoreButton onClick={loadMoreProducts} isLoading={isLoading} />}

      {!hasMore && products.length > 0 && (
        <p className="text-center text-slate-500 dark:text-slate-400 mt-4 text-sm">
          Has llegado al final de la lista.
        </p>
      )}
    </div>
  );
};

export default LoadMoreSection;
