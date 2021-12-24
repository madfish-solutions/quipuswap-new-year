import React, { FC } from 'react';

import { Box } from '../box';
import { Nft, NftProps } from './nft';
import { NftData, NftDataProps } from './nft-data';

export interface NftCardProps extends NftProps {
  nftData: NftDataProps;
}

export const Card: FC<NftCardProps> = ({ src, alt, description, nftData }) => {
  return (
    <div className="card">
      <Box>
        <Nft src={src} alt={alt} description={description} />
        <NftData {...nftData} />
      </Box>
    </div>
  );
};
