import React, { useState } from 'react';
import FileUploader from './components/FileUploader';
import './App.css';

const App: React.FC = () => {
  const [uploadStatus, setUploadStatus] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const [uploadedData, setUploadedData] = useState<Record<string, any>[]>([]);

  const handleUploadComplete = (status: {
    success: boolean;
    message: string;
    data?: any[];
  }) => {
    setUploadStatus({ success: status.success, message: status.message });

    if (status.success && status.data) {
      setUploadedData(status.data); // Update the state with the received data
    }
  };

  return (
    <div  style={{ padding: '20px' }}>
      <p>Add Candidates to Data Base</p>
      {!uploadStatus?.success && (
        <FileUploader onUploadComplete={handleUploadComplete} />
      )}

      {uploadStatus && uploadStatus.success && (
        <div 
          className="thank-you-message" 
          style={{
            backgroundColor: '#e6ffe6',
            padding: '15px',
            borderRadius: '5px',
            textAlign: 'center',
            margin: '20px 0',
            border: '1px solid #b2d8b2',
            color: '#2b8a2b',
          }}
        >
          <h2>Thank you!</h2>
          <p>{uploadStatus.message}</p>
        </div>
      )}

    </div>
  );
};

export default App;
