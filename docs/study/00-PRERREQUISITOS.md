# 00 — Prerrequisitos

Herramientas necesarias para trabajar con el proyecto myprojectapi12.

---

## 1. Node.js ≥ 18

Entorno de ejecución de JavaScript.

```bash
node --version   # v18.x, v20.x o superior
npm --version    # viene con Node.js
```

**Descarga:** [https://nodejs.org](https://nodejs.org) (versión LTS recomendada)

---

## 2. pnpm ≥ 8

Gestor de paquetes rápido y eficiente. Este proyecto usa `pnpm` en lugar de `npm`.

```bash
npm install -g pnpm
pnpm --version   # 8.x, 9.x o superior
```

**¿Por qué pnpm?** Es más rápido que npm, ahorra espacio en disco con un almacén global de dependencias, y tiene un estricto manejo de dependencias que evita bugs.

---

## 3. Git

Control de versiones.

```bash
git --version    # git version 2.x
```

**Descarga:** [https://git-scm.com](https://git-scm.com)

---

## 4. VS Code + Extensiones

Editor de código recomendado.

**Descarga:** [https://code.visualstudio.com](https://code.visualstudio.com)

### Extensiones recomendadas

| Extensión | ID | Propósito |
|-----------|----|-----------|
| **ESLint** | `dbaeumer.vscode-eslint` | Linting en tiempo real |
| **Tailwind CSS IntelliSense** | `bradlc.vscode-tailwindcss` | Autocompletado de clases Tailwind |
| **Prettier** | `esbenp.prettier-vscode` | Formateo de código |
| **GitLens** | `eamodio.gitlens` | Visualización Git en editor |
| **TypeScript + Plugin** | — | Soporte TS nativo en VS Code |

---

## 5. Verificación final

Ejecuta estos comandos para asegurarte de que todo está listo:

```bash
node --version && pnpm --version && git --version
code --version
```

---

## Enlaces relacionados

- [01-INICIO-RAPIDO.md](./01-INICIO-RAPIDO.md) — Siguiente paso: clonar y ejecutar
- [03-TECNOLOGIAS.md](./03-TECNOLOGIAS.md) — Stack tecnológico del proyecto
