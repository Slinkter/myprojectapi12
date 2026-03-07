import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@/test/utils";
import Cart from "../Cart";
import { CartProvider } from "../../application/CartContext";

// Mock de toast
vi.mock("react-hot-toast", () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe("Cart Component Integration", () => {
  const renderCart = () => {
    return render(
      <CartProvider>
        <Cart />
      </CartProvider>,
    );
  };

  it("should be hidden by default (off-canvas)", () => {
    renderCart();
    const drawer = screen.getByRole("dialog", { hidden: true });
    // En el sistema actual, el drawer usa clases de translate para ocultarse
    expect(drawer).toHaveClass("translate-x-full");
  });

  it("should display empty cart message when no items", () => {
    renderCart();
    // Abrir el carrito primero para que sea visible en el DOM (aunque el test use hidden: true)
    // Pero el mensaje de "vacío" debería estar ahí
    expect(screen.getByText(/Tu carrito está vacío/i)).toBeInTheDocument();
  });

  it("should show total price as $0 initially", () => {
    renderCart();
    const totals = screen.getAllByText(/\$0/);
    expect(totals.length).toBeGreaterThan(0);
  });
});
