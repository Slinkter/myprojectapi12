/**
 * @file useLocalStorage.ts
 * @description Hook genérico para sincronizar estado de React con localStorage.
 * @architecture Shared Hooks Layer
 */

import { useState, useEffect, useCallback } from "react";

/**
 * Hook personalizado para manejar lectura y escritura sincrónica/reactiva en localStorage.
 *
 * @template T
 * @param key Clave bajo la cual guardar el valor en localStorage.
 * @param initialValue Valor inicial por defecto si no existe un valor previo en localStorage.
 * @returns Tuple con el estado actual y la función setter.
 */
export function useLocalStorage<T>(key: string, initialValue: T | (() => T)): [T, (value: T | ((val: T) => T)) => void] {
    const [storedValue, setStoredValue] = useState<T>(() => {
        try {
            const item = window.localStorage.getItem(key);
            if (item !== null) {
                return JSON.parse(item);
            }
            return initialValue instanceof Function ? initialValue() : initialValue;
        } catch (error) {
            console.error(`Error reading localStorage key "${key}":`, error);
            return initialValue instanceof Function ? initialValue() : initialValue;
        }
    });

    useEffect(() => {
        try {
            window.localStorage.setItem(key, JSON.stringify(storedValue));
        } catch (error) {
            console.error(`Error setting localStorage key "${key}":`, error);
        }
    }, [key, storedValue]);

    const setValue = useCallback(
        (value: T | ((val: T) => T)) => {
            setStoredValue((prev) => (value instanceof Function ? value(prev) : value));
        },
        []
    );

    useEffect(() => {
        const handleStorageChange = (event: StorageEvent) => {
            if (event.key === key && event.newValue !== null) {
                try {
                    setStoredValue(JSON.parse(event.newValue));
                } catch (error) {
                    console.error(`Error parsing updated storage for key "${key}":`, error);
                }
            }
        };

        window.addEventListener("storage", handleStorageChange);
        return () => window.removeEventListener("storage", handleStorageChange);
    }, [key]);

    return [storedValue, setValue];
}
