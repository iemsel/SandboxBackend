require('dotenv').config();
const express = require('express');
const cors = require('cors');
// eslint-disable-next-line no-unused-vars
const jwt = require('jsonwebtoken'); //
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const PORT = process.env.PORT || 3010;
// eslint-disable-next-line no-unused-vars
const JWT_SECRET = process.env.JWT_SECRET || 'devsecret'; //

app.use(cors());
app.use(express.json());

// direct proxy for auth (no token needed for register/login)
app.use(
  '/auth',
  createProxyMiddleware({
    target: 'http://auth-service:4001',
    changeOrigin: true,
  }),
);

// example of protected route later for /ideas, /collab:
// function authMiddleware(req, res, next) { ... } etc.

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'gateway' });
});

app.listen(PORT, () => {
  console.log(`Gateway listening on port ${PORT}`);
});
