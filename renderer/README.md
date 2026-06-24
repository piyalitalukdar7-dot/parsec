# PARSEC Renderer

TypeScript renderer that converts PARSEC AST to HTML and React components.

## Features

- **React-based** — Compatible with React 18+
- **Dynamic** — Evaluates bindings with state context
- **Event handling** — Connects to backend actions
- **Type-safe** — Full TypeScript support

## Architecture

```
AST (from parser)
    ↓
evaluateBinding() — Evaluate {expressions} with state
    ↓
renderNode() — Convert node to HTML string
    ↓
HTML Output
```

### Components

#### `ast.ts`

TypeScript definitions mirroring Rust AST:
- `Program` — Root node
- `Node` — Union of all possible nodes
- `AttributeValue` — Attribute types
- Type guards: `isTextNode()`, `isElementNode()`, etc.

#### `render.ts`

Rendering functions:
- `evaluateBinding(expression, state)` — Run JavaScript expressions in state context
- `renderNode(node, context)` — Render single node
- `renderNodes(nodes, context)` — Render multiple nodes
- `buildProps(attrs, state)` — Build React props from attributes

#### `App.tsx`

React component:
- Fetches initial state from backend (`GET /state`)
- Handles user actions (`POST /actions/{actionName}`)
- Re-renders when state updates
- Shows loading/error states

#### `index.tsx`

Entry point:
- `initializeParsecApp()` — Initialize app on an element
- Global `window.ParsecApp` for easy access

## Usage

### As a Library

```typescript
import { parse } from 'parsec-parser';
import { renderNodes, RenderContext } from 'parsec-renderer';

const parsecCode = `<text>{state.name}</text>`;
const program = parse(parsecCode);

const context: RenderContext = {
  state: { name: 'John' },
  onAction: (actionName, data) => {
    console.log(`Action: ${actionName}`, data);
  }
};

const html = renderNodes(program.app.views[0].children, context);
document.getElementById('app').innerHTML = html;
```

### In React

```typescript
import { App } from 'parsec-renderer';
import { parse } from 'parsec-parser';

const program = parse(/* PARSEC code */);

export function MyApp() {
  return <App program={program} backendUrl="http://localhost:8000" />;
}
```

### In HTML

```html
<div id="app"></div>
<script>
  const program = { /* AST */ };
  ParsecApp.initialize(
    document.getElementById('app'),
    program,
    'http://localhost:8000'
  );
</script>
```

## State Binding

Bindings are evaluated with `new Function()`:

```typescript
evaluateBinding('state.count + 1', { count: 5 }) // → 6
evaluateBinding('state.items.length', { items: [...] }) // → item count
evaluateBinding('state.user.name.toUpperCase()', { user: { name: 'john' } }) // → 'JOHN'
```

**Security Note**: In production, use a proper expression evaluator (e.g., Mathjs) instead of `new Function()`.

## Event Handling

Events are sent to backend:

```typescript
onAction('increment', { itemId: 5 })
// Sends: POST /actions/increment
// Body: { data: { itemId: 5 } }
// Expects response: { state: { ... } }
```

## Conditional Rendering

```typescript
if (evaluateBinding('state.count > 5')) {
  // Render then_body
} else {
  // Render else_body
}
```

## Loops

```typescript
state.items.forEach((item) => {
  const itemContext = {
    state: { ...state, item },
    onAction
  };
  renderNodes(loopNode.children, itemContext);
});
```

## Building

```bash
npm install
npm run build
```

Output: `dist/` with compiled `.js`, `.d.ts`, and `.jsx` files.

## Testing

```bash
npm test
```

Tests cover:
- Binding evaluation
- Node rendering
- Event handling
- State updates

## Performance

- **Render time**: < 100ms for typical apps
- **Bundle size**: ~50KB (minified + gzipped)
- **Memory**: Minimal, direct HTML generation

## Error Handling

Errors in bindings are logged to console but don't break rendering:

```typescript
try {
  return func(state);
} catch (error) {
  console.error(`Failed to evaluate binding: ${expression}`, error);
  return null;
}
```

## Future Improvements

- [ ] Custom expression evaluator for security
- [ ] Component registry
- [ ] Built-in components (Icon, Card, Modal, etc.)
- [ ] Performance optimizations (memoization)
- [ ] Accessibility (a11y) support
