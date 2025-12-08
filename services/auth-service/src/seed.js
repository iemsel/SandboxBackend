const db = require('./db');
const bcrypt = require('bcryptjs');

async function seed() {
  try {
    console.log("🌱 Seeding auth_db...");

    // Truncate users table first (safe to rerun)
    await db.query("SET FOREIGN_KEY_CHECKS=0");
    await db.query("TRUNCATE TABLE users");
    await db.query("SET FOREIGN_KEY_CHECKS=1");

    // Users to insert
    const users = [
      { email: 'alice@example.com', name: 'Alice', password: 'password123' },
      { email: 'bob@example.com', name: 'Bob', password: 'password123' },
      { email: 'carol@example.com', name: 'Carol', password: 'password123' },
      { email: 'teacher@example.com', name: 'Teacher Tom', password: 'password123' },
      { email: 'parent@example.com', name: 'Parent Maria', password: 'password123' }
    ];

    for (const u of users) {
      const hash = await bcrypt.hash(u.password, 10);
      await db.query(
        'INSERT INTO users (email, name, password_hash, created_at) VALUES (?, ?, ?, NOW())',
        [u.email, u.name, hash]
      );
    }

    console.log("✅ auth_db seeded successfully!");
  } catch (err) {
    console.error("❌ Error seeding auth_db:", err);
  } finally {
    await db.end();
  }
}

seed();
