const express = require('express');
const cors = require('cors');
const multer = require('multer');
const Papa = require('papaparse');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 4000;

// Middleware
app.use(cors());
app.use(express.json());

// Multer setup for file uploads
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});
const upload = multer({ storage: storage, limits: { fileSize: 1024 * 1024 * 5 } }); // Limit file size to 5MB

const dataFilePath = path.join(__dirname, 'data.json');

// POST /upload endpoint
app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded.' });
  }

  const filePath = req.file.path;

  fs.readFile(filePath, 'utf8', (err, fileContent) => {
    if (err) {
      console.error('Error reading uploaded file:', err);
      // Clean up uploaded file
      fs.unlink(filePath, (unlinkErr) => {
        if (unlinkErr) console.error('Error deleting temp file:', unlinkErr);
      });
      return res.status(500).json({ error: 'Error reading file.' });
    }

    Papa.parse(fileContent, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true, // Automatically convert numbers
      complete: (results) => {
        if (results.errors.length > 0) {
          console.error('Parsing errors:', results.errors);
          // Clean up uploaded file
          fs.unlink(filePath, (unlinkErr) => {
            if (unlinkErr) console.error('Error deleting temp file:', unlinkErr);
          });
          return res.status(400).json({ errors: results.errors });
        }

        fs.writeFile(dataFilePath, JSON.stringify(results.data, null, 2), (writeErr) => {
          // Clean up uploaded file regardless of writeFile outcome
          fs.unlink(filePath, (unlinkErr) => {
            if (unlinkErr) console.error('Error deleting temp file:', unlinkErr);
          });

          if (writeErr) {
            console.error('Error writing data.json:', writeErr);
            return res.status(500).json({ error: 'Error saving processed data.' });
          }
          res.status(200).json({ imported: results.data.length });
        });
      },
      error: (error) => {
        console.error('Papaparse error:', error.message);
        // Clean up uploaded file
        fs.unlink(filePath, (unlinkErr) => {
          if (unlinkErr) console.error('Error deleting temp file:', unlinkErr);
        });
        return res.status(500).json({ error: 'Error parsing CSV file.' });
      }
    });
  });
});

// GET /transactions endpoint
app.get('/transactions', (req, res) => {
  fs.readFile(dataFilePath, 'utf8', (err, fileContent) => {
    if (err) {
      if (err.code === 'ENOENT') {
        return res.status(200).json([]); // File not found, return empty array
      }
      console.error('Error reading data.json for transactions:', err);
      return res.status(500).json({ error: 'Error fetching transactions.' });
    }
    try {
      const transactions = JSON.parse(fileContent);
      res.status(200).json(transactions);
    } catch (parseErr) {
      console.error('Error parsing data.json for transactions:', parseErr);
      res.status(500).json({ error: 'Error parsing transaction data.' });
    }
  });
});

// GET /insights endpoint
app.get('/insights', (req, res) => {
  fs.readFile(dataFilePath, 'utf8', (err, fileContent) => {
    if (err) {
      if (err.code === 'ENOENT') {
        return res.status(404).json({
          totalSpent: 0,
          monthlyTotals: {},
          categoryBreakdown: {},
          message: "No transaction data found. Please upload a CSV file."
        });
      }
      console.error('Error reading data.json for insights:', err);
      return res.status(500).json({ error: 'Error fetching insights.' });
    }

    try {
      const transactions = JSON.parse(fileContent);
      if (!transactions || transactions.length === 0) {
        return res.status(200).json({
          totalSpent: 0,
          monthlyTotals: {},
          categoryBreakdown: {},
          message: "Transaction data is empty."
        });
      }

      let totalSpent = 0;
      const monthlyTotals = {};
      const categoryBreakdown = {};

      transactions.forEach(t => {
        const amount = parseFloat(t.Amount);
        if (isNaN(amount)) return; // Skip if amount is not a valid number

        totalSpent += amount;

        // Monthly totals (assuming a 'Date' field like 'YYYY-MM-DD' or 'MM/DD/YYYY')
        // Standardize date parsing
        let dateStr = t.Date || t.date; // Common variations
        if (dateStr) {
            let dateObj;
            if (dateStr.includes('/')) { // e.g., MM/DD/YYYY
                const parts = dateStr.split('/');
                dateObj = new Date(parts[2], parts[0] - 1, parts[1]);
            } else if (dateStr.includes('-')) { // e.g., YYYY-MM-DD
                 const parts = dateStr.split('-');
                 dateObj = new Date(parts[0], parts[1] - 1, parts[2]);
            } else {
                // Attempt to parse directly if it's an ISO string or other parsable format
                dateObj = new Date(dateStr);
            }

            if (dateObj && !isNaN(dateObj.getTime())) {
                const year = dateObj.getFullYear();
                const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
                const yearMonth = `${year}-${month}`;
                monthlyTotals[yearMonth] = (monthlyTotals[yearMonth] || 0) + amount;
            }
        }


        // Category breakdown
        const category = t.Category || t.category; // Common variations
        if (category) {
          categoryBreakdown[category] = (categoryBreakdown[category] || 0) + amount;
        }
      });

      res.status(200).json({ totalSpent, monthlyTotals, categoryBreakdown });
    } catch (parseErr) {
      console.error('Error processing data for insights:', parseErr);
      res.status(500).json({ error: 'Error processing transaction data for insights.' });
    }
  });
});

// Start server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
