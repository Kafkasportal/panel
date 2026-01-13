---
name: ui-ux-designer
description: User interface design ve user experience optimization için kullanılır. Design system, responsive design, accessibility ve micro-interactions konularında uzman.
---

# UI/UX Designer Skill

User interface design ve user experience optimization.

## When to Use

- Design system bakımı yaparken
- Component library tasarımı yaparken
- Responsive design implementasyonu yaparken
- Accessibility (WCAG 2.1 AA) iyileştirmeleri yaparken
- Micro-interactions eklerken
- Design documentation yazarken
- Prototyping yaparken
- Color scheme ve typography seçerken

## Instructions

### Görevler
- Design system maintenance
- Component library design
- Responsive design
- Accessibility (WCAG 2.1 AA)
- Micro-interactions
- Design documentation
- Prototyping

### Kurallar
- Consistent design patterns
- Turkish language UI
- Mobile-first responsive design
- Color contrast ratio minimum 4.5:1
- Keyboard navigation support
- Screen reader friendly
- Loading states ve transitions

### Design System

```
Design Tokens:
├── Colors
│   ├── Primary: hsl(222.2, 47.4%, 11.2%)
│   ├── Secondary: hsl(210, 40%, 96.1%)
│   ├── Accent: hsl(210, 40%, 98%)
│   ├── Destructive: hsl(0, 84.2%, 60.2%)
│   └── Muted: hsl(210, 40%, 96.1%)
├── Typography
│   ├── Font Family: Inter, system-ui, sans-serif
│   ├── Headings: 600-700 weight
│   └── Body: 400-500 weight
├── Spacing
│   ├── xs: 0.25rem (4px)
│   ├── sm: 0.5rem (8px)
│   ├── md: 1rem (16px)
│   ├── lg: 1.5rem (24px)
│   └── xl: 2rem (32px)
└── Border Radius
    ├── sm: 0.25rem
    ├── md: 0.375rem
    ├── lg: 0.5rem
    └── full: 9999px
```

### Responsive Breakpoints

```css
/* Mobile First Approach */
/* Default: Mobile (< 640px) */

/* Small (sm): >= 640px */
@media (min-width: 640px) { }

/* Medium (md): >= 768px */
@media (min-width: 768px) { }

/* Large (lg): >= 1024px */
@media (min-width: 1024px) { }

/* Extra Large (xl): >= 1280px */
@media (min-width: 1280px) { }

/* 2XL: >= 1536px */
@media (min-width: 1536px) { }
```

### Tailwind CSS Responsive Classes

```tsx
// Mobile-first responsive design
<div className="
  grid 
  grid-cols-1      // Mobile: 1 column
  sm:grid-cols-2   // Small: 2 columns
  md:grid-cols-3   // Medium: 3 columns
  lg:grid-cols-4   // Large: 4 columns
  gap-4
">
  {items.map(item => <Card key={item.id} />)}
</div>
```

### Accessibility Checklist

```markdown
- [ ] Color contrast ratio >= 4.5:1 for normal text
- [ ] Color contrast ratio >= 3:1 for large text
- [ ] All interactive elements are keyboard accessible
- [ ] Focus indicators are visible
- [ ] Images have alt text
- [ ] Form inputs have labels
- [ ] Error messages are announced to screen readers
- [ ] Skip links for main content
- [ ] ARIA landmarks (header, nav, main, footer)
- [ ] Semantic HTML elements used
```

### Animation Guidelines

```tsx
// Tailwind animation utilities
const animations = {
  fadeIn: "animate-in fade-in duration-200",
  slideIn: "animate-in slide-in-from-bottom-2 duration-200",
  scaleIn: "animate-in zoom-in-95 duration-200",
  spinnerSlow: "animate-spin [animation-duration:2s]",
};

// Framer Motion for complex animations
import { motion } from "framer-motion";

<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, y: -20 }}
  transition={{ duration: 0.2 }}
>
  {content}
</motion.div>
```

### Empty State Design

```tsx
<EmptyState
  icon={<UsersIcon className="h-12 w-12" />}
  title="Henüz üye bulunmuyor"
  description="Yeni üye ekleyerek başlayabilirsiniz."
  action={{
    label: "Üye Ekle",
    onClick: () => openAddMemberDialog(),
  }}
/>
```

### Loading State Design

```tsx
// Skeleton loading for data tables
<div className="space-y-4">
  <Skeleton className="h-10 w-full" />
  <Skeleton className="h-10 w-full" />
  <Skeleton className="h-10 w-full" />
  <Skeleton className="h-10 w-full" />
</div>

// Spinner for actions
<Button disabled>
  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
  Kaydediliyor...
</Button>
```
