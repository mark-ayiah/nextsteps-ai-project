import React from 'react';
import { motion } from 'framer-motion';
import FileUpload from '../components/FileUpload';
import '../styles/LandingPage.css';

const LandingPage = ({ onResumeUpload, isLoading }) => {
  return (
    <div className="landing-page">
      <div className="bg-shapes">
        <div className="bg-shape"></div>
        <div className="bg-shape"></div>
        <div className="bg-shape"></div>
      </div>
      
      <motion.div 
        className="hero-section"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <motion.h1 
          className="hero-title"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 1 }}
        >
          Find Your Perfect Career Path
        </motion.h1>
        
        <motion.p 
          className="hero-subtitle"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
        >
          Upload your resume and get instant, personalized job recommendations
        </motion.p>
        
        <motion.div 
          className="upload-container"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.7, duration: 0.8 }}
        >
          <FileUpload onResumeUpload={onResumeUpload} isLoading={isLoading} />
        </motion.div>
      </motion.div>
      
      <motion.div 
        className="features-section"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
      >
        <h2 className="section-title">How It Works</h2>
        
        <div className="features-grid">
          <motion.div 
            className="feature-card"
            whileHover={{ y: -5, boxShadow: "0 8px 25px rgba(0,0,0,0.1)" }}
          >
            <div className="feature-icon">
              <span className="icon">📄</span>
            </div>
            <h3>Upload Your Resume</h3>
            <p>Simply upload your resume in PDF or DOCX format</p>
          </motion.div>
          
          <motion.div 
            className="feature-card"
            whileHover={{ y: -5, boxShadow: "0 8px 25px rgba(0,0,0,0.1)" }}
          >
            <div className="feature-icon">
              <span className="icon">⚙️</span>
            </div>
            <h3>Smart Analysis</h3>
            <p>Our AI analyzes your skills, experience, and education</p>
          </motion.div>
          
          <motion.div 
            className="feature-card"
            whileHover={{ y: -5, boxShadow: "0 8px 25px rgba(0,0,0,0.1)" }}
          >
            <div className="feature-icon">
              <span className="icon">🎯</span>
            </div>
            <h3>Get Matched</h3>
            <p>See your top job matches with personalized fit scores</p>
          </motion.div>
          
          <motion.div 
            className="feature-card"
            whileHover={{ y: -5, boxShadow: "0 8px 25px rgba(0,0,0,0.1)" }}
          >
            <div className="feature-icon">
              <span className="icon">🚀</span>
            </div>
            <h3>Improve & Apply</h3>
            <p>Get suggestions to improve your resume for better matches</p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default LandingPage;
