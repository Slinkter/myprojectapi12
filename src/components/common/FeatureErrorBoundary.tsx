/**
 * @file FeatureErrorBoundary.tsx
 * @description Boundary de error para aislar fallos en features específicas.
 * Muestra un ErrorMessage o un fallback personalizado cuando ocurre un error en sus hijos.
 * @architecture Presentation Layer - Common Components
 */
import { Component, ReactNode, ErrorInfo } from "react";
import ErrorMessage from "./ErrorMessage";
import clsx from 'clsx';

interface Props {
    children: ReactNode;
    featureName: string;
    fallback?: ReactNode;
}

interface State {
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
class FeatureErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error(`Error in ${this.props.featureName}:`, error, errorInfo);
    }

    handleReset = () => {
        this.setState({ hasError: false, error: null });
    };

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
