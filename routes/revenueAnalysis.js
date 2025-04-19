const express = require('express');
const {
  getTotalRevenue,
  getSalesByProduct,
  getTotalRevenueByProduct,
  getTotalRevenueByCategory,
  getTotalRevenueByRegion,
  getRevenueTrends
} = require('../controllers/revenueAnalytics');

const router = express.Router();

// Route to get total revenue within a date range
router.get('/revenue', getTotalRevenue);

// Route to get sales by product
router.get('/sales-by-product', getSalesByProduct);

// Route to get total revenue by product
router.get('/revenue-by-product', getTotalRevenueByProduct);

// Route to get total revenue by category
router.get('/revenue-by-category', getTotalRevenueByCategory);

// Route to get total revenue by region
router.get('/revenue-by-region', getTotalRevenueByRegion);

// Route to get revenue trends over time
router.get('/revenue-trends', getRevenueTrends);

module.exports = router;
