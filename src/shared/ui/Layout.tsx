/**
 * @file Layout.tsx
 * @description Layout principal de la aplicación.
 * @architecture Presentation Layer - Layout
 */
import { Box, Container } from "@radix-ui/themes";
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
        <Box minHeight="100vh">
            <Toaster position="top-center" reverseOrder={false} />
            <Navbar />
            <Container size="3" px="4" py="6">
                <main>
                    {children}
                </main>
            </Container>
        </Box>
    );
};

export default Layout;
