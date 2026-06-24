# PARSEC Specification

This is the complete language specification for PARSEC, a markup language for building apps.

## Quick Start

1. **Single file**: `app.parsec` — everything in one file
2. **Multiple files**: Each screen in separate `.parsec` file, imported

```parsec
<app>
  <meta title="My App" />
  
  <view>
    <stack vertical padding="20" gap="16">
      <text fontSize="24" fontWeight="bold">Hello World</text>
      <button onClick="increment">Click me</button>
      <text>{state.count}</text>
    </stack>
  </view>
</app>
```

## Key Concepts

- **UI is a function of state**: `render(state) => UI`
- **No JavaScript**: Everything declarative
- **Backend-driven**: State lives on backend, UI reflects state
- **Universal markup**: Works with any backend language
- **One source of truth**: Changes flow from user interaction → backend → state → re-render

## Core Components

### Layout
- `<stack>` — Vertical or horizontal container
- `<grid>` — Grid layout
- `<box>` — Fixed/absolute positioning
- `<scroll>` — Scrollable container

### Content
- `<text>` — Text content
- `<button>` — Clickable button
- `<input>` — Text input
- `<checkbox>` — Checkbox
- `<radio>` — Radio button
- `<select>` — Dropdown
- `<image>` — Image (local or URL)
- `<icon>` — Built-in icon

### Containers
- `<card>` — Elevated card
- `<modal>` — Modal dialog
- `<bottomSheet>` — Mobile sheet
- `<tabs>` — Tab navigation
- `<list>` — List with looping

### Navigation
- `<navbar>` — Navigation bar
- `<link>` — Navigate to screen

## State & Bindings

All state lives on the backend. Access via `{state.field}`:

```parsec
<text>{state.user.name}</text>
<text>{state.items.length}</text>
```

## Events & Actions

```parsec
<button onClick="increment">+</button>
<input onChange="setName" />
```

The action is sent to: `POST /actions/{actionName}` on your backend.

## See Also

- [Getting Started Guide](./GETTING_STARTED.md)
- [Backend Integration Guide](./BACKEND_GUIDE.md)
- [Examples](./examples/)
