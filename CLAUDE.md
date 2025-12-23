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

# Run linter
bun run lint
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
- **Linting**: ESLint flat config with React Hooks, React Refresh, and TypeScript rules

## Key Configuration Details

- TypeScript compiler options use `noEmit: true` (Vite handles transpilation)
- ESLint configured for TypeScript files only (**.{ts,tsx})
- Globals set to browser environment
- Vite serves static assets from /public/ directory

## Coding Standards

See `.claude/rules/react-typescript-standards.md` for comprehensive React and TypeScript coding standards, including:
- Type safety requirements (never use `any`)
- Component structure and organization
- Hook usage guidelines (especially `useEffect`)
- Performance best practices
- Common pitfalls to avoid
