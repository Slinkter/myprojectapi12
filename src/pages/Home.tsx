import { ProductModalProvider } from "@/features/products/application/ProductModalProvider";
import FeatureErrorBoundary from "@/components/common/FeatureErrorBoundary";
import { HomeContent } from "@/pages/HomeContent";

const Home = () => (
  <ProductModalProvider>
    <FeatureErrorBoundary featureName="Products">
      <HomeContent />
    </FeatureErrorBoundary>
  </ProductModalProvider>
);

export default Home;
