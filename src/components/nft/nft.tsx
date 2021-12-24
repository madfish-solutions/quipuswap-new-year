import { FC } from 'react';

export interface NftProps {
  src: string | null;
  alt: string | null;
  description: string | null;
}

export const Nft: FC<NftProps> = ({ src, alt, description }) => {
  return (
    <div className="img-wrapper">
      <div className="nft-card">
        <div className="front">{src && alt && <img className="card-img" src={src} alt={alt} />}</div>
        <div className="back">
          <div className="nft-description">{description}</div>
        </div>
      </div>
    </div>
  );
};
