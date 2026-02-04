import { Component } from 'react';
import PropTypes from 'prop-types';
import ErrorFallback from './ErrorFallback';

/**
 * Error Boundary component to catch JavaScript errors anywhere in the child component tree.
 * Prevents the entire app from crashing and displays a user-friendly error message.
 * 
 * Features:
 * - Catches errors during rendering, in lifecycle methods, and in constructors
 * - Logs errors to console in development mode
 * - Provides reset functionality to recover from errors
 * - Supports custom fallback UI via props
 * - Shows detailed error info in development (error message, stack trace, component stack)
 * 
 * Note: Error boundaries do NOT catch errors in:
 * - Event handlers (use try-catch instead)
 * - Asynchronous code (setTimeout, requestAnimationFrame, etc.)
 * - Server-side rendering
 * - Errors thrown in the error boundary itself
 * 
 * @class ErrorBoundary
 * @extends {Component}
 * 
 * @example
 * // Basic usage
 * <ErrorBoundary>
 *   <App />
 * </ErrorBoundary>
 * 
 * @example
 * // With custom fallback
 * <ErrorBoundary fallback={<CustomErrorUI />}>
 *   <SomeComponent />
 * </ErrorBoundary>
 */
class ErrorBoundary extends Component {
    /**
     * @param {Object} props
     * @param {React.ReactNode} props.children - Components to be wrapped by error boundary
     * @param {React.ReactNode} [props.fallback] - Optional custom fallback UI to show on error
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
     * Static lifecycle method called when an error is thrown.
     * Updates state to trigger fallback UI rendering.
     * 
     * @static
     * @param {Error} error - The error that was thrown
     * @returns {Object} New state with hasError flag and error object
     */
    static getDerivedStateFromError(error) {
        // Update state so the next render will show the fallback UI
        return { hasError: true, error };
    }

    /**
     * Lifecycle method called after an error has been thrown.
     * Used for logging errors and side effects.
     * 
     * @param {Error} error - The error that was thrown
     * @param {Object} errorInfo - Object with componentStack property containing stack trace
     * @param {string} errorInfo.componentStack - Component stack trace showing where error occurred
     */
    componentDidCatch(error, errorInfo) {
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
     * Resets the error boundary state, allowing the user to try rendering the component tree again.
     * Called when user clicks "Try Again" button in the error fallback UI.
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
