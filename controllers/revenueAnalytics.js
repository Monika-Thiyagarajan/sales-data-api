const Order = require('../models/Order');

// Helper function to standardize JSON responses
const sendResponse = (res, success, data = null, message = '') => {
  return res.status(success ? 200 : 400).json({
    success,
    data,
    message,
  });
};

// Method for calculating total revenue
const getTotalRevenue = async (req, res) => {
  const { startDate, endDate } = req.query;

  if (!startDate || !endDate) {
    return sendResponse(res, false, null, 'Please provide startDate and endDate');
  }

  try {
    const totalRevenue = await Order.aggregate([
      {
        $match: {
          dateOfSale: {
            $gte: new Date(startDate),
            $lte: new Date(endDate),
          },
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: { $multiply: ['$quantitySold', '$unitPrice'] } },
        },
      },
    ]);

    sendResponse(res, true, {
      totalRevenue: totalRevenue[0] ? totalRevenue[0].totalRevenue : 0,
    });
  } catch (err) {
    sendResponse(res, false, null, 'Error calculating total revenue');
  }
};

// Method for sales by product
const getSalesByProduct = async (req, res) => {
  try {
    const salesByProduct = await Order.aggregate([
      {
        $group: {
          _id: '$productName',
          totalSales: { $sum: { $multiply: ['$quantitySold', '$unitPrice'] } },
        },
      },
    ]);

    sendResponse(res, true, salesByProduct);
  } catch (err) {
    sendResponse(res, false, null, 'Error calculating sales by product');
  }
};

// Method for total revenue by product
const getTotalRevenueByProduct = async (req, res) => {
  const { startDate, endDate } = req.query;

  if (!startDate || !endDate) {
    return sendResponse(res, false, null, 'Please provide startDate and endDate');
  }

  try {
    const revenueByProduct = await Order.aggregate([
      {
        $match: {
          dateOfSale: {
            $gte: new Date(startDate),
            $lte: new Date(endDate),
          },
        },
      },
      {
        $group: {
          _id: '$productName',
          totalRevenue: { $sum: { $multiply: ['$quantitySold', '$unitPrice'] } },
        },
      },
    ]);

    sendResponse(res, true, revenueByProduct);
  } catch (err) {
    sendResponse(res, false, null, 'Error calculating total revenue by product');
  }
};

// Method for total revenue by category
const getTotalRevenueByCategory = async (req, res) => {
  const { startDate, endDate } = req.query;

  if (!startDate || !endDate) {
    return sendResponse(res, false, null, 'Please provide startDate and endDate');
  }

  try {
    const revenueByCategory = await Order.aggregate([
      {
        $match: {
          dateOfSale: {
            $gte: new Date(startDate),
            $lte: new Date(endDate),
          },
        },
      },
      {
        $group: {
          _id: '$category',
          totalRevenue: { $sum: { $multiply: ['$quantitySold', '$unitPrice'] } },
        },
      },
    ]);

    sendResponse(res, true, revenueByCategory);
  } catch (err) {
    sendResponse(res, false, null, 'Error calculating total revenue by category');
  }
};

// Method for total revenue by region
const getTotalRevenueByRegion = async (req, res) => {
  const { startDate, endDate } = req.query;

  if (!startDate || !endDate) {
    return sendResponse(res, false, null, 'Please provide startDate and endDate');
  }

  try {
    const revenueByRegion = await Order.aggregate([
      {
        $match: {
          dateOfSale: {
            $gte: new Date(startDate),
            $lte: new Date(endDate),
          },
        },
      },
      {
        $group: {
          _id: '$region',
          totalRevenue: { $sum: { $multiply: ['$quantitySold', '$unitPrice'] } },
        },
      },
    ]);

    sendResponse(res, true, revenueByRegion);
  } catch (err) {
    sendResponse(res, false, null, 'Error calculating total revenue by region');
  }
};

// Method for revenue trends over time
const getRevenueTrends = async (req, res) => {
  const { startDate, endDate, period } = req.query; // period can be 'monthly', 'quarterly', 'yearly'

  if (!startDate || !endDate || !period) {
    return sendResponse(res, false, null, 'Please provide startDate, endDate, and period (monthly, quarterly, or yearly)');
  }

  try {
    let groupBy = {};
    if (period === 'monthly') {
      groupBy = { $month: '$dateOfSale' }; // Group by month
    } else if (period === 'quarterly') {
      groupBy = { $ceil: { $divide: [{ $month: '$dateOfSale' }, 3] } }; // Group by quarter
    } else if (period === 'yearly') {
      groupBy = { $year: '$dateOfSale' }; // Group by year
    } else {
      return sendResponse(res, false, null, 'Invalid period, choose from monthly, quarterly, or yearly');
    }

    const revenueTrends = await Order.aggregate([
      {
        $match: {
          dateOfSale: {
            $gte: new Date(startDate),
            $lte: new Date(endDate),
          },
        },
      },
      {
        $group: {
          _id: groupBy,
          totalRevenue: { $sum: { $multiply: ['$quantitySold', '$unitPrice'] } },
        },
      },
      {
        $sort: { _id: 1 }, // Sort by time (month/quarter/year)
      },
    ]);

    sendResponse(res, true, revenueTrends);
  } catch (err) {
    sendResponse(res, false, null, 'Error calculating revenue trends');
  }
};

module.exports = {
  getTotalRevenue,
  getSalesByProduct,
  getTotalRevenueByProduct,
  getTotalRevenueByCategory,
  getTotalRevenueByRegion,
  getRevenueTrends,
};
