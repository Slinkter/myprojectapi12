/**
 * @file ErrorBoundary.tsx
 * @description Boundary de error global para la aplicación.
 * Captura errores no controlados en el árbol de componentes y muestra una UI de fallback.
 * @architecture Infrastructure Layer - Error Handling
 */
import React, { Component, ReactNode } from "react";
import ErrorFallback from "./ErrorFallback";
import clsx from 'clsx';

/**
 * @interface ErrorBoundaryProps
 * @property {ReactNode} children - Componentes hijos a envolver
 * @property {ReactNode} [fallback] - UI opcional alternativa`
 */
interface ErrorBoundaryProps {
    children: ReactNode;
    fallback?: ReactNode;
}

interface ErrorBoundaryState {
    hasError: boolean;
    error: Error | null;
    errorInfo: React.ErrorInfo | null;
}

/**
 * Componente de clase para manejo global de errores.
 * Utiliza métodos de ciclo de vida para capturar excepciones.
 *
 * @component
 */
class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null,
        };
    }

    static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
        if (import.meta.env.DEV) {
            console.error("ErrorBoundary caught an error:", error, errorInfo);
        }
        // You can also log the error to an error reporting service here
        // logErrorToService(error, errorInfo);

        this.setState({
            error,
            errorInfo,
        });
    }

    handleReset = (): void => {
        this.setState({
            hasError: false,
            error: null,
            errorInfo: null,
        });
    };

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <ErrorFallback
                    error={this.state.error}
                    errorInfo={this.state.errorInfo}
                    onReset={this.handleReset}
                />
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
