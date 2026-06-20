import { Flex, Box, Text, TextField } from "@radix-ui/themes";
import { BookmarkIcon } from "@radix-ui/react-icons";
import { Button } from '@/shared/ui/Button';

interface DiscountInputProps {
  code: string
  isApplying: boolean
  error: string
  onApply: () => void
  onChange: (code: string) => void
}

export function DiscountInput({
  code,
  isApplying,
  error,
  onApply,
  onChange,
}: DiscountInputProps) {
  return (
    <Box mb="4">
      <Text as="label" htmlFor="discount-code" size="1" color="gray" weight="medium" style={{ display: "block", marginBottom: "var(--space-2)" }}>
        Código de descuento
      </Text>
      <Flex gap="2">
        <Box style={{ flexGrow: 1 }}>
          <TextField.Root
            id="discount-code"
            type="text"
            value={code}
            onChange={(e) => onChange(e.target.value.toUpperCase())}
            onKeyDown={(e) => e.key === 'Enter' && onApply()}
            placeholder="Ingresa tu código"
            size="2"
          >
            <TextField.Slot>
              <BookmarkIcon />
            </TextField.Slot>
          </TextField.Root>
        </Box>
        <Button
          onClick={onApply}
          disabled={!code.trim() || isApplying}
          variant="outline"
          size="sm"
        >
          {isApplying ? '...' : 'Aplicar'}
        </Button>
      </Flex>
      {error && (
        <Text color="red" size="1" mt="1" as="p">{error}</Text>
      )}
      <Text size="1" color="gray" mt="2" as="p">
        Prueba: WELCOME10, SAVE5, VIP20
      </Text>
    </Box>
  )
}
