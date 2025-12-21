# Tutorial: Implementar Persistencia en el Carrito de Compras

Este tutorial te guiará paso a paso para que implementes manualmente la funcionalidad de guardar el carrito en el navegador.

**El objetivo:** Que si un usuario recarga la página, sus productos sigan ahí.

---

## 📂 Archivo a modificar

Vas a trabajar exclusivamente en este archivo:
`src/features/cart/application/CartContext.jsx`

---

## 🧠 Conceptos clave que usarás

1.  **`localStorage`**: Es como una pequeña base de datos en el navegador del usuario. Guarda texto, incluso si cierras el navegador.
    -   `localStorage.getItem('clave')`: Para leer.
    -   `localStorage.setItem('clave', 'valor')`: Para guardar.
2.  **`JSON.parse()` y `JSON.stringify()`**:
    -   El localStorage solo guarda _texto_ (strings), pero tu carrito es un _array_ de objetos.
    -   Usaremos `stringify` para convertir tu Array a Texto (al guardar).
    -   Usaremos `parse` para convertir ese Texto a Array (al leer).
3.  **`useEffect`**: Para decirle a React: "Cada vez que cambie el carrito, guárdalo otra vez".

---

## 🛠️ Paso 1: Leer los datos al iniciar (Lazy Initialization)

Actualmente, tu código probablemente inicializa el estado así:

```javascript
const [cart, setCart] = useState([]);
```

Esto le dice a React: "Empieza siempre con un array vacío". ¡Eso es lo que queremos cambiar!

**Tu Tarea:** Modifica esa línea para que busque en localStorage primero.

**Código a implementar:**

```javascript
// En lugar de useState([]) usa esto:

const [cart, setCart] = useState(() => {
    // 1. Intentamos leer del navegador
    const savedCart = localStorage.getItem("cart");

    // 2. Si hay algo guardado, lo convertimos de texto a objeto JS y lo usas
    if (savedCart) {
        return JSON.parse(savedCart);
    }

    // 3. Si no hay nada (es la primera vez), devolvemos un array vacío
    return [];
});
```

_Nota:_ Al pasarle una función a `useState`, React solo la ejecuta la primera vez que carga la página. Esto es muy eficiente.

---

## 🛠️ Paso 2: Guardar los datos cuando cambien

Ahora ya leemos los datos viejos, pero... ¡no estamos guardando los nuevos!
Necesitamos un "efecto secundario" que vigile la variable `cart`.

**Tu Tarea:** Añade este `useEffect` justo después de declarar tu estado (debajo del código del Paso 1).

**Código a implementar:**

```javascript
useEffect(() => {
    // Cada vez que 'cart' cambie, lo convertimos a texto y lo guardamos
    localStorage.setItem("cart", JSON.stringify(cart));
}, [cart]); // <--- Este array [cart] es vital: le dice cuando ejecutarse
```

---

## 🧪 Paso 3: Verificación (El Test Manual)

Una vez hayas hecho los cambios y guardado el archivo:

1.  Abre tu proyecto en el navegador (`pnpm run dev`).
2.  Añade un par de productos al carrito.
3.  Presiona **F5** (Recargar página).
4.  Mirad al icono del carrito. **¿Sigue teniendo el número de productos?**
    -   **SÍ:** ¡Éxito total! 🎉 Lo has logrado.
    -   **NO:** Algo falló. Revisa la consola del navegador (F12) por si hay errores rojos.

---

## 🆘 ¿Dudas?

Si te atascas, revisa que:

1.  No hayas borrado accidentalmente las funciones `addToCart` o `removeFromCart`.
2.  El nombre de la clave `'cart'` sea el mismo al leer y al guardar.

¡Ánimo, tú puedes! 💪
