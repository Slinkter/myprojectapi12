/**
 * @file ErrorFallback.tsx
 * @description UI de respaldo mostrada cuando ocurre un error crítico.
 * Muestra detalles técnicos solo en modo desarrollo.
 * @architecture Presentation Layer - Error Handling
 */
import { TriangleAlert } from "lucide-react";
import React from "react";
import clsx from 'clsx';

/**
 * @interface ErrorFallbackProps
 * @property {Error | null} error - El objeto de error capturado
 * @property {React.ErrorInfo | null} errorInfo - Stack trace del componente
 * @property {function} onReset - Función para intentar recuperar la aplicación
 */
interface ErrorFallbackProps {
    error: Error | null;
    errorInfo: React.ErrorInfo | null;
    onReset: () => void;
}

/**
 * Componente visual para mostrar errores fatales.
 *
 * @component
 */
const ErrorFallback = ({ error, errorInfo, onReset }: ErrorFallbackProps) => {
    const isDev = import.meta.env.DEV;

    return (
        <div className={clsx("min-h-screen flex items-center justify-center bg-(--bg-main) p-4")}>
            <div className={clsx("error-fallback-card max-w-2xl w-full p-8 text-center")}>
                <div className={clsx("flex justify-center mb-6")}>
                    <div className={clsx("w-20 h-20 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center")}>
                        <TriangleAlert className={clsx("w-12 h-12 text-red-600 dark:text-red-400")} />
                    </div>
                </div>

                <h1 className={clsx("text-3xl font-bold text-(--text-primary) mb-4")}>
                    Oops! Something went wrong
                </h1>

                <p className={clsx("text-(--text-secondary) mb-6")}>
                    We apologize for the inconvenience. An unexpected error has
                    occurred.
                </p>

                {isDev && error && (
                    <div className={clsx("mb-6 text-left")}>
                        <details className={clsx("bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-lg p-4")}>
                            <summary className={clsx("cursor-pointer font-semibold text-red-800 dark:text-red-400 mb-2")}>
                                Error Details (Development Only)
                            </summary>
                            <div className={clsx("mt-2 space-y-2")}>
                                <div>
                                    <p className={clsx("font-mono text-sm text-red-900 dark:text-red-300 break-all")}>
                                        <strong>Message:</strong>{" "}
                                        {error.message}
                                    </p>
                                </div>
                                {error.stack && (
                                    <div>
                                        <p className={clsx("font-mono text-xs text-red-800 dark:text-red-400 whitespace-pre-wrap break-all")}>
                                            <strong>Stack:</strong>
                                            {"\n"}
                                            {error.stack}
                                        </p>
                                    </div>
                                )}
                                {errorInfo && errorInfo.componentStack && (
                                    <div>
                                        <p className={clsx("font-mono text-xs text-red-800 dark:text-red-400 whitespace-pre-wrap break-all")}>
                                            <strong>Component Stack:</strong>
                                            {errorInfo.componentStack}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </details>
                    </div>
                )}

                <div className={clsx("flex gap-4 justify-center")}>
                    <button
                        onClick={onReset}
                        className={clsx("error-fallback-try-again-button px-6 py-3")}
                    >
                        Try Again
                    </button>
                    <button
                        onClick={() =>
                            (window.location.href = "/myprojectapi12/")
                        }
                        className={clsx("error-fallback-home-button px-6 py-3")}
                    >
                        Go to Home
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ErrorFallback;
