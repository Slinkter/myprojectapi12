import { Flex, Text } from "@radix-ui/themes";
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
    <Flex direction="column" align="center" justify="center" width="100%" mt="6" mb="4">
      {hasMore && <LoadMoreButton onClick={loadMoreProducts} isLoading={isLoading} />}

      {!hasMore && products.length > 0 && (
        <Text align="center" color="gray" mt="4" size="2">
          Has llegado al final de la lista.
        </Text>
      )}
    </Flex>
  );
};

export default LoadMoreSection;
