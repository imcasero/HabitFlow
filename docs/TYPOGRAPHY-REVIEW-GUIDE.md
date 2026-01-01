# Typography & Semantic HTML Review Guide

This guide helps you review code for proper typography and semantic HTML usage in HabitFlow.

## Quick Checklist

Use this checklist when reviewing components:

- [ ] Semantic HTML elements used correctly
- [ ] Heading hierarchy is logical and doesn't skip levels
- [ ] Only one `<h1>` per page
- [ ] Typography component classes used where appropriate
- [ ] Text has sufficient color contrast
- [ ] No hardcoded font sizes (use system classes)
- [ ] Line lengths are readable (consider max-width)
- [ ] Lists use proper `<ul>` or `<ol>` elements
- [ ] Links and buttons are semantically correct
- [ ] Code uses `<code>` or `<pre>` elements

## Semantic HTML Review

### Heading Hierarchy

**✅ GOOD:**
```tsx
function Page() {
  return (
    <main>
      <h1>Dashboard</h1>
      <section>
        <h2>Recent Habits</h2>
        <h3>This Week</h3>
      </section>
      <section>
        <h2>Statistics</h2>
        <h3>Monthly Progress</h3>
      </section>
    </main>
  )
}
```

**❌ BAD:**
```tsx
function Page() {
  return (
    <div>
      <h1>Dashboard</h1>
      {/* Skipped h2, went straight to h3 */}
      <h3>Recent Habits</h3>
      {/* Multiple h1 tags */}
      <h1>Statistics</h1>
    </div>
  )
}
```

**Red Flags:**
- Multiple `<h1>` elements on same page
- Skipping heading levels (h1 → h3)
- Using headings for styling instead of structure
- `<div>` or `<span>` with heading classes instead of actual headings

### Lists

**✅ GOOD:**
```tsx
function FeatureList() {
  return (
    <ul>
      <li>Daily tracking</li>
      <li>Progress charts</li>
      <li>Streak counting</li>
    </ul>
  )
}

function Steps() {
  return (
    <ol>
      <li>Create habit</li>
      <li>Track progress</li>
      <li>Build streak</li>
    </ol>
  )
}
```

**❌ BAD:**
```tsx
function FeatureList() {
  return (
    <div>
      <div>Daily tracking</div>
      <div>Progress charts</div>
      <div>Streak counting</div>
    </div>
  )
}
```

**Red Flags:**
- Using `<div>` instead of `<li>` for list items
- Not wrapping list items in `<ul>` or `<ol>`
- Using tables for layout lists
- Missing semantic list markup when presenting related items

### Links vs Buttons

**✅ GOOD:**
```tsx
// Navigation - use link
<a href="/dashboard">Go to Dashboard</a>

// Action - use button
<button onClick={handleSubmit}>Save Habit</button>

// External link
<a href="https://example.com" target="_blank" rel="noopener noreferrer">
  Learn More
</a>
```

**❌ BAD:**
```tsx
// Don't use div as button
<div onClick={handleClick}>Click me</div>

// Don't use button for navigation
<button onClick={() => navigate('/dashboard')}>Dashboard</button>

// Don't use link without href
<a onClick={handleClick}>Click me</a>
```

**Rules:**
- Use `<a>` for navigation to other pages/sections
- Use `<button>` for actions and state changes
- Never use `<div>` or `<span>` as clickable elements
- Links need `href`, buttons need `type="button"` (unless submitting forms)

### Emphasis and Importance

**✅ GOOD:**
```tsx
<p>
  This is <strong>very important</strong> information.
  This is <em>emphasized</em> for clarity.
</p>
```

**❌ BAD:**
```tsx
<p>
  This is <span className="font-bold">important</span>.
  This is <span className="italic">emphasized</span>.
</p>
```

**Rules:**
- Use `<strong>` for importance/urgency
- Use `<em>` for stress emphasis
- Use `<b>` only for stylistic boldness without semantic meaning
- Use `<i>` only for stylistic italics without semantic meaning

### Code Elements

