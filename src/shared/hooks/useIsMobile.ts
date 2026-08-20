/**
 * @file useIsMobile.ts
 * @description Hook para detectar si el viewport corresponde a un dispositivo móvil.
 * Usa `matchMedia` con el breakpoint `md` de Tailwind (768px) y reacciona a cambios
 * dinámicos de tamaño (rotación de pantalla, tablets).
 */

import { useEffect, useState } from "react";

/** Media query equivalente al breakpoint `md` de Tailwind (viewport menor a 768px). */
const MOBILE_QUERY = "(max-width: 767px)";

/**
 * Indica si el viewport actual corresponde a un dispositivo móvil.
 *
 * @remarks
 * Seguro para SSR: devuelve `false` si `window` no está disponible al primer render.
 * Se actualiza en vivo cuando el ancho cruza el breakpoint (por ejemplo, al rotar
 * la pantalla o al usar el modo multitarea en tablets).
 *
 * @returns {boolean} `true` si el viewport es móvil, `false` en caso contrario.
 */
export function useIsMobile(): boolean {
    const [isMobile, setIsMobile] = useState<boolean>(() =>
        typeof window !== "undefined"
            ? window.matchMedia(MOBILE_QUERY).matches
            : false
    );

    useEffect(() => {
        const mql = window.matchMedia(MOBILE_QUERY);
        const handleChange = (event: MediaQueryListEvent) =>
            setIsMobile(event.matches);

        setIsMobile(mql.matches);
        mql.addEventListener("change", handleChange);
        return () => mql.removeEventListener("change", handleChange);
    }, []);

    return isMobile;
}