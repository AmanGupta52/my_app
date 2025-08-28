// routes/expertsRoutes.js
const express = require('express');
const Expert = require('../models/Expert');

const router = express.Router();

// ✅ Bulk insert experts
router.post('/add-experts', async (req, res) => {
  try {
    const experts = req.body; // expects an array of expert objects
    await Expert.insertMany(experts);
    res.status(201).json({ message: 'Experts uploaded successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ Get all experts
router.get('/', async (req, res) => {
  try {
    const experts = await Expert.find();
    res.json(experts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
