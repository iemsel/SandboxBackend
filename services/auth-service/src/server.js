require('dotenv').config();
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth.routes');

const app = express();
const PORT = process.env.PORT || 4001;

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'auth' });
});

// mount routes at root: /register, /login, /me
app.use('/', authRoutes);

app.listen(PORT, () => {
  console.log(`Auth service listening on port ${PORT}`);
});
