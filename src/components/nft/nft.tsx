import { FC } from 'react';

export interface NftProps {
  src: string;
  alt: string;
  description: string;
}

export const Nft: FC<NftProps> = ({ src, alt, description }) => {
  return (
    <div className="img-wrapper">
      <div className="nft-card">
        <div className="front">
          <img className="card-img" src={src} alt={alt} />
        </div>
        <div className="back">
          <div className="nft-description">{description}</div>
        </div>
      </div>
    </div>
  );
};
