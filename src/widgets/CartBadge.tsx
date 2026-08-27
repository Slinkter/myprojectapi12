/**
 * @file CartBadge.tsx
 * @description Componente reutilizable para mostrar el badge de artículos del carrito.
 * Utiliza AnimatePresence para animar de manera más limpia la aparición y desaparición del número.
 * @architecture Widget Layer - Presentation Component
 */

import { m, AnimatePresence } from "framer-motion";
import { useCart } from "@/features/cart/application/CartContext";

/**
 * @component CartBadge
 * @description Muestra el indicador (badge) de la cantidad total de artículos en el carrito.
 * @returns {JSX.Element} Badge animado de artículos.
 */
const CartBadge = () => {
    const { cart } = useCart();
    const totalItems = cart.reduce((s, i) => s + i.quantity, 0);

    return (
        <>
            <AnimatePresence mode="popLayout">
                {totalItems > 0 && (
                    <m.span
                        key={`cart-badge-${totalItems}`}
                        initial={{ scale: 0.2, opacity: 0 }}
                        animate={{ scale: [1, 1.25, 1], opacity: 1 }}
                        exit={{ scale: 0.2, opacity: 0 }}
                        transition={{
                            type: "spring",
                            stiffness: 500,
                            damping: 20,
                            mass: 0.5,
                        }}
                        className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-emerald-500 text-white text-[10px] font-bold flex items-center justify-center border-2 border-white dark:border-slate-900 pointer-events-none shadow-sm"
                        aria-hidden="true"
                    >
                        {totalItems > 9 ? "9+" : totalItems}
                    </m.span>
                )}
            </AnimatePresence>
        </>
    );
};

export default CartBadge;