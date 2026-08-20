/**
 * @file CheckoutSuccessPage.tsx
 * @description Vista de página para la confirmación de orden exitosa (FSD Pages Layer).
 * @architecture Pages Layer - Checkout Success Page View
 */

import React from "react";
import CheckoutSuccess from "@/features/checkout/presentation/CheckoutSuccess";

/**
 * @component CheckoutSuccessPage
 * @description Envuelve y expone el resultado exitoso de compra en la capa de páginas del enrutador.
 *
 * @returns {JSX.Element} Vista de la página de confirmación de compra.
 */
const CheckoutSuccessPage: React.FC = () => {
    return <CheckoutSuccess />;
};

export default CheckoutSuccessPage;
