# 🛍️ MyProjectAPI12

Una tiendita online hecha con React. Muestra productos, los busca, los agrega al carrito y simula un pago.

![Build](https://img.shields.io/badge/build-pasa-brightgreen)
![React](https://img.shields.io/badge/React-18.3-61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)
![License](https://img.shields.io/badge/licencia-MIT-green)

---

## 📖 1. ¿Qué es MyProjectAPI12 y cómo funciona por dentro?

### Notas

MyProjectAPI12 es una **SPA** (*Single Page Application* — aplicación de una sola página). A diferencia de las páginas web tradicionales donde cada clic pide un HTML nuevo al servidor, aquí **todo el código se descarga una sola vez** y la página se re-pinta sola en el navegador.

**Flujo de una SPA:**

```
1. El usuario escribe la URL → el servidor envía index.html + JS
2. El navegador ejecuta React → React construye el DOM virtual
3. El usuario hace clic en "Carrito" → React actualiza SOLO la parte que cambió
4. Nunca se recarga la página entera
```

**¿Qué es React exactamente?**

React es una librería que organiza la interfaz en **componentes**. Un componente es una función que devuelve HTML (JSX). Ejemplo:

```jsx
function TarjetaProducto({ titulo, precio }) {
  return (
    <div className="tarjeta">
      <h2>{titulo}</h2>
      <p>${precio}</p>
    </div>
  );
}
```

Cada componente tiene su propio **estado** (state) y **propiedades** (props). Cuando el estado cambia, React vuelve a pintar solo ese componente sin tocar el resto.

**La app se conecta a DummyJSON**, una API pública que devuelve productos falsos (como si fuera una base de datos de prueba). Usa `fetch` por debajo, pero en vez de llamar a `fetch` directamente, usa **TanStack Query** que guarda los resultados en caché para no pedirlos dos veces.

### 📝 Resumen Cornell

| Cue (Pregunta clave) | Notes (Respuesta) |
|---|---|
| ¿Qué tipo de app es? | SPA — una sola página que se re-pinta sola |
| ¿Qué hace React? | Divide la pantalla en componentes, cada uno con su estado |
| ¿De dónde saca los productos? | De DummyJSON (API pública de pruebas) vía TanStack Query |
| ¿Qué es un componente? | Una función que devuelve JSX (HTML escrito en JavaScript) |

### ❓ Preguntas y Respuestas

**P: ¿Por qué se llama SPA?**  
R: Porque solo carga UNA página HTML (`index.html`). Todo lo demás lo hace React cambiando partes de esa página sin recargar.

**P: ¿Qué diferencia hay entre una SPA y una página normal?**  
R: Una página normal pide un HTML nuevo al servidor cada vez que haces clic. Una SPA cambia el contenido sola sin molestar al servidor.

**P: ¿Qué pasa si no tengo internet?**  
R: La app no carga porque depende de DummyJSON. Pero TanStack Query guarda datos en caché, así que si ya visitaste una página, la muestra aunque estés sin conexión (hasta que cierres el navegador).

**P: ¿Por qué no usamos `fetch` directamente?**  
R: Porque TanStack Query hace cosas extras: guarda en caché, reintenta si falla, actualiza cuando cambia la página, y evita pedir lo mismo dos veces.

---

## 🚀 2. ¿Cómo bajo el proyecto y lo enciendo?

### Notas

Antes de empezar, necesitas dos programas instalados:

**Node.js** no es un lenguaje nuevo. Es un programa que permite ejecutar JavaScript fuera del navegador. ¿Recuerdas que JS solo corría en Chrome/Firefox? Node.js lo sacó de ahí y lo puso a correr en tu computadora directamente. Así podemos hacer herramientas en JS.

**pnpm** es un *package manager* (gestor de paquetes). Piensa en él como un "instalador automático de piezas". Cuando escribes `pnpm install`, él lee el archivo `package.json` y descarga todas las librerías que el proyecto necesita (React, TypeScript, Tailwind, etc.) en una carpeta llamada `node_modules`.

**git clone** copia el código desde GitHub a tu computadora. GitHub es como Drive pero para código: guarda proyectos y permite que varias personas trabajen juntas.

**pnpm dev** arranca **Vite**, una herramienta que hace dos cosas:
1. **Sirve los archivos** en `http://localhost:5173` para que los veas en el navegador
2. **HMR** (*Hot Module Replacement*): cuando guardas un archivo, Vite reemplaza solo esa parte en el navegador sin recargar la página. Cambias un color y lo ves al instante.

### 📝 Resumen Cornell

| Cue | Notes |
|---|---|
| ¿Qué es Node.js? | Un programa que corre JavaScript fuera del navegador |
| ¿Qué es pnpm? | Un instalador automático de librerías JS |
| ¿Qué hace `pnpm install`? | Descarga todas las dependencias del proyecto |
| ¿Qué es Vite? | Un "cocinero" que prepara el código para el navegador y lo sirve en tiempo real |
| ¿Qué es HMR? | Hot Module Replacement — cambias código y se ve al instante sin recargar |

### ❓ Preguntas y Respuestas

**P: ¿Por qué necesito Node.js si ya tengo JavaScript en el navegador?**  
R: Porque las herramientas que construyen la app (Vite, TypeScript, ESLint) están escritas en JavaScript y necesitan Node.js para correr. El navegador solo ve el resultado final.

**P: ¿Qué diferencia hay entre npm y pnpm?**  
R: pnpm es más rápido y ocupa menos espacio. Guarda los archivos en un solo lugar del disco y los reusa entre proyectos. npm copia todo cada vez.

**P: ¿Qué es `localhost:5173`?**  
R: `localhost` es tu propia computadora. `5173` es un "puerto" (como un canal). Vite abre ese canal para que el navegador hable con tu código.

**P: ¿`pnpm build` para qué sirve?**  
R: Prepara el código para producción: junta todos los archivos en uno solo, los comprime, quita los comentarios, y los mete en la carpeta `dist/`. Eso es lo que se sube a internet.

---

## 🏗️ 3. ¿Cómo se conectan todas las piezas de la app?

### Notas

La aplicación es como una casa. Cada pieza se conecta con la siguiente. En React, la conexión se hace mediante **providers** (proveedores). Un provider es un componente que envuelve a otros y les comparte información.

**Cadena completa de providers (de afuera hacia adentro):**

```
index.html
  └── main.tsx — renderiza <App /> dentro del div#root
        └── App.tsx — envuelve todo en providers:
              ├── QueryClientProvider  ← Datos de internet (caché)
              ├── ThemeProvider        ← Modo oscuro/claro
              ├── CartProvider         ← Estado del carrito
              ├── BrowserRouter        ← URLs y rutas
              ├── LazyMotion           ← Animaciones
              ├── ErrorBoundary        ← Atrapa errores
              ├── Layout               ← Estructura visual
              └── AppRouter            ← Qué página mostrar
```

<svg viewBox="0 0 600 560" xmlns="http://www.w3.org/2000/svg" style="max-width:100%;height:auto;display:block;margin:0 auto">
  <defs>
    <linearGradient id="bgGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#f8fafc"/>
      <stop offset="100%" stop-color="#e2e8f0"/>
    </linearGradient>
    <marker id="arrow-down" viewBox="0 0 10 10" refX="5" refY="10" markerWidth="8" markerHeight="8" orient="auto">
      <path d="M0,0 L5,10 L10,0 Z" fill="#64748b"/>
    </marker>
    <marker id="arrow-up" viewBox="0 0 10 10" refX="5" refY="0" markerWidth="8" markerHeight="8" orient="auto">
      <path d="M0,10 L5,0 L10,10 Z" fill="#ea580c"/>
    </marker>
  </defs>

  <rect width="600" height="560" fill="url(#bgGrad)" rx="16"/>

  <text x="300" y="28" text-anchor="middle" fill="#1e293b" font-size="16" font-weight="bold" font-family="sans-serif">🏗️ Cadena de Providers — Torre Isométrica</text>
  <text x="300" y="44" text-anchor="middle" fill="#64748b" font-size="11" font-family="sans-serif">(de afuera hacia adentro = de abajo hacia arriba)</text>

  <!-- L8: QueryClientProvider (w=200, z0=0) -->
  <polygon points="300,296 473.2,396 300,496 126.8,396" fill="#e2e8f0" stroke="#cbd5e1" stroke-width="0.5"/>
  <polygon points="300,320 473.2,420 473.2,396 300,296" fill="#cbd5e1"/>
  <polygon points="300,320 126.8,420 126.8,396 300,296" fill="#94a3b8"/>
  <text x="300" y="404" text-anchor="middle" fill="#1e293b" font-size="13" font-weight="bold" font-family="sans-serif">QueryClientProvider</text>
  <text x="300" y="418" text-anchor="middle" fill="#475569" font-size="9" font-family="sans-serif">TanStack Query — Caché de datos</text>

  <!-- L7: ThemeProvider (w=180, z0=24) -->
  <polygon points="300,282 455.9,372 300,462 144.1,372" fill="#fce4ec" stroke="#f48fb1" stroke-width="0.5"/>
  <polygon points="300,306 455.9,396 455.9,372 300,282" fill="#f48fb1"/>
  <polygon points="300,306 144.1,396 144.1,372 300,282" fill="#e91e63"/>
  <text x="300" y="378" text-anchor="middle" fill="#880e4f" font-size="13" font-weight="bold" font-family="sans-serif">ThemeProvider</text>
  <text x="300" y="392" text-anchor="middle" fill="#ad1457" font-size="9" font-family="sans-serif">Context API — Modo oscuro/claro</text>

  <!-- L6: CartProvider (w=160, z0=48) -->
  <polygon points="300,268 438.6,348 300,428 161.4,348" fill="#e8f5e9" stroke="#a5d6a7" stroke-width="0.5"/>
  <polygon points="300,292 438.6,372 438.6,348 300,268" fill="#a5d6a7"/>
  <polygon points="300,292 161.4,372 161.4,348 300,268" fill="#66bb6a"/>
  <text x="300" y="354" text-anchor="middle" fill="#1b5e20" font-size="13" font-weight="bold" font-family="sans-serif">CartProvider</text>
  <text x="300" y="368" text-anchor="middle" fill="#2e7d32" font-size="9" font-family="sans-serif">Context + useReducer + localStorage</text>

  <!-- L5: BrowserRouter (w=140, z0=72) -->
  <polygon points="300,254 421.2,324 300,394 178.8,324" fill="#e8eaf6" stroke="#9fa8da" stroke-width="0.5"/>
  <polygon points="300,278 421.2,348 421.2,324 300,254" fill="#9fa8da"/>
  <polygon points="300,278 178.8,348 178.8,324 300,254" fill="#5c6bc0"/>
  <text x="300" y="330" text-anchor="middle" fill="#1a237e" font-size="13" font-weight="bold" font-family="sans-serif">BrowserRouter</text>
  <text x="300" y="344" text-anchor="middle" fill="#283593" font-size="9" font-family="sans-serif">React Router — URLs y rutas</text>

  <!-- L4: LazyMotion (w=120, z0=96) -->
  <polygon points="300,240 403.9,300 300,360 196.1,300" fill="#fff8e1" stroke="#ffe082" stroke-width="0.5"/>
  <polygon points="300,264 403.9,324 403.9,300 300,240" fill="#ffe082"/>
  <polygon points="300,264 196.1,324 196.1,300 300,240" fill="#ffc107"/>
  <text x="300" y="306" text-anchor="middle" fill="#e65100" font-size="13" font-weight="bold" font-family="sans-serif">LazyMotion</text>
  <text x="300" y="320" text-anchor="middle" fill="#ef6c00" font-size="9" font-family="sans-serif">Framer Motion — Animaciones</text>

  <!-- L3: ErrorBoundary (w=100, z0=120) -->
  <polygon points="300,226 386.6,276 300,326 213.4,276" fill="#ffebee" stroke="#ef9a9a" stroke-width="0.5"/>
  <polygon points="300,250 386.6,300 386.6,276 300,226" fill="#ef9a9a"/>
  <polygon points="300,250 213.4,300 213.4,276 300,226" fill="#e53935"/>
  <text x="300" y="282" text-anchor="middle" fill="#b71c1c" font-size="13" font-weight="bold" font-family="sans-serif">ErrorBoundary</text>
  <text x="300" y="296" text-anchor="middle" fill="#c62828" font-size="9" font-family="sans-serif">Atrapa errores de componentes</text>

  <!-- L2: Layout (w=80, z0=144) -->
  <polygon points="300,212 369.3,252 300,292 230.7,252" fill="#e0f7fa" stroke="#80deea" stroke-width="0.5"/>
  <polygon points="300,236 369.3,276 369.3,252 300,212" fill="#80deea"/>
  <polygon points="300,236 230.7,276 230.7,252 300,212" fill="#00bcd4"/>
  <text x="300" y="258" text-anchor="middle" fill="#004d40" font-size="13" font-weight="bold" font-family="sans-serif">Layout</text>
  <text x="300" y="272" text-anchor="middle" fill="#00695c" font-size="9" font-family="sans-serif">Navbar + main + Toaster</text>

  <!-- L1: AppRouter (w=60, z0=168) -->
  <polygon points="300,198 352,228 300,258 248,228" fill="#e8f5e9" stroke="#81c784" stroke-width="0.5"/>
  <polygon points="300,222 352,252 352,228 300,198" fill="#81c784"/>
  <polygon points="300,222 248,252 248,228 300,198" fill="#4caf50"/>
  <text x="300" y="234" text-anchor="middle" fill="#1b5e20" font-size="13" font-weight="bold" font-family="sans-serif">AppRouter</text>
  <text x="300" y="248" text-anchor="middle" fill="#2e7d32" font-size="9" font-family="sans-serif">lazy() + Suspense — Páginas</text>

  <!-- Flechas laterales -->
  <line x1="520" y1="430" x2="520" y2="210" stroke="#64748b" stroke-width="2" stroke-dasharray="5,4" marker-end="url(#arrow-down)"/>
  <text x="530" y="330" fill="#64748b" font-size="11" font-family="sans-serif" transform="rotate(-90,530,330)">⬆ Datos fluyen hacia adentro (contexto)</text>

  <line x1="70" y1="210" x2="70" y2="430" stroke="#ea580c" stroke-width="2" stroke-dasharray="5,4" marker-end="url(#arrow-up)"/>
  <text x="22" y="330" fill="#ea580c" font-size="11" font-family="sans-serif" transform="rotate(90,22,330)">⬆ Componentes renderizan hacia afuera</text>
</svg>

**¿Qué hace cada provider?**

1. **QueryClientProvider** — Crea un *cliente* de TanStack Query que se encarga de pedir datos a la API y guardarlos en caché. Todos los componentes pueden usarlo sin tener que importar `fetch` cada vez. El caché permite que si vuelves a una página, los datos aparezcan al instante.

2. **ThemeProvider** — Usa **Context API** de React para compartir el tema actual (claro u oscuro). Guarda la preferencia en `localStorage`. Cuando cambias de tema, todos los componentes se actualizan porque React detecta el cambio de contexto.

3. **CartProvider** — También usa Context API. Guarda el carrito (lista de productos, cantidades, total) en un `useReducer`. Sincroniza con `localStorage` para que el carrito no se pierda si cierras el navegador.

4. **BrowserRouter** — Lee la URL del navegador y decide qué componente mostrar. Si la URL es `/`, muestra `Home`. Si es `/checkout`, muestra `Checkout`. Usa el *History API* del navegador (la misma que usan los botones de atrás/adelante).

5. **LazyMotion** — Configura Framer Motion para animaciones. Sin esto, las animaciones no tendrían el motor que las ejecuta.

6. **ErrorBoundary** — Un componente especial de React que atrapa errores. Sin esto, si un componente explota, la página se queda en blanco. Con esto, muestra un mensaje de error bonito.

7. **Layout** — El esqueleto visual: el Navbar arriba, el contenido en el centro, márgenes, padding, colores de fondo.

8. **AppRouter** — Contiene las rutas y usa `React.lazy()` para cargar las páginas solo cuando se necesitan (code splitting). Así la página inicial carga más rápido porque no descarga Checkout hasta que entras a checkout.

**Diagrama de flujo de datos:**

<svg viewBox="0 0 600 340" xmlns="http://www.w3.org/2000/svg" style="max-width:100%;height:auto;display:block;margin:0 auto">
  <defs>
    <marker id="flow-arrow" viewBox="0 0 10 10" refX="10" refY="5" markerWidth="8" markerHeight="8" orient="auto">
      <path d="M0,1 L10,5 L0,9 Z" fill="#0ea5e9"/>
    </marker>
    <linearGradient id="bgFlow" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#f0f9ff"/>
      <stop offset="100%" stop-color="#e0f2fe"/>
    </linearGradient>
  </defs>

  <rect width="600" height="340" fill="url(#bgFlow)" rx="16"/>

  <text x="300" y="28" text-anchor="middle" fill="#0c4a6e" font-size="15" font-weight="bold" font-family="sans-serif">🔄 Flujo de Datos — Tubería Isométrica</text>

  <!-- Block 1: Usuario (click) -->
  <polygon points="80,270 170,270 200,250 110,250" fill="#e0e7ff" stroke="#818cf8" stroke-width="1"/>
  <polygon points="80,270 80,240 110,220 110,250" fill="#a5b4fc"/>
  <polygon points="80,240 170,240 200,220 110,220" fill="#c7d2fe" stroke="#818cf8" stroke-width="1"/>
  <text x="140" y="266" text-anchor="middle" fill="#3730a3" font-size="11" font-weight="bold" font-family="sans-serif">👆 Usuario</text>
  <text x="140" y="280" text-anchor="middle" fill="#4338ca" font-size="9" font-family="sans-serif">Clic "Agregar"</text>

  <!-- Arrow 1→2 -->
  <line x1="200" y1="250" x2="260" y2="225" stroke="#0ea5e9" stroke-width="2.5" marker-end="url(#flow-arrow)"/>

  <!-- Block 2: ProductCard -->
  <polygon points="270,240 360,240 390,220 300,220" fill="#d1fae5" stroke="#34d399" stroke-width="1"/>
  <polygon points="270,240 270,210 300,190 300,220" fill="#6ee7b7"/>
  <polygon points="270,210 360,210 390,190 300,190" fill="#a7f3d0" stroke="#34d399" stroke-width="1"/>
  <text x="330" y="236" text-anchor="middle" fill="#065f46" font-size="11" font-weight="bold" font-family="sans-serif">📦 ProductCard</text>
  <text x="330" y="250" text-anchor="middle" fill="#047857" font-size="9" font-family="sans-serif">addToCart(producto)</text>

  <!-- Arrow 2→3 -->
  <line x1="390" y1="220" x2="450" y2="200" stroke="#0ea5e9" stroke-width="2.5" marker-end="url(#flow-arrow)"/>

  <!-- Block 3: CartContext -->
  <polygon points="460,215 550,215 580,195 490,195" fill="#fef3c7" stroke="#fbbf24" stroke-width="1"/>
  <polygon points="460,215 460,185 490,165 490,195" fill="#fde68a"/>
  <polygon points="460,185 550,185 580,165 490,165" fill="#fef9c3" stroke="#fbbf24" stroke-width="1"/>
  <text x="520" y="211" text-anchor="middle" fill="#78350f" font-size="11" font-weight="bold" font-family="sans-serif">🛒 CartContext</text>
  <text x="520" y="225" text-anchor="middle" fill="#92400e" font-size="9" font-family="sans-serif">useReducer(ADD_ITEM)</text>

  <!-- Flow line 3a: hacia localStorage -->
  <line x1="520" y1="185" x2="520" y2="120" stroke="#64748b" stroke-width="2" stroke-dasharray="5,3" marker-end="url(#flow-arrow)"/>

  <!-- Block: localStorage -->
  <rect x="490" y="85" width="60" height="30" rx="6" fill="#e2e8f0" stroke="#94a3b8" stroke-width="1"/>
  <text x="520" y="103" text-anchor="middle" fill="#1e293b" font-size="10" font-family="sans-serif">💾 localStorage</text>

  <!-- Flow line 3b: hacia CartDrawer -->
  <line x1="565" y1="195" x2="625" y2="140" stroke="#0ea5e9" stroke-width="2.5" marker-end="url(#flow-arrow)"/>

  <!-- Block 4: CartDrawer -->
  <polygon points="630,140 680,115 710,95 660,120" fill="#e0e7ff" stroke="#818cf8" stroke-width="1"/>
  <polygon points="630,140 630,110 660,90 660,120" fill="#a5b4fc"/>
  <polygon points="660,120 710,95 710,65 660,90" fill="#c7d2fe" stroke="#818cf8" stroke-width="1"/>
  <text x="670" y="118" text-anchor="middle" fill="#3730a3" font-size="10" font-weight="bold" font-family="sans-serif">🖼️ CartDrawer</text>
  <text x="670" y="130" text-anchor="middle" fill="#4338ca" font-size="8" font-family="sans-serif">Re-render con total</text>

  <!-- Arrow 4→5 (back to user) -->
  <path d="M 680,90 Q 680,50 140,50 Q 50,50 50,200" fill="none" stroke="#0ea5e9" stroke-width="2" stroke-dasharray="5,3" marker-end="url(#flow-arrow)"/>
  <text x="400" y="48" text-anchor="middle" fill="#64748b" font-size="9" font-family="sans-serif">⬅ El usuario ve el cambio en pantalla</text>

  <!-- Etiqueta de paso -->
  <text x="300" y="305" text-anchor="middle" fill="#64748b" font-size="10" font-family="sans-serif">Cada paso dispara el siguiente automáticamente (React re-renderiza)</text>
</svg>

### 📝 Resumen Cornell

| Cue | Notes |
|---|---|
| ¿Qué es un provider? | Un componente que envuelve a otros y les comparte datos |
| ¿Quién maneja los datos de internet? | QueryClientProvider (TanStack Query) |
| ¿Quién maneja el tema? | ThemeProvider (Context API + localStorage) |
| ¿Quién maneja el carrito? | CartProvider (Context API + useReducer + localStorage) |
| ¿Quién maneja las rutas? | BrowserRouter + AppRouter |
| ¿Por qué están en este orden? | Porque los de afuera deben existir antes que los de adentro los usen |

### ❓ Preguntas y Respuestas

**P: ¿Qué pasa si cambio el orden de los providers?**  
R: Si pones `CartProvider` dentro de `BrowserRouter`, el carrito se reinicia cada vez que cambias de página. O si `ThemeProvider` está fuera de `Router`, el tema no sabe en qué página está. El orden importa.

**P: ¿Qué es `useReducer` y por qué no usamos `useState`?**  
R: `useReducer` es como `useState` pero con superpoderes. Cuando el estado es complejo (como un carrito con varios productos, cantidades y precios), `useReducer` organiza los cambios con "acciones" (agregar, quitar, limpiar, cambiar cantidad). Es más ordenado.

**P: ¿Qué guarda en localStorage exactamente?**  
R: El carrito guarda la lista de productos con sus cantidades. El tema guarda "light" o "dark". Cuando abres la página de nuevo, lee localStorage y restaura todo como estaba.

**P: ¿Cómo sabe React qué componente actualizar cuando algo cambia?**  
R: React usa el **Virtual DOM**. Cuando el estado cambia, React compara el DOM virtual anterior con el nuevo, calcula las diferencias (diffing), y solo aplica esos cambios al DOM real. Es más rápido que volver a pintar todo.

---

## ✨ 4. ¿Qué funciones tiene la tienda?

### Notas

#### 🛒 Carrito de compras

El carrito es un **contexto global**. Cualquier componente puede leerlo o modificarlo. Funciona así:

- `CartContext` guarda: `items[]`, `totalPrice`, `freeShippingThreshold`, `discount`
- `useReducer` maneja acciones: `ADD_ITEM`, `REMOVE_ITEM`, `UPDATE_QUANTITY`, `CLEAR_CART`, `APPLY_DISCOUNT`
- Cada acción dispara un **reducer** que calcula el nuevo estado sin mutar el anterior

```jsx
// Así se ve una acción del reducer
function cartReducer(state, action) {
  switch (action.type) {
    case "ADD_ITEM": {
      const existing = state.items.find(i => i.id === action.product.id);
      if (existing) {
        // Si ya está, solo suma 1 a la cantidad
        return {
          ...state,
          items: state.items.map(i =>
            i.id === action.product.id
              ? { ...i, quantity: i.quantity + 1 }
              : i
          )
        };
      }
      // Si no está, lo agrega con cantidad 1
      return { ...state, items: [...state.items, { ...action.product, quantity: 1 }] };
    }
    // ...más casos
  }
}
```

El carrito se sincroniza con `localStorage` cada vez que cambia:

```jsx
useEffect(() => {
  localStorage.setItem("cart", JSON.stringify(state));
}, [state]);
```

#### 🌙 Modo oscuro / claro

Usa **CSS variables** para cambiar los colores. No hay clases distintas, solo cambian los valores de las variables:

```css
/* Tema claro (default) */
:root {
  --color-fondo: #ffffff;
  --color-texto: #1a1a1a;
}

/* Tema oscuro */
[data-theme="dark"] {
  --color-fondo: #1a1a1a;
  --color-texto: #f0f0f0;
}
```

Cuando cambias de tema, `ThemeProvider` cambia el atributo `data-theme` en el `<html>` y todas las variables CSS se actualizan al instante.

#### 🎞️ Animaciones

Usamos **Framer Motion**, una librería de animaciones para React. Tiene varios tipos de animaciones:

| Animación | Cómo funciona | Código ejemplo |
|---|---|---|
| **Scroll reveal** | Cada tarjeta de producto se anima cuando aparece en pantalla | `<motion.div whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} />` |
| **Page transition** | Al cambiar de página, la vieja se desvanece y la nueva aparece | `<AnimatePresence><motion.div exit={{ opacity: 0 }} /></AnimatePresence>` |
| **Drawer (carrito)** | El carrito se desliza desde la derecha con un resorte | `<Sheet component={motion.div} animate={{ x: 0 }} transition={{ type: "spring" }} />` |
| **Fly to cart** | Cuando agregas un producto, una copia vuela hacia el ícono del carrito | Animación con `animate` que sigue las coordenadas del botón |
| **Hover en botones** | Los botones se elevan y agrandan un poco | `whileHover={{ scale: 1.02 }}` |

`AnimatePresence` es un componente de Framer Motion que detecta cuando un hijo se va a eliminar y ejecuta su animación de `exit` antes de removerlo del DOM.

#### 🔍 Búsqueda y categorías

La búsqueda usa **`useDebounce`**: cuando escribes en el input, espera 300ms después de que dejes de escribir antes de hacer la búsqueda. Así no hace una petición por cada letra que escribes.

```jsx
function useDebounce(valor, delay = 300) {
  const [debounced, setDebounced] = useState(valor);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(valor), delay);
    return () => clearTimeout(timer); // limpia el timer anterior
  }, [valor, delay]);
  return debounced;
}
```

Las categorías se obtienen de un endpoint de DummyJSON (`/products/categories`) y se muestran en el Navbar como un menú desplegable.

#### ♿ Accesibilidad

| Práctica | Implementación |
|---|---|
| Navegación por teclado | `Tab` para moverse, `Enter`/`Space` para activar, `Escape` para cerrar modales |
| Focus trap | En el modal de producto y el carrito, el foco no puede salir hasta que se cierren |
| Lectores de pantalla | `aria-label`, `role`, `alt` en imágenes |
| Movimiento reducido | `prefers-reduced-motion` — si el usuario lo activa, las animaciones se desactivan |

### 📝 Resumen Cornell

| Cue | Notes |
|---|---|
| ¿Cómo maneja el carrito los cambios? | Con useReducer y acciones (ADD_ITEM, REMOVE_ITEM, etc.) |
| ¿Cómo persiste el carrito? | Guarda el estado en localStorage cada vez que cambia |
| ¿Cómo cambia de tema sin recargar? | Cambia el atributo `data-theme` en `<html>`, las variables CSS se actualizan solas |
| ¿Qué hace Framer Motion? | Anima componentes con scroll reveal, transiciones, drawers, hover |
| ¿Qué es useDebounce? | Espera 300ms después de escribir para buscar, evita peticiones innecesarias |
| ¿Cómo se asegura que funciona sin mouse? | Focus trap, aria-labels, navegación por teclado |

### ❓ Preguntas y Respuestas

**P: ¿Por qué usar `useReducer` y no solo `useState`?**  
R: `useReducer` es mejor cuando el estado tiene varias partes y muchas formas de cambiar. Un carrito tiene 5 acciones distintas. Con `useReducer` cada acción está claramente definida. Con `useState` terminarías con 5 estados separados y sería más fácil equivocarse.

**P: ¿Las animaciones hacen lenta la página?**  
R: Framer Motion usa la GPU del navegador para animar (transform y opacity), no el CPU. Además, `will-change` le avisa al navegador qué va a cambiar para que prepare el renderizado. Son suaves y no bloquean la interfaz.

**P: ¿Qué pasa si escribo muy rápido en la búsqueda?**  
R: `useDebounce` espera a que dejes de escribir 300ms. Si escribes 10 letras rápido, solo hace UNA búsqueda al final, no 10. Si no existiera, haría 10 peticiones a la API y algunas llegarían en desorden.

**P: ¿Por qué algunas animaciones se ven entrecortadas?**  
R: Puede ser porque la GPU no está acelerando. Framer Motion usa `transform: translateZ(0)` para forzar la aceleración por GPU. Si el navegador no lo soporta, la animación corre por CPU y se ve más lenta.

---

## 🎮 5. ¿Qué hace cada comando de la terminal?

### Notas

Los comandos están definidos en `package.json` en la sección `"scripts"`. Son atajos para no tener que escribir comandos largos cada vez.

**`pnpm dev`**

Arranca Vite en modo desarrollo.
- Lee `vite.config.js`
- Configura los alias (`@/` → `src/`, `@shared/` → `src/shared/`, etc.)
- Inicia un servidor en `localhost:5173`
- Activa HMR (cambia el código y se ve al instante)
- NO compila TypeScript, solo lo borra al vuelo (es más rápido)

**`pnpm build`**

Vite compila todo para producción.
1. TypeScript se compila a JavaScript (y se eliminan los tipos)
2. Todos los JS se juntan en un archivo (bundling)
3. Se minimiza (quita espacios, acorta nombres de variables)
4. CSS se extrae y minimiza
5. Todo se copia a `dist/`
6. Los nombres de archivo incluyen un hash (ej. `index.a1b2c3d4.js`) para caché

**`pnpm lint`**

Ejecuta ESLint.
- Busca errores de sintaxis, variables sin usar, imports incorrectos
- Tiene una regla de React Refresh: solo exportes componentes desde archivos `.tsx`
- Máximo 2 warnings permitidos (si hay más, falla)
- Lee la configuración de `eslint.config.js`

**`pnpm type-check`**

Ejecuta `tsc --noEmit` (TypeScript sin emitir archivos).
- Revisa que todos los tipos sean correctos
- No genera archivos `.js` (solo revisa)
- Es más rápido que una compilación completa

**`pnpm preview`**

Arranca un servidor simple con el contenido de `dist/` para ver cómo queda el build antes de subirlo.

**`pnpm deploy`**

1. Ejecuta `pnpm build` (predeploy hook)
2. Usa `gh-pages` para subir `dist/` a la rama `gh-pages` de GitHub
3. GitHub Pages sirve esa rama como página web

### 📝 Resumen Cornell

| Cue | Notes |
|---|---|
| `pnpm dev` | Servidor de desarrollo con HMR (cambios en vivo) |
| `pnpm build` | Compila, junta y minimiza todo a `dist/` |
| `pnpm lint` | ESLint — revisa calidad del código |
| `pnpm type-check` | TypeScript — revisa tipos sin compilar |
| `pnpm preview` | Previsualiza `dist/` localmente |
| `pnpm deploy` | Sube `dist/` a GitHub Pages |

### ❓ Preguntas y Respuestas

**P: ¿Por qué `dev` es más rápido que `build`?**  
R: Porque `dev` no compila TypeScript ni minimiza archivos. Solo transforma lo necesario para que el navegador lo entienda y lo sirve. `build` hace todo el trabajo pesado una sola vez.

**P: ¿Qué son los hashes en los archivos del build?**  
R: Son huellas digitales del contenido. Si el archivo cambia, el hash cambia. El navegador ve el nombre nuevo y descarga el archivo en vez de usar el que tenía en caché. Así nunca muestras código viejo.

**P: ¿Qué pasa si `lint` falla?**  
R: El pre-commit hook (Husky) evita que hagas commit si `lint` o `type-check` fallan. Tienes que arreglar los errores antes de guardar.

**P: ¿Cómo hace Vite para transformar TypeScript tan rápido?**  
R: Vite **no compila** TypeScript en desarrollo. Usa **esbuild** que solo borra los tipos (type stripping). TypeScript puro corre en el navegador después de quitarle los `: string`, `: number`, etc. Por eso es instantáneo.

---

## 📁 6. ¿Por qué el código está dividido así (FSD)?

### Notas

El proyecto usa **FSD** (*Feature-Sliced Design*), una metodología para organizar código que separa el proyecto en capas y features.

**Las capas (de arriba a abajo):**

```
app/          ← Configuración global (providers, router, estilos globales)
  ├── config/    ← Variables de entorno, constantes de la app
  ├── routing/   ← AppRouter con lazy loading
  ├── providers/ ← Composición de providers
  └── styles/    ← index.css con variables CSS

pages/        ← Páginas completas (Home)
  └── Home.tsx ← Importa features y las combina

features/     ← Funcionalidades del negocio
  ├── cart/      ← Todo lo del carrito (context, reducer, drawer)
  ├── checkout/  ← Flujo de pago (formularios, validación, descuentos)
  ├── products/  ← Productos (grid, card, búsqueda, categorías)
  └── theme/     ← Tema oscuro/claro (context, localStorage)

entities/     ← (no usado aún) Modelos de negocio puros

widgets/      ← (no usado aún) Componentes compuestos

shared/       ← Código reusable que no es de negocio
  ├── api/       ← httpClient, apiClient (axios instance)
  ├── constants/ ← Números mágicos, strings fijos
  ├── hooks/     ← Custom hooks (useDebounce, useLogLifecycle)
  ├── lib/       ← Utilidades (calcular descuento, formatear precios)
  └── ui/        ← Componentes base (Button, Card, Dialog, Sheet, Input)
```

**Reglas de FSD:**

1. Una capa solo puede importar de las capas de abajo. `features` puede importar de `shared`, pero `shared` no puede importar de `features`.
2. Un feature no puede importar de otro feature directamente. Si necesitas algo de `cart` en `checkout`, deben compartirlo a través de `shared`.
3. `app` es la única capa que puede combinar features.

**Cada feature tiene 4 sub-capas:**

```
cart/
├── domain/          ← Definiciones de tipos (CartItem, CartState)
├── application/     ← Lógica (CartContext, cartReducer, useCart)
├── infrastructure/  ← Comunicación externa (no usado en cart, pero sí en products)
└── presentation/    ← Componentes visuales (CartDrawer, CartItemRow)
```

### 📐 Diagrama Isométrico 3D — Pastel de Capas FSD

<svg viewBox="0 0 600 520" xmlns="http://www.w3.org/2000/svg" style="max-width:100%;height:auto;display:block;margin:0 auto">
  <defs>
    <filter id="shadow" x="-10%" y="-10%" width="130%" height="130%">
      <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#00000030"/>
    </filter>
    <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="2" result="blur"/>
      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>

  <!-- Fondo -->
  <rect width="600" height="520" fill="#f8fafc" rx="16"/>

  <!-- Título -->
  <text x="300" y="35" text-anchor="middle" fill="#1e293b" font-size="16" font-weight="bold" font-family="sans-serif">🧱 Arquitectura FSD — Capas Isométricas</text>

  <!-- L1: shared/ (slate) -->
  <polygon points="126.8,396 473.2,396 300,496 126.8,396" fill="#cbd5e1"/>
  <polygon points="300,320 473.2,420 473.2,396 300,296" fill="#94a3b8"/>
  <polygon points="300,320 126.8,420 126.8,396 300,296" fill="#64748b"/>
  <polygon points="300,296 473.2,396 300,496 126.8,396" fill="#e2e8f0" stroke="#94a3b8" stroke-width="0.5"/>
  <text x="300" y="402" text-anchor="middle" fill="#1e293b" font-size="15" font-weight="bold" font-family="sans-serif">shared/</text>
  <text x="300" y="418" text-anchor="middle" fill="#475569" font-size="10" font-family="sans-serif">api · hooks · ui · lib · constants</text>

  <!-- L2: features/ (sky) -->
  <polygon points="126.8,372 473.2,372 300,472 126.8,372" fill="#7dd3fc"/>
  <polygon points="300,296 473.2,396 473.2,372 300,272" fill="#38bdf8"/>
  <polygon points="300,296 126.8,396 126.8,372 300,272" fill="#0ea5e9"/>
  <polygon points="300,272 473.2,372 300,472 126.8,372" fill="#bae6fd" stroke="#38bdf8" stroke-width="0.5"/>
  <text x="300" y="378" text-anchor="middle" fill="#0c4a6e" font-size="15" font-weight="bold" font-family="sans-serif">features/</text>
  <text x="300" y="394" text-anchor="middle" fill="#0369a1" font-size="10" font-family="sans-serif">cart · checkout · products · theme</text>

  <!-- L3: pages/ (violet) -->
  <polygon points="126.8,348 473.2,348 300,448 126.8,348" fill="#c4b5fd"/>
  <polygon points="300,272 473.2,372 473.2,348 300,248" fill="#a78bfa"/>
  <polygon points="300,272 126.8,372 126.8,348 300,248" fill="#8b5cf6"/>
  <polygon points="300,248 473.2,348 300,448 126.8,348" fill="#ddd6fe" stroke="#a78bfa" stroke-width="0.5"/>
  <text x="300" y="354" text-anchor="middle" fill="#f5f3ff" font-size="15" font-weight="bold" font-family="sans-serif">pages/</text>
  <text x="300" y="370" text-anchor="middle" fill="#ddd6fe" font-size="10" font-family="sans-serif">Home · (futuro: Checkout, About)</text>

  <!-- L4: app/ (emerald) -->
  <polygon points="126.8,324 473.2,324 300,424 126.8,324" fill="#6ee7b7"/>
  <polygon points="300,248 473.2,348 473.2,324 300,224" fill="#34d399"/>
  <polygon points="300,248 126.8,348 126.8,324 300,224" fill="#10b981"/>
  <polygon points="300,224 473.2,324 300,424 126.8,324" fill="#a7f3d0" stroke="#34d399" stroke-width="0.5"/>
  <text x="300" y="330" text-anchor="middle" fill="#064e3b" font-size="15" font-weight="bold" font-family="sans-serif">app/</text>
  <text x="300" y="346" text-anchor="middle" fill="#065f46" font-size="10" font-family="sans-serif">config · routing · providers</text>

  <!-- Eje Z (flecha arriba) -->
  <line x1="520" y1="420" x2="520" y2="220" stroke="#94a3b8" stroke-width="2" stroke-dasharray="4,3"/>
  <polygon points="520,215 514,228 526,228" fill="#94a3b8"/>
  <text x="530" y="215" fill="#64748b" font-size="11" font-family="sans-serif">⬆ Dependencias</text>
  <text x="530" y="228" fill="#94a3b8" font-size="9" font-family="sans-serif">(solo importan hacia abajo)</text>

  <!-- Eje X (flecha) -->
  <line x1="60" y1="460" x2="210" y2="460" stroke="#94a3b8" stroke-width="2" stroke-dasharray="4,3"/>
  <polygon points="215,460 202,454 202,466" fill="#94a3b8"/>
  <text x="65" y="455" fill="#64748b" font-size="11" font-family="sans-serif">⬇ Reutilización creciente</text>
</svg>

```
       🔝 app/        ← Configuración global (providers, router)
          📄 pages/    ← Páginas completas (Home)
            🧩 features/ ← Funcionalidades del negocio
              🧰 shared/ ← Código reusable (api, hooks, ui)
```
       🔝 app/        ← Configuración global (providers, router)
          📄 pages/    ← Páginas completas (Home)
            🧩 features/ ← Funcionalidades del negocio
              🧰 shared/ ← Código reusable (api, hooks, ui)
```

**¿Por qué hacer esta separación?**

| Problema | Sin FSD | Con FSD |
|---|---|---|
| Encontrar código | Buscar en 50 archivos mezclados | Sabes que el carrito está en `features/cart/` |
| Cambiar algo sin romper otro | Un cambio en un componente puede afectar miles de imports | Las capas tienen reglas claras de dependencia |
| Probar una feature | Tienes que importar toda la app | Cada feature es independiente |
| Quitar una feature | Hay que buscar referencias en todo el proyecto | Borras la carpeta y listo |

### 📝 Resumen Cornell

| Cue | Notes |
|---|---|
| ¿Qué es FSD? | Feature-Sliced Design — metodología para organizar código en capas |
| ¿Cuáles son las capas? | app → pages → features → entities → widgets → shared |
| ¿Qué va en `features/`? | Funcionalidades completas (cart, checkout, products, theme) |
| ¿Qué va en `shared/`? | Código reusable sin lógica de negocio (api, hooks, ui) |
| ¿Cuál es la regla principal? | Solo importar hacia abajo, nunca hacia arriba |
| ¿Por qué separar por capas? | Para no romper todo cuando cambias algo |

### ❓ Preguntas y Respuestas

**P: ¿Qué pasa si dos features necesitan compartir datos?**  
R: Usan `shared/`. Por ejemplo, el tipo `Product` está en `shared/api` porque tanto `cart` como `products` lo necesitan. Si está en `shared`, ambas pueden importarlo sin violar las reglas.

**P: ¿Por qué `entities/` y `widgets/` no existen si están en los alias?**  
R: Están configurados para cuando el proyecto crezca. Si aparecen más features, se pueden extraer modelos a `entities/` y componentes compuestos a `widgets/`. No se crean antes de necesitarlos (YAGNI — You Aren't Gonna Need It).

**P: ¿Qué diferencia hay entre `domain/` y `application/` en un feature?**  
R: `domain/` solo tiene tipos e interfaces (el "qué"). `application/` tiene la lógica (el "cómo"). `domain/cart.types.ts` define `CartItem { id, name, price, quantity }`. `application/useCart.ts` dice cómo agregar, quitar y calcular el total.

**P: ¿Cómo sé si algo va en `shared/ui` o en `features`?**  
R: Si el componente es genérico y no sabe nada del negocio (un botón, un input, un card), va en `shared/ui`. Si sabe de productos o carritos, va en `features`. Un `ProductCard` sabe de productos → va en `features/products`. Un `Button` no sabe nada → va en `shared/ui`.

---

## 📚 Documentación completa

El proyecto incluye 37 archivos de documentación. Cada uno explica una parte específica:

| Sección | Archivos | ¿Qué explican? |
|---|---|---|
| **Ingeniería de Software** | 6 docs | Casos de uso formales, arquitectura C4, diagramas UML, decisiones técnicas (ADR), auditoría SOLID+DRY, mapa de dependencias |
| **Arquitectura** | 2 docs | Visión general del proyecto y stack tecnológico |
| **Features** | 4 docs | Cómo funciona carrito, checkout, productos, tema por dentro |
| **API** | 3 docs | Cómo se conecta con internet (HTTP, endpoints, tipos) |
| **Patrones** | 2 docs | Custom hooks y contextos explicados |
| **Componentes** | 1 doc | Todos los componentes UI y cómo usarlos |
| **Operaciones** | 2 docs | Cómo desplegar y solucionar problemas comunes |
| **Guía de estudio** | 13 módulos | Tutorial paso a paso para aprender el proyecto desde cero |

---

## 🤖 ¿Quién hizo esto?

**Luis J Cueva**

- GitHub: [@Slinkter](https://github.com/Slinkter)
- LinkedIn: [Luis J Cueva](https://linkedin.com/in/luis-cueva)

---

<div align="center">
  Hecho con ❤️ y mucho café ☕
</div>
