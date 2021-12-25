import React, { FC, useCallback, useState } from 'react';

import { observer } from 'mobx-react';

import { useStores } from '../stores/use-stores.hook';
import { showBalance } from '../utils/balances';
import { Box } from './box';
import { TimeCountdown } from './time-countdown';

export const YouStacked: FC = observer(() => {
  const { distributorStore } = useStores();

  const [disabled, setDisabled] = useState(
    !distributorStore.userStakedTo || distributorStore.userStakedTo > new Date()
  );

  const handleLockTimerEnd = useCallback(() => {
    setDisabled(false);
  }, []);

  const handleUnstake = async () => {
    await distributorStore.withdraw();
  };

  return (
    <Box>
      <div className="you-staked_wrapper">
        <div className="you-staked">
          <div className="you-staked_amount-container">
            <div className="key-key">You Staked:</div>
            <div className="key-value">
              {distributorStore.stakeAmount && distributorStore.stakeAmount.gte(0)
                ? `${showBalance(distributorStore.stakeAmount)} QUIPU`
                : '--'}
            </div>
          </div>
          <div className="you-staked_countdown-container">
            <div className="key-key">Lock countdown:</div>
            <div className="key-value">
              <TimeCountdown timeTo={distributorStore.userStakedTo} onTimerEnd={handleLockTimerEnd} />
            </div>
          </div>
          <button className="pretty-button" disabled={disabled} onClick={handleUnstake}>
            {distributorStore.isLoading ? 'Loading...' : 'Unstake'}
          </button>
        </div>
      </div>
    </Box>
  );
});
