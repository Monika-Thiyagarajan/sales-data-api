const fs = require('fs');
const { Parser } = require('json2csv');

// Function to validate the data
const validateData = (data) => {
    if (!Array.isArray(data)) {
        return { valid: false, message: 'Data should be an array of objects.' };
    }

    for (const record of data) {
        // Check for required fields
        if (
            !record.orderId || !record.productId || !record.customerId ||
            !record.productName || !record.category || !record.region ||
            !record.dateOfSale || !record.quantitySold || !record.unitPrice ||
            !record.shippingCost || !record.paymentMethod ||
            !record.customerName || !record.customerEmail ||
            !record.customerAddress
        ) {
            return { valid: false, message: `Missing required field in orderId ${record.orderId}` };
        }
    }

    return { valid: true };
};

const generateCSV = () => {
    const data = [
        {
            orderId: '1001',
            productId: 'P123',
            customerId: 'C456',
            productName: 'UltraBoost Running Shoes',
            category: 'Shoes',
            region: 'North America',
            dateOfSale: '2023-12-15',
            quantitySold: 2,
            unitPrice: 180.00,
            discount: 0.1, // Optional
            shippingCost: 10.00,
            paymentMethod: 'Credit Card',
            customerName: 'John Smith',
            customerEmail: 'johnsmith@email.com',
            customerAddress: '123 Main St, Anytown, CA 12345',
            productDescription: 'High-performance running shoes with Boost technology for extra comfort.' // Optional
        },
        {
            orderId: '1002',
            productId: 'P456',
            customerId: 'C789',
            productName: 'iPhone 15 Pro',
            category: 'Electronics',
            region: 'Europe',
            dateOfSale: '2024-01-03',
            quantitySold: 1,
            unitPrice: 1299.00,
            discount: 0.0, // Optional
            shippingCost: 15.00,
            paymentMethod: 'PayPal',
            customerName: 'Emily Davis',
            customerEmail: 'emilydavis@email.com',
            customerAddress: '456 Elm St, Otherville, NY 54321',
            productDescription: 'A premium smartphone with advanced camera and performance features.' // Optional
        },
        {
            orderId: '1003',
            productId: 'P789',
            customerId: 'C123',
            productName: 'MacBook Pro 16-inch',
            category: 'Electronics',
            region: 'North America',
            dateOfSale: '2024-02-25',
            quantitySold: 1,
            unitPrice: 2399.00,
            discount: 0.05, // Optional
            shippingCost: 20.00,
            paymentMethod: 'Credit Card',
            customerName: 'Alice Johnson',
            customerEmail: 'alicejohnson@email.com',
            customerAddress: '789 Oak St, Somewhere, TX 67890',
            productDescription: 'A powerful laptop with a large Retina display and fast processing.' // Optional
        },
    ];

    try {
        // Validating the data before processing
        const validation = validateData(data);
        if (!validation.valid) {
            throw new Error(validation.message);
        }

        // Converting the data to CSV format
        const json2csv = new Parser();
        const csvContent = json2csv.parse(data);

        // Defining the file path where the CSV will be saved
        const filePath = 'salesData.csv';  // You can modify the path here

        // Saving the CSV content to a file
        fs.writeFileSync(filePath, csvContent, 'utf8');

        console.log('CSV file has been generated!');
    } catch (error) {
        console.error('Error generating CSV:', error.message);
    }
};
// generateCSV();
module.exports = { generateCSV };

