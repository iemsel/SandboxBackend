require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const PORT = process.env.PORT || 3010;

app.use(cors());

app.use((req, res, next) => {
  console.log(`[GATEWAY] ${req.method} ${req.url}`);
  next();
});

// /auth → auth-service
app.use(
  '/auth',
  createProxyMiddleware({
    target: 'http://auth-service:4001',
    changeOrigin: true,
    logLevel: 'debug',
  }),
);

// /ideas → ideas-service
app.use(
  '/ideas',
  createProxyMiddleware({
    target: 'http://ideas-service:4002',
    changeOrigin: true,
    logLevel: 'debug',
  }),
);

app.use(
  '/planner',
  createProxyMiddleware({
    target: 'http://planner-service:4003',
    changeOrigin: true,
    logLevel: 'debug',
  }),
);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'gateway' });
});

app.listen(PORT, () => {
  console.log(`Gateway listening on port ${PORT}`);
});
