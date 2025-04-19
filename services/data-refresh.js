const cron = require('node-cron');
const Order = require('../models/Order');
const Product = require('../models/Product');
const Customer = require('../models/Customer');
const fs = require('fs');


// Log to file function
const logToFile = (level, message, additionalInfo = {}) => {
  const logMessage = `[${new Date().toISOString()}] [${level}] ${message} ${JSON.stringify(additionalInfo)}\n`;
  fs.appendFileSync('refresh.log', logMessage);
};

const fetchNewData = async () => {
  return [
    {
      orderId: '1001',
      productId: 'P123',
      customerId: 'C456',
      productName: 'UltraBoost Running Shoes',
      category: 'Footwear',
      region: 'North America',
      dateOfSale: new Date('2025-04-18'),
      quantitySold: 2,
      unitPrice: 180.0,
      discount: 10.0,
      shippingCost: 5.0,
      paymentMethod: 'Credit Card',
      customerName: 'Alice Smith',
      customerEmail: 'alice@example.com',
      customerAddress: '123 Main St, Springfield',
      productDescription: 'High-performance running shoes with Boost cushioning.'
    },
    {
      orderId: '1002',
      productId: 'P456',
      customerId: 'C789',
      productName: 'iPhone 15 Pro',
      category: 'Electronics',
      region: 'Europe',
      dateOfSale: new Date('2025-04-17'),
      quantitySold: 1,
      unitPrice: 1299.0,
      discount: 0,
      shippingCost: 15.0,
      paymentMethod: 'PayPal',
      customerName: 'Bob Johnson',
      customerEmail: 'bob@example.com',
      customerAddress: '456 Oak Ave, Metropolis',
      productDescription: 'Latest Apple flagship with A17 chip and 120Hz display.'
    }
  ];
};

const refreshDatabase = async () => {
    try {
      logToFile('INFO', 'Starting data refresh process');
  
      const newData = await fetchNewData();
      logToFile('INFO', 'Fetched new data', { newDataCount: newData.length });
  
      for (const record of newData) {
        // Insert/Update Customer
        let customer = await Customer.findOne({ customer_id: record.customerId });
        if (!customer) {
          // Ensure all required fields are provided
          customer = await Customer.create({
            customer_id: record.customerId,  // Ensure customer_id is passed
            name: record.customerName,       // Ensure customerName is passed
            email: record.customerEmail,     // Ensure customerEmail is passed
            address: record.customerAddress, // Ensure customerAddress is passed
          });
          logToFile('INFO', 'Inserted new customer', { customerId: record.customerId });
        } else {
          // Check if the customer data has changed
          const customerChanged = customer.name !== record.customerName || 
                                  customer.email !== record.customerEmail || 
                                  customer.address !== record.customerAddress;
          
          if (customerChanged) {
            // Perform update if data has changed
            customer.name = record.customerName;
            customer.email = record.customerEmail;
            customer.address = record.customerAddress;
            await customer.save();
            logToFile('INFO', 'Updated customer', { customerId: record.customerId });
          } else {
            logToFile('INFO', 'Customer already exists and no changes made', { customerId: record.customerId });
          }
        }
  
        // Insert/Update Product
        let product = await Product.findOne({ product_id: record.productId });
        if (!product) {
          product = await Product.create({
            product_id: record.productId,
            product_name: record.productName,
            unit_price: record.unitPrice,
          });
          logToFile('INFO', 'Inserted new product', { productId: record.productId });
        } else {
          // Check if the product data has changed
          const productChanged = product.product_name !== record.productName ||
                                 product.unit_price !== record.unitPrice;
          
          if (productChanged) {
            // Perform update if data has changed
            product.product_name = record.productName;
            product.unit_price = record.unitPrice;
            await product.save();
            logToFile('INFO', 'Updated product', { productId: record.productId });
          } else {
            logToFile('INFO', 'Product already exists and no changes made', { productId: record.productId });
          }
        }
  
        // Create/Update Order
        const existingOrder = await Order.findOne({ order_id: record.orderId });
        const orderData = {
          order_id: record.orderId,
          customer_id: customer._id,
          product_id: product._id,
          date_of_sale: record.dateOfSale,
          payment_method: record.paymentMethod,
          quantity_sold: record.quantitySold,
          unit_price: record.unitPrice,
          discount: record.discount,
          shipping_cost: record.shippingCost,
          region: record.region,
        };
  
        if (existingOrder) {
          // Check if the order data has changed
          const orderChanged = existingOrder.quantity_sold !== record.quantitySold ||
                               existingOrder.unit_price !== record.unitPrice ||
                               existingOrder.discount !== record.discount ||
                               existingOrder.shipping_cost !== record.shippingCost;
  
          if (orderChanged) {
            // Perform update if data has changed
            await Order.updateOne({ order_id: record.orderId }, { $set: orderData });
            logToFile('INFO', 'Updated order', { orderId: record.orderId });
          } else {
            logToFile('INFO', 'Order already exists and no changes made', { orderId: record.orderId });
          }
        } else {
          await Order.create(orderData);
          logToFile('INFO', 'Inserted new order', { orderId: record.orderId });
        }
      }
  
      logToFile('INFO', 'Data refresh completed successfully');
    } catch (err) {
      logToFile('ERROR', 'Error during data refresh', {
        error: err.message,
        stack: err.stack,
      });
    }
};

  
const scheduleDataRefresh = () => {
  cron.schedule('0 0 * * *', () => {
    refreshDatabase();
    logToFile('INFO', 'Scheduled data refresh triggered');
  });
};

module.exports = { scheduleDataRefresh, refreshDatabase };
