import { useState, useCallback } from "react";
import { HiOutlineMagnifyingGlass, HiOutlineXMark } from "react-icons/hi2";
import { cn } from "@/shared/lib/cn";
import { Button } from "@/shared/ui/Button";

interface SearchInputProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
}

/**
 * Barra de búsqueda con ring de foco correcto:
 * el wrapper comparte el mismo border-radius que el input para que
 * el focus-ring se vea redondeado (no rectangular).
 */
export function SearchInput({
    value,
    onChange,
    placeholder = "Buscar productos...",
    className,
}: SearchInputProps) {
    const [isFocused, setIsFocused] = useState(false);

    const handleClear = useCallback(() => {
        onChange("");
    }, [onChange]);

    return (
        /* Wrapper: rounded-xl coincide con el input → ring también queda redondeado */
        <div
            className={cn(
                "relative flex items-center rounded-xl transition-all duration-200",
                "border bg-secondary",
                isFocused
                    ? "border-primary ring-2 ring-primary/30 shadow-sm"
                    : "border-border hover:border-primary/40",
                className,
            )}
        >
            <HiOutlineMagnifyingGlass
                className={cn(
                    "absolute left-4 w-5 h-5 pointer-events-none transition-colors duration-200",
                    isFocused ? "text-primary" : "text-muted-foreground",
                )}
            />
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder={placeholder}
                className={cn(
                    "w-full h-12 pl-12 pr-12 rounded-xl",
                    "bg-transparent" /* el fondo viene del wrapper */,
                    "text-foreground",
                    "placeholder:text-muted-foreground",
                    "focus:outline-none" /* quitamos el outline nativo */,
                    "transition-all duration-200",
                )}
                aria-label="Buscar productos"
            />
            {value && (
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleClear}
                    className="absolute right-2 h-8 w-8 rounded-full hover:bg-accent hover:text-foreground"
                    aria-label="Limpiar búsqueda"
                >
                    <HiOutlineXMark className="w-4 h-4" />
                </Button>
            )}
        </div>
    );
}
