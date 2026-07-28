import { useCallback } from "react";
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
}

/**
 * Input de búsqueda con icono y botón de limpieza.
 *
 * @remarks
 * Muestra un campo de texto con icono de búsqueda (lupa) a la izquierda
 * y un botón "X" a la derecha cuando hay texto ingresado.
 * El botón de limpieza es aria-accessible.
 *
 * @component
 * @param props.value - Valor controlado del input.
 * @param props.onChange - Callback al escribir (recibe el nuevo string).
 * @param props.placeholder - Placeholder opcional (default: "Buscar productos...").
 * @param props.style - Estilos CSS opcionales.
 * @param props.className - Clases CSS opcionales.
 * @returns Elemento JSX del input de búsqueda.
 */
export function SearchInput({
    value,
    onChange,
    placeholder = "Buscar productos...",
    style,
    className,
}: ISearchInputProps) {
    useLogLifecycle("SearchInput");

    const handleClear = useCallback(() => {
        onChange("");
    }, [onChange]);

    return (
        <div className={`relative ${className ?? ''}`} style={style}>
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
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
