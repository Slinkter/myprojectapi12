import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Utility function to merge Tailwind CSS classes conditionally.
 *
 * @remarks
 * This function combines `clsx` for conditional class joining and `tailwind-merge`
 * to handle CSS conflict resolution (e.g., overriding `p-4` with `p-2`).
 *
 * @param inputs - Array of class values (strings, objects, arrays, etc.)
 * @returns A single string of merged CSS classes.
 *
 * @example
 * ```typescript
 * <div className={cn('p-4', isActive && 'bg-blue-500', customClass)} />
 * ```
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
