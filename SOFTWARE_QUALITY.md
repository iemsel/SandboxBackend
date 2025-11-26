# Software Quality Guide — Backend

This document explains the linting, formatting, and code quality tools configured for the backend project.

## Overview

We use **ESLint** for code quality and **Prettier** for code formatting. Both run automatically on commit (via pre-commit hooks) and in CI/CD pipelines.

## Tools

### ESLint (Code Quality)
- **Purpose:** Catches bugs, enforces best practices, and ensures code style consistency
- **Config file:** `eslint.config.js`
- **Rules enforced:**
  - Single quotes for strings (`'single'`)
  - Semicolons at end of statements (`'always'`)
  - Cyclomatic complexity limit of 10
  - No unused variables
  - Proper Prettier integration (no conflicting formatting rules)

### Prettier (Code Formatting)
- **Purpose:** Auto-formats code for consistency (whitespace, line breaks, quotes)
- **Config file:** `.prettierrc`
- **Settings:**
  - Single quotes
  - Semicolons
  - Print width: 100 characters
  - Tab width: 2 spaces

## Running Quality Checks

### Lint (Check for issues)
```bash
npm run lint
```
Scans all `.js` and `.mjs` files and reports errors.

### Lint + Fix (Auto-fix issues)
```bash
npm run lint:fix
```
Automatically fixes fixable issues (formatting, unused variables, etc.).

### Format with Prettier
```bash
npx prettier --write .
```
Formats all files according to Prettier config.

## How It Works

1. **Development:** Write code normally
2. **Before commit:** Run `npm run lint:fix` to auto-fix issues
3. **Review:** Remaining errors must be manually fixed (e.g., unused imports)
4. **CI/CD:** GitHub Actions runs `npm run lint` on every push/PR — fails if errors found
5. **Merge:** Only code passing lint can be merged

## Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| Double quotes instead of single | Run `npm run lint:fix` |
| Missing semicolons | Run `npm run lint:fix` |
| Unused variables/imports | Remove them manually |
| Line too long (>100 chars) | Run `npm run lint:fix` (Prettier will wrap) |
| Conflicting ESLint/Prettier rules | Already integrated — no manual fix needed |

## ESLint Config Breakdown

The `eslint.config.js` includes:

- **Base rules** from `@eslint/js` (recommended)
- **Prettier config** (`eslint-config-prettier`) — disables formatting rules ESLint shouldn't enforce
- **Prettier plugin** — enables the `prettier/prettier` rule
- **Node.js globals** — `console` and `process` recognized as valid globals
- **Jest globals** — `test`, `expect`, `describe`, etc. for test files

## For Maintainers

To update ESLint or Prettier versions:

1. Update `package.json` devDependencies
2. Run `npm install`
3. Test with `npm run lint` and `npm run lint:fix`
4. Commit changes
 
## Questions?

Refer to:
- [ESLint Documentation](https://eslint.org/docs/latest/)
- [Prettier Documentation](https://prettier.io/docs/en/index.html)
- `.github/workflows/backend-ci.yml` for CI configuration
