const express = require('express');
if (!entries.length) return res.status(400).json({ error: 'No entries' });
if (entries.length > 2000) return res.status(400).json({ error: 'Too many entries' });
let count = 0;
const client = await pool.connect();
try {
await client.query('BEGIN');
for (const raw of entries) {
const name = (raw.name || raw.swimmer_name || '').toString().trim().slice(0,80);
const laps = Number(raw.laps);
const date = raw.date;
if (!isValidName(name) || !isValidLaps(laps) || !isValidDate(date)) continue;
await client.query('INSERT INTO entries (swimmer_name, laps, date) VALUES ($1,$2,$3)', [name, laps, date]);
count++;
}
await client.query('COMMIT');
} catch (e) { await client.query('ROLLBACK'); throw e; }
finally { client.release(); }
res.json({ inserted: count });
} catch (e) { res.status(500).json({ error: 'Server error' }); }
});


app.delete('/api/entries/:id', async (req, res) => {
try {
const admin = req.headers['x-admin-token'] || '';
if (!process.env.ADMIN_TOKEN || admin !== process.env.ADMIN_TOKEN) return res.status(403).json({ error: 'Forbidden' });
const id = parseInt(req.params.id, 10);
if (!Number.isFinite(id)) return res.status(400).json({ error: 'Invalid id' });
const { rowCount } = await pool.query('DELETE FROM entries WHERE id=$1', [id]);
res.json({ deleted: rowCount });
} catch (e) { res.status(500).json({ error: 'Server error' }); }
});


app.get('/api/swimmers', async (_req, res) => {
try {
const { rows } = await pool.query('SELECT swimmer_name, SUM(laps)::int AS total_laps FROM entries GROUP BY swimmer_name ORDER BY total_laps DESC');
res.json(rows);
} catch (e) { res.status(500).json({ error: 'Server error' }); }
});


app.get('/api/swimmer/:name', async (req, res) => {
try {
const name = req.params.name;
const { rows: entries } = await pool.query('SELECT id, swimmer_name, laps, date, created_at FROM entries WHERE swimmer_name = $1 ORDER BY date DESC, created_at DESC', [name]);
const total = entries.reduce((s,e)=>s+Number(e.laps),0);
res.json({ name, total_laps: total, entries });
} catch (e) { res.status(500).json({ error: 'Server error' }); }
});


app.get('/api/stats', async (_req, res) => {
try {
const [{ rows: c1 }, { rows: c2 }, { rows: c3 }] = await Promise.all([
pool.query('SELECT COALESCE(SUM(laps),0)::int AS total_laps FROM entries'),
pool.query('SELECT COUNT(DISTINCT swimmer_name)::int AS total_swimmers FROM entries'),
pool.query('SELECT COUNT(*)::int AS total_entries FROM entries'),
]);
res.json({ total_laps: c1[0].total_laps, total_swimmers: c2[0].total_swimmers, total_entries: c3[0].total_entries });
} catch (e) { res.status(500).json({ error: 'Server error' }); }
});


app.use((req, res) => res.status(404).json({ error: 'Not found' }));


app.listen(PORT, () => console.log(`API listening on :${PORT}`));
