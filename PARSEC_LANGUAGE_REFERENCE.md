# PARSEC Language Complete Reference

This file contains the complete PARSEC language specification for AI code generation and analysis.

## Language Overview

PARSEC is a markup language for building apps (not websites) with any backend. Single source of truth: **UI is a function of state.**

### Philosophy
- No JavaScript. Fully declarative.
- State lives on backend. Frontend is purely UI layer.
- User interaction → backend action → new state → UI re-renders
- Works with any backend language (Node.js, Python, Rust, Go, etc.)

---

## Core Syntax

### App Structure
```xml
<app>
  <meta title="My App" description="App description" />
  
  <view path="/screen-1">
    <!-- UI components -->
  </view>
  
  <view path="/screen-2">
    <!-- UI components -->
  </view>
</app>
```

### Layout Components

#### Stack (Linear Container)
```xml
<stack vertical|horizontal gap="16" padding="20" align="start|center|end|stretch" justify="start|center|end|space-between|space-around" width="100%" height="auto" flex="1">
  <!-- children -->
</stack>
```

Attributes:
- `vertical` / `horizontal` — Direction
- `gap="16"` — Space between children (px)
- `padding="20"` — Internal padding
- `margin="10"` — External margin
- `align` — Cross-axis alignment
- `justify` — Main-axis alignment
- `width` / `height` — Size (px or %)
- `flex="1"` — Flex grow

#### Grid (2D Layout)
```xml
<grid columns="2" rows="auto" gap="16" columnGap="20" rowGap="10" autoFit="false">
  <!-- items -->
</grid>
```

#### Box (Fixed/Absolute Positioning)
```xml
<box position="relative|absolute|fixed" top="0" left="0" right="0" bottom="0" width="200" height="200">
  <!-- content -->
</box>
```

#### Scroll (Scrollable Container)
```xml
<scroll horizontal="false" vertical="true" flex="1">
  <!-- content -->
</scroll>
```

---

## Content Components

### Text
```xml
<text fontSize="16" fontWeight="400|500|600|700|bold" color="#333|primary|secondary" textAlign="left|center|right|justify" textDecoration="none|underline|line-through" lineHeight="1.5" opacity="1">
  {state.text}
</text>
```

### Button
```xml
<button onClick="actionName" data="{param}" disabled="{state.isLoading}" padding="12 16" gap="8" fontSize="16" background="primary|secondary|danger" color="white" borderRadius="8" cursor="pointer">
  Click me
</button>
```

### Input Fields

#### Text Input
```xml
<input 
  type="text|email|password|number|date|time|url" 
  placeholder="Enter text" 
  value="{state.fieldValue}"
  onChange="updateField"
  disabled="{state.isDisabled}"
  required="true"
  padding="12"
  fontSize="16"
/>
```

#### Textarea
```xml
<textarea 
  placeholder="Enter text..." 
  value="{state.text}"
  onChange="setText"
  rows="4"
  cols="50"
/>
```

#### Checkbox
```xml
<checkbox 
  checked="{state.isActive}" 
  onChange="toggleActive"
  data="{item.id}"
  label="I agree"
/>
```

#### Radio Button
```xml
<radio 
  name="option" 
  value="1" 
  checked="{state.selected === '1'}"
  onChange="selectOption"
  label="Option 1"
/>
<radio 
  name="option" 
  value="2" 
  checked="{state.selected === '2'}"
  onChange="selectOption"
  label="Option 2"
/>
```

#### Select/Dropdown
```xml
<select 
  value="{state.selectedOption}"
  onChange="selectItem"
  placeholder="Choose..."
>
  <option value="1">Option 1</option>
  <option value="2">Option 2</option>
  <option value="3">Option 3</option>
</select>
```

### Media

#### Image
```xml
<image 
  src="http://example.com/image.jpg" 
  alt="Description"
  width="200" 
  height="200" 
  objectFit="cover|contain|fill"
/>
```

#### Icon (Built-in Icon Library)
```xml
<icon name="heart|star|settings|menu|close|search|check|x|arrow-left|arrow-right|plus|minus|user|bell|lock|home|email|phone" size="24" color="primary" />
```

