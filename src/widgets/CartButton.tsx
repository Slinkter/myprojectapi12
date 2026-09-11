/**
 * @file CartButton.tsx
 * @description Botón de carrito con badge animado de cantidad de artículos.
 * Extraído del Navbar para reducir su tamaño y permitir reutilización.
 * @architecture Widget Layer - Cart Button
 */

import { ShoppingCart } from "lucide-react";
import { IconButton } from "@/shared/ui/IconButton";
import CartBadge from "@/widgets/CartBadge";
import { useCart } from "@/features/cart/application/CartContext";

/**
 * @component CartButton
 * @description Botón que abre el drawer del carrito y muestra el badge animado
 * con la cantidad total de artículos. La etiqueta ARIA incluye el conteo actual.
 *
 * @returns {JSX.Element} Contenedor relativo con botón y badge.
 */
const CartButton = () => {
    const { cart, openCart } = useCart();
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <div className="relative">
            <IconButton
                onClick={openCart}
                label={`Abrir carrito${totalItems > 0 ? ` — ${totalItems} ${totalItems === 1 ? "artículo" : "artículos"}` : ""}`}
            >
                <ShoppingCart size="20" />
            </IconButton>
            <CartBadge />
        </div>
    );
};

export default CartButton;