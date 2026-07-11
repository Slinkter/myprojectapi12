/**
 * @file Layout.tsx
 * @description Layout principal de la aplicación.
 * @architecture Presentation Layer - Layout
 */
import { ReactNode } from "react";
import { Toaster } from "react-hot-toast";
import Navbar from "@/shared/ui/Navbar";
import { useLogLifecycle } from "@/shared/hooks";

/**
 * @interface ILayoutProps
 * @description Propiedades del layout principal de la aplicación.
 * @property {ReactNode} children - Contenido a renderizar dentro del layout.
 */
interface ILayoutProps {
    children: ReactNode;
}

/**
 * @component Layout
 * @description Layout principal que envuelve todas las páginas.
 * Provee el navbar global y el contenedor de contenido con
 * espaciado y ancho máximo consistentes.
 * @param {ILayoutProps} props - Propiedades del layout.
 * @returns {JSX.Element} Estructura base de la aplicación.
 */
const Layout = ({ children }: ILayoutProps) => {
    useLogLifecycle("Layout");
    return (
        <div className="min-h-screen bg-background text-foreground transition-colors duration-200">
            <Toaster position="top-center" reverseOrder={false} />
            <Navbar />
        <main className="mx-auto max-w-5xl px-4 py-6">
                {children}
            </main>
        </div>
    );
};

export default Layout;
