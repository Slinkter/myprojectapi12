# ⚛️ Tutorial de React - Nivel Básico

¡Bienvenido al mundo de React! En esta guía te explico los conceptos fundamentales de React de forma sencilla.

---

## 🤔 ¿Qué es React?

**React** es una librería (herramienta) criada por Facebook para crear interfaces de usuario.

Imagina que React son como **bloques de construcción**:
- Cada pieza de la pantalla es un "componente"
- Puedes combinar componentes para crear interfaces complejas
- Cuando los datos cambian, React actualiza automáticamente lo que se ve

---

## 📦 Concepto 1: Componentes

Un **componente** es una pieza reutilizable de la interfaz.

### Ejemplo: Un botón

```tsx
// MiBoton.tsx
function MiBoton() {
  return (
    <button className="btn-primary">
      Haz clic aquí
    </button>
  );
}
```

### ¿Cómo se usa?

```tsx
// En otro archivo
import { MiBoton } from './MiBoton';

function MiPagina() {
  return (
    <div>
      <h1>Mi Título</h1>
      <MiBoton />
      <MiBoton />
    </div>
  );
}
```

Resultado en pantalla:
```
┌─────────────────┐
│   Mi Título     │
├─────────────────┤
│ [Haz clic aquí] │
│ [Haz clic aquí] │
└─────────────────┘
```

---

## 📦 Concepto 2: Props (Propiedades)

Las **props** son como parámetros que le pasas a un componente. Es como dar instrucciones.

### Ejemplo: Botón con props

```tsx
// BotonSaludo.tsx
function BotonSaludo({ nombre }: { nombre: string }) {
  return (
    <button className="btn">
      Hola, {nombre}!
    </button>
  );
}

// Uso:
<BotonSaludo nombre="Juan" />  →  "Hola, Juan!"
<BotonSaludo nombre="Maria" /> →  "Hola, Maria!"
```

### Props con múltiples valores

```tsx
interface TarjetaProps {
  titulo: string;
  precio: number;
  imagen: string;
}

function Tarjeta({ titulo, precio, imagen }: TarjetaProps) {
  return (
    <div className="card">
      <img src={imagen} alt={titulo} />
      <h3>{titulo}</h3>
      <p>${precio}</p>
    </div>
  );
}

// Uso:
<Tarjeta 
  titulo="Camiseta" 
  precio={29.99} 
  imagen="/camiseta.jpg" 
/>
```

---

## 🔄 Concepto 3: Estado (useState)

El **estado** es información que cambia con el tiempo. Por ejemplo:
- ¿El menú está abierto o cerrado?
- ¿Cuántos productos hay en el carrito?
- ¿Qué texto escribió el usuario?

### Ejemplo: Contador

```tsx
import { useState } from 'react';

function Contador() {
  // useState devuelve: [valorActual, funciónParaCambiarElValor]
  const [cuenta, setCuenta] = useState(0);

  return (
    <div>
      <p>Cuenta: {cuenta}</p>
      <button onClick={() => setCuenta(cuenta + 1)}>
        Incrementar
      </button>
    </div>
  );
}
```

### ¿Qué hace useState?

1. **useState(0)** → Inicializa el estado con valor 0
2. **cuenta** → El valor actual (se puede leer)
3. **setCuenta(nuevoValor)** → Cambia el valor (actualiza la pantalla)

---

## ⚡ Concepto 4: Efectos (useEffect)

El **useEffect** sirve para ejecutar código cuando algo específico sucede.

### Ejemplo: Cargar datos al iniciar

```tsx
import { useEffect, useState } from 'react';

function ListaProductos() {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    // Este código se ejecuta UNA SOLA VEZ cuando el componente aparece
    async function fetchProductos() {
      const respuesta = await fetch('https://api.ejemplo.com/productos');
      const datos = await respuesta.json();
      setProductos(datos);
      setCargando(false);
    }

    fetchProductos();
  }, []); // ← El [] significa: "solo al principio"

  if (cargando) return <p>Cargando...</p>;

  return (
    <ul>
      {productos.map(p => <li key={p.id}>{p.nombre}</li>)}
    </ul>
  );
}
```

### Diferentes tipos de efectos

```tsx
// Se ejecuta solo al inicio (una vez)
useEffect(() => { ... }, []);

// Se ejecuta cuando 'contador' cambia
useEffect(() => { ... }, [contador]);

// Se ejecuta cuando el componente se desmonta
useEffect(() => {
  // cleanup
  return () => { ... };
}, []);
```

---

