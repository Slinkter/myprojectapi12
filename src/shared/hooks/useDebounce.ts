import { useState, useEffect } from 'react'

/**
 * Delays updating a value until a specified amount of time has passed without new changes.
 * This is useful when you want to wait for the user to stop typing or interacting before
 * performing an expensive operation (like making an API call).
 * 
 * @param value - The value you want to debounce (any type)
 * @param delayMs - The time to wait in milliseconds before updating the debounced value (default: 300ms)
 * @returns The debounced value that updates after the delay period has passed
 * 
 * @example
 * // Basic usage - waits 300ms after last change
 * const searchTerm = useDebounce(searchInput);
 * 
 * @example
 * // Custom delay - waits 1 second
 * const searchTerm = useDebounce(searchInput, 1000);
 * 
 * @example
 * // Using with API calls
 * const [query, setQuery] = useState('');
 * const debouncedQuery = useDebounce(query, 500);
 * 
 * useEffect(() => {
 *   if (debouncedQuery) {
 *     searchAPI(debouncedQuery); // Only searches after user stops typing
 *   }
 * }, [debouncedQuery]);
 */
export function useDebounce<T>(value: T, delayMs: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delayMs)
    return () => clearTimeout(timer)
  }, [value, delayMs])

  return debouncedValue
}
