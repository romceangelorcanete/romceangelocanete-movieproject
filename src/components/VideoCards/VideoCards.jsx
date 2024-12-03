import React from 'react';
import './VideoCards.css';

function VideoCards({ video }) {
  return (
    <div className="card-video-data">
      <div className="video-wrapper">
        <iframe
          src={video.url}
          title="video-movie"
          allowFullScreen
          frameBorder="0"
        />
      </div>
      <span className="video-name-card">{video.name}</span>
    </div>
  );
}

export default VideoCards;
