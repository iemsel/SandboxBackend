require('dotenv').config();
const express = require('express');
const cors = require('cors');
const ideasRoutes = require('./routes/ideas.routes');

const app = express();
const PORT = process.env.PORT || 4002;

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'ideas' });
});

// mount at root → /ideas, /ideas/:id
app.use('/', ideasRoutes);

app.listen(PORT, () => {
  console.log(`Ideas service listening on port ${PORT}`);
});
