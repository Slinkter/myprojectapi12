import { ProductModalProvider } from "@/features/products/application/ProductModalProvider";
import FeatureErrorBoundary from "@/components/common/FeatureErrorBoundary";
import { HomeContent } from "@/pages/HomeContent";
import { useLogLifecycle } from "@/shared/hooks";

const Home = () => {
  useLogLifecycle("Home");
  return (
    <ProductModalProvider>
      <FeatureErrorBoundary featureName="Products">
        <HomeContent />
      </FeatureErrorBoundary>
    </ProductModalProvider>
  );
};

export default Home;
