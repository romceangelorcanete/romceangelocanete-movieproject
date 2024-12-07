import React from 'react';
import './LoadingSpinner.css';

function LoadingSpinner() {
  return (
    <div className="loading-container">
      <div className="loading-spinner"></div>
      Loading movie details...
    </div>
  );
}

export default LoadingSpinner;