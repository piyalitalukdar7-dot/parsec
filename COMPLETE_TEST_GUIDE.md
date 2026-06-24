# PARSEC Extension - Complete Testing Guide

## ✅ Installation

```powershell
# Option A: Quick Setup (Windows)
cd "d:\VS Code\.parsec"
.\setup-extension.bat

# Option B: Manual Install
code --uninstall-extension parsec
code --install-extension "d:\VS Code\.parsec\vscode-extension\parsec-vscode-0.1.0.vsix"
```

---

## Test 1: Syntax Highlighting ✅

**Goal**: Verify PARSEC language is recognized

### Steps:
1. Create file: `d:\VS Code\.parsec\test-syntax.parsec`
2. Paste:
```xml
<!-- This is a comment -->
<app>
  <view>
    <text>Hello</text>
    <button onClick="action">Click Me</button>
    <input value="{state.name}" />
    <if condition="{state.active}">
      <text>Active!</text>
    </if>
  </view>
</app>
```

3. Open in VS Code
4. Check: Are keywords colored?
   - `<app>` `<view>` `<text>` - should be keyword color
   - `onClick` `condition` - should be attribute color
   - `{state.name}` - should be binding color
   - `<!-- ... -->` - should be gray/comment color

### Expected Result:
```
✅ Keywords highlighted
✅ Attributes highlighted  
✅ Bindings highlighted
✅ Comments highlighted
```

### Troubleshooting:
If no colors appear:
```powershell
# Check syntax file exists
Test-Path "d:\VS Code\.parsec\vscode-extension\syntaxes\parsec.tmLanguage.json"

# Check package.json points correctly
(Get-Content "d:\VS Code\.parsec\vscode-extension\package.json") | Select-String "parsec.tmLanguage.json"
```

---

## Test 2: Preview Rendering ✅

**Goal**: Verify preview panel renders components

### Prerequisites:
```powershell
# Start backend
cd "d:\VS Code\.parsec"
node server.js
# Should show: Backend running on http://localhost:8000
```

### Steps:
1. Open `test-syntax.parsec`
2. Press `Ctrl+Shift+P`
3. Type: `PARSEC: Toggle Preview`
4. Preview should open on right side

### Expected Result:
```
✅ Preview panel opens
✅ Components visible (Text, Button, Input)
✅ State values displayed ({state.count} shows actual number)
✅ No error messages
```

### Check Components:
- `<text>` tags render as text
- `<button>` tags render as clickable buttons
- `<input>` fields appear
- `<if>` conditions show/hide content
- `{state.fieldName}` shows actual values

### Troubleshooting:

**If preview shows error:**
```
Error: Backend Connection Error
Backend not running at http://localhost:8000
```

**Fix:**
```powershell
# Terminal 1: Start backend
node server.js

# Terminal 2: Open VS Code
code .
```

**If components don't render:**
1. Check PARSEC syntax is valid
2. Verify file saved (Ctrl+S)
3. Try: Ctrl+Shift+P → "PARSEC: Toggle Preview" again

---

## Test 3: State Binding ✅

**Goal**: Verify `{state.fieldName}` actually displays values

### File: `test-binding.parsec`
```xml
<app>
  <meta title="State Binding Test" />
  <view>
    <stack vertical padding="20" gap="16">
      <!-- These should show actual backend state -->
      <text>Count: {state.count}</text>
      <text>User: {state.user.name}</text>
      <text>Items: {state.items.length}</text>
    </stack>
  </view>
</app>
```

### Steps:
1. Backend should return:
```json
{
  "count": 42,
  "user": { "name": "John Doe" },
  "items": [1, 2, 3]
}
```

2. Open file in VS Code
3. Toggle preview (Ctrl+Shift+P → "PARSEC: Toggle Preview")

### Expected Result:
```
Count: 42
User: John Doe
Items: 3
```

NOT:
```
Count: {state.count}          ← BAD
User: {state.user.name}       ← BAD
Items: {state.items.length}   ← BAD
```

---

## Test 4: Button Actions ✅

**Goal**: Verify buttons trigger backend actions and update state

