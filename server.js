const path = require('path');
const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// POST a reading: { field1: number, field2: number }
app.post('/api/data', async (req, res) => {
  try {
    const { field1, field2 } = req.body;
    if (typeof field1 !== 'number' || typeof field2 !== 'number') {
      return res.status(400).json({ error: 'field1 and field2 must be numbers' });
    }
    const result = await db.insertReading(field1, field2);
    res.json({ success: true, id: result.lastID });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'internal error' });
  }
});

// GET readings: ?limit=100 (most recent N, returned ascending by timestamp)
app.get('/api/data', async (req, res) => {
  try {
    const limit = Math.min(10000, Math.max(1, parseInt(req.query.limit || '500')));
    const rows = await db.getRecentReadings(limit);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'internal error' });
  }
});

app.get('/api/health', (req, res) => res.json({ ok: true }));

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
