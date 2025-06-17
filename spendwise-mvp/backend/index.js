const express = require('express');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const Papa = require('papaparse');

const app = express();
const upload = multer({ dest: path.join(__dirname, 'uploads') });
const DATA_FILE = path.join(__dirname, 'data.json');

app.use(cors());
app.use(express.json());

app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  const filePath = req.file.path;
  const csvFile = fs.createReadStream(filePath);
  Papa.parse(csvFile, {
    header: true,
    skipEmptyLines: true,
    complete: (results) => {
      const data = results.data;
      fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2), (err) => {
        fs.unlink(filePath, () => {});
        if (err) return res.status(500).json({ error: 'Failed to save data' });
        res.json({ imported: data.length });
      });
    },
  });
});

app.get('/transactions', (req, res) => {
  fs.readFile(DATA_FILE, 'utf8', (err, content) => {
    if (err) return res.json([]);
    try {
      const data = JSON.parse(content);
      res.json(data);
    } catch {
      res.json([]);
    }
  });
});

app.listen(4000, () => {
  console.log('Server running on http://localhost:4000');
});
