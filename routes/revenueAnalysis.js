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

// Get total revenue within a date range
router.get('/revenue', getTotalRevenue);

// Get sales by product
router.get('/sales-by-product', getSalesByProduct);

// Get total revenue by product
router.get('/revenue-by-product', getTotalRevenueByProduct);

// Get total revenue by category
router.get('/revenue-by-category', getTotalRevenueByCategory);

// Get total revenue by region
router.get('/revenue-by-region', getTotalRevenueByRegion);

// Get revenue trends over time
router.get('/revenue-trends', getRevenueTrends);

module.exports = router;
