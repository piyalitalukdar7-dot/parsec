# PARSEC Extension - Fixed & Ready for AI

## What Was Fixed

### 1. **Syntax Highlighting**
- ✅ Fixed: Created proper `parsec.tmLanguage.json` (was pointing to `.xml` file that couldn't be used)
- ✅ Result: VS Code now recognizes PARSEC syntax properly
- ✅ Benefit: AI sees correct language definition in workspace

### 2. **Preview Rendering** 
- ✅ Fixed: Preview was showing "Loading..." forever
- ✅ Added: Full PARSEC parser/renderer inline
- ✅ Features:
  - Parses PARSEC tags
  - Evaluates `{state.fieldName}` bindings
  - Renders buttons, inputs, stacks, cards
  - Proper error messages when backend is unavailable
  - Real-time state synchronization with backend

### 3. **Backend Connection**
- ✅ Fixed: No proper error handling or state fetching
- ✅ Added: 
  - Fetches `GET /state` on preview load
  - Handles backend connection errors gracefully
  - Shows helpful error messages
  - Supports action triggers via `POST /actions/{name}`

### 4. **AI Access to Language**
- ✅ Added: New commands for AI/developers:
  - `parsec.showLanguageReference` - Opens full language spec
  - `parsec.showHelp` - Opens AI prompting guide
- ✅ Benefit: AI can read full PARSEC syntax from extension

---

## How to Use the Fixed Extension

### Step 1: Install Updated Extension

```powershell
# First uninstall old version
code --uninstall-extension parsec

# Install new version
code --install-extension "d:\VS Code\.parsec\vscode-extension\parsec-vscode-0.1.0.vsix"
```

### Step 2: Create a Test PARSEC File

Create `test.parsec`:
```xml
<app>
  <meta title="Counter App" />
  <view>
    <stack vertical padding="20" gap="16" align="center">
      <text fontSize="32">{state.count}</text>
      <button onClick="increment">+ Increment</button>
      <button onClick="decrement">- Decrement</button>
      <if condition="{state.count > 5}">
        <text color="red">Count is high!</text>
      </if>
    </stack>
  </view>
</app>
```

### Step 3: Start Your Backend

```powershell
# Option A: Use included demo server
node server.js

# Option B: Create your own backend returning:
# GET /state → {"count": 0}
# POST /actions/increment → {"state": {"count": 1}}
```

### Step 4: Open Preview

1. Open the `.parsec` file in VS Code
2. Press `Ctrl+Shift+P`
3. Type: `PARSEC: Toggle Preview`
4. See the app render in the side panel!

### Step 5: Use with AI (Copilot/ChatGPT)

#### In VS Code Copilot Chat:

```
@workspace Generate a PARSEC form component
```

Copilot can now:
- See full PARSEC syntax in workspace
- Generate accurate component code
- Reference examples from language reference

#### With ChatGPT/Claude:

1. Press `Ctrl+Shift+P`
2. Type: `PARSEC: Show Language Reference`
3. Copy relevant sections
4. Paste into AI chat
5. Ask for code generation

---

## Complete Working Example

### Frontend: `shopping.parsec`

```xml
<app>
  <meta title="Shopping Cart" />
  <view>
    <stack vertical padding="20" gap="16">
      <!-- Header -->
      <text fontSize="24" fontWeight="bold">Shopping Cart</text>
      
      <!-- Product List -->
      <for item in "{state.products}">
        <card padding="16">
          <stack horizontal gap="12" align="center">
            <stack vertical flex="1">
              <text fontWeight="bold">{item.name}</text>
              <text color="gray">${item.price}</text>
            </stack>
            <button onClick="removeProduct" data="{item.id}">Remove</button>
          </stack>
        </card>
      </for>
      
      <!-- Total -->
      <text fontSize="18" fontWeight="bold">Total: ${state.total}</text>
      
      <!-- Checkout -->
      <button onClick="checkout">Checkout</button>
    </stack>
  </view>
</app>
```

### Backend: Node.js `shopping-backend.js`

```javascript
const http = require('http');

let state = {
  products: [
    { id: 1, name: 'Laptop', price: 999 },
    { id: 2, name: 'Mouse', price: 29 }
  ],
  total: 1028
};

const server = http.createServer((req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  // GET /state
  if (req.method === 'GET' && req.url === '/state') {
    res.writeHead(200);
    res.end(JSON.stringify(state));
    return;
  }

  // POST /actions/removeProduct
  if (req.method === 'POST' && req.url.match(/^\/actions\/removeProduct/)) {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      const data = JSON.parse(body || '{}');
      state.products = state.products.filter(p => p.id != data.id);
      state.total = state.products.reduce((sum, p) => sum + p.price, 0);
      res.writeHead(200);
      res.end(JSON.stringify({ state }));
    });
    return;
  }

  // POST /actions/checkout
  if (req.method === 'POST' && req.url === '/actions/checkout') {
    res.writeHead(200);
    res.end(JSON.stringify({ state: { products: [], total: 0 } }));
    return;
  }

  res.writeHead(404);
  res.end(JSON.stringify({ error: 'Not found' }));
});

server.listen(8000, () => console.log('Backend running on http://localhost:8000'));
```

---

## Commands Available

| Command | Shortcut | Purpose |
|---------|----------|---------|
| `PARSEC: Toggle Preview` | `Ctrl+Shift+P` | Open/close preview panel |
| `PARSEC: Open Preview` | - | Open preview in side panel |
| `PARSEC: Set Backend URL` | - | Change backend address |
| `PARSEC: Show Language Reference` | - | View full PARSEC syntax |
| `PARSEC: Show AI Prompting Guide` | - | View AI prompting tips |

---

## Troubleshooting

### Preview Shows Error
**Issue**: "Backend Connection Error"

**Fix**: Make sure backend is running
```powershell
node server.js
# Should output: Backend running on http://localhost:8000
```

### Preview Shows Nothing
**Issue**: Components not rendering

**Cause**: Syntax error in PARSEC file

**Fix**: Check:
- All tags properly closed: `<button>Text</button>`
- Bindings formatted: `{state.fieldName}`
- All required attributes: `onClick="actionName"`

### AI Doesn't Generate PARSEC Code
**Fix**: Show AI the syntax
```
Cmd+Shift+P → "PARSEC: Show Language Reference"
Copy → Paste into AI chat
Then ask for code
```

### Backend Action Not Working
**Issue**: Button clicks don't update state

**Check**:
1. Action endpoint exists: `POST /actions/actionName`
2. Response format: `{ "state": {...} }`
3. Backend CORS headers enabled

---

## Next Steps

### Use with AI Right Now

1. Open VS Code in `.parsec` workspace
2. `Ctrl+Shift+I` (Copilot Chat)
3. Ask: *"@workspace create a PARSEC todo app"*
4. Copilot generates accurate code using embedded syntax!

### Create Your First App

1. Create `myapp.parsec`
2. Add PARSEC markup (see examples above)
3. `Ctrl+Shift+P` → `PARSEC: Toggle Preview`
4. Backend handles logic, preview shows UI!

### Deploy

- Frontend: Share `.parsec` file (or deploy to static host)
- Backend: Deploy Node.js/Python/Rust server
- Users access through VS Code or browser

---

## Files Modified

```
vscode-extension/
├── src/
│   ├── extension.ts          ← Added language ref commands
│   └── preview.ts            ← Fixed rendering with PARSEC parser
├── syntaxes/
│   ├── parsec.tmLanguage.json ← New! (was missing)
│   └── parsec.tmLanguage.xml   ← Old (kept for compatibility)
└── package.json              ← Added new commands
```

---

## Summary

✅ **What Works Now:**
- PARSEC syntax highlighting in VS Code
- Live preview with state binding
- Backend state fetching and actions
- AI access to full language spec
- Error handling and helpful messages

✅ **Ready For:**
- AI code generation with Copilot Chat
- Full-stack app development
- Backend integration in any language
- Team collaboration

**You can now ask AI to generate PARSEC apps and they will work!** 🚀
