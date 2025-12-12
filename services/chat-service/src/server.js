// services/chat-service/src/server.js
const express = require('express');
const app = express();
const chatRoutes = require('./routes/chat.routes');

app.use(express.json());

// inside the service we mount at root; gateway rewrites /chat → ''
app.use('/', chatRoutes);

const PORT = process.env.PORT || 4004;
app.listen(PORT, () => {
  console.log(`Chat service listening on port ${PORT}`);
});