---

## Container Components

### Card (Elevated Container)
```xml
<card padding="20" gap="12" borderRadius="8" shadow="0 4px 8px rgba(0,0,0,0.1)" background="white">
  <!-- content -->
</card>
```

### Modal (Dialog)
```xml
<modal open="{state.showModal}" onClose="closeModal" padding="24" width="500" maxWidth="90%">
  <text fontSize="20" fontWeight="bold">Modal Title</text>
  <text>Modal content here</text>
  <button onClick="closeModal">Close</button>
</modal>
```

### Bottom Sheet (Mobile)
```xml
<bottomSheet open="{state.showSheet}" onClose="closeSheet">
  <text>Bottom sheet content</text>
  <button onClick="confirm">Confirm</button>
</bottomSheet>
```

### Tabs
```xml
<tabs activeTab="{state.activeTab}" onChange="switchTab">
  <tab id="tab1" label="Tab 1">
    <!-- content for tab 1 -->
  </tab>
  <tab id="tab2" label="Tab 2">
    <!-- content for tab 2 -->
  </tab>
</tabs>
```

### List (Iteration Container)
```xml
<list items="{state.items}" keyBy="id">
  <item>
    <text>{item.title}</text>
    <text>{item.description}</text>
  </item>
</list>
```

---

## Navigation Components

### Navbar
```xml
<navbar position="top|bottom" background="primary" padding="16">
  <stack horizontal gap="16">
    <text color="white" fontWeight="bold">App Name</text>
  </stack>
</navbar>
```

### Link (Navigation)
```xml
<link to="/user/:id" params="{userId: state.userId}">
  View User
</link>
```

---

## Control Flow

### Conditional Rendering
```xml
<if condition="{state.count > 5}">
  <text>Count is high!</text>
</if>

<if condition="{state.isLoggedIn}">
  <text>Welcome {state.user.name}!</text>
  <else>
    <text>Please log in</text>
  </else>
</if>
```

### Loops
```xml
<for item in "{state.todos}">
  <stack horizontal gap="12" align="center">
    <checkbox checked="{item.completed}" onChange="toggleTodo" data="{item.id}" />
    <text>{item.title}</text>
    <button onClick="deleteTodo" data="{item.id}">×</button>
  </stack>
</for>
```

Loop with index:
```xml
<for item in "{state.items}" index="idx">
  <text>{idx + 1}. {item.name}</text>
</for>
```

---

## State & Data Binding

### Accessing State
```xml
{state.count}                           <!-- Direct access -->
{state.user.name}                       <!-- Nested access -->
{state.items[0]}                        <!-- Array index -->
{state.items.length}                    <!-- Array length -->
{state.items.filter(x => x.active)}     <!-- Array methods -->
```

### Advanced Expressions
```xml
{state.count + 1}                       <!-- Arithmetic -->
{state.isActive ? 'Active' : 'Inactive'} <!-- Ternary -->
{state.items.map(i => i.name).join(', ')} <!-- Chaining -->
{state.user?.name || 'Guest'}           <!-- Optional chaining -->
```

### Type Examples
```xml
String:   {state.name}
Number:   {state.count}
Boolean:  {state.isActive}
Array:    {state.items.length}
Object:   {state.user.name}
```

---

## Events & Actions

### Event Attributes
```xml
onClick="actionName"
onChange="actionName"
onSubmit="actionName"
onFocus="actionName"
onBlur="actionName"
onHover="actionName"
```

### Passing Data to Actions
```xml
<!-- No data -->
<button onClick="increment">+</button>

<!-- Single value -->
<button onClick="setCount" data="5">Set to 5</button>

<!-- Object -->
<button onClick="updateUser" data="{id: state.userId, name: 'John'}">Update</button>

<!-- From state -->
<button onClick="deleteItem" data="{item.id}">Delete</button>
```

