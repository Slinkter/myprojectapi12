/**
 * @file ErrorMessage.tsx
 * @description Componente de alerta para mostrar mensajes de error.
 * Soporta título, mensaje y una acción opcional (ej. reintentar).
 * @architecture Presentation Layer - Common Components
 */
import { memo } from "react";
import { cn } from "@/lib/utils";

/**
 * @interface ErrorMessageProps
 * @description Propiedades para el componente ErrorMessage.
 */
interface ErrorMessageProps {
    /** El texto del mensaje de error a mostrar */
    message: string;
    /** Título opcional para la alerta. Por defecto es "Error" */
    title?: string;
    /** Configuración opcional del botón de acción */
    action?: {
        label: string;
        onClick: () => void;
    };
    /** Clases CSS adicionales */
    className?: string;
}

// Elevar el icono SVG estático fuera del componente para evitar recreaciones
const ErrorIcon = (
    <svg
        className={cn("h-5 w-5 text-red-400")}
        viewBox="0 0 20 20"
        fill="currentColor"
        aria-hidden="true"
    >
        <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
            clipRule="evenodd"
        />
    </svg>
);

/**
 * @component ErrorMessage
 * @description Renderiza una alerta de error con un botón de acción opcional.
 * 
 * @param {ErrorMessageProps} props - Las propiedades del componente.
 * @returns {JSX.Element} La alerta con el mensaje de error.
 */
const ErrorMessage = memo(
    ({
        message,
        title = "Error",
        action,
        className = "",
    }: ErrorMessageProps) => {
        return (
            <div
                className={cn(
                    "error-message bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4",
                    className
                )}
                role="alert"
            >
                <div className={cn("flex items-start")}>
                    <div className={cn("flex-shrink-0")}>{ErrorIcon}</div>
                    <div className={cn("ml-3 flex-1")}>
                        <h3 className={cn("text-sm font-medium text-red-800 dark:text-red-200")}>
                            {title}
                        </h3>
                        <p className={cn("mt-1 text-sm text-red-700 dark:text-red-300")}>
                            {message}
                        </p>
                        {action && (
                            <button
                                onClick={action.onClick}
                                className={cn("mt-3 text-sm font-medium text-red-600 dark:text-red-400 hover:text-red-500 dark:hover:text-red-300 transition-colors")}
                            >
                                {action.label}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        );
    },
);

ErrorMessage.displayName = "ErrorMessage";

export default ErrorMessage;
