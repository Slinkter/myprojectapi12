/**
 * @file FeatureErrorBoundary.tsx
 * @description Boundary de error para aislar fallos en features específicas.
 * Muestra un ErrorMessage o un fallback personalizado cuando ocurre un error en sus hijos.
 * @architecture Presentation Layer - Common Components
 */
import { Component, ReactNode, ErrorInfo } from "react";
import ErrorMessage from "@/shared/ui/ErrorMessage";

/**
 * @interface IProps
 * @description Propiedades del componente FeatureErrorBoundary.
 * @property {ReactNode} children - Componentes hijos a envolver.
 * @property {string} featureName - Nombre de la feature para identificar errores.
 * @property {ReactNode} [fallback] - UI personalizada de fallback.
 */
interface IProps {
    children: ReactNode;
    featureName: string;
    fallback?: ReactNode;
}

/**
 * @interface IState
 * @description Estado interno del FeatureErrorBoundary.
 * @property {boolean} hasError - Indica si ocurrió un error.
 * @property {Error | null} error - Objeto de error capturado.
 */
interface IState {
    hasError: boolean;
    error: Error | null;
}

/**
 * Componente Class-based para capturar errores de renderizado en sus hijos.
 *
 * @component
 * @example
 * <FeatureErrorBoundary featureName="Products">
 *   <ProductList />
 * </FeatureErrorBoundary>
 */
class FeatureErrorBoundary extends Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    /**
     * Actualiza el estado para mostrar la UI de fallback en el error.
     * @param {Error} error - Error capturado.
     * @returns {IState} Estado con el error.
     */
    static getDerivedStateFromError(error: Error): IState {
        return { hasError: true, error };
    }

    /**
     * Registra en consola el error ocurrido en la feature.
     * @param {Error} error - El error capturado.
     * @param {ErrorInfo} errorInfo - Información de la pila de componentes.
     */
    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error(`Error in ${this.props.featureName}:`, error, errorInfo);
    }

    /**
     * Reinicia el estado de error para reintentar la renderización.
     */
    handleReset = () => {
        this.setState({ hasError: false, error: null });
    };

    /**
     * Renderiza los hijos o el mensaje de error si ocurrió un fallo.
     * @returns {ReactNode} Hijos o componente de fallback.
     */
    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <ErrorMessage
                    title={`Error in ${this.props.featureName}`}
                    message={
                        this.state.error?.message || "Something went wrong"
                    }
                    action={{
                        label: "Try again",
                        onClick: this.handleReset,
                    }}
                />
            );
        }

        return this.props.children;
    }
}

export default FeatureErrorBoundary;
