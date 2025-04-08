import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import ResultsPage from './pages/ResultsPage';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import './styles/index.css';

function App() {
  const [resumeData, setResumeData] = useState(null);
  const [jobMatches, setJobMatches] = useState([]);
  const [resumeSuggestions, setResumeSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Function to handle resume upload and processing
  const handleResumeUpload = async (file) => {
    setIsLoading(true);
    
    // Create form data for file upload
    const formData = new FormData();
    formData.append('resume', file);
    
    try {
      // Send file to backend for processing
      const response = await fetch('http://localhost:5000/api/process-resume', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Failed to process resume');
      }
      
      const data = await response.json();
      
      // Update state with processed data
      setResumeData(data.resumeData);
      setJobMatches(data.jobMatches);
      setResumeSuggestions(data.suggestions);
      setIsLoading(false);
      
      // Navigate to results page (handled in the FileUpload component)
      
    } catch (error) {
      console.error('Error processing resume:', error);
      setIsLoading(false);
      // Handle error - could set an error state here
    }
  };

  return (
    <Router>
      <div className="app">
        <Navbar />
        <div className="app-content">
          <Routes>
            <Route 
              path="/" 
              element={<LandingPage onResumeUpload={handleResumeUpload} isLoading={isLoading} />} 
            />
            <Route 
              path="/results" 
              element={
                <ResultsPage 
                  resumeData={resumeData} 
                  jobMatches={jobMatches}
                  resumeSuggestions={resumeSuggestions}
                  isLoading={isLoading}
                />
              } 
            />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;