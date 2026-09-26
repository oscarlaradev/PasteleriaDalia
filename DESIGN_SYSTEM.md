# 🍰 DESIGN SYSTEM: Dulce Aura • Haute Pâtisserie Casera

> **Aesthetic Philosophy**: Editorial French Haute Pâtisserie meets contemporary organic luxury. Inspired by Awwwards-winning culinary portfolios, blending warm buttery creams, blush raspberries, gold accents, and fluid serif typography.

---

## 🎨 1. Color Palette & Atmospheric Tokens

| Token Name | Value | Role | Usage |
| :--- | :--- | :--- | :--- |
| `--bg-crema` | `#FDFBF7` | Dominant Canvas | Background base, calm organic warm canvas |
| `--bg-crema-soft` | `#F8F4EE` | Secondary Canvas | Section alternation, input fields, subtle panels |
| `--bg-blush` | `#FAF0F2` | Accent Canvas | Highlighting special feature modules, results |
| `--bg-blush-light` | `#F5EBE6` | Gradient Accent | Soft hero and checker backgrounds |
| `--pink-accent` | `#D97D8D` | Brand Primary | Primary buttons, active tabs, interactive highlights |
| `--pink-main` | `#E8A4AF` | Brand Delicate | Borders, subtle badges, decorative elements |
| `--pink-deep` | `#C25B6F` | Brand Interaction | Button hover states, active states |
| `--frambuesa` | `#8B263E` | Contrast Accent | Strong editorial accents, high-priority CTAs, headings |
| `--gold-accent` | `#D4AF37` | Luxury Metallic | Verification badges, 5-star ratings, gold dust touches |
| `--text-primary` | `#2B1D20` | High-Contrast Ink | Primary headlines, main body copy, prices |
| `--text-secondary` | `#6E555A` | Muted Ink | Subtitles, product descriptions, secondary notes |
| `--border-delicate`| `rgba(224, 185, 192, 0.45)` | Structural Border | Crisp cards, form containers, divider rules |

---

## ✍️ 2. Typography System

### Typeface Pairing
1. **Editorial Display**: `'Playfair Display', Georgia, serif`
   - **Characteristics**: High stroke contrast, elegant serifs, luxury editorial feel.
   - **Weights**: 600 (Semi-bold), 700 (Bold), 900 (Black).
2. **Organic Script / Accent**: `'Playfair Display', cursive, italic`
   - **Usage**: Styled words inside headings (`.cursive-accent`) for human artisan emotion.
3. **Clean Body Text**: `'Plus Jakarta Sans', system-ui, -apple-system, sans-serif`
   - **Characteristics**: Crisp geometric grotesque with warm humanist apertures. Replaces bland Inter with energetic warmth.
   - **Weights**: 400 (Regular), 500 (Medium), 600 (Semi-bold), 700 (Bold).

### Fluid Type Scale (CSS Clamp)
- **Display Hero H1**: `clamp(2.5rem, 5.5vw, 4.2rem)` | Line-height: 1.12 | Tracking: -0.02em
- **Section Heading H2**: `clamp(2.0rem, 3.8vw, 3.0rem)` | Line-height: 1.20 | Tracking: -0.015em
- **Card Heading H3**: `clamp(1.25rem, 2.0vw, 1.6rem)` | Line-height: 1.30
- **Body Regular**: `1.0rem (16px)` | Line-height: 1.68
- **Body Small / Captions**: `0.88rem (14px)` | Line-height: 1.55

---

## 📐 3. Spatial System & Geometry

- **Base Radius Scale**:
  - `var(--radius-sm)`: `10px` (tags, small badges)
  - `var(--radius-md)`: `16px` (form inputs, selects, option buttons)
  - `var(--radius-lg)`: `24px` (feature cards, catalog cards, modals)
  - `var(--radius-full)`: `9999px` (pills, floating buttons)
- **Shadow Tokens**:
  - `var(--shadow-sm)`: `0 4px 14px rgba(43, 29, 32, 0.05)`
  - `var(--shadow-md)`: `0 8px 26px rgba(43, 29, 32, 0.08)`
  - `var(--shadow-lg)`: `0 16px 48px rgba(43, 29, 32, 0.12)`
  - `var(--shadow-glow)`: `0 0 35px rgba(217, 125, 141, 0.25)`

---

## 🎬 4. Motion & Physics Language

### Transition Curves
- **Standard Ease**: `cubic-bezier(0.16, 1, 0.3, 1)` (snappy spring out, zero lag)
- **Hover Transitions**: `0.22s cubic-bezier(0.16, 1, 0.3, 1)`
- **Drawer & Bar Slide**: `0.40s cubic-bezier(0.16, 1, 0.3, 1)`

### Animation Principles
1. **Never Jarring**: Micro-movements must be smooth (between 4px and 12px translation).
2. **Hover Parallax**: Product cards rise by `4px` with subtle shadow elevation.
3. **Zero Layout Shifts**: Image containers have pre-defined aspect ratios (`aspect-ratio: 4/3` or `1/1`).
4. **Hero Auto-Rotation**: Slides rotate smoothly at 5.5s intervals with gentle opacity fade.

---

## 📱 5. Responsive Art Direction

- **Desktop (`> 1024px`)**:
  - 4-column balanced forms and catalog grid.
  - Sticky urgency bar floating at bottom-left (`max-width: 490px`) to never obstruct central CTAs.
  - Floating badges positioned in safe stage margins.
- **Tablet (`768px - 1024px`)**:
  - 2-column balanced form inputs and 2-column catalog grid.
  - Summary card in builder stacks seamlessly beneath option selectors.
- **Mobile (`< 768px`)**:
  - 1-column ergonomic layout; all inputs retain identical `54px` height and `16px` rounded corners.
  - Fixed mobile navigation header with blurred glass overlay.
  - Full touch-friendly tap targets (`min-height: 48px`).

---

## 🛡️ 6. Zero Emoji & Line-Art Standard
- Standard OS emojis are strictly prohibited.
- All visual metaphors must use **crisp SVG line-art** (`stroke-width: 1.8px - 2.0px`, `stroke-linecap: round`, `fill: none`).
