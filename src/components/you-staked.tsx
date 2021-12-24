import { FC, useCallback, useState } from 'react';

import BigNumber from 'bignumber.js';

import { showBalance } from '../utils/balances';
import { Box } from './box';
import { TimeCountdown } from './time-countdown';

interface Props {
  stakeAmount: BigNumber | null;
  stakedTo: Date | null;
  isLoading: boolean;
  onUnstake: () => void;
}

export const YouStacked: FC<Props> = ({ stakeAmount, stakedTo, onUnstake, isLoading }) => {
  const [disabled, setDisabled] = useState(!stakedTo || stakedTo > new Date());

  const handleLockTimerEnd = useCallback(() => {
    setDisabled(false);
  }, []);

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
            <div className="key-value">
              <TimeCountdown timeTo={stakedTo} onTimerEnd={handleLockTimerEnd} />
            </div>
          </div>
          <button className="pretty-button" disabled={disabled} onClick={onUnstake}>
            {isLoading ? 'Loading...' : 'Unstake'}
          </button>
        </div>
      </div>
    </Box>
  );
};
