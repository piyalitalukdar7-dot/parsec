<!-- Copilot customization for PARSEC project development -->

# PARSEC Development Guidelines

## Project Overview

PARSEC is a markup language for building apps with any backend. The project consists of three main components:

1. **Parser** (Rust) — Lexer, AST, parser for PARSEC syntax
2. **Renderer** (TypeScript) — AST to HTML/React conversion
3. **VS Code Extension** (TypeScript) — Live preview in VS Code

**For complete PARSEC language syntax, see [PARSEC_LANGUAGE_REFERENCE.md](../PARSEC_LANGUAGE_REFERENCE.md)**

## When Working on PARSEC Code

When generating or analyzing PARSEC code:
1. Always reference [PARSEC_LANGUAGE_REFERENCE.md](../PARSEC_LANGUAGE_REFERENCE.md) for complete syntax
2. Use component examples from the reference (stack, grid, text, button, input, etc.)
3. Follow state binding patterns: `{state.fieldName}`
4. Ensure backend contract compliance (GET /state, POST /actions/{name})
5. Include proper error handling in backend actions
6. Test with both small and large state objects

## Development Workflow

### Parser Development

- Language: Rust (src/lexer.rs, src/ast.rs, src/parser.rs)
- Build: `cargo build --release`
- Test: `cargo test`
- WASM: `cargo build --target wasm32-unknown-unknown`

### Renderer Development

- Language: TypeScript + React
- Location: renderer/src/
- Build: `npm run build`
- Test: `npm test`

### Extension Development

- Language: TypeScript + VS Code API
- Location: vscode-extension/src/
- Build: `npm run build`
- Test: `npm test`

## Code Style

- **Rust**: Follow Rust conventions, use `rustfmt`
- **TypeScript**: Use strict mode, target ES2020
- **Comments**: Document public APIs with doc comments
- **Tests**: Add tests for all new features

## Common Tasks

### Add a New Component Type

1. Define in parser AST (ast.rs)
2. Add lexer tokens (lexer.rs)
3. Add parser rules (parser.rs)
4. Add renderer support (render.ts)
5. Update docs (SPEC.md)
6. Add example (examples/)

### Fix a Bug

1. Create test case first
2. Implement fix
3. Verify tests pass
4. Update docs if needed

### Improve Performance

1. Profile current state
2. Identify bottleneck
3. Optimize with benchmarks
4. Verify no regression

## Testing

- **Parser**: `cargo test` (Rust)
- **Renderer**: `npm test` (TypeScript)
- **Extension**: `npm test` (TypeScript)
- **Integration**: Manual testing with examples

## Documentation

- Language spec: docs/SPEC.md
- Getting started: docs/GETTING_STARTED.md
- Backend guide: docs/BACKEND_GUIDE.md
- Component docs: In code comments

## Dependencies

- **Parser**: serde, serde_json, thiserror
- **Renderer**: react, react-dom
- **Extension**: @types/vscode

Minimize dependencies. Keep library lightweight.

## Performance Goals

- Parser: < 1ms for typical apps
- Renderer: < 100ms for typical apps
- Binary: < 2MB (release)
- WASM: < 500KB (release)

## Security

- No `eval()` in production (use safe expression evaluator)
- Validate all inputs
- Sanitize HTML output
- No inline scripts in webviews

## Release Checklist

- [ ] Update version numbers
- [ ] Update CHANGELOG
- [ ] Run all tests
- [ ] Update documentation
- [ ] Tag release
- [ ] Publish to registry (npm, crates.io)

## Contributing Guidelines

- Create feature branch: `git checkout -b feature/name`
- Make atomic commits
- Write clear commit messages
- Create pull request with description
- Ensure CI passes
- Get review before merge

## Getting Help

- Check docs/ folder first
- Search existing issues
- Create new issue with:
  - Clear description
  - Reproduction steps
  - Expected vs actual behavior
  - Environment info

## Resources

- PARSEC Language Spec: [docs/SPEC.md](../docs/SPEC.md)
- Rust Book: https://doc.rust-lang.org/book/
- React Docs: https://react.dev/
- VS Code Extension API: https://code.visualstudio.com/api/

---

Last updated: 2026-06-24
