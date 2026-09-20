/**
 * @file CartButton.tsx
 * @description Botón de carrito con badge animado de cantidad de artículos.
 * Consume useCartState para totalItems y useCartActions para openCart de forma segregada.
 * @architecture Widget Layer - Cart Button
 */

import { ShoppingCart } from "lucide-react";
import { m, AnimatePresence } from "framer-motion";
import { IconButton } from "@/shared/ui/IconButton";
import { useCartState } from "@/features/cart/application/CartStateContext";
import { useCartActions } from "@/features/cart/application/CartActionsContext";

/**
 * @component CartButton
 * @description Botón que abre el drawer del carrito y muestra el badge animado
 * con la cantidad total de artículos. La etiqueta ARIA incluye el conteo actual.
 *
 * @returns {JSX.Element} Contenedor relativo con botón y badge.
 */
const CartButton = () => {
    const { totalItems } = useCartState();
    const { openCart } = useCartActions();

    return (
        <div className="relative">
            <IconButton
                onClick={openCart}
                label={`Abrir carrito${totalItems > 0 ? ` — ${totalItems} ${totalItems === 1 ? "artículo" : "artículos"}` : ""}`}
            >
                <ShoppingCart size="20" />
            </IconButton>

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
        </div>
    );
};

export default CartButton;