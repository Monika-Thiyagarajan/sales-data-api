const express = require('express');
const dbConnection = require('./config/db');
const analysisRoutes = require('./routes/revenueAnalysis');
const dataLoaderRoutes = require('./routes/dataLoader');
const dataRefreshService = require('./services/data-refresh');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json()); 

dbConnection.connectDB();
dataRefreshService.scheduleDataRefresh();
// dataRefreshService.refreshDatabase();
app.use('/api/csv', dataLoaderRoutes);
app.use('/api/analysis', analysisRoutes);

app.get('/', (req, res) => {
  res.send('API is working!');
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
