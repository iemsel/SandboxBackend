const db = require('./db');

async function seed() {
  try {
    console.log("🌱 Seeding planner_db...");

    // Disable foreign key checks to allow truncation
    await db.query("SET FOREIGN_KEY_CHECKS=0");
    await db.query("TRUNCATE TABLE plan_items");
    await db.query("TRUNCATE TABLE plans");
    await db.query("SET FOREIGN_KEY_CHECKS=1");

    // Sample plans
    const plans = [
      { owner_id: 1, title: 'Nature Learning Day', date: '2025-03-15', class_name: 'Class A', notes: 'Outdoor activities focusing on nature' },
      { owner_id: 2, title: 'Math Workshop', date: '2025-03-20', class_name: 'Group B', notes: 'Fun indoor math challenges' }
    ];

    // Insert plans
    const planIds = [];
    for (const p of plans) {
      const [result] = await db.query(
        `INSERT INTO plans (owner_id, title, date, class_name, notes, created_at)
         VALUES (?, ?, ?, ?, ?, NOW())`,
        [p.owner_id, p.title, p.date, p.class_name, p.notes]
      );
      planIds.push(result.insertId);
    }

    // Sample plan items
    const items = [
      { plan_id: planIds[0], idea_id: 1, custom_title: null, custom_description: null, start_time: '10:00:00', end_time: '10:30:00', location: 'School Yard' },
      { plan_id: planIds[0], idea_id: null, custom_title: 'Healthy Snack Break', custom_description: 'Fruits and water', start_time: '10:30:00', end_time: '10:45:00', location: 'Cafeteria' },
      { plan_id: planIds[1], idea_id: 2, custom_title: null, custom_description: null, start_time: '13:00:00', end_time: '14:00:00', location: 'Room 105' },
      { plan_id: planIds[1], idea_id: 3, custom_title: 'Story Time', custom_description: 'Storytelling session with kids', start_time: '14:00:00', end_time: '14:30:00', location: 'Library' }
    ];

    for (const i of items) {
      await db.query(
        `INSERT INTO plan_items (plan_id, idea_id, custom_title, custom_description, start_time, end_time, location, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, NOW())`,
        [
          i.plan_id,
          i.idea_id,
          i.custom_title,
          i.custom_description,
          i.start_time,
          i.end_time,
          i.location
        ]
      );
    }

    console.log("✅ planner_db seeded successfully!");
  } catch (err) {
    console.error("❌ Error seeding planner_db:", err);
  } finally {
    await db.end();
  }
}

seed();