### File: `test-actions.parsec`
```xml
<app>
  <meta title="Action Test" />
  <view>
    <stack vertical padding="20" gap="16" align="center">
      <text fontSize="32">{state.count}</text>
      
      <button onClick="increment">
        Increment
      </button>
      
      <button onClick="decrement">
        Decrement
      </button>
      
      <text>Click buttons to update count</text>
    </stack>
  </view>
</app>
```

### Backend: `test-backend.js`
```javascript
const http = require('http');

let state = { count: 0 };

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  if (req.method === 'GET' && req.url === '/state') {
    res.writeHead(200);
    res.end(JSON.stringify(state));
    return;
  }

  if (req.method === 'POST' && req.url === '/actions/increment') {
    state.count++;
    res.writeHead(200);
    res.end(JSON.stringify({ state }));
    return;
  }

  if (req.method === 'POST' && req.url === '/actions/decrement') {
    state.count--;
    res.writeHead(200);
    res.end(JSON.stringify({ state }));
    return;
  }

  res.writeHead(404);
  res.end(JSON.stringify({ error: 'Not found' }));
});

server.listen(8000, () => console.log('Test backend running'));
```

### Steps:
1. Start backend:
```powershell
node test-backend.js
```

2. Open `test-actions.parsec`
3. Toggle preview
4. Click "Increment" button
5. Watch counter increase

### Expected Result:
```
Initial: 0
Click Increment → 1
Click Increment → 2
Click Decrement → 1
```

**NOT static!** Counter should change instantly.

---

## Test 5: Conditional Rendering ✅

**Goal**: Verify `<if>` conditions show/hide content

### File: `test-conditions.parsec`
```xml
<app>
  <meta title="Conditional Test" />
  <view>
    <stack vertical padding="20" gap="16">
      <text>Count: {state.count}</text>
      
      <!-- Should only show if count > 5 -->
      <if condition="{state.count > 5}">
        <text color="red">🔥 Count is high!</text>
      </if>
      
      <!-- Should only show if count == 0 -->
      <if condition="{state.count == 0}">
        <text color="green">✓ Reset to zero</text>
      </if>
      
      <button onClick="increment">+</button>
      <button onClick="reset">Reset</button>
    </stack>
  </view>
</app>
```

### Backend Actions Needed:
```javascript
// POST /actions/increment → state.count++
// POST /actions/reset → state.count = 0
```

### Steps:
1. Count starts at 0
2. "✓ Reset to zero" message visible ✓
3. Click increment 6 times
4. "✓ Reset to zero" disappears
5. "🔥 Count is high!" appears
6. Click reset
7. Back to "✓ Reset to zero"

### Expected Result:
```
✅ Content shows/hides based on condition
✅ No errors in preview
✅ State sync is instant
```

---

## Test 6: Loop Rendering ✅

**Goal**: Verify `<for>` loops render multiple items

### File: `test-loops.parsec`
```xml
<app>
  <meta title="Loop Test" />
  <view>
    <stack vertical padding="20" gap="16">
      <text fontSize="20" fontWeight="bold">
        Todo Items ({state.todos.length})
      </text>
      
      <!-- Loop through todos array -->
      <for item in "{state.todos}">
        <card padding="12">
          <stack horizontal gap="12" align="center">
            <text flex="1">{item.title}</text>
            <text color="gray">{item.category}</text>
          </stack>
        </card>
      </for>
    </stack>
  </view>
</app>
```

### Backend State:
```json
{
  "todos": [
    { "id": 1, "title": "Buy milk", "category": "Shopping" },
    { "id": 2, "title": "Write report", "category": "Work" },
    { "id": 3, "title": "Exercise", "category": "Health" }
  ]
}
```

### Steps:
1. Open preview
2. Should show 3 cards
3. Each shows title and category

### Expected Result:
```
Todo Items (3)
[Buy milk] [Shopping]
[Write report] [Work]
[Exercise] [Health]
```

---

## Test 7: AI Language Access ✅

**Goal**: Verify AI can access PARSEC syntax

### Steps:

