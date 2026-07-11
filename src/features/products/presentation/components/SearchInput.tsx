import { useCallback } from "react";
import { useLogLifecycle } from "@/shared/hooks";
import { Search, X } from "lucide-react";

interface ISearchInputProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    style?: React.CSSProperties;
}

export function SearchInput({
    value,
    onChange,
    placeholder = "Buscar productos...",
    style,
}: ISearchInputProps) {
    useLogLifecycle("SearchInput");

    const handleClear = useCallback(() => {
        onChange("");
    }, [onChange]);

    return (
        <div className="relative" style={style}>
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                aria-label="Buscar productos"
                className="flex h-10 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm pl-9 pr-9 ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/30 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
            />
            {value && (
                <button
                    type="button"
                    onClick={handleClear}
                    className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex items-center justify-center rounded-full text-sm font-medium h-10 w-10 hover:bg-accent hover:text-accent-foreground text-muted-foreground cursor-pointer border-none bg-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/30"
                    aria-label="Limpiar búsqueda"
                >
                    <X size={14} />
                </button>
            )}
        </div>
    );
}
