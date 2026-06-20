/**
 * @file ProductCard.tsx
 * @description Tarjeta de producto individual con diseño limpio.
 * @architecture Presentation Layer - Componente de Feature
 */

import React from 'react'
import { Card as RadixCard, Flex, Box, Text, Heading, Inset } from "@radix-ui/themes";
import { useLogLifecycle } from "@/shared/hooks";
import { useProductModalContext } from '@/features/products/application/useProductModalContext'
import { getStockStatus } from '@/shared/lib/stockUtils'
import type { IProduct } from '@/features/products/application/types'
import { Button } from '@/shared/ui/Button'
import { LazyImage } from '@/shared/ui/LazyImage';

interface IProductCardProps {
  product: IProduct
}

const ProductCard = React.memo(({ product }: IProductCardProps) => {
  useLogLifecycle("ProductCard");
  const { openProductModal } = useProductModalContext()

  if (!product || !product.id) {
    console.error('ProductCard received invalid product:', product)
    return null
  }

  const stockStatus = getStockStatus(product.stock)
  const isOutOfStock = stockStatus === 'out'

  return (
    <RadixCard size="2" asChild style={{ height: "100%" }}>
      <article
        aria-label={`Producto: ${product.title}`}
        style={{
          display: "flex",
          flexDirection: "column",
          position: "relative",
          overflow: "hidden",
          cursor: "pointer",
        }}
      >
        {product.discountPercentage && (
          <Box
            position="absolute"
            top="3"
            left="3"
            style={{
              zIndex: 10,
              backgroundColor: "var(--red-9)",
              color: "white",
              padding: "4px 8px",
              borderRadius: "9999px",
              fontSize: "var(--font-size-1)",
              fontWeight: "bold",
            }}
            aria-label={`Descuento: ${Math.round(product.discountPercentage)}%`}
          >
            -{Math.round(product.discountPercentage)}%
          </Box>
        )}

        <Inset clip="border-box" side="top" pb="current">
          <Box style={{ position: "relative", overflow: "hidden", backgroundColor: "var(--gray-3)" }}>
            <LazyImage
              src={product.thumbnail}
              alt={product.title}
              style={{
                width: "100%",
                aspectRatio: "1/1",
                objectFit: "cover",
              }}
            />
          </Box>
        </Inset>

        <Flex direction="column" gap="2" p="4" style={{ flexGrow: 1 }}>
          <Flex justify="between" align="center">
            <Text size="1" weight="medium" color="gray" style={{ textTransform: "uppercase", letterSpacing: "0.05em" }}>
              {product.category}
            </Text>
            <Text size="1" weight="medium" style={{ color: "var(--amber-9)" }}>
              ★ {product.rating?.toFixed(1)}
            </Text>
          </Flex>

          <Heading size="3" as="h3" style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {product.title}
          </Heading>

          <Text size="2" color="gray" style={{
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}>
            {product.description}
          </Text>

          <Flex mt="auto" pt="3" align="end" justify="between" gap="2">
            <Box>
              <Text size="5" weight="bold">
                ${product.price.toFixed(2)}
              </Text>
              <Text
                as="div"
                size="1"
                weight="medium"
                color={stockStatus === 'ok' ? 'green' : 'amber'}
                style={{ marginTop: "2px" }}
              >
                {isOutOfStock ? 'Agotado' : `${product.stock} disponibles`}
              </Text>
            </Box>

            <Button
              onClick={() => {
                openProductModal(product)
              }}
              disabled={isOutOfStock}
              size="sm"
              style={{ borderRadius: "var(--radius-3)" }}
            >
              {isOutOfStock ? 'Sin stock' : 'Ver más'}
            </Button>
          </Flex>
        </Flex>
      </article>
    </RadixCard>
  )
})

ProductCard.displayName = 'ProductCard'

export default ProductCard

