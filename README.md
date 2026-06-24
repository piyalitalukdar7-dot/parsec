# PARSEC

A markup language for building apps (not websites) that work with any backend.

```xml
<app>
  <meta title="My App" />
  <view>
    <stack vertical gap="16" padding="20">
      <text>Hello {state.name}!</text>
      <button onClick="increment">Click: {state.count}</button>
    </stack>
  </view>
</app>
```

**One paradigm: UI is a function of state.**

User interaction → backend → new state → UI re-renders.

## Why PARSEC?

- **No JavaScript** — Fully declarative
- **Single source of truth** — State lives on backend
- **Universal** — Works with any backend language
- **Fast** — Parse and render instantly
- **Simple** — Learn in minutes

## Quick Start

1. **Write a `.parsec` file** — Markup for your UI
2. **Create a backend** — Node.js, Python, Rust, Go, etc.
3. **Connect** — PARSEC frontend talks to your backend via HTTP
4. **Preview live** — VS Code extension shows instant preview

## Project Structure

```
parsec/
├── parser/              Rust lexer/parser → AST
├── renderer/            TypeScript renderer (AST → HTML/React)
└── vscode-extension/    VS Code plugin with live preview
```

## Documentation

- [Complete Language Specification](./docs/SPEC.md)
- [Getting Started Guide](./docs/GETTING_STARTED.md)
- [Backend Integration Guide](./docs/BACKEND_GUIDE.md)

## Development

### Parser (Rust)

```bash
cd parser
cargo build --release
cargo test
```

### Renderer (TypeScript)

```bash
cd renderer
npm install
npm run build
npm test
```

### VS Code Extension

```bash
cd vscode-extension
npm install
npm run build
```

## Core Concepts

### Components

Primitive building blocks: `<stack>`, `<text>`, `<button>`, `<input>`, `<grid>`, `<card>`, `<modal>`, etc.

### State Binding

Access backend state with `{state.field}`:

```xml
<text>{state.user.name}</text>
<button onClick="increment">Count: {state.count}</button>
```

### Events & Actions

User interaction → POST to `/actions/{actionName}` → Backend processes → Returns new state → UI updates.

```xml
<button onClick="deleteItem" data="{item.id}">Delete</button>
```

### Routing

Multi-view apps with route parameters:

```xml
<view path="/user/:id">
  <text>User: {route.params.id}</text>
</view>
```

### Conditional & Loops

```xml
<if condition="{state.isLoggedIn}">
  <text>Welcome!</text>
</if>

<for item in "{state.todos}">
  <text>{item.title}</text>
</for>
```

## Backend Contract

### GET /state

Frontend fetches initial state.

**Response:**
```json
{ "count": 0, "user": { "name": "John" } }
```

### POST /actions/{actionName}

Frontend sends actions.

**Request:**
```json
{ "data": { ... } }
```

**Response:**
```json
{ "state": { ...updated state } }
```

## Examples

### Counter App

PARSEC:
```xml
<app>
  <view>
    <stack vertical align="center" justify="center">
      <text fontSize="32">{state.count}</text>
      <button onClick="increment">+</button>
      <button onClick="decrement">-</button>
    </stack>
  </view>
</app>
```

Backend (Node.js):
```javascript
let state = { count: 0 };

app.get('/state', (req, res) => res.json(state));

app.post('/actions/increment', (req, res) => {
  state.count++;
  res.json({ state });
});

app.post('/actions/decrement', (req, res) => {
  state.count--;
  res.json({ state });
});
```

### Todo App

See [full example](./examples/) for a complete todo app with PARSEC frontend + backend.

## License

MIT

## Contributing

Contributions welcome! See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

---

**PARSEC: The future of app development. Simpler. Faster. Universal.**
