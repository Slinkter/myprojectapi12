# Plan de Refactorización - MyProjectAPI12

## 📋 Resumen Ejecutivo

Este plan está diseñado para que un desarrollador junior pueda:
1. **Entender la estructura actual** del proyecto
2. **Ejecutar las refactorizaciones** de forma ordenada
3. **Verificar requisitos funcionales y no funcionales** después de cada cambio

---

## 🎯 Fases del Plan

### Fase 1: Limpieza de Documentación (30 min)

**Objetivo**: Mover archivos de documentación fuera de `src/`

| # | Tarea | Archivos afectados | Verificación |
|---|-------|-------------------|---------------|
| 1.1 | Mover `src/docs/` a raíz del proyecto | 20+ archivos markdown | `ls docs/` en raíz |
| 1.2 | Eliminar `src/docs/AGENTS.md` duplicado | 1 archivo | `src/docs/` no existe |

**Comandos**:
```bash
# Windows (PowerShell)
Move-Item -Path "src/docs/*" -Destination "docs/" -Force
Remove-Item -Path "src/docs" -Recurse -Force
```

---

### Fase 2: Eliminar Duplicación de Código (1 hora)

**Objetivo**: Unificar `stockUtils` que está duplicado

#### 2.1 - Consolidar stockUtils

**Ubicaciones duplicadas**:
- `src/shared/lib/stockUtils.ts` ✅ (mantener - es la versión compartida)
- `src/features/products/domain/stockUtils.ts` ❌ (eliminar)

**Pasos**:
1. Verificar que todos los imports usen `src/shared/lib/stockUtils.ts`
2. Eliminar `src/features/products/domain/stockUtils.ts`
3. Mover tests a ubicación correcta

**Verificar**:
```bash
# Buscar imports que apunten a la versión a eliminar
grep -r "features/products/domain/stockUtils" src/
```

---

### Fase 3: Eliminar Widgets Duplicados (2 horas)

**Objetivo**: Consolidar componentes que existen en dos lugares

#### 3.1 - CartDrawer
- `src/widgets/CartDrawer/` → eliminar
- `src/features/cart/presentation/` → mantener

#### 3.2 - ProductCard  
- `src/widgets/ProductCard/` → eliminar
- `src/features/products/presentation/ProductCard.tsx` → mantener

#### 3.3 - ProductGrid
- `src/widgets/ProductGrid/` → eliminar
- `src/features/products/presentation/ProductGrid.tsx` → mantener

#### 3.4 - Navbar
- `src/widgets/Navbar/` → eliminar
- `src/components/common/` o crear en `features/`

**Comandos**:
```bash
Remove-Item -Path "src/widgets/CartDrawer" -Recurse -Force
Remove-Item -Path "src/widgets/ProductCard" -Recurse -Force
Remove-Item -Path "src/widgets/ProductGrid" -Recurse -Force
Remove-Item -Path "src/widgets/Navbar" -Recurse -Force
```

**Verificación post-eliminación**:
```bash
pnpm build
```

---

### Fase 4: Corregir Manejo de Errores (30 min)

**Objetivo**: Eliminar catch vacíos que silencian errores

#### 4.1 - CartContext.tsx:65
```typescript
// ANTES (problema)
catch { }

// DESPUÉS (mejor)
catch (error) {
  console.error("Error loading cart:", error);
}
```

#### 4.2 - apiClient.ts:60
```typescript
// ANTES (problema)
catch { }

// DESPUÉS (mejor)
catch (error) {
  console.error("Error parsing response:", error);
}
```

---

### Fase 5: Agregar Headers de Seguridad (30 min)

**Objetivo**: Mejorar seguridad del proyecto

#### 5.1 - index.html
Agregar en `<head>`:
```html
<meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';">
<meta http-equiv="X-Frame-Options" content="DENY">
<meta http-equiv="X-Content-Type-Options" content="nosniff">
<meta http-equiv="Referrer-Policy" content="strict-origin-when-cross-origin">
```

---

### Fase 6: Configuración de Desarrollo (1 hora)

**Objetivo**: Agregar herramientas que mejoran DX

#### 6.1 - Crear .env.example
```
VITE_API_URL=https://dummyjson.com/products
VITE_APP_TITLE=My E-Commerce
```

---

## ✅ Checklist de Verificación

### Requisitos No Funcionales

| Requisito | Cómo verificar | Criterio |
|-----------|---------------|----------|
| **Rendimiento** | `pnpm build` + bundle size | < 200KB gzipped |
| **TypeScript** | `pnpm type-check` | Sin errores |
| **Linting** | `pnpm lint` | Sin errores |
| **Tests** | `pnpm test -- --run` | > 80% coverage |
| **Accesibilidad** | Lighthouse | > 90 score |

### Requisitos Funcionales

| Feature | Test manual |
|---------|-------------|
| Carrito | Agregar producto → verificar total |
| Checkout | Completar compra → verificar éxito |
| Dark mode | Toggle → verificar cambio |
| Búsqueda | Buscar producto → verificar resultados |
| Infinite scroll | Scroll → cargar más productos |

---

## 📊 Orden de Prioridad

```
1. Limpiar documentación (rápido, bajo riesgo)
2. Corregir catch vacíos (bajo riesgo)
3. Eliminar stockUtils duplicado (medio riesgo)
4. Eliminar widgets duplicados (alto riesgo - requiere testing)
5. Agregar headers de seguridad (bajo riesgo)
6. Configuración de desarrollo (opcional)
```

---

## 🚀 Comandos de Verificación Final

```bash
# Verificar que todo funcione
pnpm lint
pnpm type-check  
pnpm test -- --run
pnpm build

# Verificar en navegador
pnpm dev
```