**✅ GOOD:**
```tsx
<p>
  Use the <code>useState</code> hook for state management.
</p>

<pre>
  <code>{`function example() {
  return "formatted code";
}`}</code>
</pre>
```

**❌ BAD:**
```tsx
<p>
  Use the <span className="font-mono">useState</span> hook.
</p>

<div className="bg-gray-900 text-white p-4">
  function example() { return "code"; }
</div>
```

## Typography Class Review

### Display Text Usage

**✅ GOOD:**
```tsx
// Hero section
<section className="hero">
  <h1 className="text-display-lg">Welcome to HabitFlow</h1>
</section>

// Feature callout
<div className="callout">
  <h2 className="text-display-md">Track Your Progress</h2>
</div>
```

**❌ BAD:**
```tsx
// Regular page heading - too large
<div className="page-header">
  <h1 className="text-display-lg">Settings</h1>
</div>

// Small card - display text is overkill
<div className="card">
  <h3 className="text-display-sm">Morning Run</h3>
</div>
```

**Rules:**
- `text-display-*` for marketing/hero sections only
- Regular pages use semantic headings without display classes
- Don't use display text in small UI components

### Body Text Usage

**✅ GOOD:**
```tsx
<article>
  <p className="text-body-lg">
    This introductory paragraph sets the context.
  </p>
  <p className="text-body">
    Regular content continues here with standard sizing.
  </p>
  <p className="text-body-sm text-gray-600">
    Additional details or metadata.
  </p>
</article>
```

**❌ BAD:**
```tsx
// Mixing sizes randomly
<p className="text-body-lg">Some text</p>
<p className="text-body-sm">More important text</p>
<p className="text-body-lg">Back to large</p>

// Using wrong size for context
<button>
  <span className="text-body-lg">Click me</span>
</button>
```

**Rules:**
- `text-body-lg` for lead paragraphs only
- `text-body` is the default for content
- `text-body-sm` for secondary information
- Maintain consistent sizing within context

### Label and Caption Usage

**✅ GOOD:**
```tsx
// Form field
<div>
  <label className="text-label">Email Address</label>
  <input type="email" />
  <p className="text-caption">We'll never share your email</p>
</div>

// Metadata
<div>
  <span className="text-label">Status</span>
  <p className="text-caption">Last updated 2 hours ago</p>
</div>
```

**❌ BAD:**
```tsx
// Using label for regular text
<p className="text-label">
  This is a regular paragraph that shouldn't be uppercase.
</p>

// Caption for important content
<h2 className="text-caption">Important Section</h2>
```

**Rules:**
- `text-label` for UI labels, badges, tags (uppercase, medium weight)
- `text-caption` for helper text, timestamps, metadata (small, gray)
- Don't use labels for body content
- Don't use captions for important information

### Prose Usage

**✅ GOOD:**
```tsx
// Blog post
<article className="prose">
  <h1>How to Build Habits</h1>
  <p>Introduction paragraph...</p>
  <h2>Understanding Habit Formation</h2>
  <p>Content...</p>
  <ul>
    <li>Point one</li>
    <li>Point two</li>
  </ul>
</article>

// Documentation
<div className="prose">
  {/* Markdown-rendered content */}
  {renderMarkdown(content)}
</div>
```

**❌ BAD:**
```tsx
// UI components - prose not needed
<div className="prose">
  <button>Click me</button>
  <input type="text" />
</div>

// Simple text - overkill
<p className="prose">Just one sentence.</p>
```

**Rules:**
- Use `prose` for long-form content only
- Don't wrap UI components in prose
- Ideal for blog posts, documentation, CMS content
- Not needed for simple paragraphs

## Common Issues

### Issue: Hardcoded Font Sizes

**❌ BAD:**
```tsx
<h1 style={{ fontSize: '48px' }}>Title</h1>
<p className="text-[18px]">Content</p>
```

**✅ FIX:**
```tsx
<h1>Title</h1>  {/* Uses default h1 styling */}
<p className="text-body-lg">Content</p>
```

