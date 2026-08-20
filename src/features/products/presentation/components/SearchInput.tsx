/**
 * @file SearchInput.tsx
 * @description Componente de campo de búsqueda con icono, botón de limpieza y soporte para transiciones concurrentes.
 * @architecture Presentation Layer - Componente de Feature
 */

import { useCallback, useTransition } from "react";
import { useLogLifecycle } from "@/shared/hooks";
import { Search, X } from "lucide-react";

/**
 * @interface ISearchInputProps
 * @description Propiedades del componente SearchInput.
 */
export interface ISearchInputProps {
    /** Valor actual del campo de búsqueda. */
    value: string;
    /** Callback que se dispara al escribir en el input. */
    onChange: (value: string) => void;
    /** Texto placeholder del input. */
    placeholder?: string;
    /** Estilos CSS en línea adicionales. */
    style?: React.CSSProperties;
    /** Clases CSS adicionales. */
    className?: string;
    /** Indicador opcional de transición o carga pendiente. */
    isPending?: boolean;
}

/**
 * Input de búsqueda con icono y botón de limpieza optimizado para React concurrente.
 *
 * @remarks
 * Muestra un campo de texto con icono de búsqueda (lupa) a la izquierda
 * y un botón "X" a la derecha cuando hay texto ingresado.
 * Integra `useTransition` para asegurar que las actualizaciones de búsqueda no bloqueen la interfaz.
 *
 * @component
 * @param {ISearchInputProps} props - Propiedades del componente.
 * @returns {JSX.Element} Elemento JSX del input de búsqueda.
 */
export function SearchInput({
    value,
    onChange,
    placeholder = "Buscar productos...",
    style,
    className,
    isPending: externalIsPending,
}: ISearchInputProps) {
    useLogLifecycle("SearchInput");
    const [isPendingInternal, startTransition] = useTransition();
    const isPending = externalIsPending ?? isPendingInternal;

    const handleClear = useCallback(() => {
        startTransition(() => {
            onChange("");
        });
    }, [onChange]);

    return (
        <div className={`relative ${className ?? ""}`} style={style}>
            <Search
                size={16}
                className={`absolute left-3 top-1/2 -translate-y-1/2 transition-colors ${
                    isPending ? "text-primary animate-pulse" : "text-slate-400"
                }`}
            />
            <input
                type="text"
                value={value}
                onChange={(e) => {
                    const nextValue = e.target.value;
                    onChange(nextValue);
                }}
                placeholder={placeholder}
                aria-label="Buscar productos"
                className="flex h-10 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm pl-9 pr-9 ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-ring disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
            />
            {value && (
                <button
                    type="button"
                    onClick={handleClear}
                    className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex items-center justify-center rounded-full text-sm font-medium h-10 w-10 hover:bg-accent hover:text-accent-foreground text-muted-foreground cursor-pointer border-none bg-transparent transition-colors focus-ring"
                    aria-label="Limpiar búsqueda"
                >
                    <X size={14} />
                </button>
            )}
        </div>
    );
}
