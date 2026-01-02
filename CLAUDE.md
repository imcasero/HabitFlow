# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

HabitFlow is a React application built with TypeScript and Vite, featuring the React Compiler for automatic optimization.

## Development Commands

```bash
# Start development server with HMR
bun dev

# Type-check and build for production
bun run build

# Preview production build locally
bun run preview

# Lint and format check
bun run lint

# Lint and auto-fix issues
bun run lint:fix

# Format code
bun run format

# Run tests in watch mode
bun run test

# Run tests once
bun run test -- --run

# Run tests with UI
bun run test:ui

# Run tests with coverage
bun run test:coverage
```

## Build System

- **Vite**: Uses `rolldown-vite@7.2.5` (overridden from standard Vite) for faster builds
- **React Compiler**: Enabled via `babel-plugin-react-compiler` in vite.config.ts for automatic memoization
  - Note: This impacts dev & build performance but optimizes React renders
- **TypeScript**: Strict mode enabled with project references (tsconfig.app.json for app, tsconfig.node.json for config files)
  - Build info cached in `node_modules/.tmp/`
  - Uses verbatim module syntax and erasable syntax only

## Architecture Notes

- **Entry Point**: src/main.tsx renders src/App.tsx into #root element
- **React Version**: 19.2.0 with StrictMode enabled
- **Module System**: ESNext with bundler resolution
- **Path Aliases**: `@/` resolves to `src/` for cleaner imports
- **Styling**: Tailwind CSS v4 with PostCSS
- **Testing**: Vitest with React Testing Library
  - Test files: `*.test.ts` or `*.test.tsx` in src/
  - Setup file: src/test/setup.ts
  - Global test utilities from @testing-library/jest-dom
- **Linting & Formatting**: Biome with strict rules for React and TypeScript
  - Enforces no `any` types (`noExplicitAny: error`)
  - React hooks validation (`useExhaustiveDependencies`, `useHookAtTopLevel`)
  - Auto-organizes imports on save

## Key Configuration Details

- TypeScript compiler options use `noEmit: true` (Vite handles transpilation)
- Path aliases configured in both tsconfig.app.json and vite.config.ts
- Biome configured with 2-space indentation, single quotes, and 100-char line width
- VCS integration enabled (respects .gitignore)
- Vite serves static assets from /public/ directory
- Tailwind CSS uses v4 with `@tailwindcss/postcss` plugin
- Vitest configured with jsdom environment and React support

## VS Code Setup

The project includes recommended VS Code settings in `.vscode/`:
- **Biome** extension for linting and formatting
- **Tailwind CSS IntelliSense** for class name completion
- **Vitest Explorer** for test runner integration
- Format on save enabled
- Auto-organize imports on save

## Coding Standards

See `.claude/rules/react-typescript-standards.md` for comprehensive React and TypeScript coding standards, including:
- Type safety requirements (never use `any`)
- Component structure and organization
- Hook usage guidelines (especially `useEffect`)
- Performance best practices
- Common pitfalls to avoid

### Component Type Preferences

- **Do NOT use explicit return types** for React components (e.g., `JSX.Element`, `React.ReactElement`)
- Rely on TypeScript's type inference for component return types
- This avoids unnecessary imports and keeps component signatures clean
- Example:
  ```tsx
  // ✅ Good - no explicit return type
  export const MyComponent = () => {
    return <div>Hello</div>
  }

  // ❌ Bad - unnecessary return type
  export const MyComponent = (): JSX.Element => {
    return <div>Hello</div>
  }
  ```
