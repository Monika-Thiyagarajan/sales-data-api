const express = require('express');
const dbConnection = require('./config/db');
const analysisRoutes = require('./routes/revenueAnalysis');
const dataLoaderRoutes = require('./routes/dataLoader');
const dataRefreshService = require('./services/data-refresh');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;
app.use(cors());
// Middleware
app.use(express.json()); // For parsing application/json

// Connect to MongoDB
dbConnection.connectDB();
// dataRefreshService.scheduleDataRefresh();
dataRefreshService.refreshDatabase();
app.use('/api/csv', dataLoaderRoutes);
// Use the analysis routes
app.use('/api/analysis', analysisRoutes);

// Placeholder route to check if the server is working
app.get('/', (req, res) => {
  res.send('API is working!');
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
