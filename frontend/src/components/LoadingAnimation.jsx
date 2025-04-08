import React from 'react';
import { motion } from 'framer-motion';
import '../styles/LoadingAnimation.css';

const LoadingAnimation = () => {
  return (
    <div className="loading-container">
      <div className="loading-text">Processing</div>
      <div className="dots-container">
        <motion.div 
          className="dot"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [1, 0.8, 1]
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            repeatType: "loop",
            ease: "easeInOut",
            times: [0, 0.5, 1]
          }}
        />
        <motion.div 
          className="dot"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [1, 0.8, 1]
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            repeatType: "loop",
            ease: "easeInOut",
            times: [0, 0.5, 1],
            delay: 0.2
          }}
        />
        <motion.div 
          className="dot"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [1, 0.8, 1]
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            repeatType: "loop",
            ease: "easeInOut",
            times: [0, 0.5, 1],
            delay: 0.4
          }}
        />
      </div>
    </div>
  );
};

export default LoadingAnimation;