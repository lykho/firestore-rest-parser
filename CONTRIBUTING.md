# Contributing to firestore-rest-parser

## Development Setup

1. Fork and clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run tests:
   ```bash
   npm test
   ```
4. Build:
   ```bash
   npm run build
   ```

## Available Scripts

- `npm run dev` - Watch mode for development
- `npm run build` - Production build
- `npm test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage
- `npm run lint` - Run ESLint
- `npm run typecheck` - Run TypeScript type checking

## Code Style

This project uses Prettier for code formatting. Configuration is in `package.json`:

- 80 character line width
- No semicolons
- Single quotes
- Trailing commas (ES5)

## Pull Requests

- Include tests for new functionality
- Update README if adding new features
- Run `npm run lint && npm run typecheck && npm test` before submitting
- Keep changes focused - one feature/fix per PR

## Reporting Issues

Please include:

- The Firestore REST response you're working with (if applicable)
- Expected vs actual behavior
- Library version
- Node.js version
