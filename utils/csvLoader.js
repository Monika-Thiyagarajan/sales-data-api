const fs = require('fs');
const csv = require('csv-parser');
const Order = require('../models/Order');
const Product = require('../models/Product');
const Customer = require('../models/Customer');

// Helper validation functions
const requiredField = (value, fieldName) => !value ? `${fieldName} is required` : null;
const validNumber = (value, fieldName, min = 0) => isNaN(value) || parseFloat(value) < min ? `${fieldName} must be a valid number >= ${min}` : null;
const validEmail = (value) => !/\S+@\S+\.\S+/.test(value) ? 'Invalid email format' : null;
const validDate = (value, fieldName) => isNaN(new Date(value).getTime()) ? `${fieldName} must be a valid date` : null;
const validDiscount = (value) => value < 0 || value > 1 ? 'Discount must be between 0 and 1' : null;

// Validating each row
const validateRowData = (row) => {
    const errors = [];
    errors.push(requiredField(row['Order ID'], 'Order ID'));
    errors.push(requiredField(row['Product ID'], 'Product ID'));
    errors.push(requiredField(row['Customer ID'], 'Customer ID'));
    errors.push(requiredField(row['Product Name'], 'Product Name'));
    errors.push(validDate(row['Date of Sale'], 'Date of Sale'));
    errors.push(validNumber(row['Quantity Sold'], 'Quantity Sold', 1));
    errors.push(validNumber(row['Unit Price'], 'Unit Price'));
    errors.push(validDiscount(parseFloat(row['Discount'])));
    errors.push(validNumber(row['Shipping Cost'], 'Shipping Cost'));
    errors.push(requiredField(row['Payment Method'], 'Payment Method'));
    errors.push(requiredField(row['Customer Name'], 'Customer Name'));
    errors.push(validEmail(row['Customer Email']));
    errors.push(requiredField(row['Customer Address'], 'Customer Address'));
    return errors.filter(Boolean); // remove nulls
};

// Inserting a row into DB
const insertDataToDB = async (row) => {
    try {
        // Checking if Customer already exists
        let customer = await Customer.findOne({ customer_id: row['Customer ID'] });
        if (!customer) {
            // If not, creating new customer
            customer = new Customer({
                customer_id: row['Customer ID'],
                name: row['Customer Name'],
                email: row['Customer Email'],
                address: row['Customer Address'],
                demographics: {
                    age: parseInt(row['Customer Age']) || undefined,
                    gender: row['Gender'],
                    location: row['Region'],
                },
            });
            await customer.save();
            //  console.log(`Customer ${row['Customer ID']} created`);
        } else {
            console.log(`Customer ${row['Customer ID']} already exists, skipping creation`);
        }

        // Checking if Product already exists
        let product = await Product.findOne({ product_id: row['Product ID'] });
        if (!product) {
            // If not, create new product
            product = new Product({
                product_id: row['Product ID'],
                name: row['Product Name'],
                category: row['Category'],
                description: row['Product Description'] || '',
                unit_price: parseFloat(row['Unit Price']),
                stock: 100, // Optional: default stock if not in CSV
            });
            await product.save();
            //   console.log(`Product ${row['Product ID']} created`);
        } else {
            console.log(`Product ${row['Product ID']} already exists, skipping creation`);
        }

        // Create Order
        const order = new Order({
            order_id: row['Order ID'],
            customer_id: customer._id,
            product_id: product._id,
            quantity_sold: parseInt(row['Quantity Sold']),
            unit_price: parseFloat(row['Unit Price']),
            discount: parseFloat(row['Discount']),
            shipping_cost: parseFloat(row['Shipping Cost']),
            payment_method: row['Payment Method'],
            date_of_sale: new Date(row['Date of Sale']),
            region: row['Region'],
        });

        await order.save();
        //console.log(`Order ${row['Order ID']} created`);

    } catch (err) {
        console.error(`Error inserting row with Order ID ${row['Order ID']}:`, err.message);
    }
};

// Loading and inserting CSV data
const loadCSVData = () => {
    const results = [];
    console.log('Reading CSV from salesData.csv');
    fs.createReadStream('salesData.csv')
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', async () => {
            for (const row of results) {
                const errors = validateRowData(row);
                if (errors.length) {
                    console.error(` Validation errors for Order ID ${row['Order ID']}:`, errors.join('; '));
                    continue;
                }
                await insertDataToDB(row);
            }
            console.log('CSV import completed!');
        });
};

module.exports = { loadCSVData };
