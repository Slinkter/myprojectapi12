import { Link } from "react-router-dom";
import { ArrowLeftIcon } from "@radix-ui/react-icons";
import { Flex, Heading, Text, Badge, Box } from "@radix-ui/themes";
import { useLogLifecycle } from "@/shared/hooks";

const CheckoutHeader = () => {
  useLogLifecycle("CheckoutHeader");
  return (
    <Box p="4" style={{ borderBottom: "1px solid var(--gray-5)" }}>
      <Flex align="center" justify="between" mb="3">
        <Link
          to="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "var(--space-1)",
            fontSize: "var(--font-size-2)",
            color: "var(--gray-11)",
            textDecoration: "none",
          }}
        >
          <ArrowLeftIcon /> Volver
        </Link>
        <Badge color="green" size="2">
          Pago Seguro
        </Badge>
      </Flex>
      <Heading size="6" as="h1" id="checkout-title">
        Checkout
      </Heading>
      <Text size="2" color="gray" mt="1" as="p">
        Completa los datos para realizar tu pago
      </Text>
    </Box>
  );
};

export default CheckoutHeader;
