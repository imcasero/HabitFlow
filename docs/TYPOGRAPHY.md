# Typography System Documentation

## Overview

HabitFlow uses a custom typography system built on Tailwind CSS v4 with CSS custom properties. This system provides a consistent, scalable, and accessible typographic foundation without requiring external font files.

## Design Principles

- **System Fonts**: Uses native system font stacks for optimal performance and familiarity
- **Modular Scale**: Based on a 16px base with proportional scaling
- **Semantic HTML**: Encourages proper use of semantic elements
- **Accessibility**: Optimized line heights, letter spacing, and contrast ratios
- **Consistency**: Predefined component classes for common UI patterns

## CSS Custom Properties

All typography variables are defined in `src/index.css` and can be used throughout the application.

### Font Sizes

```css
--font-size-xs: 0.75rem;      /* 12px */
--font-size-sm: 0.875rem;     /* 14px */
--font-size-base: 1rem;       /* 16px */
--font-size-lg: 1.125rem;     /* 18px */
--font-size-xl: 1.25rem;      /* 20px */
--font-size-2xl: 1.5rem;      /* 24px */
--font-size-3xl: 1.875rem;    /* 30px */
--font-size-4xl: 2.25rem;     /* 36px */
--font-size-5xl: 3rem;        /* 48px */
--font-size-6xl: 3.75rem;     /* 60px */
```

### Line Heights

```css
--leading-none: 1;            /* Tight, for large headings */
--leading-tight: 1.25;        /* For headings */
--leading-snug: 1.375;        /* Compact text */
--leading-normal: 1.5;        /* Body text default */
--leading-relaxed: 1.625;     /* Comfortable reading */
--leading-loose: 2;           /* Spacious */
```

### Letter Spacing

```css
--tracking-tighter: -0.05em;  /* Large headings */
--tracking-tight: -0.025em;   /* Regular headings */
--tracking-normal: 0;         /* Body text */
--tracking-wide: 0.025em;     /* UI labels */
--tracking-wider: 0.05em;     /* Uppercase labels */
--tracking-widest: 0.1em;     /* Very spaced */
```

### Font Families

```css
--font-sans: System sans-serif stack (default)
--font-serif: System serif stack
--font-mono: System monospace stack
```

### Font Weights

```css
--font-light: 300
--font-normal: 400
--font-medium: 500
--font-semibold: 600
--font-bold: 700
--font-extrabold: 800
```

## Component Classes

### Display Text

Use for hero sections, landing pages, and large marketing headings.

```tsx
<h1 className="text-display-lg">60px, extrabold, tight leading</h1>
<h1 className="text-display-md">48px, bold, tight leading</h1>
<h1 className="text-display-sm">36px, bold, tight leading</h1>
```

**When to use:**
- Hero section headlines
- Landing page titles
- Marketing banners
- Feature callouts

### Semantic Headings

Use standard HTML heading elements for document structure.

```tsx
<h1>36px - Main page title</h1>
<h2>30px - Major sections</h2>
<h3>24px - Subsections</h3>
<h4>20px - Minor headings</h4>
<h5>18px - Small headings</h5>
<h6>16px - Smallest headings</h6>
```

**Best Practices:**
- Only one `<h1>` per page
- Don't skip heading levels (h1 → h2 → h3, not h1 → h3)
- Use headings for structure, not styling
- Headings should have zero margin by default (add spacing with utility classes)

### Body Text

Standard text for content and UI.

```tsx
<p className="text-body-lg">18px - Introductory paragraphs</p>
<p className="text-body">16px - Standard body text</p>
<p className="text-body-sm">14px - Secondary information</p>
```

**When to use:**
- `text-body-lg`: Lead paragraphs, important descriptions
- `text-body`: Default for all regular content
- `text-body-sm`: Captions, footnotes, metadata

### UI Text

Specialized classes for interface elements.

```tsx
<span className="text-label">UPPERCASE LABELS</span>
<span className="text-caption">Small helper text</span>
```

**When to use:**
- `text-label`: Form labels, section labels, badges, tags (14px, medium, uppercase, wide tracking)
- `text-caption`: Helper text, timestamps, metadata (12px, gray color)

### Prose Content

For rich text content with automatic spacing and styling.

```tsx
<article className="prose">
  <h1>Auto-styled heading</h1>
  <p>Paragraph with bottom margin</p>
  <ul>
    <li>Styled list items</li>
  </ul>
  <blockquote>Styled quotes</blockquote>
  <code>Inline code</code>
  <pre><code>Code blocks</code></pre>
</article>
```

**Features:**
- Automatic spacing between elements
- Styled lists with bullets/numbers
- Styled links with hover states
- Inline code with background
- Blockquotes with border
- Pre-formatted code blocks
- Max-width of 65 characters for readability