**Method A: VS Code Copilot Chat**
1. Press `Ctrl+Shift+I` (Copilot Chat)
2. Ask: `@workspace what are all PARSEC components?`
3. Copilot should list: stack, grid, text, button, input, etc.

### Expected Result:
```
Copilot shows PARSEC components:
- stack (vertical, horizontal layout)
- grid (grid layout)
- text (text display)
- button (clickable button)
- input (text input)
- ... and more
```

**Method B: Show Language Reference**
1. Ctrl+Shift+P
2. Type: "PARSEC: Show Language Reference"
3. File `PARSEC_LANGUAGE_REFERENCE.md` should open

### Expected Result:
```
✅ Reference document opens
✅ Shows all components, attributes, examples
✅ Shows complete working example apps
```

**Method C: Ask for Code Generation**
1. Ctrl+Shift+I (Copilot Chat)
2. Ask: `Generate a PARSEC form with email and password fields`
3. Copilot should generate:
```xml
<form onSubmit="login">
  <input type="email" placeholder="Email" />
  <input type="password" placeholder="Password" />
  <button type="submit">Login</button>
</form>
```

### Expected Result:
```
✅ Generated code is PARSEC-valid
✅ No XML/HTML pollution
✅ Proper component usage
```

---

## Test 8: Error Handling ✅

**Goal**: Verify helpful error messages

### Test A: Backend Down
1. Stop backend (Ctrl+C on `node server.js`)
2. Open `.parsec` file
3. Toggle preview

### Expected Result:
```
Backend Connection Error
Connect ECONNREFUSED http://localhost:8000
Make sure your backend is running at: http://localhost:8000
```

NOT just blank or "Loading..." forever.

### Test B: Invalid PARSEC Code
Create: `test-invalid.parsec`
```xml
<app>
  <view>
    <button>Missing closing tag
  </view>
</app>
```

### Expected Result:
```
Should either:
✅ Show partial rendering
✅ Show clear error message
❌ NOT crash or hang
```

---

## Full Test Checklist

```
SYNTAX & HIGHLIGHTING
□ Keywords colored correctly
□ Attributes highlighted
□ Bindings recognized
□ Comments styled

RENDERING
□ Preview opens on Ctrl+Shift+P
□ Components appear
□ Layout looks correct
□ No console errors

STATE & BINDING
□ {state.fieldName} shows actual values
□ State updates from backend
□ Complex paths work: {state.user.profile.name}

ACTIONS
□ Buttons are clickable
□ Actions trigger on click
□ Backend receives POST /actions/{name}
□ UI updates after action

CONDITIONALS
□ <if> content shows when true
□ <if> content hides when false
□ Conditions update reactively

LOOPS
□ <for> renders all items
□ Item references work: {item.field}
□ Loops update when data changes

ERROR HANDLING
□ Backend down → clear error
□ Invalid syntax → helpful message
□ Connection lost → recoverable

AI INTEGRATION
□ Can run: "PARSEC: Show Language Reference"
□ Copilot Chat sees PARSEC components
□ AI generates valid PARSEC code
```

---

## Quick Test Script

Run all tests in one go:

```powershell
# Terminal 1: Start backend
cd "d:\VS Code\.parsec"
node server.js
# Keep running...

# Terminal 2: Run tests
cd "d:\VS Code\.parsec"
code .

# Then in VS Code:
# 1. Create test-syntax.parsec (colored?)
# 2. Ctrl+Shift+P → "PARSEC: Toggle Preview" (renders?)
# 3. Create test-actions.parsec, click buttons (work?)
# 4. Ctrl+Shift+I ask: "@workspace show PARSEC components" (AI works?)
```

---

## Success Criteria

All tests pass when:

✅ Syntax highlighting works (keywords colored)
✅ Preview renders components (not blank)
✅ State bindings show values (not `{state.count}`)
✅ Buttons trigger actions (state updates)
✅ Conditionals work (content shows/hides)
✅ Loops render items (all data visible)
✅ Errors are clear (not silent failures)
✅ AI has language access (can generate code)

**If all ✅, the extension is production-ready!**

