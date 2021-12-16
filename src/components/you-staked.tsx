import React from 'react';
import { Box } from './box';

export const YouStacked = () => {
  return (
    <Box gridRow="3/-1" gridColumn="3/-1">
      <div className="you-staked">
        <div>
          <div>You Staked:</div>
          <div>200.00 QUIPU</div>
        </div>
        <div>
          <div>Lock countdown:</div>
          <div>--.--.--</div>
        </div>
        <button>Unstake</button>
      </div>
    </Box>
  );
};
