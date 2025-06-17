# SpendWise - Transaction Analyzer

SpendWise is a local, self-hosted transaction uploader, data viewer, and insights dashboard.

## Project Structure

```
/
├── backend/
│   ├── uploads/        # Temporary storage for CSV uploads
│   ├── data.json       # JSON file for storing transaction data
│   ├── index.js        # Express server logic
│   └── package.json
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── DataView.jsx
│   │   │   └── Home.jsx
│   │   ├── App.css
│   │   ├── App.js        # Main React app component with routing
│   │   ├── index.css
│   │   └── index.js      # React entry point
│   └── package.json
├── package.json          # Root package.json with helper scripts
└── README.md
```

## Prerequisites

*   Node.js (v18+ recommended)
*   npm (or yarn/pnpm)

## Setup and Running the Application

This project now includes a root `package.json` to simplify common tasks.

**1. Installation (from project root):**

To install dependencies for both backend and frontend:
```bash
npm run install:all
```
Alternatively, you can install them individually:
```bash
npm run install:backend
npm run install:frontend
```
Or, by navigating to each directory:
```bash
cd backend && npm install
cd ../frontend && npm install && cd ..
# Added cd .. to return to root for consistency if running commands sequentially
```

**2. Running the Application (Development):**

You'll need two separate terminal windows to run the backend and frontend servers.

*   **Terminal 1: Start Backend Server (Port 4000)**
    From the project root:
    ```bash
    npm run dev:backend
    ```
    (This runs `cd backend && npm start`)
    You should see a message like: `Server listening on port 4000`

*   **Terminal 2: Start Frontend Application (Port 3000)**
    From the project root:
    ```bash
    npm run dev:frontend
    ```
    (This runs `cd frontend && npm start`)
    This should automatically open the application in your default web browser at `http://localhost:3000`.

**3. Building the Frontend for Production:**

To create an optimized build of the frontend application:

From the project root:
```bash
npm run build:frontend
```
(This runs `cd frontend && npm run build`)

The production-ready files will be placed in the `frontend/build` directory.

## Features

*   **Upload Transactions**: Upload a CSV file with your transaction data (must include `Date`, `Description`, `Amount` columns; `Category` is optional).
*   **View Data**: See all your imported transactions in a table.
*   **Dashboard**:
    *   View total spending.
    *   See a monthly spending trend chart.
    *   Analyze spending by category with a bar chart.

## CSV Format Requirements

Your CSV file must have a header row. The following columns are processed:

*   `Date`: The date of the transaction (e.g., `YYYY-MM-DD`, `MM/DD/YYYY`).
*   `Description`: A brief description of the transaction.
*   `Amount`: The transaction amount (should be a numeric value).
*   `Category` (Optional): The category of the transaction.

**Example CSV:**
```csv
Date,Description,Amount,Category
2023-01-15,Groceries,55.20,Food
2023-01-20,Internet Bill,70.00,Utilities
2023-02-05,Dinner Out,85.50,Food
2023-02-10,Movie Tickets,30.00,Entertainment
```

## API Endpoints (Backend - running on http://localhost:4000)

*   `POST /upload`: Accepts CSV file upload (field name "file"). Parses and saves data to `data.json`.
*   `GET /transactions`: Returns all transactions from `data.json`.
*   `GET /insights`: Returns calculated insights (total spent, monthly totals, category breakdown).
```
