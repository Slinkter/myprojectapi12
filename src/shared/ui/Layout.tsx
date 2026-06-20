/**
 * @file Layout.tsx
 * @description Layout principal de la aplicación.
 * @architecture Presentation Layer - Layout
 */
import { ReactNode } from "react";
import { Toaster } from "react-hot-toast";
import Navbar from "@/shared/ui/Navbar";
import { useLogLifecycle } from "@/shared/hooks";

interface ILayoutProps {
    children: ReactNode;
}

const Layout = ({ children }: ILayoutProps) => {
    useLogLifecycle("Layout");
    return (
        <div className="min-h-screen bg-background">
            <Toaster position="top-center" reverseOrder={false} />
            <Navbar />
            <main className="container mx-auto px-4 py-6">
                {children}
            </main>
        </div>
    );
};

export default Layout;
