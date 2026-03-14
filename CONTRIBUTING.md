# Contributing to LIKEFOOD

Thank you for your interest in contributing to LIKEFOOD!

---

## Code of Conduct

By participating in this project, you agree to follow our Code of Conduct:

- Be respectful and inclusive
- Welcome newcomers and help them learn
- Accept constructive criticism gracefully
- Focus on what is best for the community

---

## How to Contribute

### Reporting Bugs

1. Check if the bug has already been reported
2. Create a detailed bug report with:
   - Clear title
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots if applicable
   - Environment details

### Suggesting Features

1. Check the roadmap for planned features
2. Open a discussion issue first
3. Describe the feature in detail
4. Explain why it would be beneficial

### Pull Requests

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Make your changes following our coding standards
4. Write tests for new functionality
5. Ensure all tests pass
6. Commit with clear messages
7. Push to your fork
8. Submit a pull request

---

## Development Setup

### Prerequisites

- Node.js 20.x
- MySQL 8.0 or higher
- Redis (optional, for rate limiting)

### Setup Steps

```bash
# Clone the repository
git clone https://github.com/tranquocvu-3011/likefood.git
cd likefood

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Generate Prisma client
npm run db:generate

# Push database schema
npm run db:push

# Start development server
npm run dev
```

---

## Coding Standards

### TypeScript

- Use strict mode
- Avoid `any` types
- Use proper type annotations
- Export types when needed

### React Components

- Use functional components with hooks
- Keep components small and focused
- Use proper naming conventions (PascalCase for components)
- Add JSDoc for complex logic

### Git Commits

Follow conventional commits:

```
feat: add new feature
fix: fix a bug
docs: update documentation
style: format code
refactor: restructure code
test: add tests
chore: maintenance
```

---

## Testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage
```

### Writing Tests

- Write tests for all new functionality
- Follow AAA pattern (Arrange, Act, Assert)
- Test edge cases
- Mock external dependencies

---

## License

By contributing to LIKEFOOD, you agree that your contributions will be licensed under the MIT License.

---

*Last Updated: 2026-03-14*
