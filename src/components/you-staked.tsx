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
          <div>
            <div>You Staked:</div>
            <div>{stakeAmount ? `${showBalance(stakeAmount)} QUIPU` : 'Loading...'}</div>
          </div>
          <div>
            <div>Lock countdown:</div>
            <div>{disabled && stakedTo ? stakedTo?.toISOString() : '--.--.--'}</div>
          </div>
          <button className="pretty-button" disabled={disabled}>
            Unstake
          </button>
        </div>
      </div>
    </Box>
  );
};
