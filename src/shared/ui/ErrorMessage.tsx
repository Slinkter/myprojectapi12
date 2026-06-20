import { memo } from "react";
import { cn } from "@/shared/lib/cn";
import { HiExclamationCircle } from "react-icons/hi2";
import { useLogLifecycle } from "@/shared/hooks";

interface IErrorMessageProps {
  message: string;
  title?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

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
  }: IErrorMessageProps) => {
    useLogLifecycle("ErrorMessage");
    return (
      <div
        className={cn(
          "error-message bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4",
          className,
        )}
        role="alert"
      >
        <div className={cn("flex items-start")}>
          <div className={cn("shrink-0")}>
            <HiExclamationCircle className="h-5 w-5 text-red-400" aria-hidden="true" />
          </div>
          <div className={cn("ml-3 flex-1")}>
            <h3
              className={cn(
                "text-sm font-medium text-red-800 dark:text-red-200",
              )}
            >
              {title}
            </h3>
            <p className={cn("mt-1 text-sm text-red-700 dark:text-red-300")}>
              {message}
            </p>
            {action && (
              <button
                type="button"
                onClick={action.onClick}
                className={cn(
                  "mt-3 text-sm font-medium text-red-600 dark:text-red-400 hover:text-red-500 dark:hover:text-red-300 transition-colors",
                )}
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

