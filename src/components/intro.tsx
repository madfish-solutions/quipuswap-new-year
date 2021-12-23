import React from 'react';
import { BlueStar } from './stars/blue-star';
import { OrangeStar } from './stars/orange-star';

export const Intro = () => {
  return (
    <div className="intro">
      <div className="intro-title-container">
        <h1 className="intro-title">2022</h1>
        <div className="starsBox">
          <div className="blue-star-box">
            <BlueStar top="60%" left="50%" size={14} />
          </div>
          <div className="orange-star-box">
            <OrangeStar top="60%" left="50%" size={14} />
          </div>
        </div>
      </div>
      <h3 className="intro-description">NEW YEAR DISTRIBUTION</h3>
    </div>
  );
};
