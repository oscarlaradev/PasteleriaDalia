---
name: nextjs-typescript-tailwind
description: >-
  Architects high-performance, SEO-optimized, luxury corporate and e-commerce applications
  using Next.js App Router, TypeScript strict typing, and modern Tailwind CSS architecture.
---

# Next.js + TypeScript + Tailwind CSS Architecture Skill

This skill governs the structure, type safety, styling discipline, and performance standards for modern Next.js production applications.

---

## 🏗️ Project Structure (App Router)

```text
src/
├── app/
│   ├── layout.tsx         # Root layout with fonts, metadata, global providers
│   ├── page.tsx           # Hero, showcase, core value proposition
│   ├── catalogo/          # Dynamic filtered product catalogue
│   ├── personalizador/    # Interactive bespoke product builder
│   └── api/               # Edge routes for reservations, checkout, WhatsApp sync
├── components/
│   ├── ui/                # Atomic primitives (Button, Input, Select, Badge)
│   ├── sections/          # Composed page sections (Hero, Showcase, Story, Guarantee)
│   └── interactive/       # Live configurators, interactive 3D stage, drawers
├── lib/
│   ├── design-tokens.ts   # Typed design system constants (colors, fonts, radii)
│   ├── utils.ts           # Class merging (clsx + tailwind-merge)
│   └── analytics.ts       # Performance & conversion tracking
└── types/                 # Domain TypeScript interfaces
```

---

## 🎨 Tailwind CSS Design Token Discipline

Never hardcode arbitrary hex colors or ad-hoc margins. Extend `tailwind.config.ts` to reflect the project's `DESIGN_SYSTEM.md`:

```typescript
// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        canvas: {
          DEFAULT: "var(--bg-crema)",
          soft: "var(--bg-crema-soft)",
          blush: "var(--bg-blush)",
        },
        brand: {
          accent: "var(--pink-accent)",
          main: "var(--pink-main)",
          deep: "var(--pink-deep)",
          frambuesa: "var(--frambuesa)",
          gold: "var(--gold-accent)",
        },
        ink: {
          primary: "var(--text-primary)",
          secondary: "var(--text-secondary)",
        }
      },
      fontFamily: {
        display: ["var(--font-playfair)", "serif"],
        body: ["var(--font-jakarta)", "sans-serif"],
      },
      borderRadius: {
        soft: "16px",
        lux: "24px",
      }
    },
  },
  plugins: [],
};
export default config;
```

---

## ⚡ Core Web Vitals & Performance Gate
- **Next/Image**: Always use `next/image` with explicit aspect ratios, `priority` on the hero LCP image, and `sizes` attribute.
- **Font Optimization**: Use `next/font/google` with `display: 'swap'` to eliminate FOIT and CLS.
- **Dynamic Imports**: Lazy-load heavy components (Three.js canvas, modals, rich date pickers) with `next/dynamic({ ssr: false })`.
- **Bundle Hygiene**: Zero unnecessary libraries. Target Lighthouse score 95+ across Performance, Accessibility, Best Practices, and SEO.
