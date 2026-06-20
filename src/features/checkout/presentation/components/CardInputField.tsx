import { ReactNode } from "react";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { Box, Text, TextField, Flex } from "@radix-ui/themes";
import { useLogLifecycle } from "@/shared/hooks";

interface CardInputFieldProps {
  label: string;
  name: string;
  value: string;
  error?: string;
  icon: ReactNode;
  rightSlot?: ReactNode;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
}

const CardInputField = ({
  label,
  name,
  value,
  error,
  icon,
  rightSlot,
  inputProps,
}: CardInputFieldProps) => {
  useLogLifecycle("CardInputField");
  const inputId = `card-${name}`;
  const errorId = `${inputId}-error`;

  return (
    <Box>
      <Text
        as="label"
        htmlFor={inputId}
        size="1"
        weight="bold"
        color="gray"
        style={{ display: "block", marginBottom: "var(--space-1)", textTransform: "uppercase", letterSpacing: "0.1em" }}
      >
        {label}
      </Text>
      
      <TextField.Root
        id={inputId}
        name={name}
        value={value}
        color={error ? "red" : undefined}
        aria-invalid={!!error}
        aria-describedby={error ? errorId : undefined}
        {...(inputProps as any)}
        size="3"
      >
        <TextField.Slot>
          {icon}
        </TextField.Slot>
        {rightSlot && (
          <TextField.Slot side="right">
            {rightSlot}
          </TextField.Slot>
        )}
      </TextField.Root>

      {error && (
        <Flex id={errorId} gap="1" align="center" mt="1" style={{ color: "var(--red-9)" }}>
          <ExclamationTriangleIcon width="14" height="14" />
          <Text size="1" weight="bold">
            {error}
          </Text>
        </Flex>
      )}
    </Box>
  );
};

export default CardInputField;

