import { useState, useEffect } from 'react'

/** Hook personalizado que retrasa la actualización de un valor hasta que transcurre un tiempo sin nuevos cambios. Útil para evitar operaciones costosas (como llamadas API) mientras el usuario escribe. @template T - Tipo del valor a debouncer. @param value - Valor que se desea debouncer. @param delayMs - Tiempo de espera en milisegundos (por defecto 300ms). @returns Valor debouncer que se actualiza tras el período de retraso. @example const searchTerm = useDebounce(searchInput, 500); */
export function useDebounce<T>(value: T, delayMs: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delayMs)
    return () => clearTimeout(timer)
  }, [value, delayMs])

  return debouncedValue
}
