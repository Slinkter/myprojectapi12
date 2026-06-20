import { useNavigate } from "react-router-dom";
import { useCart } from "@/features/cart/application/useCart";
import { ICartItem } from "@/features/cart/domain/cartTypes";
import { Dialog, Flex, Box, Text, Heading, IconButton } from "@radix-ui/themes";
import { Cross1Icon, BackpackIcon } from "@radix-ui/react-icons";
import { Button } from "@/shared/ui/Button";
import { useLogLifecycle } from "@/shared/hooks";
import { CartItemRow } from "./CartItemRow";

const Cart = () => {
  useLogLifecycle("Cart");
  const { cart, removeFromCart, clearCart, isCartOpen, closeCart, totalPrice } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    closeCart();
    navigate("/checkout");
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <Dialog.Root open={isCartOpen} onOpenChange={(open) => !open && closeCart()}>
      <Dialog.Content
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          bottom: 0,
          width: "100%",
          maxWidth: "380px",
          height: "100vh",
          margin: 0,
          borderRadius: 0,
          display: "flex",
          flexDirection: "column",
          padding: 0,
          boxSizing: "border-box",
        }}
      >
        <Flex direction="column" height="100%">
          {/* Header */}
          <Flex align="center" justify="between" px="4" py="3" style={{ borderBottom: "1px solid var(--gray-5)" }}>
            <Flex align="center" gap="2">
              <Heading size="4" as="h2">Mi Carrito</Heading>
              <Text size="2" color="gray">({totalItems})</Text>
            </Flex>
            <Dialog.Close>
              <IconButton variant="ghost" color="gray" size="2" style={{ cursor: "pointer" }} aria-label="Cerrar carrito">
                <Cross1Icon width="16" height="16" />
              </IconButton>
            </Dialog.Close>
          </Flex>

          {/* Items */}
          <Box style={{ flexGrow: 1, overflowY: "auto" }} p="4">
            {cart.length === 0 ? (
              <Flex direction="column" align="center" justify="center" height="100%" p="4" style={{ textAlign: "center", minHeight: "300px" }}>
                <Flex
                  align="center"
                  justify="center"
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: "9999px",
                    backgroundColor: "var(--gray-3)",
                    marginBottom: "var(--space-4)",
                    color: "var(--gray-11)",
                  }}
                >
                  <BackpackIcon width="32" height="32" />
                </Flex>
                <Text color="gray" mb="4" as="p">Tu carrito está vacío</Text>
                <Button variant="outline" onClick={closeCart}>
                  Continuar Comprando
                </Button>
              </Flex>
            ) : (
              <Flex direction="column" gap="3">
                {cart.map((item: ICartItem) => (
                  <CartItemRow
                    key={item.id}
                    item={item}
                    onRemove={removeFromCart}
                  />
                ))}
              </Flex>
            )}
          </Box>

          {/* Footer */}
          {cart.length > 0 && (
            <Flex direction="column" gap="3" p="4" style={{ borderTop: "1px solid var(--gray-5)" }}>
              <Flex align="center" justify="between">
                <Text color="gray">Subtotal</Text>
                <Text weight="medium">${totalPrice.toFixed(2)}</Text>
              </Flex>
              
              <Flex align="center" justify="between" style={{ fontSize: "var(--font-size-4)", fontWeight: "bold" }}>
                <Text>Total</Text>
                <Text>${totalPrice.toFixed(2)}</Text>
              </Flex>

              <Button
                onClick={handleCheckout}
                style={{ width: "100%" }}
              >
                Proceder al Pago
              </Button>
              
              <Button
                variant="outline"
                onClick={clearCart}
                color="red"
                style={{ width: "100%" }}
              >
                Vaciar Carrito
              </Button>
            </Flex>
          )}
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default Cart;

