import { FC } from 'react';

interface WonNftProps {
  src: string;
  rarity: string;
}

export const WonNft: FC<WonNftProps> = ({ src, rarity }) => {
  return (
    <div className="won-nft">
      <img src={src} alt="won nft" />
      <div style={{ textAlign: 'center' }}>Congratulations! You have {rarity} NFT!</div>
    </div>
  );
};
