# Calidad, Riesgos y Mantenibilidad

## 1. Estrategia de Calidad

La calidad en **MyProjectAPI12** se sostiene sobre tres pilares:

### A. Arquitectura Limpia

La separación de responsabilidades facilita la prueba y modificación de componentes sin efectos colaterales. Al desacoplar la API de la vista, podemos cambiar de proveedor de datos sin romper la UI.

### B. Análisis Estático (Linting)

Se utiliza **ESLint** con reglas estándar para React.

-   Previene errores comunes (variables no usadas, dependencias de hooks faltantes).
-   Asegura consistencia de estilo.

### C. Accesibilidad y UI

Uso de **Material Tailwind** y etiquetas semánticas HTML5.

-   Asegura contraste adecuado y estructura navegable por teclado.

## 2. Deuda Técnica Actual

| Ítem               | Severidad | Descripción                                             | Plan de Mitigación                                      |
| :----------------- | :-------- | :------------------------------------------------------ | :------------------------------------------------------ |
| **Persistencia**   | Alta      | El carrito se pierde al refrescar (F5).                 | Implementar `localStorage` en `CartContext`.            |
| **Testing**        | Media     | Cobertura de tests al 0%.                               | Configurar Vitest + RTL y testear flujos críticos.      |
| **Mappers API**    | Baja      | Acoplamiento directo a la estructura JSON de DummyJSON. | Crear capa de transformación en `infrastructure`.       |
| **Hardcoded Text** | Baja      | Textos fijos en código (sin i18n).                      | Extraer textos a archivo de constantes o librería i18n. |

## 3. Análisis de Riesgos

### R1. Dependencia de API Externa

-   **Riesgo:** Si `dummyjson.com` cae o cambia su esquema, la app deja de funcionar.
-   **Impacto:** Crítico.
-   **Mitigación:** Implementar un adaptador (Adapter Pattern) en `infrastructure` que intercepte y normalice los errores o datos.

### R2. Rendimiento en Listados Grandes

-   **Riesgo:** Renderizar miles de productos en el DOM puede congelar el navegador.
-   **Impacto:** Medio (UX pobre).
-   **Mitigación:** Implementar "Virtualización" (React Window) si el catálogo crece significativamente.

## 4. Recomendaciones Futuras (Roadmap de Calidad)

1.  **Integración Continua (CI):** Configurar GitHub Actions para correr el linter y build en cada Push.
2.  **Husky + Lint-Staged:** Impedir commits que no pasen las reglas de calidad.
3.  **Monitoreo de Errores:** Integrar Sentry para trackear errores en producción.
4.  **Optimización de Imágenes:** Implementar carga adaptativa de imágenes (WebP, tamaños dinámicos).
