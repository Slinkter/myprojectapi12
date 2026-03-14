# 🧪 Plan de Testing: MyProjectAPI12

Este documento establece la estrategia, herramientas y estándares para las pruebas automatizadas en MyProjectAPI12, cubriendo desde la lógica de negocio pura hasta los componentes de la interfaz de usuario.

---

## 🎯 Objetivos
- **Garantizar la Integridad:** Asegurar que los cambios no rompan la funcionalidad existente.
- **Validar el Dominio:** Confirmar que las reglas de negocio (precios, stock, validaciones) son 100% correctas.
- **Accesibilidad y UX:** Verificar que los componentes UI sean accesibles y respondan correctamente a la interacción del usuario.
- **Mantenibilidad:** Facilitar la refactorización con una red de seguridad de tests.

---

## 🛠️ Stack Tecnológico
- **Vitest:** Test runner ultra-rápido integrado con Vite.
- **React Testing Library (RTL):** Para pruebas de componentes centradas en el comportamiento del usuario.
- **Mock Service Worker (MSW) / Vi.mock:** Para interceptar llamadas a APIs externas.
- **Factory Pattern:** Uso de `productFactory.ts` para generar datos de prueba consistentes.

---

## 🏗️ Niveles de Testing (Estrategia DDD + FSD)

### ¿Qué se testea y dónde?

En este proyecto, diferenciamos claramente entre la lógica pura (funciones) y la interfaz (componentes) para mantener un código limpio y fácil de mantener.

| Tipo de Prueba | ¿Qué se testea? | Ubicación Recomendada | Herramientas |
| :--- | :--- | :--- | :--- |
| **Pruebas Unitarias (Funciones)** | Lógica de negocio pura, cálculos, validaciones, mappers y utilidades. | `src/features/*/domain/__tests__` | Vitest |
| **Pruebas de Integración (Hooks)** | Orquestación de estado, efectos y lógica de React. | `src/features/*/application/__tests__` | RTL (`renderHook`) |
| **Pruebas de Componentes (UI)** | Renderizado, eventos de usuario y accesibilidad. | `src/components/ui/*.test.tsx` o `src/features/*/presentation/__tests__` | RTL + Vitest |

---

### 1. Capa de Dominio (Pure Logic)
**Foco:** Funciones puras, utilidades y validaciones de negocio.
- **Archivos:** `src/features/*/domain/*.ts`
- **Técnica:** Unit Testing con Vitest.
- **Cobertura Objetivo:** 100%.
- **Ejemplo:** Pruebas de `calculateTotal` o `validateStock`.

### 2. Capa de Aplicación (Hooks & Context)
**Foco:** Orquestación de estado, efectos secundarios y lógica de React.
- **Archivos:** `src/features/*/application/*.tsx` y `src/features/*/hooks/*.ts`
- **Técnica:** Integration Testing usando `renderHook` de RTL.
- **Ejemplo:** Verificar que `addToCart` actualiza el estado global y dispara notificaciones (toasts).

### 3. Capa de Presentación (UI Components)
**Foco:** Renderizado, accesibilidad y eventos de usuario.
- **Archivos:** `src/components/ui/*.tsx`, `src/features/*/presentation/*.tsx`
- **Técnica:** Component Testing con RTL.
- **Estándar:** Buscar elementos por rol (`getByRole`) para asegurar accesibilidad.

---

## 📝 Guía de Implementación

### Estructura de Archivos
Los archivos de test deben ubicarse en carpetas `__tests__` adyacentes al código fuente o usar el sufijo `.test.tsx` / `.spec.tsx`.

### Ejemplo: Test de Función de Dominio (`.ts`)
```typescript
import { describe, it, expect } from 'vitest';
import { sum } from './mathUtils';

describe('mathUtils', () => {
  it('debería sumar dos números correctamente', () => {
    expect(sum(2, 2)).toBe(4);
  });
});
```

### Ejemplo: Test de Componente UI (`.tsx`)
```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
  it('ejecuta el onClick cuando se hace clic', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click</Button>);
    fireEvent.click(screen.getByRole('button', { name: /click/i }));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

---

## 🚀 Ejecución y Reportes
- `pnpm test`: Ejecuta todos los tests.
- `pnpm test:ui`: Abre el dashboard visual de Vitest.
- `pnpm test:coverage`: Genera un reporte detallado de cobertura en la carpeta `coverage/`.

---

## ⚠️ Reglas de Oro
1. **No testear detalles de implementación:** Testear el "qué" (comportamiento), no el "cómo" (estado interno).
2. **Mocking selectivo:** Mockear solo servicios externos (APIs) o librerías pesadas. No mockear lógica interna del proyecto.
3. **Factories sobre Fixtures:** Usar `makeProduct()` en lugar de objetos JSON estáticos para mantener los tipos actualizados.
