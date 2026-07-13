# QuickBMICalc.com - Design System & Architecture

This document outlines the design tokens, components, accessibility standards, and architecture for the privacy-first, ad-free, single-page BMI calculator at QuickBMICalc.com.

---

## 1. Design Tokens

### Color Palette
Custom palette mapped to standard utility CSS classes:

| Color | Token / Value | Role |
| :--- | :--- | :--- |
| **Primary** | `#0D6EFD` | Brand primary color for CTA button background, focus rings, and primary indicators |
| **Page Background** | `#F8F9FA` | Outer layout background |
| **Card / Canvas** | `#FFFFFF` | Core calculator card surface |
| **Text** | `#212529` | Dark high-contrast primary text color |
| **Muted Text** | `#6C757D` | Secondary labels, hints, and placeholder text |
| **Accent: Healthy** | `#198754` | Semantic indicator for Normal BMI category (18.5 - 24.9) |
| **Accent: Warning** | `#FFC107` | Semantic indicator for Overweight BMI category (25 - 29.9) |
| **Accent: Danger** | `#DC3545` | Semantic indicator for Underweight (< 18.5) and Obese (≥ 30) BMI categories |

### Typography
Consistent typography utilising clean, modern, high-legibility sans-serif fonts:
- **Headings Font Family**: `'Inter', system-ui, -apple-system, sans-serif`
- **Body Font Family**: `'Inter', system-ui, -apple-system, sans-serif`
- **Sizes**:
  - Main Title: `28px` / `line-height: 36px` / `Font Weight: 700`
  - Section Headings: `20px` / `line-height: 28px` / `Font Weight: 600`
  - Labels & Body: `16px` / `line-height: 24px` / `Font Weight: 500`
  - Small/Muted Text: `14px` / `line-height: 20px` / `Font Weight: 400`

### Spacing & Grid System
Based on an **8px base grid** for consistent alignment and breathing room:
- `4px` (`0.25rem`) - Extra small adjustments (inner borders, badge margins)
- `8px` (`0.5rem`) - Grid base unit (small gaps, input inline padding)
- `16px` (`1rem`) - Medium padding/margin (between fields, small component spacing)
- `24px` (`1.5rem`) - Large padding/margin (main card padding, section gap)
- `32px` (`2rem`) - Extra large padding (spacing from top/bottom of screen)

### Border Radius
Consistent, modern rounded corners:
- **Cards & Primary Buttons**: `12px` (`0.75rem`)
- **Inputs & Badge elements**: `8px` (`0.5rem`)

---

## 2. Layout & Interactions

### Layout Structure
- **Overall Layout**: Centered card design, max-width `480px`.
- **Vertical Alignment**: Fully centered vertically and horizontally in the viewport (`min-h-screen`, `flex`, `items-center`, `justify-center`).
- **Responsive**: Mobile-first layout, scales dynamically on smaller devices, strict overflow rules to prevent any horizontal scrolling.

### Inputs & Fields
- **Accessible Labels**: Large text (`16px`, weight 600), explicit association with matching inputs via `for` and `id` attributes.
- **Placeholders**: Clear examples (e.g. "e.g., 70" or "e.g., 175").
- **Focus States**: High-contrast, outline-none with a visible focus ring using primary color: `outline: none; box-shadow: 0 0 0 3px rgba(13, 110, 253, 0.4); border-color: #0D6EFD;`.

### Buttons (CTAs)
- **Primary Style**: Background `#0D6EFD`, solid white text, `12px` border-radius.
- **States**:
  - *Hover*: Darkens background by 10% (`#0b5ed7`).
  - *Active / Focus*: Slight scaling down to `0.98` for tactile click feedback.
  - *Transition*: Smooth `cubic-bezier(0.4, 0, 0.2, 1)` transition on hover/transform (150ms).

### Result Area
- **Entrance Animation**: Slide up and fade in dynamically when calculation completes:
  ```css
  @keyframes slideUpFade {
    from {
      opacity: 0;
      transform: translateY(12px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  ```
- **Category Badge**: Dynamic background color corresponding to the BMI category (Healthy -> Accent Healthy, Overweight -> Accent Warning, Underweight/Obese -> Accent Danger).

---

## 3. Project Architecture (Astro)

Following the workspace requirement to build using Astro, the project is organized as:

```
project-root/
├── DESIGN.md                 # Design Tokens & Guidelines (This File)
├── package.json              # Dependencies & Scripts
├── astro.config.mjs          # Astro Static Config (ready for Vercel)
├── tsconfig.json             # TypeScript Config
├── vercel.json               # Vercel Configuration
├── public/
│   └── favicon.svg           # Scalable favicon asset
└── src/
    ├── layouts/
    │   └── Layout.astro      # Main template layout with SEO meta & fonts
    ├── pages/
    │   └── index.astro       # Interactive single-page calculator UI
    ├── styles/
    │   └── global.css        # Global CSS stylesheet containing variables & base rules
    └── scripts/
        └── bmi.js            # Privacy-first calculations & UI update handlers
```

This structure builds to static HTML/CSS/JS files deployable on Vercel, matching the user-specified files conceptually while keeping the core Astro build pipeline.
