import { Flex, Box, Text, IconButton } from "@radix-ui/themes";
import { TrashIcon } from "@radix-ui/react-icons";
import type { ICartItem } from "@/features/cart/domain/cartTypes";
import { useLogLifecycle } from "@/shared/hooks";

interface CartItemRowProps {
  item: ICartItem;
  onRemove: (id: number) => void;
}

export const CartItemRow = ({ item, onRemove }: CartItemRowProps) => {
  useLogLifecycle("CartItemRow");
  return (
    <Flex
      align="start"
      gap="3"
      p="3"
      style={{
        border: "1px solid var(--gray-5)",
        borderRadius: "var(--radius-3)",
      }}
    >
      <img
        src={item.thumbnail}
        alt={item.title}
        style={{
          width: 56,
          height: 56,
          objectFit: "cover",
          borderRadius: "var(--radius-2)",
          backgroundColor: "var(--gray-3)",
          flexShrink: 0,
        }}
      />
      <Box style={{ flexGrow: 1, minWidth: 0 }}>
        <Text size="2" weight="medium" as="p" style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {item.title}
        </Text>
        <Text size="1" color="gray" mt="1" as="p">
          ${item.price.toFixed(2)} x {item.quantity}
        </Text>
      </Box>
      <Flex direction="column" align="end" gap="1">
        <Text size="2" weight="bold">
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
          <TrashIcon width="16" height="16" />
        </IconButton>
      </Flex>
    </Flex>
  );
};
