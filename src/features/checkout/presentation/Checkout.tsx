/**
 * @file Checkout.tsx
 * @description Página principal del proceso de pago.
 * Diseño limpio y profesional.
 * @architecture Capa de Presentación - Feature de Checkout
 */
import { useState, useEffect } from "react";
import { useLogLifecycle } from "@/shared/hooks";
import { useCheckout } from "@/features/checkout/application/useCheckout";
import { useCart } from "@/features/cart/application/useCart";
import { CheckoutSteps } from "@/features/checkout/presentation/components/CheckoutSteps";
import CheckoutHeader from "@/features/checkout/presentation/CheckoutHeader";
import PaymentMethodSelector from "@/features/checkout/presentation/PaymentMethodSelector";
import PaymentFormContainer from "@/features/checkout/presentation/PaymentFormContainer";
import PaymentSubmitButton from "@/features/checkout/presentation/PaymentSubmitButton";
import SecurityBadge from "@/features/checkout/presentation/SecurityBadge";
import { OrderSummary } from "@/features/checkout/presentation/components/OrderSummary";

import { Container, Grid, Flex, Card, Heading, Box } from "@radix-ui/themes";

const STEPS = ['Carrito', 'Pago', 'Confirmación'];

const Checkout = () => {
  useLogLifecycle("Checkout");
  useEffect(() => {
    console.log('[Checkout] Component mounted!')
  }, [])
  
  const {
    paymentMethod,
    cardInfo,
    errors,
    cardType,
    handlePayment,
    handlePaymentFieldChange,
    selectPaymentMethod,
    isPaymentDisabled,
  } = useCheckout();

  const { cart, totalPrice, removeFromCart } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePaymentClick = async () => {
    setIsProcessing(true)
    try {
      await handlePayment()
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <Box style={{ minHeight: "100vh", backgroundColor: "var(--gray-1)", padding: "var(--space-4) 0" }}>
      <Container size="3">
        <Flex direction="column" gap="5">
          {/* Estados */}
          <CheckoutSteps steps={STEPS} currentStep={1} />

          {/* Header */}
          <CheckoutHeader />

          <Grid columns={{ initial: "1", md: "2" }} gap="6">
            {/* Formulario */}
            <Flex direction="column" gap="4">
              {/* Método de pago */}
              <Card size="2">
                <Heading size="2" color="gray" mb="3">Método de pago</Heading>
                <PaymentMethodSelector
                  currentMethod={paymentMethod}
                  onMethodChange={selectPaymentMethod}
                />
              </Card>

              {/* Datos de tarjeta */}
              <Card size="2">
                <Heading size="2" color="gray" mb="4">Datos de la tarjeta</Heading>
                <PaymentFormContainer
                  paymentMethod={paymentMethod}
                  cardProps={{
                    cardInfo,
                    errors,
                    cardType,
                    onChange: handlePaymentFieldChange,
                  }}
                />
              </Card>

              <PaymentSubmitButton
                isDisabled={isPaymentDisabled || cart.length === 0}
                isProcessing={isProcessing}
                method={paymentMethod}
                onClick={handlePaymentClick}
              />

              <SecurityBadge />
            </Flex>

            {/* Resumen del pedido */}
            <Box style={{ position: "sticky", top: "var(--space-4)", height: "fit-content" }}>
              <OrderSummary 
                items={cart} 
                totalPrice={totalPrice}
                onRemove={removeFromCart}
              />
            </Box>
          </Grid>
        </Flex>
      </Container>
    </Box>
  );
};

export default Checkout;
