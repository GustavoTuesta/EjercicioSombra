---
name: ui-standards
description: Guía de estándar UI para CRUDs en HTML, CSS y JS puro.
---

# Estándar UI para CRUDs (Vainilla JS)

Esta guía define el sistema de diseño y los componentes base para aplicaciones CRUD modernas construidas sin frameworks.

## 1. Sistema de Diseño

### Tipografía
- **Fuente**: 'Inter', system-ui, -apple-system, sans-serif.
- **Escala**:
    - `heading-1`: 2.5rem (Semibold)
    - `heading-2`: 1.75rem (Semibold)
    - `body`: 1rem (Regular)
    - `small`: 0.875rem (Regular)

### Colores (Variables CSS)
```css
:root {
  --ui-primary: #6366f1;
  --ui-primary-hover: #4f46e5;
  --ui-success: #22c55e;
  --ui-danger: #ef4444;
  --ui-warning: #f59e0b;
  --ui-bg: #f8fafc;
  --ui-surface: #ffffff;
  --ui-text: #1e293b;
  --ui-text-light: #64748b;
  --ui-border: #e2e8f0;
}
```

### Espaciado y Bordes
- **Gris de espaciado**: Base 4px (4px, 8px, 16px, 24px, 32px).
- **Border Radius**: `8px` para componentes pequeños, `12px` para contenedores.
- **Sombras**:
    - `low`: 0 1px 3px rgba(0,0,0,0.1)
    - `medium`: 0 4px 6px -1px rgba(0,0,0,0.1)

## 2. Convención de Clases (BEM)

Se utiliza la metodología **BEM (Block Element Modifier)**:
- `.block`: El componente principal (ej: `.c-card`).
- `.block__element`: Parte interna (ej: `.c-card__title`).
- `.block--modifier`: Variante o estado (ej: `.c-button--primary`, `.c-button--disabled`).

Prefijo recomendado: `c-` para componentes.

## 3. Componentes Base

### Button
- `.c-button`: Estilos base.
- `.c-button--primary`: Color principal.
- `.c-button--danger`: Color de error/borrado.
- `.c-button--loading`: Estado de carga (spinner).

### Input / Textarea / Select
- `.c-input`: Estilo unificado para campos de texto.
- `.c-input--error`: Borde rojo cuando hay fallas de validación.

### Card
- `.c-card`: Contenedor con fondo blanco, bordes redondeados y sombra suave.

### Modal
- `.c-modal`: Overlay oscuro con desenfoque.
- `.c-modal__content`: Diálogo centralizado.

### Badge
- `.c-badge`: Pequeñas etiquetas de estado (ej: "Completado", "Pendiente").

## 4. Estados Visuales

- **Hover**: Cambio sutil de color de fondo o elevación (shadow).
- **Active**: Efecto de presión (scale 0.98).
- **Disabled**: Opacidad 0.5 y `cursor: not-allowed`.
- **Loading**: Uso de un spinner CSS o cambio de texto.

## 5. Buenas Prácticas

- **Accesibilidad**:
    - Usar etiquetas `<label>` vinculadas a sus inputs.
    - Asegurar contraste de color suficiente.
    - Soporte para navegación por teclado (`:focus-visible`).
- **Diseño Responsive**:
    - Usar `flexbox` y `grid`.
    - Media queries para ajustar contenedores en móviles (`max-width: 480px`).
