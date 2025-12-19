const db = require('../db');

// Helper: safely turn instructions into JSON string (or null)
function serializeInstructions(instructions) {
  if (!instructions) return null;

  // If it's already an array → stringify
  if (Array.isArray(instructions)) {
    return JSON.stringify(instructions);
  }

  // If it's a string, it just stores it as a 1-item array,
  if (typeof instructions === 'string') {
    const trimmed = instructions.trim();
    if (!trimmed) return null;
    return JSON.stringify([trimmed]);
  }

  return null;
}

// Helper: parse JSON back to array for responses
function parseInstructions(raw) {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

// GET / (via gateway: /ideas)
async function listIdeas(req, res) {
  const {
    author_id,
    difficulty,
    season,
    yard_context,
    min_time,
    max_time,
    favorites_only,
    weather,
    min_age,
    max_age,
  } = req.query;

  let sql = `
    SELECT
      i.*,
      (
        SELECT AVG(c.rating)
        FROM idea_comments c
        WHERE c.idea_id = i.id AND c.rating IS NOT NULL
      ) AS avg_rating,
      (
        SELECT COUNT(*)
        FROM idea_comments c
        WHERE c.idea_id = i.id AND c.rating IS NOT NULL
      ) AS rating_count
    FROM ideas i
  `;

  const params = [];

  // If user is logged in & wants favourites_only
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
  if (weather) {
    sql += ' AND i.weather = ?';
    params.push(weather);
  }
  if (min_age) {
    // Idea is suitable if its max_age is >= requested min_age
    sql += ' AND (i.max_age IS NULL OR i.max_age >= ?)';
    params.push(Number(min_age));
  }
  if (max_age) {
    // Idea is suitable if its min_age is <= requested max_age
    sql += ' AND (i.min_age IS NULL OR i.min_age <= ?)';
    params.push(Number(max_age));
  }

  sql += ' ORDER BY i.created_at DESC';

  try {
    const [rows] = await db.query(sql, params);

    // Convert instructions_json → instructions array
    const result = rows.map((idea) => ({
      ...idea,
      instructions: parseInstructions(idea.instructions_json),
    }));

    res.json(result);
  } catch (err) {
    console.error('listIdeas error:', err);
    res.status(500).json({ error: 'Server error' });
  }
}

// POST /  (via gateway: POST /ideas)
// Protected – needs JWT
async function createIdea(req, res) {
  const {
    title,
    description,
    time_minutes,
    time_label,
    difficulty,
    materials,
    subject,
    season,
    yard_context,
    instructions,
    weather,
    min_age,
    max_age,
    image_url,
    tags,
    categories,
  } = req.body;

  const author_id = req.user?.id;

  if (!author_id || !title) {
    return res.status(400).json({ error: 'title and auth user are required' });
  }

  const instructionsJson = serializeInstructions(instructions);

  // Normalize tags / categories to arrays of strings
  const tagsArray = Array.isArray(tags)
    ? tags
    : typeof tags === 'string'
      ? tags
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean)
      : [];

  const categoriesArray = Array.isArray(categories)
    ? categories
    : typeof categories === 'string'
      ? categories
          .split(',')
          .map((c) => c.trim())
          .filter(Boolean)
      : [];

  try {
    // Insert main idea
    const [result] = await db.query(
      `INSERT INTO ideas (
        author_id,
        title,
        description,
        time_minutes,
        time_label,
        difficulty,
        materials,
        subject,
        season,
        yard_context,
        instructions_json,
        weather,
        min_age,
        max_age,
        image_url
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        author_id,
        title,
        description || null,
        time_minutes || null,
        time_label || null,
        difficulty || 'easy',
        materials || null,
        subject || null,
        season || 'any',
        yard_context || 'no_green',
        instructionsJson,
        weather || 'any',
        min_age !== undefined && min_age !== null ? Number(min_age) : null,
        max_age !== undefined && max_age !== null ? Number(max_age) : null,
        image_url || null,
      ],
    );

    const ideaId = result.insertId;

    // Insert tags
    for (const tag of tagsArray) {
      await db.query('INSERT INTO idea_tags (idea_id, tag) VALUES (?, ?)', [ideaId, tag]);
    }

    // Insert categories
    for (const category of categoriesArray) {
      await db.query('INSERT INTO idea_categories (idea_id, category) VALUES (?, ?)', [
        ideaId,
        category,
      ]);
    }

    const [rows] = await db.query('SELECT * FROM ideas WHERE id = ?', [ideaId]);
    const idea = rows[0];

    res.status(201).json({
      ...idea,
      instructions: parseInstructions(idea.instructions_json),
      tags: tagsArray,
      categories: categoriesArray,
    });
  } catch (err) {
    console.error('createIdea error:', err);
    res.status(500).json({ error: 'Server error' });
  }
}

// GET /:id
async function getIdea(req, res) {
  const { id } = req.params;
  const userId = req.user?.id; // Optional - user might not be logged in

  try {
    const [ideas] = await db.query('SELECT * FROM ideas WHERE id = ?', [id]);
    if (ideas.length === 0) {
      return res.status(404).json({ error: 'Idea not found' });
    }

    const idea = ideas[0];

    const [tagRows] = await db.query('SELECT tag FROM idea_tags WHERE idea_id = ?', [id]);
    const [catRows] = await db.query('SELECT category FROM idea_categories WHERE idea_id = ?', [
      id,
    ]);

    const [commentRows] = await db.query(
      'SELECT id, idea_id, user_id, text, rating, created_at FROM idea_comments WHERE idea_id = ? ORDER BY created_at ASC',
      [id],
    );

    // Get like/dislike counts and user reactions for each comment
    const commentsWithReactions = await Promise.all(
      commentRows.map(async (comment) => {
        const [likeRows] = await db.query(
          'SELECT COUNT(*) AS count FROM comment_reactions WHERE comment_id = ? AND reaction_type = "like"',
          [comment.id],
        );
        const [dislikeRows] = await db.query(
          'SELECT COUNT(*) AS count FROM comment_reactions WHERE comment_id = ? AND reaction_type = "dislike"',
          [comment.id],
        );
        
        let userReaction = null;
        if (userId) {
          const [userReactionRows] = await db.query(
            'SELECT reaction_type FROM comment_reactions WHERE comment_id = ? AND user_id = ?',
            [comment.id, userId],
          );
          if (userReactionRows.length > 0) {
            userReaction = userReactionRows[0].reaction_type;
          }
        }
        
        return {
          ...comment,
          likes: likeRows[0]?.count || 0,
          dislikes: dislikeRows[0]?.count || 0,
          userReaction,
        };
      }),
    );

    const [ratingRows] = await db.query(
      'SELECT AVG(rating) AS avg_rating, COUNT(*) AS rating_count FROM idea_comments WHERE idea_id = ? AND rating IS NOT NULL',
      [id],
    );

    const avg_rating = ratingRows[0].avg_rating || null;
    const rating_count = ratingRows[0].rating_count || 0;

    res.json({
      ...idea,
      instructions: parseInstructions(idea.instructions_json),
      tags: tagRows.map((r) => r.tag),
      categories: catRows.map((r) => r.category),
      comments: commentsWithReactions,
      avg_rating,
      rating_count,
    });
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

    // Clean up related data
    await db.query('DELETE FROM idea_comments WHERE idea_id = ?', [id]);
    await db.query('DELETE FROM idea_tags WHERE idea_id = ?', [id]);
    await db.query('DELETE FROM idea_categories WHERE idea_id = ?', [id]);
    await db.query('DELETE FROM idea_favorites WHERE idea_id = ?', [id]);
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

// POST /:id/comments  – add comment + optional rating
async function addComment(req, res) {
  const userId = req.user?.id;
  const { id: ideaId } = req.params;
  const { text, rating } = req.body;

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  if (!text || !text.trim()) {
    return res.status(400).json({ error: 'text is required' });
  }

  let ratingValue = null;
  if (rating !== undefined && rating !== null && rating !== '') {
    const num = Number(rating);
    if (Number.isNaN(num) || num < 1 || num > 5) {
      return res.status(400).json({ error: 'rating must be between 1 and 5' });
    }
    ratingValue = num;
  }

  try {
    const [ideaRows] = await db.query('SELECT id FROM ideas WHERE id = ?', [ideaId]);
    if (ideaRows.length === 0) {
      return res.status(404).json({ error: 'Idea not found' });
    }

    const [result] = await db.query(
      'INSERT INTO idea_comments (idea_id, user_id, text, rating) VALUES (?, ?, ?, ?)',
      [ideaId, userId, text, ratingValue],
    );

    const [rows] = await db.query('SELECT * FROM idea_comments WHERE id = ?', [result.insertId]);
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error('addComment error:', err);
    res.status(500).json({ error: 'Server error' });
  }
}

// GET /:id/comments – list comments for an idea
async function listComments(req, res) {
  const { id: ideaId } = req.params;

  try {
    const [rows] = await db.query(
      'SELECT id, idea_id, user_id, text, rating, created_at FROM idea_comments WHERE idea_id = ? ORDER BY created_at ASC',
      [ideaId],
    );

    // Get like/dislike counts for each comment
    const commentsWithReactions = await Promise.all(
      rows.map(async (comment) => {
        const [likeRows] = await db.query(
          'SELECT COUNT(*) AS count FROM comment_reactions WHERE comment_id = ? AND reaction_type = "like"',
          [comment.id],
        );
        const [dislikeRows] = await db.query(
          'SELECT COUNT(*) AS count FROM comment_reactions WHERE comment_id = ? AND reaction_type = "dislike"',
          [comment.id],
        );
        return {
          ...comment,
          likes: likeRows[0]?.count || 0,
          dislikes: dislikeRows[0]?.count || 0,
        };
      }),
    );

    res.json(commentsWithReactions);
  } catch (err) {
    console.error('listComments error:', err);
    res.status(500).json({ error: 'Server error' });
  }
}

// POST /comments/:commentId/like – toggle like on a comment
async function toggleCommentLike(req, res) {
  const userId = req.user?.id;
  const { commentId } = req.params;

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    // Check if comment exists
    const [commentRows] = await db.query('SELECT id FROM idea_comments WHERE id = ?', [commentId]);
    if (commentRows.length === 0) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    // Check if user already has a reaction
    const [existingRows] = await db.query(
      'SELECT reaction_type FROM comment_reactions WHERE comment_id = ? AND user_id = ?',
      [commentId, userId],
    );

    if (existingRows.length > 0) {
      const existingReaction = existingRows[0].reaction_type;
      if (existingReaction === 'like') {
        // Remove like
        await db.query('DELETE FROM comment_reactions WHERE comment_id = ? AND user_id = ?', [
          commentId,
          userId,
        ]);
      } else {
        // Change dislike to like
        await db.query(
          'UPDATE comment_reactions SET reaction_type = "like" WHERE comment_id = ? AND user_id = ?',
          [commentId, userId],
        );
      }
    } else {
      // Add like
      await db.query(
        'INSERT INTO comment_reactions (comment_id, user_id, reaction_type) VALUES (?, ?, "like")',
        [commentId, userId],
      );
    }

    // Get updated counts
    const [likeRows] = await db.query(
      'SELECT COUNT(*) AS count FROM comment_reactions WHERE comment_id = ? AND reaction_type = "like"',
      [commentId],
    );
    const [dislikeRows] = await db.query(
      'SELECT COUNT(*) AS count FROM comment_reactions WHERE comment_id = ? AND reaction_type = "dislike"',
      [commentId],
    );
    const [userReactionRows] = await db.query(
      'SELECT reaction_type FROM comment_reactions WHERE comment_id = ? AND user_id = ?',
      [commentId, userId],
    );

    res.json({
      likes: likeRows[0]?.count || 0,
      dislikes: dislikeRows[0]?.count || 0,
      userReaction: userReactionRows.length > 0 ? userReactionRows[0].reaction_type : null,
    });
  } catch (err) {
    console.error('toggleCommentLike error:', err);
    res.status(500).json({ error: 'Server error' });
  }
}

// POST /comments/:commentId/dislike – toggle dislike on a comment
async function toggleCommentDislike(req, res) {
  const userId = req.user?.id;
  const { commentId } = req.params;

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    // Check if comment exists
    const [commentRows] = await db.query('SELECT id FROM idea_comments WHERE id = ?', [commentId]);
    if (commentRows.length === 0) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    // Check if user already has a reaction
    const [existingRows] = await db.query(
      'SELECT reaction_type FROM comment_reactions WHERE comment_id = ? AND user_id = ?',
      [commentId, userId],
    );

    if (existingRows.length > 0) {
      const existingReaction = existingRows[0].reaction_type;
      if (existingReaction === 'dislike') {
        // Remove dislike
        await db.query('DELETE FROM comment_reactions WHERE comment_id = ? AND user_id = ?', [
          commentId,
          userId,
        ]);
      } else {
        // Change like to dislike
        await db.query(
          'UPDATE comment_reactions SET reaction_type = "dislike" WHERE comment_id = ? AND user_id = ?',
          [commentId, userId],
        );
      }
    } else {
      // Add dislike
      await db.query(
        'INSERT INTO comment_reactions (comment_id, user_id, reaction_type) VALUES (?, ?, "dislike")',
        [commentId, userId],
      );
    }

    // Get updated counts
    const [likeRows] = await db.query(
      'SELECT COUNT(*) AS count FROM comment_reactions WHERE comment_id = ? AND reaction_type = "like"',
      [commentId],
    );
    const [dislikeRows] = await db.query(
      'SELECT COUNT(*) AS count FROM comment_reactions WHERE comment_id = ? AND reaction_type = "dislike"',
      [commentId],
    );
    const [userReactionRows] = await db.query(
      'SELECT reaction_type FROM comment_reactions WHERE comment_id = ? AND user_id = ?',
      [commentId, userId],
    );

    res.json({
      likes: likeRows[0]?.count || 0,
      dislikes: dislikeRows[0]?.count || 0,
      userReaction: userReactionRows.length > 0 ? userReactionRows[0].reaction_type : null,
    });
  } catch (err) {
    console.error('toggleCommentDislike error:', err);
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
  addComment,
  listComments,
  toggleCommentLike,
  toggleCommentDislike,
};
