# 🎓 Guía para Estudiantes de Programación

¡Bienvenido a este proyecto! Esta guía está escrita especialmente para ti, que estás aprendiendo a programar.

---

## 📚 ¿Qué vas a aprender aquí?

Este proyecto es una **tienda online** (e-commerce) construida con tecnologías modernas de desarrollo web:

| Tecnología | ¿Qué es? |
|------------|----------|
| **React** | Una librería para crear interfaces de usuario |
| **TypeScript** | JavaScript con superpoderes (detecta errores antes de ejecutar) |
| **Vite** | Una herramienta que hace el desarrollo muy rápido |
| **Tailwind CSS** | Para estilizar las páginas web fácilmente |

---

## 🚀 ¿Cómo empiezo?

### Paso 1: Instalar Node.js
Si no lo tienes, descarga Node.js desde: https://nodejs.org
- Descarga la versión **LTS** (la más estable)
- Simplemente dale "Next" a todo durante la instalación

### Paso 2: Descargar el proyecto
```bash
# Abre tu terminal y escribe:
git clone https://github.com/tu-usuario/myprojectapi12.git
cd myprojectapi12
```

### Paso 3: Instalar las dependencias
```bash
# Este comando descarga todas las herramientas que el proyecto necesita
pnpm install
```

### Paso 4: ¡Ejecutar el proyecto!
```bash
# Esto abre la tienda en tu navegador
pnpm dev
```

Deberías ver algo así:
```
  VITE v5.4.21  ready in 300 ms

  ➜  Local:   http://localhost:5173/
```

¡Eso es todo! Ya tienes la tienda funcionando 🎉

---

## 📁 ¿Qué hay en este proyecto?

```
myprojectapi12/
├── src/                    ← Aquí está todo el código
│   ├── features/           ← Las funcionalidades de la tienda
│   │   ├── products/       ← Todo sobre los productos
│   │   ├── cart/           ← El carrito de compras
│   │   └── checkout/       ← El proceso de pago
│   ├── components/         ← Piezas reutilizables de la interfaz
│   ├── pages/              ← Las páginas principales
│   └── app/                ← Configuración de la aplicación
├── docs/                   ← La documentación (lo que estás leyendo)
└── package.json            ← Lista de herramientas del proyecto
```

No te preocupes si no entiendes todo ahora. ¡Iremos poco a poco!

---

## ✅ Checklist de verificación

- [ ] Instalé Node.js
- [ ] Descargué el proyecto
- [ ] Ejecuté `pnpm install`
- [ ] Ejecuté `pnpm dev`
- [ ] Vi la tienda en mi navegador

---

## ❓ Preguntas frecuentes

**P: ¿Qué hago si me da error al ejecutar?**
R: Asegúrate de haber instalado Node.js y ejecutado `pnpm install`. Si el error continúa, pregunta a tu profesor o busca en Google el mensaje de error.

**P: ¿Cómo puedo ver los cambios que hago?**
R: Simply save your file and the browser will update automatically. It's like magic!

**P: ¿Dónde puedo pedir ayuda?**
R: 1. Revisa la documentación en esta carpeta `docs/`
   2. Pregunta a tus compañeros
   3. Consulta a tu profesor

---

## 🎯 Siguiente paso

Ahora que tienes el proyecto funcionando, te recomiendo leer:

👉 **[02-ESTRUCTURA-PROYECTO.md](02-ESTRUCTURA-PROYECTO.md)** - Para entender cómo está organizado el código

---

¡Mucho éxito con tu aprendizaje! 🚀
