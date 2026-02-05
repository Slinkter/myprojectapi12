/**
 * @file AppRouter.jsx
 * @component
 * @description Gestiona el enrutamiento de la aplicación utilizando `react-router-dom`.
 *   Emplea la carga perezosa para las páginas (`Home`, `Checkout`, `CheckoutSuccess`) para habilitar la división de código,
 *   mejorando el rendimiento de carga inicial.
 * @architecture Actúa como la capa de enrutamiento central, definiendo rutas y renderizando los componentes de página correspondientes
 *   envueltos en `Suspense` para una experiencia de carga fluida.
 * @sideeffects Las importaciones dinámicas dentro de las llamadas `lazy` activan solicitudes de red para fragmentos de JavaScript a medida que se accede a las páginas.
 * @perf Utiliza la carga perezosa para reducir el tamaño inicial del paquete y `Suspense` para evitar cascadas de UI
 *   proporcionando un componente `Loader` de reserva.
 * @returns {JSX.Element} Un componente de React que renderiza la página adecuada según la URL actual.
 */
import { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";

const Home = lazy(() => import("@/pages/Home"));
const Checkout = lazy(() =>
    import("@/features/checkout/presentation/Checkout")
);
const CheckoutSuccess = lazy(() =>
    import("@/features/checkout/presentation/CheckoutSuccess")
);

import Loader from "@/components/common/Loader";

const AppRouter = () => {
    return (
        <Suspense fallback={<Loader />}>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/checkout-success" element={<CheckoutSuccess />} />
            </Routes>
        </Suspense>
    );
};

export default AppRouter;
