const mysql = require('mysql2/promise');

// Main ideas_db connection
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || '',
  database: process.env.DB_NAME || 'ideas_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Auth_db connection for fetching user information
const authDb = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || '',
  database: 'auth_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

module.exports = pool;
module.exports.authDb = authDb;
