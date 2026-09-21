# 🏫 Taller Práctico: Crea tu Tienda Online desde Cero
> **Manual paso a paso para estudiantes y principiantes**  
> Aprende a construir una aplicación web moderna (SPA) como **MyProjectAPI12** con explicaciones sencillas, analogías de la vida real y retos prácticos.

---

## 🧭 Índice del Taller

1. [¿Qué vamos a construir? (La idea explicada fácil)](#1-qué-vamos-a-construir-la-idea-explicada-fácil)
2. [Los Ingredientes: Herramientas que usaremos](#2-los-ingredientes-herramientas-que-usaremos)
3. [Taller 1: Preparando tu mesa de trabajo (Instalación)](#3-taller-1-preparando-tu-mesa-de-trabajo-instalación)
4. [Taller 2: ¿Cómo se organiza una aplicación grande? (La metáfora de la casa)](#4-taller-2-cómo-se-organiza-una-aplicación-grande-la-metáfora-de-la-casa)
5. [Taller 3: Creando la Tarjeta de Producto (ProductCard)](#5-taller-3-creando-la-tarjeta-de-producto-productcard)
6. [Taller 4: El Carrito de Compras (Memoria compartida)](#6-taller-4-el-carrito-de-compras-memoria-compartida)
7. [Taller 5: El Mostrador de Pago (Checkout y Matemáticas seguras)](#7-taller-5-el-mostrador-de-pago-checkout-y-matemáticas-seguras)
8. [Taller 6: La Base de Datos (Firebase y la Nube)](#8-taller-6-la-base-de-datos-firebase-y-la-nube)
9. [Taller 7: ¿Cómo probar y publicar tu tienda en Internet?](#9-taller-7-cómo-probar-y-publicar-tu-tienda-en-internet)
10. [Preguntas Frecuentes y Glosario Escolar](#10-preguntas-frecuentes-y-glosario-escolar)

---

## 1. ¿Qué vamos a construir? (La idea explicada fácil)

Imagina un supermercado físico:
- Hay pasillos con estantes (**El Catálogo de Productos**).
- Tienes un carrito con ruedas donde vas metiendo cosas (**El Carrito de Compras**).
- Hay una caja registradora donde sumas el total, aplicas un cupón de descuento y pagas (**El Checkout**).
- Al salir, te entregan tu recibo y se descuenta lo vendido del almacén (**La Base de Datos / Pedidos**).

En Internet, todo esto se hace con una **SPA** (*Single Page Application* o Aplicación de Una Sola Página).  
**¿Por qué es especial?** Porque nunca se "recarga en blanco" como las páginas antiguas; es como una app de tu teléfono: rápida, fluida y suave.

---

## 2. Los Ingredientes: Herramientas que usaremos

| Herramienta | ¿Qué es en la vida real? | ¿Para qué sirve en el proyecto? |
| :--- | :--- | :--- |
| **Node.js** | El motor del coche | Permite a tu computadora entender y ejecutar código JavaScript moderno. |
| **pnpm** | El repartidor eficiente | Descarga las piezas que otros programadores ya inventaron (botones, iconos, etc.) de forma rápida y sin gastar espacio. |
| **React** | Bloques de LEGO | En vez de escribir miles de líneas, creas piecitas (`<Tarjeta />`, `<Boton />`, `<Navbar />`) y las ensamblas. |
| **TypeScript** | El profesor que revisa tu tarea | Te avisa si cometes un error antes de entregar (por ejemplo, si intentas sumar texto con un número). |
| **Tailwind CSS** | La caja de pinturas y colores | Te permite dar estilo y forma hermosa a los botones y tarjetas con palabras sencillas (`bg-white`, `rounded-2xl`, `p-4`). |
| **Firebase** | El archivador seguro en la nube | Guarda los usuarios registrados y los pedidos para que no se borren cuando apagues la máquina. |

---

## 3. Taller 1: Preparando tu mesa de trabajo (Instalación)

### Paso 1: Abrir la terminal
En tu computadora abre la terminal (la ventana negra donde escribes comandos).

### Paso 2: Descargar el código
Escribe el siguiente comando para copiar el proyecto en tu máquina:
```bash
git clone https://github.com/Slinkter/myprojectapi12.git
cd myprojectapi12
```

### Paso 3: Instalar las dependencias
> [!IMPORTANT]
> En este proyecto usamos **pnpm**, ¡nunca uses `npm`!
```bash
pnpm install
```

### Paso 4: Encender la tienda en tu computadora
```bash
pnpm dev
```
Verás un enlace como `http://localhost:5173`. Haz clic en él o ábrelo en tu navegador. ¡Felicidades! Ya tienes la tienda funcionando en tu pantalla.

---

## 4. Taller 2: ¿Cómo se organiza una aplicación grande? (La metáfora de la casa)

Si metes todos tus juguetes, libros y comida en un solo cajón, tu habitación será un desastre.  
Por eso usamos una regla llamada **Feature-Sliced Design (FSD)**:

```
src/
├── app/          ← Los cimientos y la puerta principal (configuración global)
├── pages/        ← Las habitaciones de la casa (Home, Checkout, Pedidos, Preguntas)
├── widgets/      ← Muebles grandes compuestos (La barra superior de navegación: Navbar)
├── features/     ← Las funciones de cada cuarto (el carrito, la búsqueda, los pagos)
├── entities/     ← Los objetos puros (la ficha de qué es un "Producto")
└── shared/       ← Herramientas universales (botones simples, formateador de precios, iconos)
```

**Regla de oro escolar:**  
Los componentes de arriba pueden usar cosas de abajo, pero las cosas de abajo **nunca** deben pedirle prestado a las de arriba.

---

## 5. Taller 3: Creando la Tarjeta de Producto (ProductCard)

Una tarjeta de producto muestra la foto, el nombre, el precio y un botón para comprar.

### ¿Cómo funciona en código? (Explicación para clase)

```tsx
// 1. Recibimos la información del producto (sus propiedades)
function TarjetaProducto({ producto }) {
  return (
    <article className="border border-slate-200 rounded-2xl p-4 bg-white shadow-sm">
      {/* 2. La foto del producto */}
      <img src={producto.foto} alt={producto.titulo} className="w-full h-48 object-contain" />

      {/* 3. Título y categoría */}
      <span className="text-xs uppercase text-slate-500">{producto.categoria}</span>
      <h3 className="font-medium text-slate-900">{producto.titulo}</h3>

      {/* 4. Precio y botón de comprar */}
      <div className="flex justify-between items-center mt-3">
        <span className="font-bold text-lg">${producto.precio}</span>
        <button className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700">
          Añadir
        </button>
      </div>
    </article>
  );
}
```

> [!TIP]
> **Lección de Diseño Moderno:**  
> Evitamos sombras cortadas y zooms agresivos que recorten la foto. Centramos la imagen y dejamos espacio para que el producto "respire".

---

## 6. Taller 4: El Carrito de Compras (Memoria compartida)

**El reto:** Si tocas el botón "Añadir" en una tarjeta, ¿cómo sabe la barra de arriba (Navbar) que el número debe cambiar de `0` a `1`?

### La solución: Context API (El tablón de anuncios)
En React usamos un **Contexto**. Imagina un tablón de anuncios en el pasillo del colegio:
1. Cuando pulsas "Añadir", envías una nota al tablón (`ADD_ITEM`).
2. El tablón guarda la lista de productos y la cantidad.
3. El icono del carrito en el techo siempre mira el tablón; en cuanto ve una nota nueva, se actualiza solo.

Además, usamos `localStorage`: si se te apaga la computadora o cierras la pestaña por error, tus productos siguen dentro del carrito cuando vuelves a abrir la tienda.

---

## 7. Taller 5: El Mostrador de Pago (Checkout y Matemáticas seguras)

Cuando el cliente va a pagar, no podemos equivocarnos en las cuentas:

$$\text{Total} = (\text{Subtotal} - \text{Descuentos}) + \text{Envío}$$

Para evitar errores, creamos una función centralizada llamada `calculateOrderFinancials`:
- Si el subtotal supera los **$50**, el envío es **GRATIS**.
- Si el cliente escribe un cupón (ej: `DESCUENTO10`), le descuenta el porcentaje correspondiente.
- Esta matemática se calcula exactamente igual en la pantalla y en el servidor, protegiendo tanto al comprador como al vendedor.

---

## 8. Taller 6: La Base de Datos (Firebase y la Nube)

¿A dónde viaja tu compra?
1. Tu aplicación se comunica de forma segura con **Firebase Firestore** (una base de datos moderna de Google).
2. Se realiza una **Transacción**:
   - Se revisa si todavía queda inventario (stock) del producto.
   - Si queda stock, se resta 1 del almacén.
   - Se guarda el pedido con la dirección del cliente y su lista de compras.
   - Si no quedaba stock, la compra se cancela amablemente para evitar vender lo que no existe.

---

## 9. Taller 7: ¿Cómo probar y publicar tu tienda en Internet?

Para asegurarnos de que el código no tenga ningún error, ejecutamos la **Cadena de Calidad**:

### 1. El Inspector de Reglas (Linter)
```bash
pnpm lint
```
*Revisa que no hayas dejado variables abandonadas o código desordenado.*

### 2. El Revisor de Tipos (TypeScript)
```bash
pnpm type-check
```
*Verifica que todas las operaciones matemáticas y funciones estén conectadas a la perfección.*

### 3. La Empaquetadora (Build)
```bash
pnpm build
```
*Toma todo tu código, lo comprime y lo convierte en archivos ultra rápidos dentro de la carpeta `dist/`.*

---

## 10. Preguntas Frecuentes y Glosario Escolar

- **¿Qué es un Componente?**  
  Una función que devuelve elementos visuales (como una pieza de LEGO).
- **¿Qué es un Hook (`useState`, `useEffect`)?**  
  Son "superpoderes" de React para que una función pueda recordar cosas (estado) o reaccionar cuando algo cambia en la pantalla.
- **¿Por qué no usamos imágenes pesadas?**  
  Porque ralentizan la conexión de los usuarios con teléfonos móviles. Usamos `LazyImage`, que sólo carga la imagen cuando el usuario hace scroll hacia ella.
- **¿Qué es Dark Mode (Modo Oscuro)?**  
  Un botón que cambia la paleta de colores a tonos oscuros para descansar la vista de noche y ahorrar batería.

---
*Documento didáctico creado para el proyecto MyProjectAPI12 bajo la metodología de documentación viva.*
