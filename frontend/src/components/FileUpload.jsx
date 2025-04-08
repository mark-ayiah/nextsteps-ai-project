import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import LoadingAnimation from './LoadingAnimation';
import '../styles/FileUpload.css';

const FileUpload = ({ onResumeUpload, isLoading }) => {
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    validateAndSetFile(selectedFile);
  };
  
  const validateAndSetFile = (selectedFile) => {
    setError('');
    
    if (!selectedFile) return;
    
    const fileType = selectedFile.type;
    const validTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword'
    ];
    
    if (!validTypes.includes(fileType)) {
      setError('Please upload a PDF or Word (.docx) file');
      setFile(null);
      return;
    }
    
    if (selectedFile.size > 5 * 1024 * 1024) {
      setError('File size should be less than 5MB');
      setFile(null);
      return;
    }
    
    setFile(selectedFile);
  };
  
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = () => {
    setIsDragging(false);
  };
  
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFile = e.dataTransfer.files[0];
    validateAndSetFile(droppedFile);
  };
  
  const handleUploadClick = () => {
    fileInputRef.current.click();
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!file) {
      setError('Please select a file to upload');
      return;
    }
    
    try {
      await onResumeUpload(file);
      navigate('/results');
    } catch (error) {
      console.error('Error submitting resume:', error);
      setError('Failed to process resume. Please try again.');
    }
  };
  
  return (
    <div className="file-upload-container">
      <form onSubmit={handleSubmit}>
        <motion.div 
          className={`drop-zone ${isDragging ? 'dragging' : ''} ${file ? 'has-file' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          whileHover={{ boxShadow: "0 0 15px rgba(58, 232, 220, 0.3)" }}
        >
          <input 
            type="file" 
            ref={fileInputRef}
            className="file-input" 
            onChange={handleFileChange}
            accept=".pdf,.docx,.doc"
          />
          
          <div className="upload-content">
            {!file ? (
              <>
                <div className="upload-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="17 8 12 3 7 8"></polyline>
                    <line x1="12" y1="3" x2="12" y2="15"></line>
                  </svg>
                </div>
                <h3>Drag & Drop Your Resume</h3>
                <p>or</p>
                <button type="button" className="btn btn-secondary" onClick={handleUploadClick}>
                  Browse Files
                </button>
                <p className="file-format">Supported formats: PDF, DOCX</p>
              </>
            ) : (
              <>
                <div className="file-preview">
                  <div className="file-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                      <polyline points="14 2 14 8 20 8"></polyline>
                      <line x1="16" y1="13" x2="8" y2="13"></line>
                      <line x1="16" y1="17" x2="8" y2="17"></line>
                    </svg>
                  </div>
                  <div className="file-info">
                    <p className="file-name">{file.name}</p>
                    <p className="file-size">{(file.size / 1024).toFixed(2)} KB</p>
                  </div>
                  <button 
                    type="button" 
                    className="remove-file-btn"
                    onClick={() => setFile(null)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </button>
                </div>
              </>
            )}
          </div>
        </motion.div>
        
        {error && <p className="error-message">{error}</p>}
        
        <motion.button 
          type="submit" 
          className="btn btn-primary submit-btn"
          disabled={!file || isLoading}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
        >
          {isLoading ? (
            <LoadingAnimation />
          ) : (
            'Analyze Resume & Find Matches'
          )}
        </motion.button>
      </form>
    </div>
  );
};

export default FileUpload;