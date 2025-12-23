# React + TypeScript Code Standards

## Tooling

This project uses **Biome** for linting and formatting:
- Run `bun run lint` to check for issues
- Run `bun run lint:fix` to auto-fix linting issues
- Run `bun run format` to format code
- Biome enforces `noExplicitAny`, exhaustive dependencies in hooks, and more

## TypeScript Standards

### Type Safety
- **NEVER use `any` type**. Use `unknown` if the type is truly unknown, then narrow it with type guards
- Prefer explicit return types for functions and components
- Use strict TypeScript compiler options (already enabled)
- Leverage type inference where types are obvious
- Use `const` assertions for literal types
- Define prop types with interfaces, not inline types

```tsx
// ❌ Bad
const Component = (props: any) => { }
function process(data: any) { }

// ✅ Good
interface ComponentProps {
  title: string;
  count: number;
}
const Component = ({ title, count }: ComponentProps): JSX.Element => { }
function process(data: unknown): void {
  if (typeof data === 'string') {
    // Handle string
  }
}
```

### Prop Types
- Always define interfaces for component props
- Mark optional props with `?`
- Use discriminated unions for variant props
- Avoid passing entire objects when only specific fields are needed

```tsx
// ❌ Bad
const Button = (props) => <button>{props.label}</button>

// ✅ Good
interface ButtonProps {
  label: string;
  variant?: 'primary' | 'secondary';
  onClick: () => void;
}
const Button = ({ label, variant = 'primary', onClick }: ButtonProps): JSX.Element => (
  <button onClick={onClick}>{label}</button>
)
```

## React Component Standards

### Component Structure
- Prefer function components over class components
- Extract reusable logic into custom hooks
- Keep components focused and single-purpose
- Colocate related components in feature directories
- Name components with PascalCase, files can match component name

### Component Organization
Order within a component:
1. Type definitions and interfaces
2. Component function declaration
3. Hooks (useState, useEffect, custom hooks)
4. Derived state and memoized values
5. Event handlers and callbacks
6. Render logic

```tsx
// ✅ Good structure
interface UserProfileProps {
  userId: string;
}

const UserProfile = ({ userId }: UserProfileProps): JSX.Element => {
  // 1. State
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // 2. Effects
  useEffect(() => {
    fetchUser(userId).then(setUser).finally(() => setLoading(false));
  }, [userId]);

  // 3. Derived state
  const displayName = useMemo(() =>
    user ? `${user.firstName} ${user.lastName}` : 'Unknown',
    [user]
  );

  // 4. Event handlers
  const handleUpdate = useCallback(() => {
    // Handle update
  }, []);

  // 5. Render
  if (loading) return <Spinner />;
  return <div>{displayName}</div>;
};
```

## Hook Usage Standards

### useEffect Guidelines
- **Be specific with dependencies**: Include all values from component scope that the effect uses
- **Avoid empty dependency arrays** unless the effect truly should run once on mount
- **Clean up side effects**: Return cleanup functions for subscriptions, timers, listeners
- **Keep effects focused**: One effect per concern
- **Don't use effects for derived state**: Use `useMemo` or compute during render instead

```tsx
// ❌ Bad
useEffect(() => {
  // Multiple concerns in one effect
  fetchData();
  const interval = setInterval(poll, 1000);
  window.addEventListener('resize', handleResize);
}, []); // Missing dependencies, no cleanup

// ✅ Good
useEffect(() => {
  fetchData(id);
}, [id]); // Correct dependency

useEffect(() => {
  const interval = setInterval(poll, 1000);
  return () => clearInterval(interval); // Cleanup
}, [poll]);

useEffect(() => {
  window.addEventListener('resize', handleResize);
  return () => window.removeEventListener('resize', handleResize);
}, [handleResize]);
```

### Avoid useEffect When Not Needed
```tsx
// ❌ Bad - unnecessary effect
const [firstName, setFirstName] = useState('');
const [lastName, setLastName] = useState('');
const [fullName, setFullName] = useState('');

useEffect(() => {
  setFullName(`${firstName} ${lastName}`);
}, [firstName, lastName]);

// ✅ Good - compute during render
const [firstName, setFirstName] = useState('');
const [lastName, setLastName] = useState('');
const fullName = `${firstName} ${lastName}`;
```

### Custom Hooks
- Extract reusable stateful logic into custom hooks
- Name with `use` prefix
- Return values consistently (array for 2 values like useState, object for 3+)
- Type return values explicitly

```tsx
// ✅ Good custom hook
interface UseFetchResult<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

function useFetch<T>(url: string): UseFetchResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetch(url)
      .then(res => res.json())
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [url]);

  return { data, loading, error };
}
```

## Performance Best Practices

### Memoization
- Use `useMemo` for expensive computations
- Use `useCallback` for functions passed to optimized child components
- Use `memo()` for components that render often with same props
- Don't over-optimize - profile first

```tsx
// ✅ Good memoization
const ExpensiveComponent = memo(({ data }: Props) => {
  const processed = useMemo(() =>
    expensiveOperation(data),
    [data]
  );

  return <div>{processed}</div>;
});

const Parent = () => {
  const handleClick = useCallback(() => {
    // Handler logic
  }, []);

  return <ExpensiveComponent data={data} onClick={handleClick} />;
};
```

## Code Organization

### File Structure
```
src/
  components/          # Reusable UI components
    Button/
      Button.tsx
      Button.test.tsx
  features/           # Feature-specific components
    habits/
      HabitList.tsx
      HabitItem.tsx
  hooks/              # Custom hooks
    useFetch.ts
  types/              # Shared types
    habit.ts
  utils/              # Pure utility functions
    format.ts
```

### Import Organization
Order imports:
1. React imports
2. Third-party libraries
3. Internal absolute imports
4. Relative imports
5. CSS/styles

## Common Pitfalls to Avoid

1. **Don't mutate state directly** - use setter functions
2. **Don't call hooks conditionally** - must be at top level
3. **Don't forget key prop** in lists - use stable, unique identifiers
4. **Don't use index as key** when list can reorder
5. **Don't inline object/array literals** as props - causes re-renders
6. **Don't access DOM directly** - use refs when needed
7. **Don't suppress TypeScript errors** with `@ts-ignore` or `as any`
