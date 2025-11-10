const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Get all tools
app.get('/api/tools', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM tools ORDER BY created_at DESC');
    res.json(rows);
  } catch (err) {
    console.error(err);
    if (err.code === 'ECONNREFUSED') {
      res.json([]);
    } else {
      res.status(500).json({ error: err.message });
    }
  }
});

// Add a new tool
app.post('/api/tools', async (req, res) => {
  try {
    const { name, description, status } = req.body;
    const [result] = await db.query('INSERT INTO tools (name, description, status) VALUES (?, ?, ?)', [name, description, status]);
    res.status(201).json({ id: result.insertId, name, description, status });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Update a tool
app.put('/api/tools/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, status } = req.body;
    await db.query('UPDATE tools SET name = ?, description = ?, status = ? WHERE id = ?', [name, description, status, id]);
    res.json({ id, name, description, status });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Delete a tool
app.delete('/api/tools/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await db.query('DELETE FROM tools WHERE id = ?', [id]);
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
