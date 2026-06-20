import { Link } from "react-router-dom";
import React from "react";
import { Flex, Card, Heading, Text } from "@radix-ui/themes";
import { Button } from "@/shared/ui/Button";
import { useLogLifecycle } from "@/shared/hooks";

const CheckoutSuccess: React.FC = () => {
  useLogLifecycle("CheckoutSuccess");
  return (
    <Flex align="center" justify="center" p="4" style={{ minHeight: "70vh" }}>
      <Card size="3" style={{ maxWidth: 400, width: "100%", textAlign: "center" }}>
        <Flex
          align="center"
          justify="center"
          style={{
            width: 80,
            height: 80,
            borderRadius: "9999px",
            backgroundColor: "var(--green-3)",
            color: "var(--green-9)",
            marginLeft: "auto",
            marginRight: "auto",
            marginBottom: "var(--space-4)",
          }}
        >
          <Text size="8" weight="bold">✓</Text>
        </Flex>
        <Heading size="5" mb="3">
          ¡Pago Exitoso!
        </Heading>
        <Text size="2" color="gray" mb="5" as="p">
          Tu pedido ha sido procesado correctamente.
        </Text>
        <Link to="/" style={{ textDecoration: "none" }}>
          <Button style={{ width: "100%" }}>
            Continuar Comprando
          </Button>
        </Link>
      </Card>
    </Flex>
  );
};

export default CheckoutSuccess;
