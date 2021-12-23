import { FC } from 'react';

import BigNumber from 'bignumber.js';

import { showBalance } from '../utils/balances';
import { Box } from './box';

interface Props {
  stakeAmount: BigNumber | null;
  stakedTo: Date | null;
}

export const YouStacked: FC<Props> = ({ stakeAmount, stakedTo }) => {
  const disabled = !stakedTo || stakedTo > new Date();

  return (
    <Box>
      <div className="you-staked_wrapper">
        <div className="you-staked">
          <div className="you-staked_amount-container">
            <div className="key-key">You Staked:</div>
            <div className="key-value">{stakeAmount ? `${showBalance(stakeAmount)} QUIPU` : 'Loading...'}</div>
          </div>
          <div className="you-staked_countdown-container">
            <div className="key-key">Lock countdown:</div>
            <div className="key-value">{disabled && stakedTo ? stakedTo?.toISOString() : '--.--.--'}</div>
          </div>
          <button className="pretty-button" disabled={disabled}>
            Unstake
          </button>
        </div>
      </div>
    </Box>
  );
};
