import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';

interface FileUploaderProps {
  onUploadComplete: (status: { success: boolean; message: string; data?: any[] }) => void;
}

const FileUploader: React.FC<FileUploaderProps> = ({ onUploadComplete }) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const formData = new FormData();
    formData.append('file', acceptedFiles[0]);

    axios.post('http://localhost:5000/api/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    .then(response => {
      onUploadComplete({
        success: true, 
        message: response.data.message || 'File uploaded successfully',
        data: response.data.allData // Pass the entire data to the parent
      });
    })
    .catch(error => {
      onUploadComplete({
        success: false, 
        message: error.response?.data?.message || 'Upload failed'
      });
    });
  }, [onUploadComplete]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div 
      {...getRootProps()} 
      style={{
        border: '2px dashed #cccccc',
        borderRadius: '4px',
        padding: '20px',
        textAlign: 'center',
        cursor: 'pointer'
      }}
    >
      <input {...getInputProps()} />
      {
        isDragActive ?
          <p>Drop the files here ...</p> :
          <p>Drag 'n' drop an Excel file here, or click to select</p>
      }
    </div>
  );
};

export default FileUploader;
