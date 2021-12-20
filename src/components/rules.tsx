import React from 'react';

import { Box } from './box';

export const Rules = () => {
  return (
    <Box gridRow="3/-1" gridColumn="1/3">
      <div className="rules-wrapper">
        <div className="rules-text">
          <h4 className="rules-title">Rules</h4>
          <div className="rules-point">
            1. QuipuSwap is a great entry point to research the Tezos ecosystem, swap any FA1.2-FA2 tokens.
          </div>
          <div className="rules-point">
            2. QuipuSwap is a great entry point to research the Tezos ecosystem, swap any FA1.2-FA2 tokens.
          </div>
          <div className="rules-point">
            3. QuipuSwap is a great entry point to research the Tezos ecosystem, swap any FA1.2-FA2 tokens.
          </div>
        </div>
        <div className="rules-logic">
          <div>
            <div>Distribution Starts in:</div>
            <div>23h 59m 59s</div>
          </div>
          <div>
            <div>NFT Left:</div>
            <div>99/100</div>
          </div>
          <button>Claim</button>
        </div>
      </div>
    </Box>
  );
};
