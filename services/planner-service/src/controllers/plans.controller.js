const db = require("../db");

// GET /plans?date=YYYY-MM-DD
async function listPlans(req, res) {
  const userId = req.user.id;
  const { date } = req.query;

  let sql = "SELECT * FROM plans WHERE owner_id = ?";
  const params = [userId];

  if (date) {
    sql += " AND date = ?";
    params.push(date);
  }

  sql += " ORDER BY date ASC, created_at DESC";

  try {
    const [rows] = await db.query(sql, params);
    res.json(rows);
  } catch (err) {
    console.error("listPlans error:", err);
    res.status(500).json({ error: "Server error" });
  }
}

// POST /plans
async function createPlan(req, res) {
  const userId = req.user.id;
  const { title, date, class_name, notes } = req.body;

  if (!title || !date) {
    return res.status(400).json({ error: "title and date are required" });
  }

  try {
    const [result] = await db.query(
      `INSERT INTO plans (owner_id, title, date, class_name, notes)
       VALUES (?, ?, ?, ?, ?)`,
      [userId, title, date, class_name || null, notes || null]
    );

    const [rows] = await db.query("SELECT * FROM plans WHERE id = ?", [result.insertId]);
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error("createPlan error:", err);
    res.status(500).json({ error: "Server error" });
  }
}

// GET /plans/:id (includes items)
async function getPlan(req, res) {
  const userId = req.user.id;
  const { id } = req.params;

  try {
    const [plans] = await db.query(
      "SELECT * FROM plans WHERE id = ? AND owner_id = ?",
      [id, userId]
    );
    if (plans.length === 0) {
      return res.status(404).json({ error: "Plan not found" });
    }

    const plan = plans[0];

    const [items] = await db.query(
      "SELECT * FROM plan_items WHERE plan_id = ? ORDER BY start_time ASC, id ASC",
      [id]
    );

    res.json({ ...plan, items });
  } catch (err) {
    console.error("getPlan error:", err);
    res.status(500).json({ error: "Server error" });
  }
}

// DELETE /plans/:id
async function deletePlan(req, res) {
  const userId = req.user.id;
  const { id } = req.params;

  try {
    const [plans] = await db.query(
      "SELECT owner_id FROM plans WHERE id = ?",
      [id]
    );
    if (plans.length === 0) {
      return res.status(404).json({ error: "Plan not found" });
    }
    if (plans[0].owner_id !== userId) {
      return res.status(403).json({ error: "Not allowed to delete this plan" });
    }

    await db.query("DELETE FROM plan_items WHERE plan_id = ?", [id]);
    await db.query("DELETE FROM plans WHERE id = ?", [id]);

    res.status(204).send();
  } catch (err) {
    console.error("deletePlan error:", err);
    res.status(500).json({ error: "Server error" });
  }
}

// POST /plans/:id/items
async function addPlanItem(req, res) {
  const userId = req.user.id;
  const { id: planId } = req.params;
  const {
    idea_id,
    custom_title,
    custom_description,
    start_time,
    end_time,
    location
  } = req.body;

  try {
    // check ownership
    const [plans] = await db.query(
      "SELECT owner_id FROM plans WHERE id = ?",
      [planId]
    );
    if (plans.length === 0) {
      return res.status(404).json({ error: "Plan not found" });
    }
    if (plans[0].owner_id !== userId) {
      return res.status(403).json({ error: "Not allowed to modify this plan" });
    }

    const [result] = await db.query(
      `INSERT INTO plan_items (
        plan_id, idea_id, custom_title, custom_description,
        start_time, end_time, location
      ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        planId,
        idea_id || null,
        custom_title || null,
        custom_description || null,
        start_time || null,
        end_time || null,
        location || null
      ]
    );

    const [rows] = await db.query(
      "SELECT * FROM plan_items WHERE id = ?",
      [result.insertId]
    );

    res.status(201).json(rows[0]);
  } catch (err) {
    console.error("addPlanItem error:", err);
    res.status(500).json({ error: "Server error" });
  }
}

// DELETE /plans/:planId/items/:itemId
async function deletePlanItem(req, res) {
  const userId = req.user.id;
  const { planId, itemId } = req.params;

  try {
    const [plans] = await db.query(
      "SELECT owner_id FROM plans WHERE id = ?",
      [planId]
    );
    if (plans.length === 0) {
      return res.status(404).json({ error: "Plan not found" });
    }
    if (plans[0].owner_id !== userId) {
      return res.status(403).json({ error: "Not allowed to modify this plan" });
    }

    await db.query(
      "DELETE FROM plan_items WHERE id = ? AND plan_id = ?",
      [itemId, planId]
    );

    res.status(204).send();
  } catch (err) {
    console.error("deletePlanItem error:", err);
    res.status(500).json({ error: "Server error" });
  }
}

module.exports = {
  listPlans,
  createPlan,
  getPlan,
  deletePlan,
  addPlanItem,
  deletePlanItem
};
