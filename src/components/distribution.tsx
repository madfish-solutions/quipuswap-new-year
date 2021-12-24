import React, { FC, useState } from 'react';

import { observer } from 'mobx-react';

import { useRootStore } from '../stores/use-root-store.hook';
import { TimeCountdown } from './time-countdown';

interface Props {
  distributionStarts: Date | null;
  nftTotalSupply: number | null;
  nftMaxSupply: number | null;
  isLoading: boolean;
  isUserClaim: boolean;
  isStakeAllow: boolean;
  onClaim: () => void;
}

export const Distribution: FC<Props> = observer(
  ({ distributionStarts, nftTotalSupply, nftMaxSupply, isLoading, isUserClaim, isStakeAllow, onClaim }) => {
    const { mainStore } = useRootStore();

    const [distributionLabel, setDistributionLabel] = useState<string | null>(distributionStarts ? null : 'Started');
    const [disabled, setDisabled] = useState(true);

    const handleDistributionTimerEnd = () => {
      setDistributionLabel('Started');
      setDisabled(false);
    };

    return (
      <div className="rules-logic">
        <div className="rules-logic_distribution-container">
          <div className="key-key">Distribution {distributionLabel}</div>
          <TimeCountdown timeTo={distributionStarts} onTimerEnd={handleDistributionTimerEnd} />
          <p>({mainStore.secondsPassed})</p>
          <button onClick={() => mainStore.increaseTimer()}>inc</button>
        </div>
        <div className="rules-logic_left-container">
          <div className="key-key">NFT Left:</div>
          <div className="key-value">
            {nftMaxSupply && nftTotalSupply !== null
              ? `${nftMaxSupply - nftTotalSupply}/${nftMaxSupply}`
              : `Loading...`}
          </div>
        </div>
        <button
          className="pretty-button"
          onClick={onClaim}
          disabled={!isStakeAllow || disabled || isLoading || isUserClaim}
          type="button"
        >
          {isLoading ? 'Loading...' : 'Claim'}
        </button>
      </div>
    );
  }
);
