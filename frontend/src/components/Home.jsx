import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success' or 'error'
  const navigate = useNavigate();

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

    try {
      const response = await fetch('http://localhost:4000/upload', {
        method: 'POST',
        body: formData,
      });

      const responseData = await response.json();

      if (response.ok) {
        setMessage(`Successfully imported ${responseData.imported} rows.`);
        setMessageType('success');
        // Optionally clear file input after successful upload
        // event.target.reset(); // This might be tricky if input is not part of form directly
        setSelectedFile(null); // Clear selected file state
        if (document.getElementById('fileInput')) {
            document.getElementById('fileInput').value = null; // Attempt to clear file input visually
        }


        // Navigate to data view page after a short delay to show message
        setTimeout(() => {
          navigate('/data');
        }, 1500);
      } else {
        let errorMessage = `Upload failed: ${response.statusText}`;
        if (responseData && responseData.message) {
          errorMessage = responseData.message;
        } else if (responseData && responseData.errors && responseData.errors.length > 0) {
          errorMessage = responseData.errors.map(err => `${err.message || err.code} (Row: ${err.row})`).join(', ');
        } else if (responseData && responseData.error) { // Handle cases where error is a simple string
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
    <div>
      <h2>Upload Transactions CSV</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <input
            id="fileInput"
            type="file"
            accept=".csv"
            onChange={handleFileChange}
          />
        </div>
        <button type="submit">Import Transactions</button>
      </form>
      {message && (
        <div className={`message-area ${messageType}`}>
          {message}
        </div>
      )}
    </div>
  );
}

export default Home;
