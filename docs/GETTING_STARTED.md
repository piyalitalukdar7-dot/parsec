# Getting Started with PARSEC

## Prerequisites

- Node.js 16+ (for TypeScript/renderer)
- Rust 1.70+ (optional, for building parser from source)
- VS Code 1.75+

## Installation

### 1. Install the VS Code Extension

```bash
cd vscode-extension
npm install
npm run build
# Install the extension from dist/
```

### 2. Set Up the Renderer (TypeScript/React)

```bash
cd renderer
npm install
npm run build
```

### 3. Set Up the Parser (Optional: Rust)

```bash
cd parser
cargo build --release
```

## Create Your First App

### Step 1: Create a .parsec file

```bash
mkdir my-app
cd my-app
touch app.parsec
```

### Step 2: Write a simple app

```xml
<app>
  <meta title="Counter App" />
  
  <view>
    <stack vertical align="center" justify="center" width="100%" height="100%">
      <text fontSize="32" fontWeight="bold">
        Count: {state.count}
      </text>
      
      <button onClick="increment" padding="12" gap="8">
        Increment
      </button>
      
      <button onClick="decrement" padding="12" gap="8">
        Decrement
      </button>
    </stack>
  </view>
</app>
```

### Step 3: Set Up Your Backend

Create a simple Node.js server:

```javascript
import express from 'express';

let state = { count: 0 };

const app = express();
app.use(express.json());

// Initial state fetch
app.get('/state', (req, res) => {
  res.json(state);
});

// Actions
app.post('/actions/increment', (req, res) => {
  state.count++;
  res.json({ state });
});

app.post('/actions/decrement', (req, res) => {
  state.count--;
  res.json({ state });
});

app.listen(8000, () => {
  console.log('Backend listening on http://localhost:8000');
});
```

### Step 4: Start Your Backend

```bash
node server.js
```

### Step 5: Open in VS Code

1. Open `app.parsec` in VS Code
2. Run command: `PARSEC: Open Preview` (Ctrl+Shift+P in macOS/Linux, Ctrl+Shift+P on Windows)
3. Set backend URL in settings: `parsec.backendUrl`
4. Watch your app render!

## Backend URL Configuration

By default, PARSEC looks for backend at `http://localhost:8000`.

To change:
1. Settings → Search "parsec.backendUrl"
2. Or run: `PARSEC: Set Backend URL` command

## Auto-Refresh

Enable auto-preview refresh when you save `.parsec` files:
1. Settings → Search "parsec.autoRefresh"
2. Set to `true`

## Debugging

- **Inspector**: Click elements in preview to inspect state/props
- **Console**: Check VS Code output panel for parse errors
- **Backend Logs**: Monitor your backend server output

## Next Steps

- Read the [Backend Integration Guide](./BACKEND_GUIDE.md)
- Check out [examples](../examples/)
- Read the full [specification](./SPEC.md)
