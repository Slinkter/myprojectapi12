/**
 * @file CheckoutPage.tsx
 * @description Vista de página para el proceso de checkout y confirmación de compra (FSD Pages Layer).
 * @architecture Pages Layer - Checkout Page View
 */

import React from "react";
import Checkout from "@/features/checkout/presentation/Checkout";

/**
 * @component CheckoutPage
 * @description Envuelve y expone el módulo de checkout en la capa de páginas del enrutador.
 *
 * @returns {JSX.Element} Vista de la página de checkout.
 */
const CheckoutPage: React.FC = () => {
    return <Checkout />;
};

export default CheckoutPage;
