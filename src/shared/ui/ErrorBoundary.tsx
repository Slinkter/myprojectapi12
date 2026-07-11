/**
 * @file ErrorBoundary.tsx
 * @description Boundary de error global para la aplicación.
 * Captura errores no controlados en el árbol de componentes y muestra una UI de fallback.
 * @architecture Infrastructure Layer - Error Handling
 */
import React, { Component, ReactNode } from "react";
import ErrorFallback from "@/shared/ui/ErrorFallback";

/**
 * @interface IErrorBoundaryProps
 * @description Propiedades del componente ErrorBoundary.
 * @property {ReactNode} children - Componentes hijos a envolver.
 * @property {ReactNode} [fallback] - UI opcional alternativa de error.
 */
interface IErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * @interface IErrorBoundaryState
 * @description Estado interno del ErrorBoundary.
 * @property {boolean} hasError - Indica si ocurrió un error.
 * @property {Error | null} error - Objeto de error capturado.
 * @property {React.ErrorInfo | null} errorInfo - Información del stack del error.
 */
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

  /**
   * Actualiza el estado para renderizar la UI de fallback en el siguiente render.
   * @param {Error} error - Error capturado.
   * @returns {Partial<IErrorBoundaryState>} Estado parcial con el error.
   */
  static getDerivedStateFromError(error: Error): Partial<IErrorBoundaryState> {
    return { hasError: true, error };
  }

  /**
   * Captura el error y registra información en consola (solo en desarrollo).
   * @param {Error} error - El error capturado.
   * @param {React.ErrorInfo} errorInfo - Información de la pila de componentes.
   */
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

  /**
   * Reinicia el estado de error, permitiendo reintentar la renderización.
   */
  handleReset = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  /**
   * Renderiza los hijos o la UI de fallback si hay un error.
   * @returns {ReactNode} Hijos o componente de error.
   */
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
