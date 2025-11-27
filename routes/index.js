import express from 'express';
const router = express.Router();

// Root route
router.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'API is running' });
});

export default router;
