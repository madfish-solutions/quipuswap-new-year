import React, { FC } from 'react';

import { NftToken } from '../../interfaces/NftToken';
import { Box } from '../box';
import { Nft } from './nft';
import { NftData } from './nft-data';

export interface NftCardProps {
  token: NftToken;
}

export const Card: FC<NftCardProps> = ({ token }) => {
  const { name, thumbnailUri, description, rarity, quantity } = token;

  return (
    <div className="card">
      <Box>
        <Nft src={thumbnailUri} alt={name} description={description} />
        <NftData name={name} rarity={rarity} quantity={quantity} />
      </Box>
    </div>
  );
};
