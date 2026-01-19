require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const PORT = process.env.PORT || 3010;

const AUTH_URL = process.env.AUTH_URL;
const IDEAS_URL = process.env.IDEAS_URL;
const PLANNER_URL = process.env.PLANNER_URL;
// optional for later
const CHAT_URL = process.env.CHAT_URL;

app.use(cors());
app.use(express.json());

if (!AUTH_URL || !IDEAS_URL || !PLANNER_URL) {
  console.warn('[GATEWAY] Missing one of AUTH_URL / IDEAS_URL / PLANNER_URL env vars');
}

// /auth/* -> auth-service/*
app.use(
  '/auth',
  createProxyMiddleware({
    target: AUTH_URL,
    changeOrigin: true,
    pathRewrite: { '^/auth': '' },
  }),
);

// /ideas/* -> idea-service/*
app.use(
  '/ideas',
  createProxyMiddleware({
    target: IDEAS_URL,
    changeOrigin: true,
    pathRewrite: { '^/ideas': '' },
  }),
);

// /planner/* -> planner-service/*
app.use(
  '/planner',
  createProxyMiddleware({
    target: PLANNER_URL,
    changeOrigin: true,
    pathRewrite: { '^/planner': '' },
  }),
);

// /chat/* -> chat-service/* (later)
if (CHAT_URL) {
  app.use(
    '/chat',
    createProxyMiddleware({
      target: CHAT_URL,
      changeOrigin: true,
      pathRewrite: { '^/chat': '' },
    }),
  );
}

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'gateway' });
});

app.listen(PORT, () => console.log(`Gateway listening on port ${PORT}`));
