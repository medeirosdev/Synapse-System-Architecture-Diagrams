# Contributing to Synapse

Thank you for your interest in contributing to Synapse! This document provides guidelines and instructions for contributing.

## Code of Conduct

By participating in this project, you agree to maintain a respectful and inclusive environment for everyone.

## How to Contribute

### Reporting Bugs

Before creating a bug report, please check existing issues to avoid duplicates. When creating a bug report, include:

- A clear and descriptive title
- Steps to reproduce the issue
- Expected behavior vs actual behavior
- Screenshots if applicable
- Browser and OS information

### Suggesting Features

Feature suggestions are welcome! Please provide:

- A clear description of the feature
- The problem it solves or the use case it addresses
- Any implementation ideas you may have

### Pull Requests

1. Fork the repository and create your branch from `main`
2. If you've added code, add tests if applicable
3. Ensure your code follows the existing style conventions
4. Update documentation as needed
5. Write a clear commit message

## Development Setup

### Prerequisites

- Node.js 18 or higher
- npm or yarn

### Getting Started

```bash
# Clone your fork
git clone https://github.com/yourusername/synapse.git
cd synapse

# Install dependencies
npm install

# Start development server
npm run dev
```

### Project Structure

- `src/components/` - React components
- `src/store/` - Zustand state management
- `src/lib/` - Utility functions and persistence
- `src/config/` - Configuration files (icons, etc.)
- `src/types.ts` - TypeScript type definitions

### Code Style

- Use TypeScript for all new code
- Follow existing naming conventions
- Use functional components with hooks
- Keep components focused and single-purpose
- Add JSDoc comments for exported functions

### Testing

```bash
# Run type checking
npm run typecheck

# Build for production (also validates)
npm run build
```

## Commit Messages

Use clear and descriptive commit messages:

- `feat:` for new features
- `fix:` for bug fixes
- `docs:` for documentation changes
- `style:` for formatting changes
- `refactor:` for code refactoring
- `test:` for adding tests
- `chore:` for maintenance tasks

Example: `feat: add edge label support`

## Questions?

Feel free to open an issue for any questions about contributing.
