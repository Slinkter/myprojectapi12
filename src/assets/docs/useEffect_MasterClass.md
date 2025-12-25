# 🎓 Master Class: useEffect a Profundidad (Nivel Experto)

## 0. El Cambio de Paradigma Mental

Olvida lo que sabes sobre "Ciclos de Vida" (`componentDidMount`, `componentDidUpdate`, :`componentWillUnmount`).
**`useEffect` NO es un ciclo de vida.**

`useEffect` es una herramienta de **Sincronización**.
Su propósito es: _"Sincronizar el estado de React con un Sistema Externo"_.

-   **Sistema Externo:** El DOM, una API, un WebSocket, un temporizador, `localStorage`.

---

## 1. Anatomía y El "Render Cycle"

```javascript
useEffect(() => {
    // 1. SETUP CODE
    const connection = createConnection(serverUrl, roomId);
    connection.connect();

    // 2. CLEANUP FUNCTION
    return () => {
        connection.disconnect();
    };
}, [serverUrl, roomId]); // 3. DEPENDENCIES
```

### El Flujo Real:

1.  **Render Commit:** React pinta la UI en la pantalla.
2.  **Cleanup (Anterior):** Si hubo un render previo, React ejecuta la función de _cleanup_ del efecto anterior.
3.  **Setup (Actual):** React ejecuta el _setup_ del nuevo efecto.

**⚠️ Nota Crítica:** En `StrictMode` (Desarrollo), React ejecuta esto **DOS** veces explícitamente (`Setup -> Cleanup -> Setup`) para probar que tu lógica de limpieza sea resiliente.

---

## 2. La Matriz de Dependencias `[]` (El Diablo está en los detalles)

El arreglo de dependencias es tu afirmación de verdad a React.

> "Solo vuelve a ejecutar esta sincronización si estos valores cambian".

### Caso A: Dependencias Primitivas vs Referenciales

```javascript
// ❌ PELIGRO: Dependencia Inestable
useEffect(() => {
    api.fetch(options);
}, [options]); // Si 'options' es un objeto { id: 1 }, cada render CREA un nuevo objeto en memoria.
// Resultado: Bucle infinito o re-ejecución en cada render.
```

**Solución 1 (Memoización):**

```javascript
const options = useMemo(() => ({ id: 1 }), []);
```

**Solución 2 (Mover dentro del efecto):**

```javascript
useEffect(() => {
    const options = { id: 1 }; // Ahora es local y no importa.
    api.fetch(options);
}, []);
```

### Caso B: Funciones como Dependencia

Si pasas una función al array, asegúrate de que esté envuelta en `useCallback`, o romperás la optimización.

---

## 3. Casos de Uso Avanzados y Patrones

### Patrón 1: "Data Fetching" y "Race Conditions" (Condiciones de Carrera)

El error junior más común es ignorar que las respuestas de red pueden llegar en desorden.

```javascript
useEffect(() => {
    let ignore = false; // Flag de control

    async function fetchProfile() {
        const result = await api.getUser();
        if (!ignore) {
            setBio(result.bio);
        }
    }

    fetchProfile();

    return () => {
        ignore = true; // Si el componente se desmonta o id cambia, ignoramos la respuesta anterior.
    };
}, [userId]);
```

_Truco Pro:_ Usa `AbortController` para cancelar la petición real al navegador.

### Patrón 2: Event Listener Dinámico

Sincronizarse con eventos del DOM que dependen del estado.

```javascript
useEffect(() => {
    const handleScroll = () => {
        if (window.scrollY > scrollThreshold) {
            // 'scrollThreshold' es estado dinámico
            // ...
        }
    };

    window.addEventListener("scroll", handleScroll);

    // Limpieza OBLIGATORIA
    return () => window.removeEventListener("scroll", handleScroll);
}, [scrollThreshold]); // 👈 Si esto cambia, quitamos el listener viejo y ponemos uno nuevo.
```

---

## 4. Trucos de Experto (Doctorado)

### Truco A: Leer el último estado sin re-ejecutar el efecto (`useEvent` pattern)

A veces quieres leer un valor dentro del efecto (para analytics, logs), pero NO quieres que ese valor reinicie el efecto.

```javascript
// Imagina que quieres loguear la visita, pero solo cuando cambia la 'url', NO cuando cambia el 'usuario'.
useEffect(() => {
    logVisit(url, user.name);
}, [url, user.name]); // ❌ Esto loguea cada vez que el usuario cambia, ¡MALO!
```

**Solución (Uso de Refs para romper reactividad):**

```javascript
const userRef = useRef(user);

// Mantenemos la ref actualizada siempre
useEffect(() => {
    userRef.current = user;
});

useEffect(() => {
    // Leemos de la ref. La ref NO es una dependencia reactiva.
    logVisit(url, userRef.current.name);
}, [url]); // ✅ Solo se ejecuta al cambiar la URL.
```

### Truco B: ¿Cuándo NO usar useEffect?

El 80% de los `useEffect` en código legacy son innecesarios.

1.  **No lo uses para transformar datos:**
    -   ❌ `useEffect(() => setFullName(name + lastName), [name, lastName])`
    -   ✅ `const fullName = name + lastName;` (Derivación directa durante render).
2.  **No lo uses para eventos de usuario:**
    -   ❌ `useEffect` escuchando un estado `isSubmitted` para hacer POST.
    -   ✅ Haz el POST directamente en el `handleSubmit` u `onClick`.

---

## 5. Resumen Ejecutivo

1.  **Setup + Cleanup** es la unidad atómica. Deben ser simétricos.
2.  Cada valor reactivo (state, prop, context) que uses **adentro**, debe ir en el **array**.
3.  Si no quieres que vaya en el array, demuestra que no es reactivo o usa un `ref`.
4.  Si tu efecto ajusta el estado basado en otro estado, probablemente estás haciendo algo mal -> **Deriva el estado**.
