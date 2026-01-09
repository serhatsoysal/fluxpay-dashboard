# Contributing to FluxPay Dashboard

Thank you for your interest in contributing to FluxPay Dashboard! This document provides guidelines and instructions for contributing to this project.

## Code of Conduct

By participating in this project, you agree to maintain a respectful and inclusive environment for everyone. Please be kind and courteous.

## Getting Started

### Prerequisites

- Node.js 20.x or higher
- npm or yarn
- Git

### Development Setup

1. Fork the repository on GitHub
2. Clone your fork locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/fluxpay-dashboard.git
   cd fluxpay-dashboard
   ```

3. Add the upstream repository:
   ```bash
   git remote add upstream https://github.com/ORIGINAL_OWNER/fluxpay-dashboard.git
   ```

4. Install dependencies:
   ```bash
   npm install
   ```

5. Create a `.env` file from the example:
   ```bash
   cp .env.example .env
   ```

6. Start the development server:
   ```bash
   npm run dev
   ```

## Development Workflow

### Branch Naming Convention

Use descriptive branch names with the following prefixes:

- `feature/` - New features (e.g., `feature/add-payment-gateway`)
- `fix/` - Bug fixes (e.g., `fix/login-redirect-issue`)
- `docs/` - Documentation updates (e.g., `docs/update-readme`)
- `refactor/` - Code refactoring (e.g., `refactor/auth-module`)
- `test/` - Test additions or updates (e.g., `test/add-auth-tests`)
- `chore/` - Maintenance tasks (e.g., `chore/update-dependencies`)

### Commit Message Convention

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation changes
- `style` - Code style changes (formatting, etc.)
- `refactor` - Code refactoring
- `test` - Adding or updating tests
- `chore` - Maintenance tasks

**Examples:**
```
feat(auth): add JWT token refresh mechanism

fix(ui): resolve button alignment issue on mobile

docs(readme): update installation instructions
```

## Coding Standards

### TypeScript

- Use TypeScript strict mode
- Avoid `any` types; use proper type definitions
- Use interfaces for object types
- Export types alongside their related components

### React

- Use functional components with hooks
- Keep components focused and single-purpose
- Extract reusable logic into custom hooks
- Use proper prop typing with TypeScript

### Code Style

- Follow existing code formatting (enforced by ESLint and Prettier)
- Run `npm run lint` before committing
- Use meaningful variable and function names
- Keep functions small and focused
- Add comments for complex logic

### File Organization

```
src/
├── app/              # Application configuration
├── features/         # Feature modules
│   └── [feature]/
│       ├── api/      # API calls
│       ├── components/
│       ├── hooks/
│       ├── pages/
│       ├── store/    # State management
│       ├── types/
│       └── utils/
└── shared/           # Shared utilities
    ├── components/
    ├── hooks/
    ├── types/
    └── utils/
```

## Testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch

# Run tests with UI
npm run test:ui
```

### Writing Tests

- Write tests for new features and bug fixes
- Aim for at least 70% code coverage
- Use React Testing Library for component tests
- Test user interactions, not implementation details
- Keep tests simple and focused

**Test file naming:**
- Component tests: `ComponentName.test.tsx`
- Hook tests: `useHookName.test.ts`
- Utility tests: `utilityName.test.ts`

## Pull Request Process

1. **Create a feature branch** from `develop`:
   ```bash
   git checkout develop
   git pull upstream develop
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes** following the coding standards

3. **Test your changes**:
   ```bash
   npm run lint
   npm test
   npm run build
   ```

4. **Commit your changes** with clear, descriptive commit messages

5. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create a Pull Request** on GitHub:
   - Use the PR template
   - Link related issues
   - Provide clear description and screenshots
   - Request review from maintainers

7. **Address review feedback** promptly

8. **Squash commits** if requested before merge

## Review Process

- All PRs require at least one approval
- CI checks must pass (tests, linting, build)
- Changes may be requested by reviewers
- Be responsive to feedback
- PRs may be closed if inactive for 30 days

## Project Structure

### Key Directories

- **`src/app/`** - Application setup and configuration
- **`src/features/`** - Feature-based modules
- **`src/shared/`** - Shared components and utilities
- **`src/styles/`** - Global styles and Tailwind configuration
- **`public/`** - Static assets

### Important Files

- **`vite.config.ts`** - Build configuration
- **`vitest.config.ts`** - Test configuration
- **`tsconfig.json`** - TypeScript configuration
- **`tailwind.config.js`** - Tailwind CSS configuration

## Reporting Issues

### Bug Reports

Use the [Bug Report template](.github/ISSUE_TEMPLATE/bug_report.yml) and include:
- Clear description of the issue
- Steps to reproduce
- Expected vs. actual behavior
- Screenshots if applicable
- Environment details (browser, OS)

### Feature Requests

Use the [Feature Request template](.github/ISSUE_TEMPLATE/feature_request.yml) and include:
- Problem statement
- Proposed solution
- Use cases
- Mockups if applicable

## Getting Help

- **Questions:** Open a [GitHub Discussion](https://github.com/YOUR_USERNAME/fluxpay-dashboard/discussions)
- **Bugs:** Open an [Issue](https://github.com/YOUR_USERNAME/fluxpay-dashboard/issues)
- **Security:** See [SECURITY.md](SECURITY.md)

## License

By contributing, you agree that your contributions will be licensed under the project's MIT License.

## Recognition

Contributors are recognized in the project's README and release notes. Thank you for your contributions!

