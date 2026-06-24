// Simple counter backend in Node.js/Express

import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 8000;

// Enable CORS
app.use(cors());
app.use(express.json());

// App state
let state = {
  count: 0
};

// Routes

// GET /state - Return current state
app.get('/state', (req, res) => {
  res.json(state);
});

// POST /actions/increment
app.post('/actions/increment', (req, res) => {
  state.count++;
  res.json({ state });
});

// POST /actions/decrement
app.post('/actions/decrement', (req, res) => {
  state.count--;
  res.json({ state });
});

// POST /actions/reset
app.post('/actions/reset', (req, res) => {
  state.count = 0;
  res.json({ state });
});

// Start server
app.listen(PORT, () => {
  console.log(`✓ PARSEC backend running on http://localhost:${PORT}`);
  console.log(`  State: ${JSON.stringify(state)}`);
});
