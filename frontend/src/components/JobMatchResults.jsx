import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MatchChart from './MatchChart';
import '../styles/JobMatchResults.css';

const JobMatchResults = ({ jobMatches, resumeData }) => {
  const [expandedJob, setExpandedJob] = useState(null);
  
  // Sort job matches by score in descending order
  const sortedMatches = [...jobMatches].sort((a, b) => b.score - a.score);
  // Get top 3 matches
  const topMatches = sortedMatches.slice(0, 3);
  
  const toggleExpand = (jobId) => {
    if (expandedJob === jobId) {
      setExpandedJob(null);
    } else {
      setExpandedJob(jobId);
    }
  };
  
  // Helper function to highlight matching keywords in text
  const highlightMatches = (text, keywords) => {
    if (!keywords || !keywords.length) return text;
    
    // Create a regex pattern with all keywords joined by |
    const pattern = new RegExp(`(${keywords.join('|')})`, 'gi');
    
    // Split the text by the pattern and create an array of parts and matches
    const parts = text.split(pattern);
    
    return parts.map((part, index) => {
      // Check if the part matches any keyword (case insensitive)
      const isMatch = keywords.some(keyword => 
        part.toLowerCase() === keyword.toLowerCase()
      );
      
      return isMatch ? (
        <span key={index} className="highlight">{part}</span>
      ) : (
        <span key={index}>{part}</span>
      );
    });
  };
  
  return (
    <div className="job-match-results">
      <h2 className="section-title">Your Top Matches</h2>
      
      <div className="match-chart-container">
        <MatchChart matches={topMatches} />
      </div>
      
      <div className="job-cards-container">
        {topMatches.map((job, index) => (
          <motion.div
            key={job.id}
            className={`job-card ${expandedJob === job.id ? 'expanded' : ''}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2, duration: 0.5 }}
            whileHover={{ y: -5 }}
            layoutId={`job-card-${job.id}`}
          >
            <div className="job-card-header">
              <div className="job-score-badge">
                <motion.div 
                  className="score-chart"
                  initial={{ strokeDashoffset: 283 }}
                  animate={{ 
                    strokeDashoffset: 283 - (283 * job.score / 100) 
                  }}
                  transition={{ duration: 1.5, delay: index * 0.2 }}
                >
                  <svg width="60" height="60" viewBox="0 0 60 60">
                    <circle 
                      className="score-bg" 
                      cx="30" 
                      cy="30" 
                      r="25" 
                      strokeWidth="5" 
                      fill="none" 
                    />
                    <circle 
                      className="score-fill" 
                      cx="30" 
                      cy="30" 
                      r="25" 
                      strokeWidth="5" 
                      fill="none" 
                      strokeDasharray="157" 
                      strokeDashoffset="0" 
                      strokeLinecap="round" 
                    />
                    <text 
                      x="30" 
                      y="35" 
                      textAnchor="middle" 
                      className="score-text"
                    >
                      {Math.round(job.score)}%
                    </text>
                  </svg>
                </motion.div>
              </div>
              
              <div className="job-title-info">
                <h3 className="job-title">{job.title}</h3>
                <p className="job-company">{job.company}</p>
                <div className="job-details">
                  <span className="job-location">{job.location}</span>
                  <span className="job-experience">{job.experienceLevel}</span>
                </div>
              </div>
              
              <button 
                className="expand-btn"
                onClick={() => toggleExpand(job.id)}
                aria-label={expandedJob === job.id ? "Collapse job details" : "Expand job details"}
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="24" 
                  height="24" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                  className={expandedJob === job.id ? 'expanded' : ''}
                >
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </button>
            </div>
            
            <AnimatePresence>
              {expandedJob === job.id && (
                <motion.div 
                  className="job-card-details"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="job-description">
                    <h4>Job Description</h4>
                    <p>{highlightMatches(job.description, job.matchingKeywords)}</p>
                  </div>
                  
                  <div className="matching-criteria">
                    <h4>Matching Criteria</h4>
                    <div className="match-categories">
                      <div className="match-category">
                        <div className="category-label">Skills</div>
                        <div className="match-bar-container">
                          <motion.div 
                            className="match-bar"
                            initial={{ width: 0 }}
                            animate={{ width: `${job.categoryScores.skills}%` }}
                            transition={{ duration: 1 }}
                          ></motion.div>
                          <span className="match-percentage">{Math.round(job.categoryScores.skills)}%</span>
                        </div>
                      </div>
                      
                      <div className="match-category">
                        <div className="category-label">Experience</div>
                        <div className="match-bar-container">
                          <motion.div 
                            className="match-bar"
                            initial={{ width: 0 }}
                            animate={{ width: `${job.categoryScores.experience}%` }}
                            transition={{ duration: 1 }}
                          ></motion.div>
                          <span className="match-percentage">{Math.round(job.categoryScores.experience)}%</span>
                        </div>
                      </div>
                      
                      <div className="match-category">
                        <div className="category-label">Education</div>
                        <div className="match-bar-container">
                          <motion.div 
                            className="match-bar"
                            initial={{ width: 0 }}
                            animate={{ width: `${job.categoryScores.education}%` }}
                            transition={{ duration: 1 }}
                          ></motion.div>
                          <span className="match-percentage">{Math.round(job.categoryScores.education)}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="keyword-matches">
                    <h4>Matching Keywords</h4>
                    <div className="keyword-tags">
                      {job.matchingKeywords.map((keyword, i) => (
                        <span key={i} className="keyword-tag matching">{keyword}</span>
                      ))}
                    </div>
                    
                    <h4 className="mt-3">Missing Keywords</h4>
                    <div className="keyword-tags">
                      {job.missingKeywords.map((keyword, i) => (
                        <span key={i} className="keyword-tag missing">{keyword}</span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="job-card-actions">
                    <button className="btn btn-primary">Apply Now</button>
                    <button className="btn btn-secondary">Save Job</button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default JobMatchResults;