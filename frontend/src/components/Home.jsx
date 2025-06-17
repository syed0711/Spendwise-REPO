import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Alert, Box, Typography, Stack } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

function Home() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('info'); // 'success', 'error', 'info', 'warning'
  const navigate = useNavigate();

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
    setMessage(''); // Clear previous messages
    setMessageType('info');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!selectedFile) {
      setMessage('Please select a CSV file to upload.');
      setMessageType('error');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);

    setMessage('Uploading...');
    setMessageType('info');

    try {
      const response = await fetch('http://localhost:4000/upload', {
        method: 'POST',
        body: formData,
      });

      const responseData = await response.json();

      if (response.ok) {
        setMessage(`Successfully imported ${responseData.imported} rows.`);
        setMessageType('success');
        setSelectedFile(null);
        if (document.getElementById('fileInput')) {
          document.getElementById('fileInput').value = null;
        }

        setTimeout(() => {
          navigate('/data');
        }, 1500);
      } else {
        let errorMessage = `Upload failed: ${response.statusText}`;
        if (responseData && responseData.message) {
          errorMessage = responseData.message;
        } else if (responseData && responseData.errors && responseData.errors.length > 0) {
          errorMessage = responseData.errors.map(err => `${err.message || err.code} (Row: ${err.row || 'N/A'})`).join(', ');
        } else if (responseData && responseData.error) {
          errorMessage = responseData.error;
        }
        setMessage(errorMessage);
        setMessageType('error');
      }
    } catch (error) {
      console.error('Upload error:', error);
      setMessage(`Network error or server is not responding: ${error.message}`);
      setMessageType('error');
    }
  };

  return (
    <Box
      sx={{
        maxWidth: 500,
        margin: 'auto',
        mt: 4,
        p: { xs: 2, sm: 3 }, // Responsive padding
        border: '1px solid',
        borderColor: 'grey.300',
        borderRadius: 2,
        boxShadow: 3
      }}
    >
      <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ mb: 3 }}>
        Upload Transactions CSV
      </Typography>
      <form onSubmit={handleSubmit}>
        <Stack spacing={2.5}> {/* Increased spacing slightly */}
          <Button
            component="label"
            role={undefined} // Accessibility: remove button role when it's a label
            variant="outlined"
            startIcon={<CloudUploadIcon />}
            sx={{ textTransform: 'none' }} // Keep filename casing
          >
            {selectedFile ? selectedFile.name : 'Select CSV File'}
            <input
              type="file"
              hidden
              accept=".csv,text/csv" // More specific accept types
              onChange={handleFileChange}
              id="fileInput"
            />
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={!selectedFile || messageType === 'info' && message === 'Uploading...'} // Disable while uploading
          >
            Import Transactions
          </Button>
          {message && (
            <Alert severity={messageType || 'info'} sx={{ mt: 2 }}>
              {message}
            </Alert>
          )}
        </Stack>
      </form>
    </Box>
  );
}

export default Home;
