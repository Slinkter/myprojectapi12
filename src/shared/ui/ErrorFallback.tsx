/**
 * @file ErrorFallback.tsx
 * @description UI de respaldo mostrada cuando ocurre un error crítico.
 * Muestra detalles técnicos solo en modo desarrollo.
 * @architecture Presentation Layer - Error Handling
 */
import { HiOutlineExclamationTriangle } from "react-icons/hi2";
import React from "react";
import clsx from "clsx";
import { useLogLifecycle } from "@/shared/hooks";

/**
 * @interface IErrorFallbackProps
 * @description Propiedades del componente ErrorFallback.
 * @property {Error | null} error - Objeto de error capturado.
 * @property {React.ErrorInfo | null} errorInfo - Pila de componentes donde ocurrió el error.
 * @property {() => void} onReset - Función para reintentar y recuperar la aplicación.
 */
interface IErrorFallbackProps {
    error: Error | null;
    errorInfo: React.ErrorInfo | null;
    onReset: () => void;
}

/**
 * @component ErrorFallback
 * @description Pantalla de error fatal con mensaje amigable.
 * Muestra detalles técnicos del error solo en modo desarrollo
 * y ofrece botones para reintentar o volver al inicio.
 * @param {IErrorFallbackProps} props - Propiedades del componente.
 * @returns {JSX.Element} Pantalla completa de error.
 */
const ErrorFallback = ({ error, errorInfo, onReset }: IErrorFallbackProps) => {
    useLogLifecycle("ErrorFallback");
    const isDev = import.meta.env.DEV;

    return (
        <div
            className={clsx(
                "min-h-screen flex items-center justify-center bg-(--bg-main) p-4",
            )}
        >
            <div
                className={clsx(
                    "error-fallback-card max-w-2xl w-full p-8 text-center",
                )}
            >
                <div className={clsx("flex justify-center mb-6")}>
                    <div
                        className={clsx(
                            "w-20 h-20 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center",
                        )}
                    >
                        <HiOutlineExclamationTriangle
                            className={clsx(
                                "w-12 h-12 text-red-600 dark:text-red-400",
                            )}
                        />
                    </div>
                </div>

                <h1
                    className={clsx(
                        "text-3xl font-bold text-(--text-primary) mb-4",
                    )}
                >
                    ¡Oops! Algo salió mal
                </h1>

                <p className={clsx("text-(--text-secondary) mb-6")}>
                    Disculpe las molestias. Ha ocurrido un error inesperado.
                </p>

                {isDev && error && (
                    <div className={clsx("mb-6 text-left")}>
                        <details
                            className={clsx(
                                "bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-lg p-4",
                            )}
                        >
                            <summary
                                className={clsx(
                                    "cursor-pointer font-semibold text-red-800 dark:text-red-400 mb-2",
                                )}
                            >
                                Detalles del Error (Solo Desarrollo)
                            </summary>
                            <div className={clsx("mt-2 space-y-2")}>
                                <div>
                                    <p
                                        className={clsx(
                                            "font-mono text-sm text-red-900 dark:text-red-300 break-all",
                                        )}
                                    >
                                        <strong>Mensaje:</strong>{" "}
                                        {error.message}
                                    </p>
                                </div>
                                {error.stack && (
                                    <div>
                                        <p
                                            className={clsx(
                                                "font-mono text-xs text-red-800 dark:text-red-400 whitespace-pre-wrap break-all",
                                            )}
                                        >
                                            <strong>Pila de ejecución:</strong>
                                            {"\n"}
                                            {error.stack}
                                        </p>
                                    </div>
                                )}
                                {errorInfo && errorInfo.componentStack && (
                                    <div>
                                        <p
                                            className={clsx(
                                                "font-mono text-xs text-red-800 dark:text-red-400 whitespace-pre-wrap break-all",
                                            )}
                                        >
                                            <strong>
                                                Pila de componentes:
                                            </strong>
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
                        type="button"
                        onClick={onReset}
                        className={clsx(
                            "error-fallback-try-again-button px-6 py-3 min-h-[44px] rounded-xl transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/30",
                        )}
                    >
                        Reintentar
                    </button>
                    <button
                        type="button"
                        onClick={() =>
                            (window.location.href = "/myprojectapi12/")
                        }
                        className={clsx("error-fallback-home-button px-6 py-3 min-h-[44px] rounded-xl transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/30")}
                    >
                        Ir al Inicio
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ErrorFallback;
