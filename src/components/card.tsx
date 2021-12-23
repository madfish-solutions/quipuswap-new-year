import React, { FC } from 'react';

import { Box } from './box';
import { Nft, NftProps } from './nft';

interface NftCardDiscription {
  name: string;
  rarity: string;
  quantity: string;
}

interface NftCardProps extends NftProps {
  nftData?: NftCardDiscription;
}

export const Card: FC<NftCardProps> = ({ src, alt, discription }) => {
  return (
    <div className="card">
      <Box>
        <Nft src={src} alt={alt} discription={discription} />
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
    </div>
  );
};
