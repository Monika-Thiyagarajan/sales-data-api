# Revenue Analytics System

This system provides a complete solution for processing, storing, and analyzing historical sales data. The data is loaded from a CSV file containing various fields such as product information, customer details, and sale transactions. The system includes a mechanism for periodic data refresh, a normalized database schema, and a RESTful API for querying various revenue-related metrics.

## Features

- **Data Loading:** Efficiently loads sales data from CSV into a normalized database schema.
- **Data Refresh Mechanism:** Automatically refreshes the database with new data periodically or on-demand.
- **RESTful API for Analysis:** Provides endpoints for querying revenue data and triggering data refresh.
- **Core Analysis:** Supports revenue calculations, including total revenue, revenue by product, revenue by category, and revenue by region.

## Prerequisites

Ensure that you have the following installed:

1. **Node.js** (v14.x or higher)
   - You can check if Node.js is installed by running:
     ```bash
     node -v
     ```
   - If not installed, download it from the official [Node.js Website](https://nodejs.org/).

2. **MongoDB** (Local)
     Ensure mongdb is running

3. **CSV File:** A CSV file containing historical sales data with fields OR we can hit the api (GET) http://localhost/5000/api/csv/generate-csv(in postman / thunderclient)

## Setup and Execution

Follow these steps to set up and run the application:

### 1. Clone the Repository

Clone the repository to your local machine:

```bash
git https://github.com/Monika-Thiyagarajan/sales-data-api.git
cd sales-data-api
```

### 2. Install Dependencies

npm install

### 3.  Set Up Environment Variables
MONGO_URI=<Your MongoDB URI> (eg:mongodb://localhost:27017/salesDB)
PORT=5000

### 4. Data loading
Hit this (POST) api http://localhost:5000/api/generate-csv (data loaded in db)

### 5. Start the Server
node server.js or nodemon server.js
