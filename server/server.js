import express from 'express';
import fs from 'fs';
import path from 'path';

const app = express();
const PORT = 3000;
const FILE = path.resolve('./tasks.json');

// Middleware
app.use(express.json());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// Citire toate taskurile
app.get('/tasks', (req, res) => {
  if (!fs.existsSync(FILE)) return res.json([]);
  const data = fs.readFileSync(FILE, 'utf-8');
  res.json(JSON.parse(data));
});

// Adăugare task nou
app.post('/tasks', (req, res) => {
  const tasks = fs.existsSync(FILE) ? JSON.parse(fs.readFileSync(FILE, 'utf-8')) : [];
  tasks.push(req.body);
  fs.writeFileSync(FILE, JSON.stringify(tasks, null, 2));
  res.json({ message: 'Task added!' });
});

// Actualizare task
app.put('/tasks/:id', (req, res) => {
  if (!fs.existsSync(FILE)) return res.status(404).json({ message: 'No tasks found' });
  const tasks = JSON.parse(fs.readFileSync(FILE, 'utf-8'));
  const index = tasks.findIndex(t => t.id === Number(req.params.id));
  if (index === -1) return res.status(404).json({ message: 'Task not found' });
  tasks[index] = req.body;
  fs.writeFileSync(FILE, JSON.stringify(tasks, null, 2));
  res.json({ message: 'Task updated!' });
});

// Ștergere task
app.delete('/tasks/:id', (req, res) => {
  if (!fs.existsSync(FILE)) return res.status(404).json({ message: 'No tasks found' });
  let tasks = JSON.parse(fs.readFileSync(FILE, 'utf-8'));
  tasks = tasks.filter(t => t.id !== Number(req.params.id));
  fs.writeFileSync(FILE, JSON.stringify(tasks, null, 2));
  res.json({ message: 'Task deleted!' });
});

// Pornire server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
