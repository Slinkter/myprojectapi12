import type { ICartItem } from '@/features/cart/domain/cartTypes';
import { TrashIcon } from '@radix-ui/react-icons'
import { Flex, Box, Text, IconButton } from '@radix-ui/themes';
import { useLogLifecycle } from "@/shared/hooks";

interface OrderItemRowProps {
  item: ICartItem
  onRemove: (id: number) => void
}

export function OrderItemRow({ item, onRemove }: OrderItemRowProps) {
  useLogLifecycle("OrderItemRow");
  return (
    <Flex
      align="center"
      gap="2"
      p="2"
      style={{
        border: "1px solid var(--gray-5)",
        borderRadius: "var(--radius-3)",
      }}
    >
      <Box
        style={{
          width: 40,
          height: 40,
          borderRadius: "var(--radius-2)",
          overflow: "hidden",
          flexShrink: 0,
          backgroundColor: "var(--gray-3)",
        }}
      >
        <img
          src={item.thumbnail}
          alt={item.title}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </Box>
      <Box style={{ flexGrow: 1, minWidth: 0 }}>
        <Text size="1" weight="medium" as="p" style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {item.title}
        </Text>
        <Text size="1" color="gray" as="p">
          ${item.price.toFixed(2)} x {item.quantity}
        </Text>
      </Box>
      <Text size="1" weight="bold" style={{ minWidth: 50, textAlign: "right" }}>
        ${(item.price * item.quantity).toFixed(2)}
      </Text>
      <IconButton
        size="1"
        variant="ghost"
        color="red"
        onClick={() => onRemove(item.id)}
        style={{ cursor: "pointer" }}
        aria-label={`Eliminar ${item.title}`}
      >
        <TrashIcon width="14" height="14" />
      </IconButton>
    </Flex>
  )
}
