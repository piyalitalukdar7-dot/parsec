# PARSEC Examples

Complete example apps showing PARSEC in action.

## Counter App

A simple counter app demonstrating basic bindings, events, and state updates.

**Files:**
- `counter.parsec` — PARSEC frontend
- `backend-counter.js` — Node.js backend

**Run:**
```bash
# Terminal 1: Start backend
node backend-counter.js

# Terminal 2: Open counter.parsec in VS Code
# Command: PARSEC: Open Preview
```

**Features:**
- Display state value
- Increment/decrement buttons
- Conditional rendering (count warnings)
- Simple card styling

## Todo App

A todo list app showing loops, conditionals, and list management.

**Files:**
- `todo.parsec` — PARSEC frontend
- `backend-todo.js` — Node.js backend

**Run:**
```bash
# Terminal 1: Start backend
node backend-todo.js

# Terminal 2: Open todo.parsec in VS Code
# Command: PARSEC: Open Preview
```

**Features:**
- Add todos
- Toggle completion status
- Delete todos
- List rendering with loops (`<for>`)
- Conditional empty state
- Statistics/counting

## More Examples Coming

- [ ] Shopping cart
- [ ] Weather app
- [ ] Chat interface
- [ ] User profile
- [ ] Form validation
- [ ] Multi-view routing

## How to Create Your Own

1. Create a `.parsec` file
2. Create a Node.js/Python/Rust backend
3. Implement `/state` endpoint
4. Implement action endpoints in `/actions/{actionName}`
5. Open PARSEC preview
6. Set backend URL if not localhost:8000

See [Backend Integration Guide](../docs/BACKEND_GUIDE.md) for details.
