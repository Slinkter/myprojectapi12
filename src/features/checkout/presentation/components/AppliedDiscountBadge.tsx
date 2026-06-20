import { CheckIcon, Cross1Icon } from '@radix-ui/react-icons'
import { Card, Flex, Text, IconButton } from '@radix-ui/themes'
import { useLogLifecycle } from "@/shared/hooks";

interface IDiscountCode {
  code: string
  discount: number
  type: 'percentage' | 'fixed'
}

interface AppliedDiscountBadgeProps {
  discount: IDiscountCode
  onRemove: () => void
}

export function AppliedDiscountBadge({ discount, onRemove }: AppliedDiscountBadgeProps) {
  useLogLifecycle("AppliedDiscountBadge");
  return (
    <Card
      size="1"
      style={{
        backgroundColor: "var(--green-2)",
        borderColor: "var(--green-6)",
        marginBottom: "var(--space-3)",
      }}
    >
      <Flex align="center" justify="between">
        <Flex align="center" gap="2" style={{ color: "var(--green-9)" }}>
          <CheckIcon width="16" height="16" />
          <Text size="2" weight="medium">
            {discount.code} (-{discount.type === 'percentage' ? `${discount.discount}%` : `$${discount.discount}`})
          </Text>
        </Flex>
        <IconButton
          size="1"
          variant="ghost"
          color="green"
          onClick={onRemove}
          style={{ cursor: "pointer" }}
          aria-label="Eliminar descuento"
        >
          <Cross1Icon width="14" height="14" />
        </IconButton>
      </Flex>
    </Card>
  )
}
