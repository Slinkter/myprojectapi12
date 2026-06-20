/**
 * @file Loader.tsx
 * @description Indicador de carga visual (Spinner).
 * Utilizado durante peticiones asíncronas o cargas diferidas.
 * @architecture Presentation Layer - Common Components
 */
import React from "react";
import { Flex, Spinner, Text } from "@radix-ui/themes";
import { useLogLifecycle } from "@/shared/hooks";

/**
 * @component Loader
 * @description Un componente simple de spinner de carga.
 * 
 * @returns {JSX.Element} El spinner de carga.
 */
const Loader: React.FC = () => {
    useLogLifecycle("Loader");
    return (
        <Flex
            position="fixed"
            inset="0"
            align="center"
            justify="center"
            style={{
                backgroundColor: "var(--black-a8)",
                backdropFilter: "blur(4px)",
                zIndex: 50,
            }}
        >
            <Flex direction="column" align="center" gap="3">
                <Spinner size="3" />
                <Text size="2" color="gray">Cargando...</Text>
            </Flex>
        </Flex>
    );
};

export default Loader;

