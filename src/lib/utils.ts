import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Función de utilidad para fusionar clases de Tailwind CSS condicionalmente.
 *
 * @remarks
 * Esta función combina `clsx` para la unión condicional de clases y `tailwind-merge`
 * para manejar la resolución de conflictos de CSS (por ejemplo, sobrescribir `p-4` con `p-2`).
 *
 * @param inputs - Array de valores de clase (strings, objetos, arrays, etc.)
 * @returns Una cadena única de clases CSS fusionadas.
 *
 * @example
 * ```typescript
 * <div className={cn('p-4', isActive && 'bg-blue-500', customClass)} />
 * ```
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
