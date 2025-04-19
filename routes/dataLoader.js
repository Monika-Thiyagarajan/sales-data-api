const express = require('express');
const router = express.Router();
const csvLoader = require('../utils/csvLoader');
const csvGenerator = require('../utils/csvGenerator')

router.get('/generate-csv', async (req, res) => {
    try {
        console.log('Loading CSV data...');
        await csvGenerator.generateCSV();
        res.status(200).json({ success: true, message: 'CSV data loaded successfully!' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Error loading CSV data', error: err.message });
    }
});
router.post('/load-csv', async (req, res) => {
    try {
        console.log('Loading CSV data...');
        await csvLoader.loadCSVData();
        res.status(200).json({ success: true, message: 'CSV data loaded successfully!' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Error loading CSV data', error: err.message });
    }
});


module.exports = router;
