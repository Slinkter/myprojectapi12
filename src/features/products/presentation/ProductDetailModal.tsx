import { useState, useEffect } from "react";
import { useLogLifecycle } from "@/shared/hooks";
import { useCart } from "@/features/cart/application/useCart";
import { IProductDetailModalProps } from "@/features/products/application/types";
import { getStockStatus } from "@/shared/lib/stockUtils";
import { Dialog, Flex, Box, Grid, Text, Heading, Badge, IconButton } from "@radix-ui/themes";
import { Cross1Icon, BackpackIcon, PlusIcon, MinusIcon } from "@radix-ui/react-icons";
import { Button } from "@/shared/ui/Button";

const ProductDetailModal = (props: IProductDetailModalProps) => {
  useLogLifecycle("ProductDetailModal");
  const { product, isOpen, onClose } = props;
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState<number>(1);
  const [selectedImage, setSelectedImage] = useState<string>('');

  useEffect(() => {
    if (!isOpen) return;
    setQuantity(1);
    if (product?.images && product.images.length > 0) {
      setSelectedImage(product.images[0]);
    } else if (product?.thumbnail) {
      setSelectedImage(product.thumbnail);
    }
  }, [isOpen, product?.images, product?.thumbnail]);

  const increment = () => {
    setQuantity((prev) => (product && prev < product.stock ? prev + 1 : prev));
  };

  const decrement = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : prev));
  };

  const handleAddToCart = () => {
    if (product) addToCart(product, quantity);
    onClose();
  };

  if (!product) return null;
  
  const stockStatus = getStockStatus(product.stock);
  const displayImages = product.images && product.images.length > 0 ? product.images : [product.thumbnail];
  const isOutOfStock = stockStatus === 'out';

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Content size="4" style={{ maxWidth: 850, position: "relative" }}>
        {/* Close Button */}
        <Box style={{ position: "absolute", top: 12, right: 12, zIndex: 10 }}>
          <Dialog.Close>
            <IconButton variant="ghost" color="gray" size="2" style={{ cursor: "pointer" }} aria-label="Cerrar modal">
              <Cross1Icon width="18" height="18" />
            </IconButton>
          </Dialog.Close>
        </Box>

        <Grid columns={{ initial: "1", md: "2" }} gap="6">
          {/* Image Section */}
          <Flex direction="column" align="center" justify="center" p="4" style={{ backgroundColor: "var(--gray-2)", borderRadius: "var(--radius-3)" }}>
            <Box style={{ width: "100%", maxWidth: "320px", display: "flex", justifyContent: "center", alignItems: "center" }}>
              <img
                src={selectedImage}
                alt={product.title}
                style={{
                  width: "100%",
                  height: "auto",
                  maxHeight: "300px",
                  objectFit: "contain",
                  borderRadius: "var(--radius-3)",
                }}
              />
            </Box>
            
            {displayImages.length > 1 && (
              <Flex gap="2" mt="4" wrap="wrap" justify="center">
                {displayImages.map((img, index) => (
                  <IconButton
                    key={index}
                    onClick={() => setSelectedImage(img)}
                    variant="outline"
                    style={{
                      width: 56,
                      height: 56,
                      padding: 0,
                      overflow: "hidden",
                      border: selectedImage === img ? "2px solid var(--purple-9)" : "1px solid var(--gray-5)",
                      opacity: selectedImage === img ? 1 : 0.6,
                      cursor: "pointer",
                    }}
                    aria-label={`Ver imagen ${index + 1}`}
                  >
                    <img src={img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </IconButton>
                ))}
              </Flex>
            )}
          </Flex>

          {/* Content Section */}
          <Flex direction="column" gap="4">
            {/* Badges */}
            <Flex gap="2">
              {product.brand && (
                <Badge color="purple" size="2" style={{ textTransform: "uppercase" }}>
                  {product.brand}
                </Badge>
              )}
              {product.discountPercentage && (
                <Badge color="red" size="2">
                  -{Math.round(product.discountPercentage)}%
                </Badge>
              )}
            </Flex>

            {/* Title */}
            <Heading size="6" as="h2">
              {product.title}
            </Heading>

            {/* Rating */}
            <Flex align="center" gap="2">
              <Flex align="center" gap="0">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Text
                    key={i}
                    size="3"
                    style={{
                      color: i < Math.round(product.rating || 0) ? "var(--amber-9)" : "var(--gray-6)",
                    }}
                  >
                    ★
                  </Text>
                ))}
              </Flex>
              <Text size="2" color="gray">
                {product.rating?.toFixed(1)}
              </Text>
            </Flex>

            {/* Description */}
            <Text size="2" color="gray" style={{ lineHeight: "1.6" }}>
              {product.description}
            </Text>

            {/* Price */}
            <Flex align="baseline" gap="3">
              <Text size="6" weight="bold">
                ${product.price.toFixed(2)}
              </Text>
              {product.discountPercentage && (
                <Text size="3" color="gray" style={{ textDecoration: "line-through" }}>
                  ${(product.price / (1 - product.discountPercentage / 100)).toFixed(2)}
                </Text>
              )}
            </Flex>

            {/* Stock */}
            <Box>
              <Text
                size="2"
                weight="medium"
                color={
                  isOutOfStock ? "red" :
                  stockStatus === "low" ? "amber" : "green"
                }
              >
                {isOutOfStock ? 'Agotado' : 
                 stockStatus === 'low' ? `Solo quedan ${product.stock} unidades` : 
                 `${product.stock} unidades disponibles`}
              </Text>
            </Box>

            {/* Quantity & Add to Cart */}
            <Flex direction="column" gap="3" mt="auto">
              <Flex align="center" gap="3">
                <Text size="2" weight="medium">Cantidad:</Text>
                <Flex align="center" style={{ border: "1px solid var(--gray-6)", borderRadius: "var(--radius-3)" }}>
                  <IconButton
                    onClick={decrement}
                    disabled={quantity <= 1}
                    variant="ghost"
                    color="gray"
                    style={{ cursor: "pointer" }}
                    aria-label="Disminuir cantidad"
                  >
                    <MinusIcon />
                  </IconButton>
                  <Text weight="medium" style={{ minWidth: 40, textAlign: "center", paddingLeft: "var(--space-3)", paddingRight: "var(--space-3)" }}>
                    {quantity}
                  </Text>
                  <IconButton
                    onClick={increment}
                    disabled={quantity >= product.stock}
                    variant="ghost"
                    color="gray"
                    style={{ cursor: "pointer" }}
                    aria-label="Aumentar cantidad"
                  >
                    <PlusIcon />
                  </IconButton>
                </Flex>
              </Flex>

              <Button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                size="lg"
                style={{ width: "100%" }}
              >
                <BackpackIcon style={{ marginRight: 8 }} />
                {isOutOfStock ? 'Sin Stock' : 'Añadir al Carrito'}
              </Button>

              <Button
                variant="ghost"
                onClick={onClose}
                style={{ width: "100%" }}
              >
                Continuar Comprando
              </Button>
            </Flex>
          </Flex>
        </Grid>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default ProductDetailModal;
