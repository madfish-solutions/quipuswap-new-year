import React, { FC } from 'react';

export const RulesText: FC = () => (
  <div className="rules-text">
    <h4 className="rules-title">Rules</h4>
    <div className="rules-point">1. To participate in the lottery, you need to stake 200 QUIPU</div>
    <div className="rules-point">2. Your stake will be frozen 24 hours</div>
    <div className="rules-point">
      3. The first 500 participants who will stake QUIPU receive our special NFT at once.
    </div>
    <div className="rules-point">
      4. A participant gets a chance to win: 70% - Common NFT, 20% - Rare NFT, 10% Epic NFT
    </div>
    <div className="rules-point">5. After 24 hours, your QUIPU will be claimable back.</div>
  </div>
);
