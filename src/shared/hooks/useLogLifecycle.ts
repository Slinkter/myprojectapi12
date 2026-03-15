import { useEffect, useRef } from 'react';

const formatTime = (ms: number) => {
  if (ms < 1) return `${(ms * 1000).toFixed(0)}μs`;
  if (ms < 1000) return `${ms.toFixed(1)}ms`;
  return `${(ms / 1000).toFixed(2)}s`;
};

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
