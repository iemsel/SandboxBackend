const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || '',
  database: process.env.DB_NAME || 'ideas_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

const authDb = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || '',
  database: 'auth_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

module.exports = pool;
module.exports.authDb = authDb;
