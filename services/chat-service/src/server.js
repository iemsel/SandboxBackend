// services/chat-service/src/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const chatRoutes = require('./routes/chat.routes');

const app = express();
const PORT = process.env.PORT || 4004;

app.use(cors());
app.use(express.json());

// health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'chat' });
});

// all chat routes mounted at root
app.use('/', chatRoutes);

app.listen(PORT, () => {
  console.log(`Chat service listening on port ${PORT}`);
});
