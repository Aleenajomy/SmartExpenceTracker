const express = require('express');
const router = express.Router();
const { exportPDF, exportCSV } = require('../controllers/exportController');
const { protect } = require('../middleware/auth');

router.use(protect);
router.get('/pdf', exportPDF);
router.get('/csv', exportCSV);

module.exports = router;