**When to use:**
- Blog posts
- Documentation
- Long-form content
- CMS-generated content
- Markdown-rendered content

## Usage Examples

### Page Header

```tsx
function PageHeader() {
  return (
    <header className="space-y-2">
      <h1>Dashboard</h1>
      <p className="text-body text-gray-600">
        Track your habits and progress
      </p>
    </header>
  )
}
```

### Card Component

```tsx
function HabitCard({ title, description, streak }) {
  return (
    <div className="p-4 border rounded">
      <h3>{title}</h3>
      <p className="text-body-sm text-gray-600 mt-1">
        {description}
      </p>
      <div className="mt-3">
        <span className="text-label">Streak</span>
        <p className="text-2xl font-bold">{streak} days</p>
      </div>
    </div>
  )
}
```

### Form Field

```tsx
function FormField({ label, helper }) {
  return (
    <div className="space-y-1">
      <label className="text-label block">
        {label}
      </label>
      <input type="text" className="..." />
      <p className="text-caption">
        {helper}
      </p>
    </div>
  )
}
```

### Hero Section

```tsx
function Hero() {
  return (
    <section className="text-center py-20">
      <h1 className="text-display-lg mb-4">
        Build Better Habits
      </h1>
      <p className="text-body-lg text-gray-600 max-w-2xl mx-auto">
        Track your daily habits and achieve your goals with HabitFlow
      </p>
    </section>
  )
}
```

## Combining with Tailwind Utilities

The typography system works seamlessly with Tailwind utilities:

```tsx
// Font weight
<h2 className="font-medium">Medium weight heading</h2>
<p className="font-semibold">Semibold paragraph</p>

// Colors
<p className="text-body text-gray-600">Gray text</p>
<h3 className="text-blue-600">Colored heading</h3>

// Text alignment
<p className="text-body text-center">Centered text</p>

// Responsive sizing
<h1 className="text-2xl md:text-4xl lg:text-display-md">
  Responsive heading
</h1>

// Spacing
<h2 className="mb-4">Heading with margin</h2>
<p className="text-body leading-loose">Extra relaxed paragraph</p>
```

## Accessibility Guidelines

### Color Contrast

- Body text (#1a1a1a) on white background meets WCAG AAA (21:1 ratio)
- Gray text (#666) meets WCAG AA for large text
- Blue links (#2563eb) meet WCAG AA standards

### Font Sizing

- Minimum font size: 12px (text-caption) for supplementary text
- Body text default: 16px for comfortable reading
- Use relative units (rem) for better browser zoom support

### Semantic HTML

- Always use semantic heading hierarchy
- Use `<strong>` for importance, `<em>` for emphasis
- Use `<code>` for code snippets
- Use proper list elements (`<ul>`, `<ol>`, `<li>`)

### Line Length

- Prose content limited to 65 characters for optimal readability
- Consider using max-width on long-form content

## Custom Typography

When you need custom styling:

```tsx
// Using CSS custom properties
<p style={{ fontSize: 'var(--font-size-lg)' }}>Custom size</p>

// Using inline styles with variables
<h2 style={{
  fontSize: 'var(--font-size-3xl)',
  fontWeight: 'var(--font-semibold)',
  letterSpacing: 'var(--tracking-tight)'
}}>
  Custom heading
</h2>

// Combining classes and custom properties
<p className="text-body" style={{ lineHeight: 'var(--leading-loose)' }}>
  Custom line height
</p>
```

## Performance Notes

- **No external fonts**: Zero network requests for fonts
- **System fonts**: Instant rendering, no FOIT/FOUT
- **CSS custom properties**: Efficient and themeable
- **No JavaScript**: Pure CSS solution

## Migration Guide

If you're updating existing components:

```tsx
// Before
<h1 className="text-4xl font-bold">Title</h1>

// After
<h1>Title</h1>  // Styled automatically

// Before
<p className="text-base leading-relaxed">Content</p>

// After
<p className="text-body">Content</p>  // More semantic

// Before
<span className="text-xs uppercase font-medium tracking-wide">Label</span>

// After
<span className="text-label">Label</span>  // Cleaner
```

## Troubleshooting

### Text not styled correctly

- Ensure `src/index.css` is imported in `src/main.tsx`
- Check that Tailwind's `@layer base` and `@layer components` are processed
- Verify no conflicting global styles

### Custom properties not working

- Custom properties are defined in `:root` and available globally
- Use `var(--property-name)` syntax
- Check browser DevTools for computed values

### Prose styles not applying

- Ensure the `prose` class is on a parent element
- Check for conflicting utility classes that override prose styles
- Prose styles only affect direct children and common elements

## See Also

- [React + TypeScript Standards](../.claude/rules/react-typescript-standards.md)
- [Tailwind CSS Documentation](https://tailwindcss.com)
- [WCAG Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
