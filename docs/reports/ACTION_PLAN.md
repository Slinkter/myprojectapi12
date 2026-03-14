# Plan de Acción - MyProjectAPI12

**Fecha:** 5 de Febrero, 2026  
**Objetivo:** Mejorar calidad del código en fases pequeñas y manejables

---

## 📋 Índice de Fases

- [Fase 1: Limpieza CSS](#fase-1-limpieza-css) - 30 min ⚡
- [Fase 2: Refactorizar JSDoc](#fase-2-refactorizar-jsdoc) - 2 horas 📝
- [Fase 3: Desacoplar CartContext](#fase-3-desacoplar-cartcontext) - 1.5 horas 🔧
- [Fase 4: Mejorar Testing](#fase-4-mejorar-testing) - 4 horas 🧪
- [Fase 5: Optimización CSS](#fase-5-optimización-css) - 2 horas 🎨
- [Fase 6: TypeScript Setup](#fase-6-typescript-setup) - 3 horas 📘
- [Fase 7: Accessibility](#fase-7-accessibility) - 2 horas ♿

---

## Fase 1: Limpieza CSS

**Prioridad:** 🔴 ALTA  
**Tiempo estimado:** 30 minutos  
**Complejidad:** Baja

### Objetivos

- Eliminar duplicados de CSS
- Consolidar clases similares
- Remover variables no usadas

### Tareas

#### 1.1 Eliminar duplicados de `.skeleton-card`

- **Archivo:** `src/index.css`
- **Líneas:** 429-458, 463-492, 496-525
- **Acción:** Mantener solo una definición (líneas 429-458)
- **Tiempo:** 5 min

#### 1.2 Eliminar duplicados de `.product-detail-modal-card`

- **Archivo:** `src/index.css`
- **Líneas:** 343-372, 386-415
- **Acción:** Mantener solo una definición (líneas 343-372)
- **Tiempo:** 5 min

#### 1.3 Consolidar botones similares

- **Clases afectadas:**
    - `.product-add-to-cart-button`
    - `.product-detail-add-to-cart-button`
    - `.cart-checkout-button`
    - `.checkout-pay-button`
- **Acción:** Crear clase base `.btn-primary` y extender
- **Tiempo:** 10 min

#### 1.4 Remover variables CSS no usadas

- **Variable:** `--neumo-shadow-dark` (línea 30)
- **Acción:** Verificar uso y eliminar si no se usa
- **Tiempo:** 5 min

#### 1.5 Verificación

- **Comando:** `pnpm build`
- **Validar:** Sin errores de CSS
- **Tiempo:** 5 min

### ✅ Criterios de Éxito

- [ ] 0 duplicados en CSS
- [ ] Build exitoso
- [ ] Tamaño de CSS reducido

---

## Fase 2: Refactorizar JSDoc

**Prioridad:** 🟡 MEDIA  
**Tiempo estimado:** 2 horas  
**Complejidad:** Media

### Objetivos

- JSDoc más conciso y directo
- Reducir comentarios innecesarios
- Mantener solo información esencial

### Principios para JSDoc Mejorado

```javascript
// ❌ ANTES - Demasiado verboso
/**
 * Componente proveedor del carrito que gestiona el estado y las operaciones del carrito de compras.
 *
 * Características:
 * - Añadir productos al carrito (crea una nueva entrada o aumenta la cantidad)
 * - Eliminar productos del carrito
 * - Vaciar todo el carrito
 * - Calcular el precio total automáticamente
 * - Gestionar la visibilidad del cajón del carrito (abrir/cerrar/alternar)
 * - Mostrar notificaciones toast para las acciones del carrito
 * - Optimizado con useMemo y useCallback para prevenir re-renderizados innecesarios
 *
 * @component
 * @param {Object} props
 * @param {React.ReactNode} props.children - Componentes hijos que tendrán acceso al contexto del carrito
 * @returns {JSX.Element} Componente proveedor que envuelve a los hijos
 *
 * @example
 * // Envuelve tu aplicación con CartProvider
 * <CartProvider>
 *   <App />
 * </CartProvider>
 */

// ✅ DESPUÉS - Conciso y directo
/**
 * Proveedor del contexto del carrito de compras.
 * Gestiona estado global: items, total, y visibilidad del drawer.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Componentes hijos
 */
```

### Tareas

#### 2.1 Refactorizar CartContext.jsx

- **Archivo:** `src/features/cart/application/CartContext.jsx`
- **Acción:** Reducir JSDoc a lo esencial
- **Líneas afectadas:** 1-203
- **Tiempo:** 30 min

#### 2.2 Refactorizar main.jsx

- **Archivo:** `src/main.jsx`
- **Acción:** Simplificar comentarios de archivo
- **Tiempo:** 10 min

#### 2.3 Refactorizar App.jsx

- **Archivo:** `src/App.jsx`
- **Acción:** JSDoc más directo
- **Tiempo:** 10 min

#### 2.4 Crear guía de JSDoc

- **Archivo:** `docs/JSDOC_GUIDE.md`
- **Acción:** Documentar estándares del proyecto
- **Tiempo:** 20 min

#### 2.5 Aplicar a otros archivos

- **Archivos:** Componentes en `src/features/`
- **Acción:** Aplicar nuevos estándares
- **Tiempo:** 50 min

### ✅ Criterios de Éxito

- [ ] JSDoc reducido en 50%
- [ ] Información esencial mantenida
- [ ] Guía de estándares creada
- [ ] 0 errores de lint

---

## Fase 3: Desacoplar CartContext

**Prioridad:** 🟡 MEDIA  
**Tiempo estimado:** 1.5 horas  
**Complejidad:** Media

### Objetivos

- Separar lógica de negocio de la presentación
- Crear hooks personalizados
- Reducir tamaño de archivos

### Estructura Propuesta

```text
features/cart/
├─ application/
│  ├─ CartContext.jsx          (solo Context y Provider)
│  ├─ useCart.js               (hook para consumir context)
│  └─ hooks/
│     ├─ useCartActions.js    (addToCart, removeFromCart, etc.)
│     ├─ useCartState.js      (cart, totalPrice)
│     └─ useCartDrawer.js     (isOpen, toggle, etc.)
├─ domain/
│  ├─ cartTypes.js             (TypeDefs movidos aquí)
│  └─ cartUtils.js             (funciones puras)
└─ presentation/
   └─ Cart.jsx
```

### Tareas

#### 3.1 Crear capa de dominio

- **Archivo nuevo:** `src/features/cart/domain/cartTypes.js`
- **Contenido:** Mover TypeDefs
- **Tiempo:** 15 min

#### 3.2 Extraer utilidades

- **Archivo nuevo:** `src/features/cart/domain/cartUtils.js`
- **Contenido:** Funciones puras (calcular total, validaciones)
- **Tiempo:** 20 min

#### 3.3 Crear hooks personalizados

- **Archivo nuevo:** `src/features/cart/application/hooks/useCartActions.js`
- **Contenido:** addToCart, removeFromCart, clearCart
- **Tiempo:** 20 min

#### 3.4 Crear hook de estado

- **Archivo nuevo:** `src/features/cart/application/hooks/useCartState.js`
- **Contenido:** cart, totalPrice
- **Tiempo:** 15 min

#### 3.5 Crear hook de drawer

- **Archivo nuevo:** `src/features/cart/application/hooks/useCartDrawer.js`
- **Contenido:** isOpen, toggle, open, close
- **Tiempo:** 15 min

#### 3.6 Refactorizar CartContext

- **Archivo:** `src/features/cart/application/CartContext.jsx`
- **Acción:** Usar hooks creados, reducir a ~80 líneas
- **Tiempo:** 15 min

#### 3.7 Crear hook principal useCart

- **Archivo nuevo:** `src/features/cart/application/useCart.js`
- **Contenido:** Hook principal para consumir el contexto
- **Tiempo:** 10 min

### ✅ Criterios de Éxito

- [ ] CartContext.jsx < 100 líneas
- [ ] Lógica separada en hooks
- [ ] Tests siguen pasando
- [ ] Funciones puras en domain/

---

## Fase 4: Mejorar Testing

**Prioridad:** 🟡 MEDIA  
**Tiempo estimado:** 4 horas  
**Complejidad:** Media-Alta

### Objetivos

- Aumentar cobertura de tests
- Agregar tests para features principales
- Configurar coverage reporting

### Tareas

#### 4.1 Configurar coverage

- **Archivo:** `vitest.config.js`
- **Acción:** Agregar configuración de coverage
- **Tiempo:** 15 min

#### 4.2 Tests para ThemeContext

- **Archivo nuevo:** `src/features/theme/application/__tests__/ThemeContext.test.jsx`
- **Tests:** toggle, persistence, initial state
- **Tiempo:** 45 min

#### 4.3 Tests para hooks de Cart

- **Archivo nuevo:** `src/features/cart/application/hooks/__tests__/useCartActions.test.js`
- **Tests:** addToCart, removeFromCart, clearCart
- **Tiempo:** 1 hora

#### 4.4 Tests para utilidades

- **Archivo nuevo:** `src/features/cart/domain/__tests__/cartUtils.test.js`
- **Tests:** Funciones puras
- **Tiempo:** 30 min

#### 4.5 Tests para componentes de producto

- **Archivo nuevo:** `src/features/products/presentation/__tests__/ProductCard.test.jsx`
- **Tests:** Renderizado, eventos, props
- **Tiempo:** 1 hora

#### 4.6 Ejecutar coverage

- **Comando:** `pnpm test:coverage`
- **Objetivo:** > 50% coverage
- **Tiempo:** 30 min

### ✅ Criterios de Éxito

- [ ] Coverage > 50%
- [ ] Tests para 3+ features
- [ ] Todos los tests pasan
- [ ] Coverage report generado

---

## Fase 5: Optimización CSS

**Prioridad:** 🟢 BAJA  
**Tiempo estimado:** 2 horas  
**Complejidad:** Media

### Objetivos

- Crear sistema de utilidades CSS
- Reducir duplicación
- Mejorar mantenibilidad

### Tareas

#### 5.1 Crear utilidades de botones

- **Archivo:** `src/index.css`
- **Acción:** Crear clases base `.btn-*`
- **Tiempo:** 30 min

```css
/* Sistema de botones */
.btn-base {
    @apply px-5 py-2.5 rounded-xl font-medium transition-all duration-300;
}

.btn-primary {
    @apply btn-base bg-gradient-to-r from-amber-600 to-orange-600 text-white;
}

.btn-secondary {
    @apply btn-base bg-[var(--bg-card)] border border-[var(--border-light)];
}
```

#### 5.2 Crear utilidades de cards

- **Acción:** Consolidar estilos de tarjetas
- **Tiempo:** 30 min

#### 5.3 Extraer animaciones

- **Archivo nuevo:** `src/styles/animations.css`
- **Contenido:** Todas las @keyframes
- **Tiempo:** 20 min

#### 5.4 Extraer variables

- **Archivo nuevo:** `src/styles/variables.css`
- **Contenido:** Todas las CSS custom properties
- **Tiempo:** 20 min

#### 5.5 Reorganizar index.css

- **Acción:** Importar archivos modulares
- **Tiempo:** 20 min

### ✅ Criterios de Éxito

- [ ] CSS modular (3-4 archivos)
- [ ] Duplicación eliminada
- [ ] Build exitoso
- [ ] Tamaño similar o menor

---

## Fase 6: TypeScript Setup

**Prioridad:** 🟢 BAJA  
**Tiempo estimado:** 3 horas  
**Complejidad:** Alta

### Objetivos

- Configurar TypeScript
- Migración gradual
- Mantener compatibilidad con JS

### Tareas

#### 6.1 Instalar dependencias

- **Comando:** `pnpm add -D typescript @types/react @types/react-dom`
- **Tiempo:** 5 min

#### 6.2 Crear tsconfig.json

- **Archivo nuevo:** `tsconfig.json`
- **Configuración:** Modo incremental, allowJs: true
- **Tiempo:** 15 min

#### 6.3 Migrar tipos de dominio

- **Archivo:** `src/features/cart/domain/cartTypes.ts`
- **Acción:** Convertir TypeDefs a interfaces TS
- **Tiempo:** 30 min

#### 6.4 Migrar utilidades

- **Archivo:** `src/features/cart/domain/cartUtils.ts`
- **Acción:** Agregar tipos a funciones
- **Tiempo:** 30 min

#### 6.5 Migrar hooks

- **Archivos:** `src/features/cart/application/hooks/*.ts`
- **Acción:** Convertir a TypeScript
- **Tiempo:** 1 hora

#### 6.6 Configurar Vite para TS

- **Archivo:** `vite.config.ts`
- **Acción:** Renombrar y ajustar
- **Tiempo:** 15 min

#### 6.7 Actualizar scripts

- **Archivo:** `package.json`
- **Acción:** Agregar script de type-check
- **Tiempo:** 10 min

#### 6.8 Documentar estrategia

- **Archivo:** `docs/TYPESCRIPT_MIGRATION.md`
- **Contenido:** Plan de migración gradual
- **Tiempo:** 15 min

### ✅ Criterios de Éxito

- [ ] TypeScript configurado
- [ ] Domain layer migrado
- [ ] Build exitoso
- [ ] 0 errores de tipos

---

## Fase 7: Accessibility

**Prioridad:** 🟢 BAJA  
**Tiempo estimado:** 2 horas  
**Complejidad:** Media

### Objetivos

- Mejorar accesibilidad
- ARIA labels completos
- Navegación por teclado

### Tareas

#### 7.1 Auditoría con Lighthouse

- **Herramienta:** Chrome DevTools
- **Acción:** Ejecutar audit de accessibility
- **Tiempo:** 15 min

#### 7.2 Agregar ARIA labels

- **Componentes:** Navbar, Cart, ProductCard
- **Acción:** Agregar aria-label, aria-describedby
- **Tiempo:** 45 min

#### 7.3 Mejorar navegación por teclado

- **Componentes:** Modal, Drawer, Forms
- **Acción:** Focus management, tab order
- **Tiempo:** 30 min

#### 7.4 Agregar skip links

- **Archivo:** `src/components/common/Layout.jsx`
- **Acción:** Skip to main content
- **Tiempo:** 15 min

#### 7.5 Testing con screen reader

- **Herramienta:** VoiceOver (Mac)
- **Acción:** Probar flujos principales
- **Tiempo:** 15 min

### ✅ Criterios de Éxito

- [ ] Lighthouse accessibility > 95
- [ ] Todos los interactivos tienen ARIA
- [ ] Navegación por teclado funcional
- [ ] Screen reader friendly

---

## 🎯 Resumen de Prioridades

### Esta Semana (Crítico)

1. ✅ **Fase 1: Limpieza CSS** (30 min)

### Próxima Semana (Importante)

2. ✅ **Fase 2: Refactorizar JSDoc** (2 horas)
3. ✅ **Fase 3: Desacoplar CartContext** (1.5 horas)

### Este Mes (Recomendado)

4. ✅ **Fase 4: Mejorar Testing** (4 horas)
5. ✅ **Fase 5: Optimización CSS** (2 horas)

### Próximo Mes (Opcional)

6. ⚪ **Fase 6: TypeScript Setup** (3 horas)
7. ⚪ **Fase 7: Accessibility** (2 horas)

---

## 📊 Progreso Total

```
Fase 1: [ ] Limpieza CSS           (30 min)
Fase 2: [ ] Refactorizar JSDoc     (2 horas)
Fase 3: [ ] Desacoplar CartContext (1.5 horas)
Fase 4: [ ] Mejorar Testing        (4 horas)
Fase 5: [ ] Optimización CSS       (2 horas)
Fase 6: [ ] TypeScript Setup       (3 horas)
Fase 7: [ ] Accessibility          (2 horas)
─────────────────────────────────────────────
Total:                              15 horas
```

---

## 🚀 Cómo Usar Este Plan

1. **Elige una fase** según tu tiempo disponible
2. **Completa todas las tareas** de esa fase
3. **Verifica los criterios de éxito**
4. **Commit y push** tus cambios
5. **Marca la fase como completada**
6. **Pasa a la siguiente fase**

### Comandos Útiles

```bash
# Antes de cada fase
git checkout -b fase-1-limpieza-css

# Después de cada fase
pnpm build
pnpm test
pnpm lint

# Commit
git add .
git commit -m "✅ Fase 1: Limpieza CSS completada"
git push origin fase-1-limpieza-css
```

---

**¿Listo para empezar?** 🚀

Dime qué fase quieres que ejecute primero y lo haré paso a paso.
