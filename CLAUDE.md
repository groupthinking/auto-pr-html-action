# CLAUDE.md - Auto PR Screenshots

## Quick Reference

### Build & Test Commands
```bash
pnpm install          # Install dependencies
pnpm build            # Build with ncc to dist/
pnpm test             # Run Jest tests
pnpm lint             # Run Biome linter
pnpm check            # Lint + type check
```

### Project Summary
GitHub Action that captures screenshots of web apps and posts them to PRs using Playwright.

### Architecture
- **Entry**: `src/index.ts` - orchestrates the workflow
- **Config**: `src/config-loader.ts` - loads YAML configs
- **Capture**: `src/screenshot-capture.ts` - Playwright browser automation
- **Upload**: `src/screenshot-uploader.ts` - pushes to gh-screenshots branch
- **Comment**: `src/comment-poster.ts` - posts to PR

### Key Files
| File | Purpose |
|------|---------|
| `action.yml` | GitHub Action definition |
| `src/types.ts` | TypeScript interfaces |
| `.github/screenshots.config.yml` | Example config format |

### Tech Stack
- TypeScript + Node.js 24
- Playwright (chromium, firefox, webkit)
- @vercel/ncc for bundling
- Biome for linting/formatting
- Jest for testing
- pnpm as package manager

### Code Style
- Single quotes, trailing commas
- 2-space indentation, 100 char line width
- Strict TypeScript mode
- Use logger module for output (with emoji prefixes)

### Testing Locally
```bash
export LOCAL_TEST=true
export INPUT_URL="http://localhost:3000"
pnpm test:local /path/to/project
```

### Common Patterns

#### Error Handling
```typescript
try {
  // operation
} catch (error) {
  const errorMessage = error instanceof Error ? error.message : String(error);
  logger.error('❌ Error:', errorMessage);
  if (failOnError) {
    core.setFailed(errorMessage);
  }
}
```

#### Config Loading Precedence
1. Config file (`.github/screenshots.config.yml`)
2. URL input parameter
3. Framework auto-detection

### Important Notes
- Always rebuild dist after changes: `pnpm build`
- dist/ is committed to repo (required for GitHub Actions)
- Supports Node.js 24 runtime
