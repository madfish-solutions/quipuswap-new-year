import { FC } from 'react';

import { Nullable } from '../utils/fp';

const getRarity = (rewardIndex: null | 0 | 1 | 2) => {
  switch (rewardIndex) {
    case 2:
      return 'You have minted Quipu Magician';
    case 1:
      return 'You have minted Quipu Hospitable Host';
    case 0:
      return 'You have minted Quipu Merry Fellow';
    default:
      return 'However, all the NFTs have been collected already.';
  }
};

interface WonNftProps {
  src: Nullable<string>;
  rarity: Nullable<0 | 1 | 2>;
}

export const WonNft: FC<WonNftProps> = ({ src, rarity }) => {
  return (
    <div className="won-nft">
      {src !== null && <img src={src} alt="won nft" />}
      <div style={{ textAlign: 'center' }}>
        <h3 style={{ marginTop: 8 }}>
          Congratulations! <br />
          Your stake was successful!
        </h3>
        <p>{getRarity(rarity)}!</p>
      </div>
    </div>
  );
};
