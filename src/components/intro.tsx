import { FC } from 'react';

import { Year } from 'components/icons/2022';

import { BlueStar } from './stars/blue-star';
import { OrangeStar } from './stars/orange-star';

export const Intro: FC = () => {
  return (
    <div className="intro">
      <div className="intro-title-container">
        <Year />
        <div className="starsBox">
          <div className="blue-star-box">
            <BlueStar top="60%" left="50%" size={14} />
          </div>
          <div className="orange-star-box">
            <OrangeStar top="60%" left="50%" size={14} />
          </div>
        </div>
      </div>
      <h3 className="intro-description">QuipuSwap Christmas NFT Distribution</h3>
    </div>
  );
};
