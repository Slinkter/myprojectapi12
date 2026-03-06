/**
 * @file CartIcon.tsx
 * @description Componente visual del icono del carrito.
 * Renderiza puramente el icono SVG sin lógica de estado ni badges.
 * @architecture Presentation Layer - Cart Feature
 */
import { ShoppingCart } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * @interface CartIconProps
 * @property {string} [className] - Clases CSS adicionales
 */
interface ICartIconProps {
    className?: string;
}

/**
 * Componente visual simple para el icono del carrito.
 *
 * @component
 * @param {CartIconProps} props
 */
const CartIcon = ({ className }: ICartIconProps) => {
    return (
        <ShoppingCart
            className={cn("h-5 w-5", className)}
            strokeWidth={2}
        />
    );
};

export default CartIcon;
