// Todo list backend in Node.js/Express

import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 8000;

// Enable CORS
app.use(cors());
app.use(express.json());

// App state
let state = {
  todos: [
    { id: 1, title: 'Learn PARSEC', completed: false },
    { id: 2, title: 'Build an app', completed: false }
  ],
  newTodoText: ''
};

let nextId = 3;

// Routes

// GET /state
app.get('/state', (req, res) => {
  res.json(state);
});

// POST /actions/addTodo
app.post('/actions/addTodo', (req, res) => {
  if (state.newTodoText.trim()) {
    state.todos.push({
      id: nextId++,
      title: state.newTodoText,
      completed: false
    });
    state.newTodoText = '';
  }
  res.json({ state });
});

// POST /actions/setNewTodoText
app.post('/actions/setNewTodoText', (req, res) => {
  state.newTodoText = req.body.data?.toString() || '';
  res.json({ state });
});

// POST /actions/toggleTodo
app.post('/actions/toggleTodo', (req, res) => {
  const id = req.body.data;
  const todo = state.todos.find(t => t.id === id);
  if (todo) {
    todo.completed = !todo.completed;
  }
  res.json({ state });
});

// POST /actions/deleteTodo
app.post('/actions/deleteTodo', (req, res) => {
  const id = req.body.data;
  state.todos = state.todos.filter(t => t.id !== id);
  res.json({ state });
});

// Start server
app.listen(PORT, () => {
  console.log(`✓ PARSEC todo backend running on http://localhost:${PORT}`);
  console.log(`  Todos: ${state.todos.length}`);
});
