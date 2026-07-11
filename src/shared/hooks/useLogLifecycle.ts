import { useEffect, useRef } from 'react';

/** Formatea un tiempo en milisegundos a una representación legible (μs, ms, o s). @param ms - Tiempo en milisegundos. @returns Cadena formateada con la unidad correspondiente. @example formatTime(0.5) // => '500μs' */
const formatTime = (ms: number) => {
  if (ms < 1) return `${(ms * 1000).toFixed(0)}μs`;
  if (ms < 1000) return `${ms.toFixed(1)}ms`;
  return `${(ms / 1000).toFixed(2)}s`;
};

/** Hook personalizado que registra en consola el ciclo de vida de un componente (montaje, renderizado y desmontaje) para depuración. @param name - Nombre identificador del componente a monitorear. @example useLogLifecycle('ProductList'); */
export const useLogLifecycle = (name: string) => {
  const mountTimeRef = useRef(0);
  const renderCountRef = useRef(0);
  
  useEffect(() => {
    mountTimeRef.current = performance.now();
    renderCountRef.current = 1;
    console.log(`[LIFECYCLE] 🟢 MOUNT: ${name}`);
    
    return () => {
      console.log(`[LIFECYCLE] 🔴 UNMOUNT: ${name} (lived ${formatTime(performance.now() - mountTimeRef.current)})`);
    };
  }, [name]);
  
  useEffect(() => {
    renderCountRef.current += 1;
    if (renderCountRef.current > 1) {
      console.log(`[LIFECYCLE] 🔄 RENDER #${renderCountRef.current}: ${name} (+${formatTime(performance.now() - mountTimeRef.current)})`);
    }
  });
};

/** Hook personalizado que registra en consola el estado de una petición API (carga, éxito o error) para depuración. @param name - Nombre identificador de la petición. @param isLoading - Indica si la petición está en curso. @param data - Datos recibidos de la petición. @param error - Error de la petición, si existe. @example useApiDebug('FetchProducts', isLoading, data, error); */
export const useApiDebug = (name: string, isLoading: boolean, data: unknown, error: Error | null) => {
  const startTimeRef = useRef(0);
  
  useEffect(() => {
    startTimeRef.current = performance.now();
  }, []);
  
  useEffect(() => {
    if (isLoading) {
      console.log(`[API] ⏳ ${name}: Loading...`);
    } else if (error) {
      console.log(`[API] ❌ ${name}: Error - ${error.message}`);
    } else if (data) {
      console.log(`[API] ✅ ${name}: Data received (+${formatTime(performance.now() - startTimeRef.current)})`);
    }
  }, [isLoading, data, error, name]);
};