### Backend Action Flow
1. User clicks button
2. Frontend sends: `POST /actions/actionName` with `{ data: {...} }`
3. Backend processes and returns: `{ state: {...updated state...} }`
4. Frontend updates state
5. UI re-renders automatically

---

## Forms & Validation

### Simple Form
```xml
<stack vertical gap="16">
  <input 
    type="email" 
    placeholder="Email" 
    value="{state.email}"
    onChange="setEmail"
    required="true"
  />
  
  <input 
    type="password" 
    placeholder="Password" 
    value="{state.password}"
    onChange="setPassword"
    required="true"
  />
  
  <button onClick="login">Login</button>
</stack>
```

### Form Submission
```xml
<form onSubmit="submitForm">
  <input type="text" value="{state.name}" onChange="setName" required="true" />
  <button type="submit">Submit</button>
</form>
```

---

## Styling & Themes

### Colors
```xml
<text color="primary|secondary|success|danger|warning|info|#FF5733|rgb(255, 87, 51)">
  Colored text
</text>
```

### Typography
```xml
<text fontSize="12|14|16|18|20|24|28|32" fontWeight="400|500|600|700|800|bold" fontFamily="sans-serif|serif|monospace">
  Text
</text>
```

### Spacing
```xml
padding="20"           <!-- All sides -->
padding="20 10"        <!-- Vertical Horizontal -->
padding="20 10 15 5"   <!-- Top Right Bottom Left -->

margin="20"
marginTop="20"
marginBottom="20"
```

### Borders & Shadows
```xml
<card 
  borderRadius="8" 
  border="1px solid #ccc"
  shadow="0 4px 8px rgba(0,0,0,0.1)"
>
  Content
</card>
```

### Opacity & Transforms
```xml
<text opacity="0.5" transform="scale(1.1) rotate(45deg)">
  Transformed text
</text>
```

### Theme Variables
```xml
<text color="primary">    <!-- Uses theme color -->
<button background="secondary">  <!-- Uses theme color -->
```

---

## Responsive Design

### Mobile Breakpoints
```xml
<!-- Attributes with suffixes -->
width="100%@mobile"     <!-- On mobile -->
width="50%@tablet"      <!-- On tablet -->
width="25%@desktop"     <!-- On desktop -->

gap="8@mobile"          <!-- Smaller gap on mobile -->
gap="16@desktop"        <!-- Larger gap on desktop -->

fontSize="14@mobile"    <!-- Smaller font on mobile -->
fontSize="18@desktop"   <!-- Larger font on desktop -->
```

### Conditional by Viewport
```xml
<if condition="{viewport.width < 768}">
  <!-- Mobile layout -->
  <stack vertical>
    <!-- vertical stack -->
  </stack>
</if>

<if condition="{viewport.width >= 768}">
  <!-- Desktop layout -->
  <stack horizontal>
    <!-- horizontal stack -->
  </stack>
</if>
```

---

## Routing & Multi-Screen Apps

### Define Routes
```xml
<app>
  <meta title="My App" />
  
  <view path="/">
    <!-- Home screen -->
  </view>
  
  <view path="/user/:id">
    <!-- User detail screen - id in route.params.id -->
  </view>
  
  <view path="/search?q=:query">
    <!-- Search screen - query in route.query.q -->
  </view>
</app>
```

### Access Route Params
```xml
<text>User ID: {route.params.id}</text>
<text>Search: {route.query.q}</text>
```

### Navigate Between Screens
```xml
<link to="/">Go to home</link>
<link to="/user/:id" params="{id: state.userId}">View user</link>
<button onClick="navigate" data="{path: '/search', query: {q: 'parsec'}}">Search</button>
```

---

## Custom Components & Reusability

### Define a Component
```xml
<component name="UserCard" props="user">
  <card padding="16" gap="12">
    <text fontWeight="bold">{props.user.name}</text>
    <text>{props.user.email}</text>
    <text color="secondary">{props.user.role}</text>
  </card>
</component>
```

### Use a Component
```xml
<UserCard user="{state.currentUser}" />

<!-- In a loop -->
<for item in "{state.users}">
  <UserCard user="{item}" />
</for>
```

