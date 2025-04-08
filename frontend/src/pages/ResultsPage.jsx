import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import JobMatchResults from '../components/JobMatchResults';
import ResumeSuggestions from '../components/ResumeSuggestions';
import LoadingAnimation from '../components/LoadingAnimation';
import '../styles/ResultsPage.css';

const ResultsPage = ({ resumeData, jobMatches, resumeSuggestions, isLoading }) => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // If there's no resume data and we're not loading, redirect to the landing page
    if (!resumeData && !isLoading) {
      navigate('/');
    }
  }, [resumeData, isLoading, navigate]);
  
  if (isLoading) {
    return (
      <div className="loading-overlay">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <svg width="100" height="100" viewBox="0 0 100 100">
            <motion.circle
              cx="50"
              cy="50"
              r="40"
              stroke="url(#gradient)"
              strokeWidth="4"
              fill="none"
              strokeDasharray="251"
              initial={{ strokeDashoffset: 251 }}
              animate={{ 
                strokeDashoffset: 0,
                rotate: 360
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: "linear"
              }}
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#6e3adc" />
                <stop offset="100%" stopColor="#3ae8dc" />
              </linearGradient>
            </defs>
          </svg>
        </motion.div>
        <div className="loading-text">Analyzing your resume...</div>
      </div>
    );
  }
  
  if (!resumeData) {
    return null; // This is just to prevent rendering before redirect
  }
  
  return (
    <div className="results-page">
      <div className="bg-shapes">
        <div className="bg-shape"></div>
        <div className="bg-shape"></div>
        <div className="bg-shape"></div>
      </div>
      
      <motion.div
        className="results-container"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <motion.div
          className="results-header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          <h1>Your Job Match Results</h1>
          <p className="results-subtitle">
            Based on your resume, we've found {jobMatches.length} potential job matches for you
          </p>
        </motion.div>
        
        <div className="results-content">
          <motion.div
            className="results-column main-column"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            <JobMatchResults jobMatches={jobMatches} resumeData={resumeData} />
          </motion.div>
          
          <motion.div
            className="results-column sidebar-column"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <ResumeSuggestions suggestions={resumeSuggestions} resumeData={resumeData} />
          </motion.div>
        </div>
        
        <motion.div
          className="results-footer"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
        >
          <button
            className="btn btn-secondary"
            onClick={() => navigate('/')}
          >
            Upload New Resume
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ResultsPage;