# Skill: ux-review

# UX Review Agent

Analiza páginas y componentes para generar un reporte detallado de mejoras de UX/UI.

## Uso

Este skill revisa:
1. Páginas principales (Home, Checkout, etc.)
2. Componentes de UI
3. Accesibilidad
4. Performance visual
5. Consistencia de diseño

## Workflow

1. **Recolectar archivos** - Listar todas las páginas y componentes
2. **Analizar cada página** - Revisar estructura, patrones, accesibilidad
3. **Identificar problemas** - Detectar issues de UX/UI
4. **Generar reporte** - Crear documento con recomendaciones

## Archivos a revisar

- `src/pages/*.tsx`
- `src/widgets/**/*.tsx`
- `src/features/**/presentation/*.tsx`
- `src/components/**/*.tsx`

## Output

Genera un reporte en markdown con:
- Puntuación por página (0-100)
- Lista de problemas encontrados
- Recomendaciones priorizadas
- Plan de acción

## Reglas

- Usar principios de UX: visibilidad, feedback, consistencia, recuperación
- Verificar WCAG 2.1 nivel AA
- Revisar responsive design
- Verificar animaciones y transiciones
