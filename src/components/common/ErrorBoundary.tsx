/**
 * @file ErrorBoundary.tsx
 * @description Boundary de error global para la aplicación.
 * Captura errores no controlados en el árbol de componentes y muestra una UI de fallback.
 * @architecture Infrastructure Layer - Error Handling
 */
import React, { Component, ReactNode } from "react";
import ErrorFallback from "./ErrorFallback";

/**
 * @interface ErrorBoundaryProps
 * @property {ReactNode} children - Componentes hijos a envolver
 * @property {ReactNode} [fallback] - UI opcional alternativa`
 */
interface IErrorBoundaryProps {
    children: ReactNode;
    fallback?: ReactNode;
}

interface IErrorBoundaryState {
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
class ErrorBoundary extends Component<
    IErrorBoundaryProps,
    IErrorBoundaryState
> {
    constructor(props: IErrorBoundaryProps) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null,
        };
    }

    static getDerivedStateFromError(
        error: Error,
    ): Partial<IErrorBoundaryState> {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
        if (import.meta.env.DEV) {
            console.error("ErrorBoundary capturó un error:", error, errorInfo);
        }
        // Aquí también se podría enviar el error a un servicio de reporte (ej. Sentry)
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