## 🔗 Concepto 5: Context (useContext)

El **Context** permite compartir información entre muchos componentes sin tener que pasar props por todos lados.

### Ejemplo: Carrito de compras

```tsx
// CartContext.tsx
import { createContext, useContext, useState } from 'react';

interface CartContextValue {
  items: number;
  addItem: () => void;
}

// Crear el contexto
const CartContext = createContext<CartContextValue | undefined>(undefined);

// Provider (envuelve la app)
export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState(0);

  const addItem = () => setItems(items + 1);

  return (
    <CartContext.Provider value={{ items, addItem }}>
      {children}
    </CartContext.Provider>
  );
}

// Hook para usar el carrito facilmente
export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
}
```

### ¿Cómo se usa?

```tsx
// En cualquier componente
import { useCart } from './CartContext';

function CarritoIcono() {
  const { items } = useCart();
  
  return <span>🛒 {items} items</span>;
}

function BotonComprar() {
  const { addItem } = useCart();
  
  return <button onClick={addItem}>Agregar al carrito</button>;
}
```

---

## 🎯 Concepto 6: Renderizado Condicional

Mostrar diferentes cosas según una condición.

```tsx
function Usuario({ usuario }: { usuario: { nombre: string; estaLogueado: boolean } }) {
  if (usuario.estaLogueado) {
    return <p>Bienvenido, {usuario.nombre}!</p>;
  }
  
  return <p>Por favor, inicia sesión</p>;
}

// O con operador ternario:
function Usuario2({ usuario }: { usuario: { nombre: string } }) {
  return (
    <div>
      {usuario 
        ? <p>Hola, {usuario.nombre}</p>
        : <p>Hola, invitado</p>
      }
    </div>
  );
}
```

---

## 🔁 Concepto 7: Listas (map)

Renderizar una lista de elementos.

```tsx
function ListaProductos({ productos }: { productos: { id: number; nombre: string }[] }) {
  return (
    <ul>
      {productos.map(producto => (
        <li key={producto.id}>
          {producto.nombre}
        </li>
      ))}
    </ul>
  );
}
```

> ⚠️ **Importante**: Siempre usa una `key` única en listas. Es para que React pueda identificar cada elemento.

---

## 🎨 Concepto 8: Estilos con Tailwind

En este proyecto usamos **Tailwind CSS** para dar estilos.

```tsx
// Clases de Tailwind
function EjemploEstilos() {
  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-gray-800">
        Título Grande
      </h1>
      <p className="text-gray-600 mt-2">
        Texto de color gris
      </p>
      <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
        Botón azul
      </button>
    </div>
  );
}
```

### Clases comunes

| Clase | Qué hace |
|-------|----------|
| `flex` | Contenedor flexible |
| `p-4` | Padding (espacio interno) |
| `m-2` | Margin (espacio externo) |
| `text-xl` | Tamaño de texto grande |
| `bg-blue-500` | Fondo azul |
| `text-white` | Texto blanco |
| `rounded` | Bordes redondeados |
| `shadow-md` | Sombra mediana |

---

## 📋 Resumen de Conceptos

| Concepto | Para qué sirve | Ejemplo |
|----------|----------------|---------|
| **Componente** | Pieza reutilizable de UI | `<Boton />` |
| **Props** | Datos que le pasas | `<Boton texto="OK" />` |
| **useState** | Información que cambia | `const [count, setCount] = useState(0)` |
| **useEffect** | Efectos secundarios | `useEffect(() => {...}, [])` |
| **useContext** | Compartir datos globalmente | `useCart()` |
| **Conditional** | Mostrar según condición | `{loggedIn ? ... : ...}` |
| **map** | Renderizar listas | `{items.map(i => ...)}` |

---

## ✅ Checklist de verificación

- [ ] Sé crear un componente
- [ ] Sé usar props para pasar datos
- [ ] Sé usar useState para estado
- [ ] Sé usar useEffect para efectos
- [ ] Sé usar useContext para compartir datos
- [ ] Sé renderizar listas con map

---

## 🎯 Siguiente paso

Ahora que conoces React, vuelve a ver cómo está estructurado el proyecto:

👉 **[02-ESTRUCTURA-PROYECTO.md](02-ESTRUCTURA-PROYECTO.md)**

---

## 📚 Recursos adicionales

- [Documentación oficial de React](https://react.dev/)
- [Tutorial interactivo de React](https://react.dev/learn)
- [Tailwind CSS](https://tailwindcss.com/)

---

¡Felicidades! Ahora conoces los fundamentos de React 🎉