### Issue: Inconsistent Spacing

**❌ BAD:**
```tsx
<div>
  <h2>Section Title</h2>
  <p>Content immediately after, no spacing</p>
</div>
```

**✅ FIX:**
```tsx
<div className="space-y-4">
  <h2>Section Title</h2>
  <p className="text-body">Content with proper spacing</p>
</div>
```

### Issue: Wrong Element for Job

**❌ BAD:**
```tsx
<div className="text-2xl font-bold">Heading</div>
<a className="cursor-pointer" onClick={handleClick}>Action</a>
```

**✅ FIX:**
```tsx
<h2>Heading</h2>
<button type="button" onClick={handleClick}>Action</button>
```

### Issue: Poor Color Contrast

**❌ BAD:**
```tsx
<p className="text-gray-400">Important information</p>  {/* Too light */}
```

**✅ FIX:**
```tsx
<p className="text-body text-gray-700">Important information</p>
```

### Issue: Not Using Custom Properties

**❌ BAD:**
```tsx
<p style={{ fontSize: '14px', lineHeight: '1.5' }}>Text</p>
```

**✅ FIX:**
```tsx
<p className="text-body-sm">Text</p>
{/* OR */}
<p style={{
  fontSize: 'var(--font-size-sm)',
  lineHeight: 'var(--leading-normal)'
}}>
  Text
</p>
```

## Automated Review Steps

When reviewing a component file:

1. **Check Heading Structure**
   - Search for `<h1`, `<h2`, `<h3`, etc.
   - Verify only one `<h1>` per page component
   - Ensure no skipped levels (1→2→3, not 1→3)

2. **Check for Semantic Elements**
   - Search for `<div onClick` or `<span onClick` (should be buttons)
   - Look for lists: are they using `<ul>/<ol>` or just `<div>`?
   - Check if `<a>` tags have `href` attributes

3. **Check Typography Classes**
   - Search for `text-display-` (should only be in hero/marketing)
   - Look for `className="text-` patterns
   - Verify appropriate sizing for context

4. **Check for Hardcoded Styles**
   - Search for `fontSize:` in style props
   - Look for arbitrary Tailwind values: `text-[`
   - Check if using system classes instead

5. **Check Accessibility**
   - Button elements have `type="button"` or `type="submit"`
   - External links have `rel="noopener noreferrer"`
   - Form inputs have associated labels
   - Sufficient color contrast for text

## Review Workflow

### For New Components

1. Read through the component code
2. Run the semantic HTML checklist
3. Run the typography class checklist
4. Check for common issues
5. Test in browser for visual hierarchy
6. Verify with screen reader if possible

### For Component Updates

1. Review changed lines for semantic HTML
2. Check if typography classes are appropriate for changes
3. Ensure no regression in accessibility
4. Verify visual hierarchy still makes sense

### Red Flag Patterns

Immediately flag for review:

- `<div onClick` or `<span onClick`
- Multiple `<h1>` in same file
- `className="text-[` (arbitrary values)
- `style={{ fontSize: '`
- `<a>` without `href`
- Nested headings that skip levels
- Very long lines of text without max-width
- Light gray text on white background for body content

## Tools & Commands

### Grep for Common Issues

```bash
# Find clickable divs/spans
grep -r "div onClick\|span onClick" src/

# Find multiple h1s in same file
grep -c "<h1" src/**/*.tsx

# Find hardcoded font sizes
grep -r "fontSize:" src/

# Find arbitrary Tailwind values
grep -r "text-\[" src/
```

### Biome Checks

Run the linter to catch issues:
```bash
bun run lint
```

### Manual Testing

- Test with browser zoom (150%, 200%)
- Test with browser text-only zoom
- Test with screen reader
- Check color contrast with DevTools
- Verify heading outline in DevTools

## Resources

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [MDN Semantic HTML](https://developer.mozilla.org/en-US/docs/Glossary/Semantics)
- [Typography Documentation](./TYPOGRAPHY.md)
- [React + TypeScript Standards](../.claude/rules/react-typescript-standards.md)
