# Backend Integration Guide

## Overview

PARSEC apps communicate with a backend server via HTTP. The backend owns all state and handles all business logic.

## Architecture

```
┌─────────────────────────────────────────────┐
│           PARSEC Frontend                   │
│   (Parse, Render, Handle Events)            │
└────────────────┬────────────────────────────┘
                 │
                 │ HTTP Requests
                 ↓
┌─────────────────────────────────────────────┐
│        Your Backend Server                  │
│   (State, Logic, Persistence)               │
└─────────────────────────────────────────────┘
```

## API Contract

### GET /state

Frontend fetches initial app state on load.

**Response:**
```json
{
  "count": 0,
  "user": {
    "id": 1,
    "name": "John"
  },
  "items": [
    { "id": 1, "title": "Item 1" },
    { "id": 2, "title": "Item 2" }
  ]
}
```

### POST /actions/{actionName}

Frontend sends user actions to backend.

**Request:**
```json
{
  "data": { ... }  // Optional action-specific data
}
```

**Response:**
```json
{
  "state": { ... }  // New app state after action
}
```

## Examples

### Node.js/Express

```javascript
import express from 'express';

let state = {
  todos: [
    { id: 1, title: 'Learn PARSEC', done: false },
    { id: 2, title: 'Build an app', done: false }
  ]
};

const app = express();
app.use(express.json());

// Initial state
app.get('/state', (req, res) => {
  res.json(state);
});

// Add todo
app.post('/actions/addTodo', (req, res) => {
  const { title } = req.body.data;
  const newTodo = {
    id: Math.max(...state.todos.map(t => t.id)) + 1,
    title,
    done: false
  };
  state.todos.push(newTodo);
  res.json({ state });
});

// Toggle todo
app.post('/actions/toggleTodo', (req, res) => {
  const { id } = req.body.data;
  const todo = state.todos.find(t => t.id === id);
  if (todo) {
    todo.done = !todo.done;
  }
  res.json({ state });
});

// Delete todo
app.post('/actions/deleteTodo', (req, res) => {
  const { id } = req.body.data;
  state.todos = state.todos.filter(t => t.id !== id);
  res.json({ state });
});

app.listen(8000);
```

### Python/FastAPI

```python
from fastapi import FastAPI
from fastapi.responses import JSONResponse

app = FastAPI()

state = {
    "todos": [
        {"id": 1, "title": "Learn PARSEC", "done": False},
        {"id": 2, "title": "Build an app", "done": False}
    ]
}

@app.get("/state")
async def get_state():
    return state

@app.post("/actions/addTodo")
async def add_todo(request: dict):
    title = request.get("data", {}).get("title")
    new_todo = {
        "id": max([t["id"] for t in state["todos"]]) + 1,
        "title": title,
        "done": False
    }
    state["todos"].append(new_todo)
    return {"state": state}

@app.post("/actions/toggleTodo")
async def toggle_todo(request: dict):
    todo_id = request.get("data", {}).get("id")
    todo = next((t for t in state["todos"] if t["id"] == todo_id), None)
    if todo:
        todo["done"] = not todo["done"]
    return {"state": state}

@app.post("/actions/deleteTodo")
async def delete_todo(request: dict):
    todo_id = request.get("data", {}).get("id")
    state["todos"] = [t for t in state["todos"] if t["id"] != todo_id]
    return {"state": state}
```

### Rust/Actix-web

```rust
use actix_web::{web, App, HttpServer, HttpResponse};
use serde_json::json;
use std::sync::Mutex;

#[derive(Clone)]
struct AppState {
    todos: Vec<Todo>,
}

#[derive(Clone)]
struct Todo {
    id: u32,
    title: String,
    done: bool,
}

#[actix_web::get("/state")]
async fn get_state(state: web::Data<Mutex<AppState>>) -> HttpResponse {
    let app_state = state.lock().unwrap();
    HttpResponse::Ok().json(app_state.todos.clone())
}

#[actix_web::post("/actions/addTodo")]
async fn add_todo(
    state: web::Data<Mutex<AppState>>,
    req: web::Json<serde_json::Value>,
) -> HttpResponse {
    let mut app_state = state.lock().unwrap();
    if let Some(title) = req.get("data").and_then(|d| d.get("title")) {
        let new_id = app_state.todos.iter().map(|t| t.id).max().unwrap_or(0) + 1;
        app_state.todos.push(Todo {
            id: new_id,
            title: title.as_str().unwrap_or("").to_string(),
            done: false,
        });
    }
    HttpResponse::Ok().json(json!({ "state": app_state.todos }))
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    let app_state = web::Data::new(Mutex::new(AppState {
        todos: vec![],
    }));

    HttpServer::new(move || {
        App::new()
            .app_data(app_state.clone())
            .service(get_state)
            .service(add_todo)
    })
    .bind("127.0.0.1:8000")?
    .run()
    .await
}
```

## Best Practices

### 1. Keep State Minimal

Only include state that affects rendering. Derived values should be computed on the frontend.

❌ **Bad:**
```json
{
  "todos": [...],
  "todoCount": 5,
  "completedCount": 2,
  "totalCount": 7
}
```

✅ **Good:**
```json
{
  "todos": [...]
}
```

Frontend can compute:
```parsec
<text>{state.todos.length} total</text>
<text>{state.todos.filter(t => t.done).length} done</text>
```

### 2. Immutable Updates

Always return a new state object, not mutations.

❌ **Bad:**
```javascript
state.user.name = "Jane";
res.json({ state });
```

✅ **Good:**
```javascript
res.json({
  state: {
    ...state,
    user: { ...state.user, name: "Jane" }
  }
});
```

### 3. Error Handling

For now, respond with updated state even on errors. In future versions, error payloads may be supported.

```javascript
// Current approach
app.post("/actions/deleteUser", (req, res) => {
  try {
    const user = findUser(req.body.data.id);
    if (!user) {
      return res.status(404).json({ state }); // Return current state
    }
    deleteUser(user.id);
    res.json({ state });
  } catch (error) {
    res.status(500).json({ state }); // Return current state
  }
});
```

### 4. CORS

If frontend and backend are on different origins, enable CORS:

```javascript
// Express
import cors from 'cors';
app.use(cors());
```

```python
# FastAPI
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### 5. Authentication

Add auth headers/tokens as needed:

**Backend:**
```javascript
app.use((req, res, next) => {
  const token = req.headers.authorization;
  // Validate token...
  next();
});
```

**PARSEC frontend** can send custom headers in future versions.

## State Schema

There's no enforced schema, but here's a recommended structure:

```json
{
  "user": {
    "id": 1,
    "name": "John",
    "email": "john@example.com"
  },
  "todos": [
    { "id": 1, "title": "Task 1", "done": false }
  ],
  "loading": false,
  "error": null,
  "metadata": {
    "version": "1.0"
  }
}
```

## Performance Tips

- Keep state JSON < 1MB for smooth previews
- Batch updates when possible
- Use pagination for large lists
- Cache state on frontend when appropriate

## Testing

Test your backend with CURL:

```bash
# Get initial state
curl http://localhost:8000/state

# Call an action
curl -X POST http://localhost:8000/actions/increment \
  -H "Content-Type: application/json" \
  -d '{"data": {}}'
```

## Next Steps

- Deploy your backend to production
- Set PARSEC backend URL to your production server
- Monitor API usage and performance
