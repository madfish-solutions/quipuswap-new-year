import React, { FC } from 'react';

export const RulesText: FC = () => (
  <div className="rules-text">
    <h4 className="rules-title">Rules</h4>
    <div className="rules-point">1. To&nbsp;participate in&nbsp;the lottery, you need to&nbsp;stake 100&nbsp;QUIPU</div>
    <div className="rules-point">2. Your stake will be&nbsp;frozen 24&nbsp;hours.</div>
    <div className="rules-point">
      3. The first 500 participants who will stake QUIPU receive our special NFT at&nbsp;once.
    </div>
    <div className="rules-point">
      4. A&nbsp;participant gets a&nbsp;chance to&nbsp;win: <span className="nobr">70%&nbsp;&mdash; Common NFT,</span>{' '}
      <span className="nobr">20%&nbsp;&mdash; Rare NFT,</span> <span className="nobr">10% Epic NFT.</span>
    </div>
    <div className="rules-point">5. After 24&nbsp;hours, your QUIPU will be&nbsp;claimable back.</div>
  </div>
);
