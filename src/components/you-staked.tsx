import { FC } from 'react';

import BigNumber from 'bignumber.js';

import { showBalance } from '../utils/balances';
import { Box } from './box';
import { TimeCountdown } from './time-countdown';

interface Props {
  stakeAmount: BigNumber | null;
  stakedTo: Date | null;
  onUnstake: () => void;
}

export const YouStacked: FC<Props> = ({ stakeAmount, stakedTo, onUnstake }) => {
  const disabled = !stakedTo || stakedTo > new Date();

  return (
    <Box>
      <div className="you-staked_wrapper">
        <div className="you-staked">
          <div className="you-staked_amount-container">
            <div className="key-key">You Staked:</div>
            <div className="key-value">{!disabled && stakeAmount ? `${showBalance(stakeAmount)} QUIPU` : '--'}</div>
          </div>
          <div className="you-staked_countdown-container">
            <div className="key-key">Lock countdown:</div>
            <div className="key-value">{disabled && <TimeCountdown timeTo={stakedTo} />}</div>
          </div>
          <button className="pretty-button" disabled={disabled} onClick={onUnstake}>
            Unstake
          </button>
        </div>
      </div>
    </Box>
  );
};
