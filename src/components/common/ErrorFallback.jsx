import PropTypes from 'prop-types';
import { HiOutlineExclamationTriangle } from 'react-icons/hi2';

/**
 * Fallback UI component displayed when an error is caught by ErrorBoundary
 * @param {Object} props
 * @param {Error} props.error - The error that was caught
 * @param {Object} props.errorInfo - Additional error information
 * @param {Function} props.onReset - Callback to reset the error boundary
 */
const ErrorFallback = ({ error, errorInfo, onReset }) => {
    const isDev = import.meta.env.DEV;

    return (
        <div className="min-h-screen flex items-center justify-center bg-[var(--bg-main)] p-4">
            <div className="neumo-card max-w-2xl w-full p-8 text-center">
                <div className="flex justify-center mb-6">
                    <div className="w-20 h-20 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
                        <HiOutlineExclamationTriangle className="w-12 h-12 text-red-600 dark:text-red-400" />
                    </div>
                </div>

                <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-4">
                    Oops! Something went wrong
                </h1>

                <p className="text-[var(--text-secondary)] mb-6">
                    We apologize for the inconvenience. An unexpected error has occurred.
                </p>

                {isDev && error && (
                    <div className="mb-6 text-left">
                        <details className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-lg p-4">
                            <summary className="cursor-pointer font-semibold text-red-800 dark:text-red-400 mb-2">
                                Error Details (Development Only)
                            </summary>
                            <div className="mt-2 space-y-2">
                                <div>
                                    <p className="font-mono text-sm text-red-900 dark:text-red-300 break-all">
                                        <strong>Message:</strong> {error.message}
                                    </p>
                                </div>
                                {error.stack && (
                                    <div>
                                        <p className="font-mono text-xs text-red-800 dark:text-red-400 whitespace-pre-wrap break-all">
                                            <strong>Stack:</strong>
                                            {'\n'}
                                            {error.stack}
                                        </p>
                                    </div>
                                )}
                                {errorInfo && errorInfo.componentStack && (
                                    <div>
                                        <p className="font-mono text-xs text-red-800 dark:text-red-400 whitespace-pre-wrap break-all">
                                            <strong>Component Stack:</strong>
                                            {errorInfo.componentStack}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </details>
                    </div>
                )}

                <div className="flex gap-4 justify-center">
                    <button
                        onClick={onReset}
                        className="neumo-button-primary px-6 py-3"
                    >
                        Try Again
                    </button>
                    <button
                        onClick={() => window.location.href = '/myprojectapi12/'}
                        className="neumo-button px-6 py-3"
                    >
                        Go to Home
                    </button>
                </div>
            </div>
        </div>
    );
};

ErrorFallback.propTypes = {
    error: PropTypes.instanceOf(Error),
    errorInfo: PropTypes.shape({
        componentStack: PropTypes.string,
    }),
    onReset: PropTypes.func.isRequired,
};

export default ErrorFallback;
