import React, { FC } from 'react';
import { Box } from './box';

interface CardProps {
  src: string;
  alt: string;
  gridRow: string;
  gridColumn: string;
}

export const Card: FC<CardProps> = ({ src, alt, gridRow, gridColumn }) => {
  return (
    <Box gridRow={gridRow} gridColumn={gridColumn}>
      <div className="img-wrapper">
        <img className="card-img" src={src} alt={alt} />
      </div>
      <div className="card-description">
        <div className="card-description_row">
          <div className="card-key">Name:</div>
          <div className="card-value">Distribution Starts</div>
        </div>
        <div className="card-description_row">
          <div className="card-key">Rare:</div>
          <div className="card-value">14%</div>
        </div>
        <div className="card-description_row">
          <div className="card-key">Items:</div>
          <div className="card-value">100</div>
        </div>
      </div>
    </Box>
  );
};
