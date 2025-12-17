const db = require('../db');

async function getMemberRole(groupId, userId) {
  const [rows] = await db.query(
    'SELECT role FROM chat_group_members WHERE group_id = ? AND user_id = ?',
    [groupId, userId],
  );
  if (rows.length === 0) return null;
  return rows[0].role;
}

// GET /groups – groups where current user is member
async function listGroups(req, res) {
  const userId = req.user.id;

  try {
    const [rows] = await db.query(
      `
      SELECT g.*
      FROM chat_groups g
      INNER JOIN chat_group_members m
        ON m.group_id = g.id
      WHERE m.user_id = ?
      ORDER BY g.created_at DESC
    `,
      [userId],
    );

    return res.json(rows);
  } catch (err) {
    console.error('[chat-service] listGroups error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
}

function generateJoinCode() {
  return Math.random().toString(36).slice(2, 10).toUpperCase();
}

// POST /groups – create group, creator is owner
async function createGroup(req, res) {
  const userId = req.user.id;
  const { name, description } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'name is required' });
  }
  const joinCode = generateJoinCode();
  try {
    const [result] = await db.query(
      'INSERT INTO chat_groups (name, description, owner_id, join_code) VALUES (?, ?, ?, ?)',
      [name, description || null, userId, joinCode],
    );

    const groupId = result.insertId;

    // Pass values as a single array
    await db.query('INSERT INTO chat_group_members (group_id, user_id, role) VALUES (?, ?, ?)', [
      groupId,
      userId,
      'owner',
    ]);

    const [rows] = await db.query('SELECT * FROM chat_groups WHERE id = ?', [groupId]);
    return res.status(201).json(rows[0]);
  } catch (err) {
    console.error('[chat-service] createGroup error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
}

// POST /groups/join { code: "ABCD1234" }
async function joinGroupByCode(req, res) {
  const userId = req.user.id;
  const { code } = req.body;

  if (!code) {
    return res.status(400).json({ error: 'code is required' });
  }

  try {
    // 1. Find group by join code
    const [groups] = await db.query('SELECT id FROM chat_groups WHERE join_code = ?', [code]);
    if (groups.length === 0) {
      return res.status(404).json({ error: 'Group not found for this code' });
    }

    const groupId = groups[0].id;

    // 2. Insert membership (or ignore if already joined)
    await db.query(
      'INSERT IGNORE INTO chat_group_members (group_id, user_id, role) VALUES (?, ?, ?)',
      [groupId, userId, 'member'],
    );

    // 3. Return the joined group
    const [rows] = await db.query('SELECT * FROM chat_groups WHERE id = ?', [groupId]);
    return res.status(200).json(rows[0]);
  } catch (err) {
    console.error('[chat-service] joinGroupByCode error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
}

// POST /groups/:groupId/members – add member (owner/moderator)
async function addMember(req, res) {
  const currentUserId = req.user.id;
  const { groupId } = req.params;
  const { user_id, role } = req.body;

  if (!user_id) {
    return res.status(400).json({ error: 'user_id is required' });
  }

  try {
    const currentRole = await getMemberRole(groupId, currentUserId);
    if (!currentRole || (currentRole !== 'owner' && currentRole !== 'moderator')) {
      return res.status(403).json({ error: 'Not allowed to add members' });
    }

    await db.query(
      'INSERT IGNORE INTO chat_group_members (group_id, user_id, role) VALUES (?, ?, ?)',
      [groupId, user_id, role || 'member'],
    );

    return res.status(204).send();
  } catch (err) {
    console.error('[chat-service] addMember error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
}

// DELETE /groups/:groupId/members/:userId – remove member (owner/moderator)
async function removeMember(req, res) {
  const currentUserId = req.user.id;
  const { groupId, userId } = req.params;

  try {
    const currentRole = await getMemberRole(groupId, currentUserId);
    if (!currentRole || (currentRole !== 'owner' && currentRole !== 'moderator')) {
      return res.status(403).json({ error: 'Not allowed to remove members' });
    }

    const [rows] = await db.query(
      'SELECT role FROM chat_group_members WHERE group_id = ? AND user_id = ?',
      [groupId, userId],
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Member not found' });
    }

    if (rows[0].role === 'owner') {
      return res.status(400).json({ error: 'Cannot remove group owner' });
    }

    await db.query('DELETE FROM chat_group_members WHERE group_id = ? AND user_id = ?', [
      groupId,
      userId,
    ]);

    return res.status(204).send();
  } catch (err) {
    console.error('[chat-service] removeMember error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
}

// GET /groups/:groupId/messages – list messages (member only)
async function listMessages(req, res) {
  const userId = req.user.id;
  const { groupId } = req.params;

  try {
    const role = await getMemberRole(groupId, userId);
    if (!role) {
      return res.status(403).json({ error: 'Not a member of this group' });
    }

    const [rows] = await db.query(
      `
      SELECT id, group_id, sender_id, text, image_url, created_at, is_deleted
      FROM chat_messages
      WHERE group_id = ?
      ORDER BY created_at ASC
    `,
      [groupId],
    );

    return res.json(rows);
  } catch (err) {
    console.error('[chat-service] listMessages error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
}

// POST /groups/:groupId/messages – send message
async function sendMessage(req, res) {
  const userId = req.user.id;
  const { groupId } = req.params;
  const { text, image_url } = req.body;

  if (!text && !image_url) {
    return res.status(400).json({ error: 'text or image_url is required' });
  }

  try {
    const role = await getMemberRole(groupId, userId);
    if (!role) {
      return res.status(403).json({ error: 'Not a member of this group' });
    }

    const [result] = await db.query(
      `
      INSERT INTO chat_messages (group_id, sender_id, text, image_url)
      VALUES (?, ?, ?, ?)
    `,
      [groupId, userId, text || null, image_url || null],
    );

    const [rows] = await db.query('SELECT * FROM chat_messages WHERE id = ?', [result.insertId]);

    return res.status(201).json(rows[0]);
  } catch (err) {
    console.error('[chat-service] sendMessage error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
}

// DELETE /groups/:groupId/messages/:messageId – moderation soft delete
async function deleteMessage(req, res) {
  const currentUserId = req.user.id;
  const { groupId, messageId } = req.params;

  try {
    const role = await getMemberRole(groupId, currentUserId);
    if (!role || (role !== 'owner' && role !== 'moderator')) {
      return res.status(403).json({ error: 'Not allowed to delete messages' });
    }

    const [rows] = await db.query('SELECT id FROM chat_messages WHERE id = ? AND group_id = ?', [
      messageId,
      groupId,
    ]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Message not found' });
    }

    await db.query(
      `
      UPDATE chat_messages
      SET is_deleted = 1, deleted_by = ?
      WHERE id = ? AND group_id = ?
    `,
      [currentUserId, messageId, groupId],
    );

    return res.status(204).send();
  } catch (err) {
    console.error('[chat-service] deleteMessage error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
}

module.exports = {
  listGroups,
  createGroup,
  addMember,
  removeMember,
  listMessages,
  sendMessage,
  deleteMessage,
  joinGroupByCode,
};
