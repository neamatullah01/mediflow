---
name: Clinical Intelligence
colors:
  surface: '#f6faff'
  surface-dim: '#d6dae0'
  surface-bright: '#f6faff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f0f4fa'
  surface-container: '#eaeef4'
  surface-container-high: '#e4e8ee'
  surface-container-highest: '#dee3e9'
  on-surface: '#171c20'
  on-surface-variant: '#3e4850'
  inverse-surface: '#2c3135'
  inverse-on-surface: '#edf1f7'
  outline: '#6e7881'
  outline-variant: '#bec8d2'
  surface-tint: '#006591'
  primary: '#006591'
  on-primary: '#ffffff'
  primary-container: '#0ea5e9'
  on-primary-container: '#003751'
  inverse-primary: '#89ceff'
  secondary: '#006c49'
  on-secondary: '#ffffff'
  secondary-container: '#6cf8bb'
  on-secondary-container: '#00714d'
  tertiary: '#8a5100'
  on-tertiary: '#ffffff'
  tertiary-container: '#de8712'
  on-tertiary-container: '#4d2b00'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#c9e6ff'
  primary-fixed-dim: '#89ceff'
  on-primary-fixed: '#001e2f'
  on-primary-fixed-variant: '#004c6e'
  secondary-fixed: '#6ffbbe'
  secondary-fixed-dim: '#4edea3'
  on-secondary-fixed: '#002113'
  on-secondary-fixed-variant: '#005236'
  tertiary-fixed: '#ffdcbd'
  tertiary-fixed-dim: '#ffb86e'
  on-tertiary-fixed: '#2c1600'
  on-tertiary-fixed-variant: '#693c00'
  background: '#f6faff'
  on-background: '#171c20'
  surface-variant: '#dee3e9'
typography:
  display-lg:
    fontSize: 36px
    fontWeight: '600'
    lineHeight: 44px
    letterSpacing: -0.02em
  display-md:
    fontSize: 30px
    fontWeight: '600'
    lineHeight: 38px
    letterSpacing: -0.02em
  headline-lg:
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-sm:
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
  label-sm:
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  xs: 0.25rem
  sm: 0.5rem
  md: 1rem
  lg: 1.25rem
  xl: 2rem
  gutter: 1.5rem
  container-padding: 2rem
---

## Brand & Style

The design system is anchored in the principles of **Clinical Precision** and **Adaptive Intelligence**. It is designed to instill absolute confidence in pharmacists and healthcare providers by balancing a sterile, professional aesthetic with modern, accessible interface patterns.

The visual direction follows a **Corporate/Modern** style with a heavy emphasis on **Minimalism**. Every pixel is dedicated to data clarity, reducing cognitive load in high-stakes medical environments. The interface prioritizes utility and speed, ensuring that AI-driven insights are presented as supportive tools rather than distractions. The emotional goal is to feel reliable, calm, and forward-thinking.

## Colors

The color architecture of this design system is strictly functional. 

- **Primary (Sky Blue):** Used for the core "active" layer. It signifies navigation, primary actions, and selected states.
- **Secondary (Emerald):** Reserved for "Safe" states, such as successful prescription verification, stock replenishment, and healthy margins.
- **Accent (Amber):** A cautionary signal used for low-stock warnings, expiring medication, or pending approvals.
- **Danger (Red):** Critical alerts, drug-to-drug interaction warnings, and destructive actions.

The **Neutral** palette utilizes cool-toned grays to maintain a clean, clinical feel. High-quality grays are used to create structural hierarchy, with Slate-900 providing deep contrast for typography and Slate-200 defining the subtle boundaries of the layout.

## Typography

This design system utilizes **Inter** exclusively to leverage its exceptional legibility in data-dense environments. 

- **Weights:** Use 600 (Semibold) for all headings to provide clear structural anchoring. Use 500 (Medium) for interactive elements like buttons and navigation. Use 400 (Regular) for all long-form reading and patient data.
- **Hierarchy:** Clear distinction between display levels and functional labels is critical. Labels for technical data points (e.g., dosage, SKU numbers) should utilize the `label-sm` style to maximize space without sacrificing scannability.

## Layout & Spacing

This design system employs a **12-column fluid grid** for high-level dashboard layouts, allowing the interface to scale from tablet to ultra-wide displays used in pharmacy back-offices.

The spacing rhythm is built on a 4px baseline. Standard card padding is strictly enforced at **20px (p-5)** to ensure a breathable but efficient use of space. Gutters are kept at 24px to maintain a clear visual separation between distinct data modules. Use dense spacing (sm/xs) only within data tables to ensure the pharmacist can view as many line items as possible without scrolling.

## Elevation & Depth

To maintain a professional and trustworthy appearance, this design system avoids heavy shadows. Instead, it utilizes **Tonal Layers** and **Low-Contrast Outlines**.

Depth is created by:
1. **The Background Layer:** A very light gray (Neutral-50) or white.
2. **The Surface Layer:** Card containers use a solid white background with a 1px border in Neutral-200.
3. **The Active Layer:** Elements that require focus (like modals) use a highly diffused, 10% opacity shadow with a 20px blur to lift them slightly off the page without appearing "gamey" or overly stylized.

## Shapes

The shape language is sophisticated and approachable. The primary structural element, the Card, uses a **12px (rounded-xl)** corner radius to soften the clinical edge of the data. 

Interactive elements like buttons and input fields utilize a slightly tighter **8px radius** to convey a more precise, tool-like feel. This subtle variation in roundedness helps users subconsciously distinguish between "containers" (information) and "controls" (actions).

## Components

The components within this design system are built for high-performance pharmacy management.

- **Cards:** The foundational container. Always white background, 1px Neutral-200 border, and 20px (p-5) padding.
- **Buttons:**
    - *Primary:* Sky Blue background with white text. 
    - *Secondary:* Ghost style with Sky Blue border and text.
    - *Success:* Emerald background for "Verify" or "Complete" actions.
- **Data Tables:** Use a "zebra-stripe" pattern with Neutral-50 on alternate rows. Typography should be `body-sm` to ensure maximum data density.
- **Status Badges:** Pill-shaped with low-opacity backgrounds (e.g., 10% of the semantic color) and high-contrast text of the same hue.
- **Inputs:** Clean, outlined fields with a 1px border. When focused, the border transitions to Sky Blue with a subtle 2px outer glow.
- **AI Insights:** Specialized cards using a subtle gradient border (Sky Blue to Emerald) to denote AI-generated suggestions or automated stock predictions.
- **Iconography:** Use **Lucide-react** style icons with a 1.5px stroke width. Icons should always be monochrome (Neutral-500) unless they represent a specific status (e.g., a red alert icon).