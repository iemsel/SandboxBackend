require('dotenv').config();
const express = require('express');
const cors = require('cors');
const plansRoutes = require('./routes/plans.routes');

const app = express();
const PORT = process.env.PORT || 4003;

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'planner' });
});

// mount at root (gateway will forward /planner/* → here)
app.use('/', plansRoutes);

app.listen(PORT, () => {
  console.log(`Planner service listening on port ${PORT}`);
});
