const db = require('../db');

// GET / (via gateway: /ideas)
async function listIdeas(req, res) {
  const { author_id, difficulty, season, yard_context, min_time, max_time, favorites_only } =
    req.query;

  let sql = `
    SELECT i.*
    FROM ideas i
  `;
  const params = [];

  // If user is logged in & want favourites_only
  let userId = null;
  if (req.user && favorites_only === 'true') {
    userId = req.user.id;
    sql += `
      INNER JOIN idea_favorites f
      ON f.idea_id = i.id AND f.user_id = ?
    `;
    params.push(userId);
  }

  sql += ' WHERE 1=1';

  if (author_id) {
    sql += ' AND i.author_id = ?';
    params.push(author_id);
  }
  if (difficulty) {
    sql += ' AND i.difficulty = ?';
    params.push(difficulty);
  }
  if (season) {
    sql += ' AND i.season = ?';
    params.push(season);
  }
  if (yard_context) {
    sql += ' AND i.yard_context = ?';
    params.push(yard_context);
  }
  if (min_time) {
    sql += ' AND i.time_minutes >= ?';
    params.push(Number(min_time));
  }
  if (max_time) {
    sql += ' AND i.time_minutes <= ?';
    params.push(Number(max_time));
  }

  sql += ' ORDER BY i.created_at DESC';

  try {
    const [rows] = await db.query(sql, params);
    res.json(rows);
  } catch (err) {
    console.error('listIdeas error:', err);
    res.status(500).json({ error: 'Server error' });
  }
}

// POST /  (via gateway: POST /ideas)
// Protected – needs JWT
async function createIdea(req, res) {
  const { title, description, time_minutes, difficulty, materials, subject, season, yard_context } =
    req.body;

  const author_id = req.user?.id;

  if (!author_id || !title) {
    return res.status(400).json({ error: 'title and auth user are required' });
  }

  try {
    const [result] = await db.query(
      `INSERT INTO ideas (
        author_id, title, description, time_minutes, difficulty,
        materials, subject, season, yard_context
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        author_id,
        title,
        description || null,
        time_minutes || null,
        difficulty || 'easy',
        materials || null,
        subject || null,
        season || 'any',
        yard_context || 'no_green',
      ],
    );

    const [rows] = await db.query('SELECT * FROM ideas WHERE id = ?', [result.insertId]);
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error('createIdea error:', err);
    res.status(500).json({ error: 'Server error' });
  }
}

// GET /:id
async function getIdea(req, res) {
  const { id } = req.params;

  try {
    const [rows] = await db.query('SELECT * FROM ideas WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Idea not found' });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error('getIdea error:', err);
    res.status(500).json({ error: 'Server error' });
  }
}

// DELETE /:id
// Only owner can delete
async function deleteIdea(req, res) {
  const { id } = req.params;
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const [rows] = await db.query('SELECT author_id FROM ideas WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Idea not found' });
    }
    if (rows[0].author_id !== userId) {
      return res.status(403).json({ error: 'Not allowed to delete this idea' });
    }

    await db.query('DELETE FROM ideas WHERE id = ?', [id]);
    res.status(204).send();
  } catch (err) {
    console.error('deleteIdea error:', err);
    res.status(500).json({ error: 'Server error' });
  }
}

// POST /favorites/:id   → mark as favourite
async function addFavorite(req, res) {
  const userId = req.user?.id;
  const { id: ideaId } = req.params;

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    await db.query('INSERT IGNORE INTO idea_favorites (user_id, idea_id) VALUES (?, ?)', [
      userId,
      ideaId,
    ]);
    res.status(204).send();
  } catch (err) {
    console.error('addFavorite error:', err);
    res.status(500).json({ error: 'Server error' });
  }
}

// DELETE /favorites/:id → remove favourite
async function removeFavorite(req, res) {
  const userId = req.user?.id;
  const { id: ideaId } = req.params;

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    await db.query('DELETE FROM idea_favorites WHERE user_id = ? AND idea_id = ?', [
      userId,
      ideaId,
    ]);
    res.status(204).send();
  } catch (err) {
    console.error('removeFavorite error:', err);
    res.status(500).json({ error: 'Server error' });
  }
}

module.exports = {
  listIdeas,
  createIdea,
  getIdea,
  deleteIdea,
  addFavorite,
  removeFavorite,
};
