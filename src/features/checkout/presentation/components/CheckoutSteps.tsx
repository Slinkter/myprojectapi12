import { CheckIcon } from '@radix-ui/react-icons'
import { Flex, Box, Text } from '@radix-ui/themes'
import { useLogLifecycle } from "@/shared/hooks";

interface ICheckoutStepsProps {
  steps: string[]
  currentStep: number
  style?: React.CSSProperties
}

export function CheckoutSteps({ steps, currentStep, style }: ICheckoutStepsProps) {
  useLogLifecycle("CheckoutSteps");
  return (
    <Flex align="center" justify="center" gap="2" mb="4" style={style}>
      {steps.map((step, index) => {
        const isCompleted = index < currentStep
        const isCurrent = index === currentStep

        return (
          <Flex key={index} align="center">
            <Flex
              align="center"
              justify="center"
              style={{
                width: 32,
                height: 32,
                borderRadius: "9999px",
                fontWeight: "bold",
                fontSize: "var(--font-size-2)",
                transition: "all 0.3s",
                backgroundColor: isCompleted ? "var(--green-9)" : isCurrent ? "var(--purple-9)" : "var(--gray-3)",
                color: isCompleted || isCurrent ? "white" : "var(--gray-8)",
                boxShadow: isCurrent ? "0 0 0 4px var(--purple-3)" : undefined,
              }}
            >
              {isCompleted ? (
                <CheckIcon width="18" height="18" />
              ) : (
                index + 1
              )}
            </Flex>
            <Box display={{ initial: "none", sm: "inline" }} asChild>
              <Text
                size="2"
                weight="medium"
                style={{
                  marginLeft: "var(--space-2)",
                  color: isCompleted ? "var(--green-9)" : isCurrent ? "var(--purple-9)" : "var(--gray-8)",
                }}
              >
                {step}
              </Text>
            </Box>
            {index < steps.length - 1 && (
              <Box
                style={{
                  width: 48,
                  height: 2,
                  margin: "0 var(--space-2)",
                  backgroundColor: isCompleted ? "var(--green-9)" : "var(--gray-5)",
                }}
              />
            )}
          </Flex>
        )
      })}
    </Flex>
  )
}
