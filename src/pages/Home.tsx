import { ProductModalProvider } from "@/features/products/application/ProductModalContext";
import FeatureErrorBoundary from "@/components/common/FeatureErrorBoundary";
import { HomeContent } from "./HomeContent";

const Home = () => (
  <ProductModalProvider>
    <FeatureErrorBoundary featureName="Products">
      <HomeContent />
    </FeatureErrorBoundary>
  </ProductModalProvider>
);

export default Home;
