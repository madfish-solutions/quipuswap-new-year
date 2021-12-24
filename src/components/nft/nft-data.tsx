import { FC } from 'react';

export interface NftDataProps {
  name: string | null;
  rarity: string | null;
  quantity: string | null;
}
export const NftData: FC<NftDataProps> = ({ name, rarity, quantity }) => {
  return (
    <div className="card-description">
      <div className="card-description_row">
        <div className="card-key">Name:</div>
        <div className="card-value">{name}</div>
      </div>
      <div className="card-description_row">
        <div className="card-key">Rarity:</div>
        <div className="card-value">{rarity}</div>
      </div>
      <div className="card-description_row">
        <div className="card-key">Items:</div>
        <div className="card-value">{quantity}</div>
      </div>
    </div>
  );
};
