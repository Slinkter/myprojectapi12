import { useState, useCallback } from "react";
import { useLogLifecycle } from "@/shared/hooks";
import { HiOutlineMagnifyingGlass, HiOutlineXMark } from "react-icons/hi2";
import { cn } from "@/shared/lib/cn";
import { Button } from "@/shared/ui/Button";

interface ISearchInputProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
}

export function SearchInput({
    value,
    onChange,
    placeholder = "Buscar productos...",
    className,
}: ISearchInputProps) {
    useLogLifecycle("SearchInput");
    const [isFocused, setIsFocused] = useState(false);

    const handleClear = useCallback(() => {
        onChange("");
    }, [onChange]);

    return (
        <div
            className={cn(
                "relative flex items-center rounded-xl transition-all duration-200",
                "border bg-background",
                isFocused
                    ? "border-primary ring-2 ring-primary/30"
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
                type="search"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder={placeholder}
                className={cn(
                    "w-full h-12 pl-12 pr-12 rounded-xl",
                    "bg-transparent",
                    "text-foreground",
                    "placeholder:text-muted-foreground",
                    "focus:outline-none",
                    "transition-all duration-200",
                )}
                aria-label="Buscar productos"
            />
            {value && (
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleClear}
                    className="absolute right-2 h-8 w-8 rounded-full hover:bg-muted cursor-pointer focus-visible:ring-2 focus-visible:ring-primary"
                    aria-label="Limpiar búsqueda"
                >
                    <HiOutlineXMark className="w-4 h-4" />
                </Button>
            )}
        </div>
    );
}
