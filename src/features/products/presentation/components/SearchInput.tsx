import { useCallback } from "react";
import { useLogLifecycle } from "@/shared/hooks";
import { TextField, IconButton } from "@radix-ui/themes";
import { MagnifyingGlassIcon, Cross1Icon } from "@radix-ui/react-icons";

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
        <TextField.Root
            size="3"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            style={style}
            aria-label="Buscar productos"
        >
            <TextField.Slot>
                <MagnifyingGlassIcon height="16" width="16" />
            </TextField.Slot>
            {value && (
                <TextField.Slot side="right">
                    <IconButton
                        size="1"
                        variant="ghost"
                        color="gray"
                        onClick={handleClear}
                        style={{ cursor: "pointer" }}
                        aria-label="Limpiar búsqueda"
                    >
                        <Cross1Icon height="16" width="16" />
                    </IconButton>
                </TextField.Slot>
            )}
        </TextField.Root>
    );
}
