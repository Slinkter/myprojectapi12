import { Card, Flex, Text, Box } from "@radix-ui/themes";
import { CheckCircledIcon } from "@radix-ui/react-icons";
import { FaBitcoin } from "react-icons/fa";
import { useLogLifecycle } from "@/shared/hooks";

interface IPaymentMethodRadioProps {
    id: string;
    label: string;
    checked: boolean;
    onChange: () => void;
}

const PaymentMethodRadio = ({
    id,
    label,
    checked,
    onChange,
}: IPaymentMethodRadioProps) => {
    useLogLifecycle("PaymentMethodRadio");

    return (
        <Card
            onClick={onChange}
            style={{
                cursor: "pointer",
                border: checked ? "2px solid var(--purple-9)" : "2px solid var(--gray-5)",
                backgroundColor: checked ? "var(--purple-2)" : "var(--color-background)",
                position: "relative",
                height: 96,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.2s",
            }}
            role="radio"
            aria-checked={checked}
            tabIndex={0}
            onKeyDown={(e) => {
                if (e.key === " " || e.key === "Enter") {
                    e.preventDefault();
                    onChange();
                }
            }}
        >
            <Flex direction="column" align="center" justify="center" gap="1">
                <Box>
                    {id === "visa" && (
                        <Text weight="bold" style={{ color: "var(--blue-9)" }} size="2">VISA</Text>
                    )}
                    {id === "mastercard" && (
                        <Flex gap="0" style={{ position: "relative" }}>
                            <Box style={{ width: 16, height: 16, borderRadius: "9999px", backgroundColor: "var(--red-9)" }} />
                            <Box style={{ width: 16, height: 16, borderRadius: "9999px", backgroundColor: "var(--orange-9)", marginLeft: -6 }} />
                        </Flex>
                    )}
                    {id === "bitcoin" && (
                        <FaBitcoin style={{ color: "var(--orange-9)", width: 20, height: 20 }} />
                    )}
                </Box>
                <Text size="1" weight="medium">{label}</Text>
            </Flex>
            {checked && (
                <Box position="absolute" top="2" right="2" style={{ color: "var(--purple-9)" }}>
                    <CheckCircledIcon width="16" height="16" />
                </Box>
            )}
        </Card>
    );
};

export default PaymentMethodRadio;

