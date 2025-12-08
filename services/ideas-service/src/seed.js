const db = require('./db');

async function seed() {
  try {
    console.log("🌱 Seeding ideas_db...");

    // Truncate tables first (so you can run seed multiple times safely)
    await db.query("SET FOREIGN_KEY_CHECKS=0"); // disable FK temporarily
    await db.query("TRUNCATE TABLE idea_favorites");
    await db.query("TRUNCATE TABLE comments");
    await db.query("TRUNCATE TABLE ideas");
    await db.query("SET FOREIGN_KEY_CHECKS=1"); // re-enable FK

    // Insert Ideas
    const ideas = [
      [1, "Leaf Art", "Collect leaves and make nature patterns.", 20, "easy", "Leaves, glue, paper", "nature", "autumn", "some_green"],
      [2, "Math Treasure Hunt", "Solve riddles hidden around the playground.", 30, "medium", "Paper, markers", "math", "any", "green_blue"],
      [1, "Indoor Story Circle", "Kids tell stories using prompts.", 15, "easy", "None", "language", "winter", "indoor"]
    ];

    for (const idea of ideas) {
      await db.query(
        `INSERT INTO ideas (
          author_id, title, description, time_minutes, difficulty,
          materials, subject, season, yard_context
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        idea
      );
    }

    // Insert Comments
    const comments = [
      [1, 2, "Great activity! Kids loved it."],
      [1, 3, "Used it last week — worked well."],
      [2, 1, "Trying this in my class next week."]
    ];

    for (const comment of comments) {
      await db.query(
        `INSERT INTO comments (idea_id, user_id, text) VALUES (?, ?, ?)`,
        comment
      );
    }

    // Insert Favorites (use IGNORE to avoid duplicate PK errors)
    const favorites = [
      [1, 1],
      [1, 2],
      [2, 1],
      [3, 3]
    ];

    for (const fav of favorites) {
      await db.query(
        `INSERT IGNORE INTO idea_favorites (user_id, idea_id) VALUES (?, ?)`,
        fav
      );
    }

    console.log("✅ ideas_db seeded successfully!");
  } catch (err) {
    console.error("❌ Error seeding ideas_db:", err);
  } finally {
    await db.end(); // close the pool
  }
}

seed();
