/**
 * @file ErrorBoundary
 * @architecture Capa de manejo de errores - captura errores de React en el árbol de componentes
 * @side-effects Registro en consola en modo desarrollo, gestión del estado de error
 * @perf Componente de clase requerido para límites de error (limitación de React)
 */
import { Component } from 'react';
import PropTypes from 'prop-types';
import ErrorFallback from './ErrorFallback';

/**
 * Componente Error Boundary para capturar errores de JavaScript en cualquier parte del árbol de componentes hijos.
 * Evita que toda la aplicación se bloquee y muestra un mensaje de error amigable para el usuario.
 *
 * Características:
 * - Captura errores durante el renderizado, en los métodos de ciclo de vida y en los constructores.
 * - Registra errores en la consola en modo de desarrollo.
 * - Proporciona funcionalidad de reinicio para recuperarse de errores.
 * - Soporta UI de fallback personalizada a través de props.
 * - Muestra información detallada del error en desarrollo (mensaje de error, seguimiento de pila, pila de componentes).
 *
 * Nota: Los límites de error NO capturan errores en:
 * - Manejadores de eventos (usar try-catch en su lugar)
 * - Código asíncrono (setTimeout, requestAnimationFrame, etc.)
 * - Renderizado del lado del servidor
 * - Errores lanzados en el propio límite de error
 *
 * @class ErrorBoundary
 * @extends {Component}
 *
 * @example
 * // Uso básico
 * <ErrorBoundary>
 *   <App />
 * </ErrorBoundary>
 *
 * @example
 * // Con fallback personalizado
 * <ErrorBoundary fallback={<CustomErrorUI />}>
 *   <SomeComponent />
 * </ErrorBoundary>
 */class ErrorBoundary extends Component {
    /**
     * @param {Object} props
     * @param {React.ReactNode} props.children - Componentes a ser envueltos por el límite de error
     * @param {React.ReactNode} [props.fallback] - UI de fallback personalizada opcional para mostrar en caso de error
     */
    constructor(props) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null,
        };
    }

        /**
         * Método de ciclo de vida estático llamado cuando se lanza un error.
         * Actualiza el estado para activar el renderizado de la UI de fallback.
         *
         * @static
         * @param {Error} error - El error que fue lanzado
         * @returns {Object} Nuevo estado con el flag hasError y el objeto de error
         */    static getDerivedStateFromError(error) {
        // Update state so the next render will show the fallback UI
        return { hasError: true, error };
    }

        /**
         * Método de ciclo de vida llamado después de que se ha lanzado un error.
         * Se utiliza para registrar errores y efectos secundarios.
         *
         * @param {Error} error - El error que fue lanzado
         * @param {Object} errorInfo - Objeto con la propiedad componentStack que contiene el seguimiento de pila
         * @param {string} errorInfo.componentStack - Seguimiento de pila del componente que muestra dónde ocurrió el error
         */    componentDidCatch(error, errorInfo) {
        // Log error to console in development
        if (import.meta.env.DEV) {
            console.error('ErrorBoundary caught an error:', error, errorInfo);
        }

        // You can also log the error to an error reporting service here
        // logErrorToService(error, errorInfo);

        this.setState({
            error,
            errorInfo,
        });
    }

    /**
     * Reinicia el estado del límite de error, permitiendo al usuario intentar renderizar el árbol de componentes nuevamente.
     * Se llama cuando el usuario hace clic en el botón "Try Again" (Intentar de nuevo) en la UI de fallback de error.
     */
    handleReset = () => {
        this.setState({
            hasError: false,
            error: null,
            errorInfo: null,
        });
    };

    render() {
        if (this.state.hasError) {
            // Use custom fallback if provided, otherwise use default
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

ErrorBoundary.propTypes = {
    children: PropTypes.node.isRequired,
    fallback: PropTypes.node,
};

export default ErrorBoundary;
