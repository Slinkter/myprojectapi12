/**
 * @file Layout.tsx
 * @description Layout principal de la aplicación.
 * Incluye la barra de navegación (Navbar), el contenedor principal y el pie de página.
 * Maneja el estado de scroll para efectos visuales en el header.
 * @architecture Presentation Layer - Layout
 */
import { ReactNode } from "react";
import { Toaster } from "react-hot-toast";
import Navbar from "./Navbar";
import clsx from 'clsx';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className={clsx("min-h-dvh bg-[var(--bg-main)]")}>
      <Toaster position="top-center" reverseOrder={false} />
      <Navbar />
      <main className={clsx("container mx-auto px-3 py-6 sm:px-4 sm:py-8")} role="main">
        {children}
      </main>
    </div>
  );
};

export default Layout;
