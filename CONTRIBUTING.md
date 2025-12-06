# Contributing Guidelines

Thank you for contributing! This guide will help you understand our development workflow and standards.

## Quick Start

1. **Install dependencies**

   ```bash
   npm install  # or yarn/pnpm
   ```

2. **Create a branch**

   ```bash
   git checkout -b feat/your-feature
   ```

3. **Make changes and commit**
   ```bash
   git add .
   git commit -m "feat: add new feature"
   ```

## Commit Message Format

We use [Conventional Commits](https://www.conventionalcommits.org/) for clear and structured commit history.

### Format

```
<type>(<scope>): <subject>
```

### Types

| Type       | Use Case                | Example                         |
| ---------- | ----------------------- | ------------------------------- |
| `feat`     | New feature             | `feat: add user login`          |
| `fix`      | Bug fix                 | `fix: resolve login error`      |
| `docs`     | Documentation           | `docs: update README`           |
| `style`    | Code formatting         | `style: format with prettier`   |
| `refactor` | Code restructuring      | `refactor: simplify auth logic` |
| `perf`     | Performance improvement | `perf: optimize queries`        |
| `test`     | Tests                   | `test: add login tests`         |
| `chore`    | Maintenance             | `chore: update dependencies`    |

### Examples

✅ **Good:**

```bash
feat: add password reset
fix(api): handle null user response
docs: add setup instructions
refactor(auth): simplify token validation
```

❌ **Bad:**

```bash
added stuff
WIP
Fix bug.
updated code
```

### Rules

- Use **lowercase** for type and subject
- Use **imperative mood**: "add" not "added"
- **No period** at the end
- Keep subject **under 50 characters**
- Optionally add scope in parentheses

## Automated Checks

### Pre-commit Hook

Runs automatically before each commit:

- **ESLint** - Checks and fixes code issues (if installed)
- **Prettier** - Formats code (if installed)

Only checks files you're committing (fast!).

### Commit Message Hook

Validates your commit message format after you write it.

### What If ESLint/Prettier Not Installed?

The hooks will skip them with a warning. Install when ready:

```bash
npm install -D eslint prettier  # or yarn/pnpm
```

## Bypassing Hooks

⚠️ **Only in emergencies:**

```bash
git commit --no-verify -m "emergency fix"
```

## Troubleshooting

### Hooks Not Running

```bash
npm run prepare
chmod +x .husky/*
```

### Lint Errors

```bash
npm run lint -- --fix  # Fix automatically
```

### Commit Rejected

Check the error message and ensure your commit follows the format:

- Valid type (feat, fix, docs, etc.)
- Lowercase subject
- No period at end

### Example Fix

```bash
# Wrong
git commit -m "Added feature."

# Right
git commit -m "feat: add feature"
```

## Best Practices

1. **Commit often** with small, logical changes
2. **Write clear messages** explaining what and why
3. **Test before committing**
4. **One feature per branch**
5. **Update docs** when needed

## Branch Naming

- `feat/feature-name` - New features
- `fix/bug-name` - Bug fixes
- `docs/doc-name` - Documentation
- `refactor/refactor-name` - Code refactoring

## Code Review Checklist

Before creating a PR:

- ✅ Tests pass
- ✅ Code is formatted
- ✅ No lint errors
- ✅ Commit messages follow conventions
- ✅ Documentation updated

## Resources

- [Conventional Commits](https://www.conventionalcommits.org/)
- [Git Hooks](https://git-scm.com/docs/githooks)

---

Questions? Check existing issues or ask the team! 🚀
