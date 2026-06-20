import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@/test/utils";
import Cart from "../Cart";
import { useCart } from "@/features/cart/application/useCart";

// Mock de toast
vi.mock("react-hot-toast", () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

// Mock de useCart
vi.mock("@/features/cart/application/useCart", () => ({
  useCart: vi.fn(),
}));

describe("Cart Component Integration", () => {
  const defaultUseCartValue = {
    cart: [],
    addToCart: vi.fn(),
    removeFromCart: vi.fn(),
    clearCart: vi.fn(),
    isCartOpen: false,
    openCart: vi.fn(),
    closeCart: vi.fn(),
    toggleCart: vi.fn(),
    totalPrice: 0,
    totalItems: 0,
  };

  beforeEach(() => {
    vi.mocked(useCart).mockReturnValue(defaultUseCartValue);
  });

  it("should be hidden by default (off-canvas)", () => {
    render(<Cart />);
    const drawer = screen.queryByRole("dialog");
    expect(drawer).not.toBeInTheDocument();
  });

  it("should display empty cart message when no items", () => {
    vi.mocked(useCart).mockReturnValue({
      ...defaultUseCartValue,
      isCartOpen: true,
    });
    render(<Cart />);
    expect(screen.getByText(/Tu carrito está vacío/i)).toBeInTheDocument();
  });

  it("should not show total price section when cart is empty", () => {
    vi.mocked(useCart).mockReturnValue({
      ...defaultUseCartValue,
      isCartOpen: true,
    });
    render(<Cart />);
    const totals = screen.queryAllByText(/\$0/);
    expect(totals.length).toBe(0);
  });
});