### Components with Slots
```xml
<component name="Card" props="">
  <card padding="16">
    {props.children}
  </card>
</component>

<!-- Usage -->
<Card>
  <text>Content inside card</text>
</Card>
```

---

## Backend Integration

### Backend Contract

#### GET /state
Frontend fetches initial state on app load.

**Response:**
```json
{
  "count": 0,
  "user": {
    "id": 1,
    "name": "John",
    "email": "john@example.com"
  },
  "todos": [
    { "id": 1, "title": "Task 1", "completed": false },
    { "id": 2, "title": "Task 2", "completed": true }
  ],
  "isLoading": false,
  "error": null
}
```

#### POST /actions/{actionName}
Frontend sends action requests to backend.

**Request:**
```json
{
  "data": {
    "itemId": 5,
    "title": "New todo"
  }
}
```

**Response:**
```json
{
  "state": {
    "count": 1,
    "todos": [...],
    "isLoading": false
  }
}
```

---

## Complete Example: Todo App

### PARSEC Frontend
```xml
<app>
  <meta title="Todo App" />
  
  <view>
    <stack vertical padding="20" gap="16" width="100%" height="100vh">
      
      <!-- Header -->
      <stack horizontal justify="between" align="center">
        <text fontSize="28" fontWeight="bold">My Todos</text>
        <text color="secondary">{state.todos.filter(t => !t.completed).length} remaining</text>
      </stack>
      
      <!-- Input -->
      <stack horizontal gap="12" align="end">
        <input 
          placeholder="Add a new todo..." 
          value="{state.newTodoText}"
          onChange="setNewTodoText"
          flex="1"
          padding="12"
        />
        <button onClick="addTodo" padding="12 20" background="primary">
          +
        </button>
      </stack>
      
      <!-- Todo List -->
      <scroll flex="1">
        <stack vertical gap="12">
          <for item in "{state.todos}">
            <card padding="16" gap="12">
              <stack horizontal gap="12" flex="1" align="center">
                <checkbox 
                  checked="{item.completed}"
                  onChange="toggleTodo"
                  data="{item.id}"
                />
                <text 
                  flex="1"
                  textDecoration="{item.completed ? 'line-through' : 'none'}"
                  color="{item.completed ? 'secondary' : 'foreground'}"
                >
                  {item.title}
                </text>
                <button 
                  onClick="deleteTodo"
                  data="{item.id}"
                  padding="8 12"
                  background="danger"
                >
                  ×
                </button>
              </stack>
            </card>
          </for>
        </stack>
      </scroll>
      
      <!-- Stats -->
      <stack horizontal gap="32" justify="center" padding="16" background="secondary">
        <text>Total: {state.todos.length}</text>
        <text>Done: {state.todos.filter(t => t.completed).length}</text>
        <text>Remaining: {state.todos.filter(t => !t.completed).length}</text>
      </stack>
      
    </stack>
  </view>
</app>
```

### Node.js Backend
```javascript
const http = require('http');
const url = require('url');

let state = {
  todos: [
    { id: 1, title: 'Learn PARSEC', completed: false },
    { id: 2, title: 'Build an app', completed: false }
  ],
  newTodoText: ''
};

let nextId = 3;

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');

  const { pathname } = url.parse(req.url, true);

  // GET /state
  if (pathname === '/state' && req.method === 'GET') {
    res.writeHead(200);
    res.end(JSON.stringify(state));
    return;
  }

  // POST /actions/addTodo
  if (pathname === '/actions/addTodo' && req.method === 'POST') {
    if (state.newTodoText.trim()) {
      state.todos.push({
        id: nextId++,
        title: state.newTodoText,
        completed: false
      });
      state.newTodoText = '';
    }
    res.writeHead(200);
    res.end(JSON.stringify({ state }));
    return;
  }

  // POST /actions/toggleTodo
  if (pathname === '/actions/toggleTodo' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      const { data } = JSON.parse(body);
      const todo = state.todos.find(t => t.id === data);
      if (todo) todo.completed = !todo.completed;
      res.writeHead(200);
      res.end(JSON.stringify({ state }));
    });
    return;
  }

  // POST /actions/deleteTodo
  if (pathname === '/actions/deleteTodo' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      const { data } = JSON.parse(body);
      state.todos = state.todos.filter(t => t.id !== data);
      res.writeHead(200);
      res.end(JSON.stringify({ state }));
    });
    return;
  }

  // POST /actions/setNewTodoText
  if (pathname === '/actions/setNewTodoText' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      const { data } = JSON.parse(body);
      state.newTodoText = data;
      res.writeHead(200);
      res.end(JSON.stringify({ state }));
    });
    return;
  }

  res.writeHead(404);
  res.end(JSON.stringify({ error: 'Not found' }));
});

server.listen(8000, () => {
  console.log('Backend listening on http://localhost:8000');
});
```

