# 🏗️ Arquitectura de Software

## Paradigma
El proyecto sigue una **Arquitectura Basada en Features (Feature-Based Architecture)** inspirada en **Clean Architecture** y **Domain-Driven Design (DDD)**. El código se organiza por módulos funcionales, cada uno con sus propias capas de responsabilidad.

## Diagrama de Capas

```mermaid
graph TD
    User((Usuario)) --> View[Capa de Presentación<br>(React Components / UI)]
    
    subgraph Feature Module
        View --> Application[Capa de Aplicación<br>(Hooks / Context)]
        Application --> Domain[Capa de Dominio<br>(Lógica Pura / Tipos)]
        Application --> Infrastructure[Capa de Infraestructura<br>(API Clients / Query)]
    end
    
    Infrastructure --> External[API Externa / TanStack Query]
```

## Estructura de Directorios (Actualizada)

La estructura `src/` se organiza de la siguiente manera:

```text
src/
├── app/                  # Configuración Global
│   ├── api/              # Configuración de TanStack Query y clientes
│   ├── config/           # Proveedores y variables de entorno
│   └── routing/          # Definición de rutas (React Router 7)
│
├── features/             # Módulos de Negocio Vertical (DDD)
│   ├── [feature]/
│   │   ├── application/  # Hooks (useFeature), Contextos
│   │   ├── domain/       # Lógica de negocio, utilidades puras, tipos
│   │   ├── infrastructure/ # Llamadas a API, adaptadores de datos
│   │   └── presentation/ # Componentes UI específicos del feature
│   ├── cart/             # Carrito de compras
│   ├── products/         # Catálogo de productos
│   └── checkout/         # Proceso de pago
│
├── components/           # Componentes Compartidos
│   ├── common/           # Layout, Error Boundaries, Navbar
│   └── ui/               # Componentes Shadcn/UI (primitivos)
│
├── pages/                # Vistas de Alto Nivel (Rutas)
│
└── styles/               # Estilos Globales y Configuración Tailwind 4
```

## Patrones de Diseño Aplicados

### 1. Domain-Driven Design (DDD) Lite
Cada feature encapsula su propia lógica de dominio (`domain`), casos de uso (`application`) y adaptadores externos (`infrastructure`), permitiendo que el código sea modular y testeable.

### 2. TanStack Query para Estado de Servidor
Se utiliza React Query para manejar la sincronización con la API, eliminando la necesidad de manejar estados de carga y error manualmente en la mayoría de los casos.

### 3. Context API para Estado UI
Para estados puramente de interfaz de usuario que atraviesan la aplicación (como el carrito o el tema), se utiliza React Context junto con Custom Hooks.

### 4. Shadcn/UI + Tailwind 4
Adopción de un sistema de diseño basado en componentes reutilizables y altamente personalizables mediante clases de utilidad, con tokens de diseño definidos en CSS.

---
_Última actualización: 12 de febrero de 2026_
