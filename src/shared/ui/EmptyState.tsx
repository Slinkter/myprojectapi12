import { Flex, Heading, Text } from "@radix-ui/themes";
import { useLogLifecycle } from "@/shared/hooks";
import { Button } from "@/shared/ui/Button";

interface IEmptyStateProps {
  icon?: React.ReactNode
  title: string
  description?: string
  actionLabel?: string
  onAction?: () => void
  style?: React.CSSProperties
}

export function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  style
}: IEmptyStateProps) {
  useLogLifecycle("EmptyState");
  return (
    <Flex
      direction="column"
      align="center"
      justify="center"
      py="8"
      px="4"
      style={{ textAlign: "center", minHeight: "400px", ...style }}
    >
      {icon && (
        <Flex
          align="center"
          justify="center"
          style={{
            width: "80px",
            height: "80px",
            borderRadius: "9999px",
            backgroundColor: "var(--gray-3)",
            color: "var(--gray-11)",
            marginBottom: "var(--space-4)",
          }}
        >
          {icon}
        </Flex>
      )}
      
      <Heading size="4" weight="bold" style={{ marginBottom: "var(--space-2)" }}>
        {title}
      </Heading>
      
      {description && (
        <Text size="2" color="gray" style={{ maxWidth: "320px", marginBottom: "var(--space-4)" }}>
          {description}
        </Text>
      )}
      
      {actionLabel && onAction && (
        <Button onClick={onAction} variant="outline">
          {actionLabel}
        </Button>
      )}
    </Flex>
  )
}

export default EmptyState