---

## Best Practices

### 1. Keep State Minimal
Only include state that affects rendering.

### 2. Use Conditional Rendering
Show/hide UI based on state instead of rendering unused components.

### 3. Bind Events Correctly
```xml
<!-- ✅ Good -->
<button onClick="increment">+</button>

<!-- ❌ Bad - don't call the function -->
<!-- <button onClick="increment()">+</button> -->
```

### 4. Use Data Attributes for IDs
```xml
<!-- ✅ Good -->
<button onClick="delete" data="{item.id}">Delete</button>

<!-- Instead of -->
<button onClick="delete" data="123">Delete</button>
```

### 5. Use Components for Reusability
```xml
<!-- ✅ Good - define once, use many times -->
<component name="TodoItem" props="todo">
  <card>
    <text>{props.todo.title}</text>
  </card>
</component>

<!-- Instead of -->
<!-- Repeating card structure in loops -->
```

---

## Debugging Tips

### Console Logs in Backend
```javascript
console.log('Action received:', actionName, data);
console.log('State after update:', state);
```

### Check Frontend-Backend Communication
- Open DevTools (F12) → Network tab
- Trigger action → See POST request
- Check response body contains updated state

### Common Issues
- **"Cannot read property 'x' of undefined"** → Check state structure
- **"Action not found"** → Check endpoint name matches exactly
- **"CORS error"** → Add CORS headers in backend
- **"State not updating"** → Verify response includes `{ state: {...} }`

---

## Performance Optimization

### 1. Minimize State Size
```json
// ❌ Bad - includes computed values
{ "todos": [...], "completedCount": 5, "totalCount": 10 }

// ✅ Good - compute on frontend
{ "todos": [...] }
// {state.todos.filter(t => t.completed).length}
```

### 2. Use Pagination for Large Lists
```xml
<for item in "{state.items.slice(0, 20)}">
  <!-- Show first 20 items -->
</for>
<button onClick="loadMore">Load More</button>
```

### 3. Lazy Load Images
```xml
<image src="{item.thumbnail}" loading="lazy" />
```

---

## Security Notes

- **Validate all inputs** on backend before storing
- **Sanitize state** before rendering in PARSEC
- **Use HTTPS** in production
- **Validate user permissions** on backend (not frontend)
- **Never send secrets/tokens** in state (they'll be visible in frontend code)

---

## Quick Reference Summary

| Task | Syntax |
|------|--------|
| Display text | `<text>{state.value}</text>` |
| Show button | `<button onClick="action" data="{param}">Click</button>` |
| Input field | `<input value="{state.field}" onChange="setField" />` |
| Conditional | `<if condition="{state.flag}"><text>Show</text></if>` |
| Loop | `<for item in "{state.items}"><text>{item}</text></for>` |
| Layout | `<stack vertical gap="16"><child/></stack>` |
| Navigation | `<link to="/path">Go</link>` |
| Component | `<MyComponent prop="{value}" />` |
| State access | `{state.field}`, `{state.arr[0]}`, `{state.obj.field}` |
| Event | `onClick="actionName"` or `onChange="actionName"` |

---

**This is the complete PARSEC language specification. Use this for all code generation and analysis.**
