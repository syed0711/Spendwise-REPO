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
└── README.md
```

## Prerequisites

*   Node.js (v18+ recommended)
*   npm (or yarn/pnpm)

## Setup and Running the Application

1.  **Backend Server (Port 4000):**
    *   Navigate to the backend directory:
        ```bash
        cd backend
        ```
    *   Install dependencies:
        ```bash
        npm install
        ```
    *   Start the backend server:
        ```bash
        npm start
        ```
    *   You should see a message like: `Server listening on port 4000`

2.  **Frontend Application (Port 3000):**
    *   Open a new terminal window/tab.
    *   Navigate to the frontend directory:
        ```bash
        cd frontend
        ```
        (If you are in the `backend` directory, you can use `cd ../frontend`)
    *   Install dependencies:
        ```bash
        npm install
        ```
    *   Start the frontend development server:
        ```bash
        npm start
        ```
    *   This should automatically open the application in your default web browser at `http://localhost:3000`.

## Features

*   **Upload Transactions**: Upload a CSV file with your transaction data (must include `Date`, `Description`, `Amount` columns; `Category` is optional).
*   **View Data**: See all your imported transactions in a sortable, paginated table.
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

## API Endpoints (Backend)

*   `POST /upload`: Accepts CSV file upload (field name "file"). Parses and saves data to `data.json`.
*   `GET /transactions`: Returns all transactions from `data.json`.
*   `GET /insights`: Returns calculated insights (total spent, monthly totals, category breakdown).

```
