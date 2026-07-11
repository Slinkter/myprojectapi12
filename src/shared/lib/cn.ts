import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/** Función utilitaria que combina clases de Tailwind CSS sin conflictos. Une `clsx` y `tailwind-merge` para resolver clases contradictorias. @param inputs - Lista de valores de clase (strings, objetos, arrays). @returns Cadena de clases CSS optimizada y sin conflictos. @example cn('px-4', 'px-2') // => 'px-2' */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}
