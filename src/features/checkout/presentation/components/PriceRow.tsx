import { Flex, Text } from "@radix-ui/themes";
import { useLogLifecycle } from "@/shared/hooks";

interface PriceRowProps {
  label: React.ReactNode
  value: React.ReactNode
  variant?: 'default' | 'success' | 'highlight'
}

export function PriceRow({ label, value, variant = 'default' }: PriceRowProps) {
  useLogLifecycle("PriceRow");

  const isSuccess = variant === 'success';
  const isHighlight = variant === 'highlight';

  return (
    <Flex
      justify="between"
      pt={isHighlight ? "2" : undefined}
      style={{
        fontSize: isHighlight ? "var(--font-size-4)" : "var(--font-size-2)",
        fontWeight: isHighlight ? "bold" : undefined,
        borderTop: isHighlight ? "1px solid var(--gray-5)" : undefined,
        color: isSuccess ? "var(--green-9)" : undefined,
      }}
    >
      <Text color={isSuccess ? "green" : "gray"}>
        {label}
      </Text>
      <Text weight={isHighlight ? "bold" : "medium"} color={isSuccess ? "green" : undefined}>
        {value}
      </Text>
    </Flex>
  );
}
