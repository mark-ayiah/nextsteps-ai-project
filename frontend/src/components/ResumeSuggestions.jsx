import React from 'react';
import { motion } from 'framer-motion';
import '../styles/ResumeSuggestions.css';

const ResumeSuggestions = ({ suggestions, resumeData }) => {
  if (!suggestions || !suggestions.length) {
    return (
      <div className="resume-suggestions">
        <h2 className="section-title">Resume Feedback</h2>
        <p className="no-suggestions">No suggestions available at this time.</p>
      </div>
    );
  }
  
  // Group suggestions by category
  const categorizedSuggestions = {
    skills: suggestions.filter(s => s.category === 'skills'),
    experience: suggestions.filter(s => s.category === 'experience'),
    education: suggestions.filter(s => s.category === 'education'),
    formatting: suggestions.filter(s => s.category === 'formatting'),
  };
  
  // Get the count of suggestions by priority
  const highPriority = suggestions.filter(s => s.priority === 'high').length;
  const mediumPriority = suggestions.filter(s => s.priority === 'medium').length;
  const lowPriority = suggestions.filter(s => s.priority === 'low').length;
  
  return (
    <div className="resume-suggestions">
      <h2 className="section-title">Resume Feedback</h2>
      
      <div className="resume-summary-card">
        <h3>Resume Analysis</h3>
        
        <div className="summary-stats">
          <div className="stat-item">
            <div className="stat-value">{resumeData.skills.length}</div>
            <div className="stat-label">Skills</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">{resumeData.experience.length}</div>
            <div className="stat-label">Jobs</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">{resumeData.education.length}</div>
            <div className="stat-label">Education</div>
          </div>
        </div>
        
        <div className="suggestion-priority-summary">
          <h4>Improvements Needed</h4>
          
          <div className="priority-bars">
            <div className="priority-item">
              <div className="priority-label">
                <span className="priority-dot high"></span>
                <span>High Priority</span>
              </div>
              <div className="priority-bar-container">
                <motion.div 
                  className="priority-bar high"
                  initial={{ width: 0 }}
                  animate={{ width: `${(highPriority / suggestions.length) * 100}%` }}
                  transition={{ duration: 1 }}
                ></motion.div>
                <span className="priority-count">{highPriority}</span>
              </div>
            </div>
            
            <div className="priority-item">
              <div className="priority-label">
                <span className="priority-dot medium"></span>
                <span>Medium Priority</span>
              </div>
              <div className="priority-bar-container">
                <motion.div 
                  className="priority-bar medium"
                  initial={{ width: 0 }}
                  animate={{ width: `${(mediumPriority / suggestions.length) * 100}%` }}
                  transition={{ duration: 1 }}
                ></motion.div>
                <span className="priority-count">{mediumPriority}</span>
              </div>
            </div>
            
            <div className="priority-item">
              <div className="priority-label">
                <span className="priority-dot low"></span>
                <span>Low Priority</span>
              </div>
              <div className="priority-bar-container">
                <motion.div 
                  className="priority-bar low"
                  initial={{ width: 0 }}
                  animate={{ width: `${(lowPriority / suggestions.length) * 100}%` }}
                  transition={{ duration: 1 }}
                ></motion.div>
                <span className="priority-count">{lowPriority}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="suggestions-list">
        {Object.entries(categorizedSuggestions).map(([category, categorySuggestions]) => (
          categorySuggestions.length > 0 && (
            <motion.div 
              key={category}
              className="suggestion-category"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h3 className="category-title">
                {category.charAt(0).toUpperCase() + category.slice(1)} Suggestions
              </h3>
              
              {categorySuggestions.map((suggestion, index) => (
                <motion.div 
                  key={index}
                  className={`suggestion-item priority-${suggestion.priority}`}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.3 }}
                  whileHover={{ x: 5 }}
                >
                  <div className="suggestion-priority">
                    <span className={`priority-indicator ${suggestion.priority}`}></span>
                  </div>
                  <div className="suggestion-content">
                    <p>{suggestion.text}</p>
                    {suggestion.example && (
                      <div className="suggestion-example">
                        <span>Example:</span> {suggestion.example}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )
        ))}
      </div>
      
      <div className="suggestions-actions">
        <button className="btn btn-primary">Download Full Report</button>
      </div>
    </div>
  );
};

export default ResumeSuggestions;