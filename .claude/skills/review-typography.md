# review-typography

Reviews a component file for proper typography and semantic HTML usage.

## Usage

```
/review-typography path/to/Component.tsx
```

## What It Checks

This skill reviews code against the HabitFlow typography system and semantic HTML standards:

### Semantic HTML
- Heading hierarchy (single h1, no skipped levels)
- Proper use of semantic elements (ul/ol for lists, buttons vs links)
- Clickable divs/spans (anti-pattern)
- Code elements (using `<code>` and `<pre>`)

### Typography Classes
- Appropriate use of display text classes
- Correct body text sizing for context
- Proper label and caption usage
- Prose wrapper for long-form content

### Accessibility
- Color contrast
- Button types
- External link attributes
- Form label associations

### Anti-patterns
- Hardcoded font sizes
- Arbitrary Tailwind values for typography
- Inconsistent spacing
- Wrong elements for the job

## Output

The skill will provide:
1. List of issues found (with line numbers)
2. Severity (error, warning, suggestion)
3. Recommendations for fixes
4. Code examples where helpful

## Example

```bash
/review-typography src/components/HabitCard.tsx
```

Output:
```
📝 Reviewing: src/components/HabitCard.tsx

❌ ERRORS (2):
  Line 15: Clickable div should be a button
    <div onClick={handleClick}>...</div>
    Fix: <button type="button" onClick={handleClick}>...</button>

  Line 23: Hardcoded font size
    style={{ fontSize: '18px' }}
    Fix: className="text-body-lg"

⚠️  WARNINGS (1):
  Line 8: Using display text in small component
    <h3 className="text-display-sm">...</h3>
    Fix: <h3>...</h3> (semantic heading is sufficient)

💡 SUGGESTIONS (1):
  Line 30: Consider using text-caption for timestamp
    <p className="text-sm text-gray-500">2 hours ago</p>
    Fix: <p className="text-caption">2 hours ago</p>

✅ Summary: 2 errors, 1 warning, 1 suggestion
```

## Integration

This skill can be run:
- Manually via CLI: `/review-typography <file>`
- In your workflow before committing
- As part of code review process
- When creating new components

## Related Documentation

- [Typography System](../../docs/TYPOGRAPHY.md)
- [Typography Review Guide](../../docs/TYPOGRAPHY-REVIEW-GUIDE.md)
- [React + TypeScript Standards](../rules/react-typescript-standards.md)
