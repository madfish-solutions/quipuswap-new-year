import { FC } from 'react';

export interface NftProps {
  src: string;
  alt: string;
  discription: string;
}

export const Nft: FC<NftProps> = ({ src, alt, discription }) => {
  return (
    <div className="img-wrapper">
      <div className="nft-card">
        <div className="front">
          <img className="card-img" src={src} alt={alt} />
        </div>
        <div className="back">
          <div className="nft-description">{discription}</div>
        </div>
      </div>
    </div>
  );
};
