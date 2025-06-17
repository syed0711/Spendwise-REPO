// frontend/src/components/Home.jsx
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Alert, Box, Typography, Stack, CircularProgress, Paper } from '@mui/material'; // Added Paper
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

function Home() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success' or 'error'
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const fileInputRef = useRef(null); // Ref for the hidden file input

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
    setMessage('');
    setMessageType('');
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
    setIsLoading(true);
    setMessage(''); // Clear previous messages

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
        if (fileInputRef.current) {
            fileInputRef.current.value = null; // Reset file input
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
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      component={Paper}
      elevation={3}
      sx={{
        maxWidth: 600,
        margin: 'auto',
        mt: {xs: 2, sm: 4},
        p: {xs: 2, sm: 4},
        borderRadius: 2
      }}
    >
      <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ mb: 3, fontWeight: 'medium' }}>
        Upload Transactions CSV
      </Typography>
      <form onSubmit={handleSubmit}>
        <Stack spacing={3}>
          {/* Custom styled file input area */}
          <Box
            sx={{
              border: '2px dashed',
              borderColor: 'grey.400',
              borderRadius: 1, // theme.shape.borderRadius
              p: 3,
              textAlign: 'center',
              cursor: 'pointer',
              '&:hover': {
                borderColor: 'primary.main',
                backgroundColor: 'action.hover'
              }
            }}
            onClick={() => fileInputRef.current?.click()} // Trigger click on hidden input
            role="button" // Make it clear it's clickable
            tabIndex={0} // Make it focusable
            onKeyPress={(e) => { if (e.key === 'Enter' || e.key === ' ') fileInputRef.current?.click(); }} // Keyboard accessibility
          >
            <CloudUploadIcon sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
            <Typography color="text.secondary">
              {selectedFile ? selectedFile.name : 'Click or tap to select a CSV file'}
            </Typography>
          </Box>
          {/* Hidden actual file input */}
          <input
            type="file"
            hidden
            accept=".csv,text/csv" // More specific accept types
            onChange={handleFileChange}
            id="fileInput" // For label association if needed, though click is handled by Box
            ref={fileInputRef}
          />
          {/* Display selected file name (optional) */}
          {selectedFile && (
            <Typography variant="body2" align="center" color="text.secondary" sx={{ wordBreak: 'break-all' }}>
              Selected: {selectedFile.name}
            </Typography>
          )}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={!selectedFile || isLoading}
            fullWidth
            size="large" // Make button larger
            startIcon={isLoading ? <CircularProgress size={24} color="inherit" /> : null}
            sx={{ py: 1.5, textTransform: 'none', fontSize: '1.1rem' }} // Custom padding and font size
          >
            {isLoading ? 'Importing...' : 'Import Transactions'}
          </Button>
          {message && (
            <Alert
              severity={messageType || 'info'}
              sx={{ mt: 2, '& .MuiAlert-message': { flexGrow: 1 } }} // Allow message to take full width
            >
              {message}
            </Alert>
          )}
        </Stack>
      </form>
    </Box>
  );
}
export default Home;
