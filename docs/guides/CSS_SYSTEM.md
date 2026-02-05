# 🎨 CSS System Guide

**Project:** MyProjectAPI12  
**Last Updated:** February 5, 2026

---

## Overview

MyProjectAPI12 uses a **modular CSS architecture** built on Tailwind CSS with custom design tokens, utility classes, and component-specific styles.

---

## File Structure

\`\`\`
src/
├── index.css # Main entry (imports only)
└── styles/
├── variables.css # Design tokens
├── animations.css # Keyframes
├── buttons.css # Button system
├── cards.css # Card system
└── components.css # Specific components
\`\`\`

---

## Design Tokens

### Colors

**Location:** `src/styles/variables.css`

\`\`\`css
:root {
/_ Light Mode _/
--bg-main: #f8fafc;
--bg-card: #ffffff;
--bg-input: #f1f5f9;

    --text-primary: #1a1614;
    --text-secondary: #64748b;
    --text-accent: #d97706;

    --border-light: #e2e8f0;

}

.dark:root {
/_ Dark Mode _/
--bg-main: #0f172a;
--bg-card: #1e293b;
--bg-input: #334155;

    --text-primary: #f8fafc;
    --text-secondary: #94a3b8;
    --text-accent: #fbbf24;

    --border-light: #334155;

}
\`\`\`

### Shadows

\`\`\`css
:root {
--shadow-soft:
0 4px 12px -2px rgba(15, 23, 42, 0.08),
0 2px 6px -1px rgba(15, 23, 42, 0.04);

    --shadow-hover:
        0 12px 24px -4px rgba(15, 23, 42, 0.12),
        0 4px 12px -2px rgba(15, 23, 42, 0.06);

}
\`\`\`

---

## Button System

### Base Button

\`\`\`css
.btn-base {
@apply px-5 py-2.5 rounded-xl font-medium transition-all duration-300 border;
box-shadow: var(--shadow-soft);
}

.btn-base:active {
@apply transform scale-95;
transition: transform 0.1s ease;
}
\`\`\`

### Button Variants

#### Primary Button (CTAs)

\`\`\`css
.btn-primary {
@apply btn-base bg-gradient-to-r from-amber-600 to-orange-600 text-white border-transparent shadow-lg;
}

.btn-primary:hover {
@apply from-amber-700 to-orange-700 shadow-xl;
box-shadow: 0 8px 20px -4px rgba(217, 119, 6, 0.4);
transform: translateY(-2px);
}
\`\`\`

**Usage:**
\`\`\`jsx
<button className="btn-primary">
Add to Cart
</button>
\`\`\`

#### Secondary Button

\`\`\`css
.btn-secondary {
@apply btn-base border-transparent;
background-color: var(--bg-card);
border-color: var(--border-light);
color: var(--text-primary);
}

.btn-secondary:hover {
@apply bg-amber-50 border-amber-300;
color: var(--text-accent);
box-shadow: var(--shadow-hover);
transform: translateY(-2px);
}
\`\`\`

**Usage:**
\`\`\`jsx
<button className="btn-secondary">
Clear Cart
</button>
\`\`\`

### Specific Button Classes

All specific buttons extend the base variants:

\`\`\`css
/_ Primary actions _/
.cart-checkout-button,
.product-add-to-cart-button,
.checkout-pay-button {
@apply btn-primary;
}

/_ Secondary actions _/
.cart-clear-button,
.error-fallback-home-button {
@apply btn-secondary;
}
\`\`\`

---

## Card System

### Base Card

\`\`\`css
.card-base {
@apply bg-white rounded-2xl border border-slate-200;
box-shadow:
0 1px 3px 0 rgba(0, 0, 0, 0.1),
0 1px 2px -1px rgba(0, 0, 0, 0.1);
transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
animation: slideUp 0.5s ease-out;
}

.card-base:hover {
border-color: var(--text-accent);
box-shadow:
0 10px 15px -3px rgba(0, 0, 0, 0.1),
0 4px 6px -4px rgba(0, 0, 0, 0.1);
transform: translateY(-4px) scale(1.01);
}
\`\`\`

**Usage:**
\`\`\`jsx

<div className="card-base">
    <h3>Card Title</h3>
    <p>Card content</p>
</div>
\`\`\`

### Product Card (Special Variant)

\`\`\`css
.product-card {
@apply flex flex-col h-full bg-[var(--bg-card)] rounded-2xl overflow-hidden border border-[var(--border-light)];
box-shadow: var(--shadow-soft);
transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
animation: fadeInUp 0.6s ease-out backwards;
}

.product-card:hover {
box-shadow: var(--shadow-hover);
border-color: var(--text-accent);
transform: translateY(-8px) scale(1.02);
}

.product-card\_\_image {
@apply w-full h-48 object-contain p-4;
transition: transform 0.4s ease;
}

.product-card:hover .product-card\_\_image {
transform: scale(1.05);
}
\`\`\`

### Staggered Animations

\`\`\`css
.product-card:nth-child(1) { animation-delay: 0.05s; }
.product-card:nth-child(2) { animation-delay: 0.1s; }
.product-card:nth-child(3) { animation-delay: 0.15s; }
.product-card:nth-child(4) { animation-delay: 0.2s; }
/_ ... up to 8 _/
\`\`\`

---

## Animation System

### Available Animations

**Location:** `src/styles/animations.css`

#### fadeIn

\`\`\`css
@keyframes fadeIn {
from {
opacity: 0;
transform: translateY(10px);
}
to {
opacity: 1;
transform: translateY(0);
}
}
\`\`\`

**Usage:**
\`\`\`css
#root {
animation: fadeIn 0.4s ease-out;
}
\`\`\`

#### slideUp

\`\`\`css
@keyframes slideUp {
from {
opacity: 0;
transform: translateY(20px);
}
to {
opacity: 1;
transform: translateY(0);
}
}
\`\`\`

**Usage:**
\`\`\`css
.card-base {
animation: slideUp 0.5s ease-out;
}
\`\`\`

#### fadeInUp (Product Cards)

\`\`\`css
@keyframes fadeInUp {
from {
opacity: 0;
transform: translateY(30px);
}
to {
opacity: 1;
transform: translateY(0);
}
}
\`\`\`

#### slideInRight (Cart Drawer)

\`\`\`css
@keyframes slideInRight {
from {
transform: translateX(100%);
opacity: 0;
}
to {
transform: translateX(0);
opacity: 1;
}
}
\`\`\`

**Usage:**
\`\`\`css
.cart-drawer {
animation: slideInRight 0.3s ease-out;
}
\`\`\`

#### pulse (Load More Button)

\`\`\`css
@keyframes pulse {
0%, 100% {
box-shadow: 0 4px 12px rgba(217, 119, 6, 0.3);
}
50% {
box-shadow: 0 8px 24px rgba(217, 119, 6, 0.5);
}
}
\`\`\`

**Usage:**
\`\`\`css
.page-home\_\_load-more-button {
animation: pulse 2s ease-in-out infinite;
}
\`\`\`

---

## Component-Specific Styles

### Form Inputs

\`\`\`css
.neumo-input,
.checkout-form-input {
@apply w-full rounded-xl bg-[var(--bg-input)] p-3.5 text-[var(--text-primary)] border border-transparent transition-all outline-none;
}

.neumo-input:focus,
.checkout-form-input:focus {
@apply border-amber-500 bg-[var(--bg-card)] ring-2 ring-amber-500/20;
box-shadow: 0 0 0 3px rgba(217, 119, 6, 0.1);
}
\`\`\`

### Cart Drawer

\`\`\`css
.cart-drawer {
@apply bg-[var(--bg-card)] shadow-2xl border-l border-[var(--border-light)];
animation: slideInRight 0.3s ease-out;
}

.cart-drawer\_\_header {
@apply border-b border-[var(--border-light)] pb-4 mb-4 flex items-center justify-between;
}

.cart-drawer\_\_item {
@apply border-b border-[var(--border-light)] last:border-0 py-4;
animation: fadeIn 0.3s ease-out;
}

.cart-drawer\_\_item-price {
@apply font-bold;
color: var(--text-accent);
}
\`\`\`

---

## Dark Mode Support

### Automatic Dark Mode

All CSS variables automatically switch based on the `.dark` class:

\`\`\`css
/_ Light mode (default) _/
:root {
--bg-main: #f8fafc;
}

/_ Dark mode _/
.dark:root {
--bg-main: #0f172a;
}
\`\`\`

### Component Dark Mode

\`\`\`css
.card-base {
@apply bg-white;
}

.dark .card-base {
@apply bg-slate-800 border-slate-700;
}
\`\`\`

---

## Tailwind Integration

### Custom Configuration

**File:** `tailwind.config.js`

\`\`\`javascript
export default {
darkMode: 'class',
content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
theme: {
extend: {
fontFamily: {
lora: ['Lora', 'Georgia', 'serif'],
},
colors: {
amber: {
// Custom amber shades
},
},
},
},
};
\`\`\`

### Using Tailwind with Custom CSS

\`\`\`css
/_ Combine Tailwind utilities with custom properties _/
.btn-primary {
@apply px-5 py-2.5 rounded-xl; /_ Tailwind _/
background: var(--gradient-primary); /_ Custom _/
}
\`\`\`

---

## Best Practices

### 1. Use Design Tokens

✅ **Do:**
\`\`\`css
.my-component {
background-color: var(--bg-card);
color: var(--text-primary);
}
\`\`\`

❌ **Don't:**
\`\`\`css
.my-component {
background-color: #ffffff; /_ Hard-coded _/
color: #1a1614;
}
\`\`\`

### 2. Extend Base Classes

✅ **Do:**
\`\`\`css
.my-button {
@apply btn-base; /_ Extend base _/
/_ Add specific styles _/
}
\`\`\`

❌ **Don't:**
\`\`\`css
.my-button {
/_ Duplicate all base styles _/
@apply px-5 py-2.5 rounded-xl...;
}
\`\`\`

### 3. Use Semantic Class Names

✅ **Do:**
\`\`\`css
.cart-checkout-button { }
.product-add-to-cart-button { }
\`\`\`

❌ **Don't:**
\`\`\`css
.btn-1 { }
.btn-2 { }
\`\`\`

### 4. Keep Animations Subtle

✅ **Do:**
\`\`\`css
.card {
transition: transform 0.3s ease;
}

.card:hover {
transform: translateY(-4px); /_ Subtle _/
}
\`\`\`

❌ **Don't:**
\`\`\`css
.card:hover {
transform: scale(2) rotate(360deg); /_ Too much _/
}
\`\`\`

---

## Adding New Styles

### 1. Determine the Category

- **Design token?** → `variables.css`
- **Animation?** → `animations.css`
- **Button variant?** → `buttons.css`
- **Card variant?** → `cards.css`
- **Component-specific?** → `components.css`

### 2. Follow Naming Convention

\`\`\`css
/_ Pattern: [component]\_\_[element]--[modifier] _/
.cart-drawer**item--selected { }
.product-card**image--loading { }
\`\`\`

### 3. Use BEM-like Structure

\`\`\`css
/_ Block _/
.cart-drawer { }

/_ Element _/
.cart-drawer**header { }
.cart-drawer**item { }

/_ Modifier _/
.cart-drawer--open { }
.cart-drawer\_\_item--selected { }
\`\`\`

---

## Performance Tips

### 1. Use CSS Variables for Dynamic Values

\`\`\`css
/_ Instead of inline styles _/
.dynamic-bg {
background-color: var(--dynamic-color);
}
\`\`\`

### 2. Leverage Tailwind's Purge

Tailwind automatically removes unused CSS in production.

### 3. Minimize Animation Complexity

\`\`\`css
/_ Prefer transform and opacity (GPU-accelerated) _/
.animated {
transform: translateY(-4px);
opacity: 0.9;
}

/_ Avoid animating layout properties _/
.slow {
height: 100px; /_ Causes reflow _/
}
\`\`\`

---

## Debugging Tips

### 1. Check Dark Mode

\`\`\`javascript
// Toggle dark mode in console
document.documentElement.classList.toggle('dark');
\`\`\`

### 2. Inspect CSS Variables

\`\`\`javascript
// Get computed CSS variable
getComputedStyle(document.documentElement)
.getPropertyValue('--bg-main');
\`\`\`

### 3. View All Animations

\`\`\`css
/_ Slow down all animations for debugging _/

- {
  animation-duration: 3s !important;
  transition-duration: 3s !important;
  }
  \`\`\`

---

## References

- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [CSS Custom Properties](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)
- [CSS Animations](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Animations)
- [BEM Methodology](http://getbem.com/)

---

_Last updated: February 5, 2026_
