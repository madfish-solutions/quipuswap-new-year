import React, { FC, useState } from 'react';

import { observer } from 'mobx-react';

import { useStores } from '../stores/use-stores.hook';
import { TimeCountdown } from './time-countdown';

export const Distribution: FC = observer(() => {
  const { distributorStore, nftStore, qsTokenStore } = useStores();

  const [distributionLabel, setDistributionLabel] = useState<string | null>(
    distributorStore.distributionStarts ? null : 'Started'
  );
  const [disabled, setDisabled] = useState(true);

  const handleDistributionTimerEnd = () => {
    setDistributionLabel('Started');
    setDisabled(false);
  };

  const handleClaim = async () => {
    await qsTokenStore.stakeForNft();
  };

  const isLoading = qsTokenStore.isLoading;

  return (
    <div className="rules-logic">
      <div className="rules-logic_distribution-container">
        <div className="key-key">Distribution {distributionLabel}</div>
        <TimeCountdown timeTo={distributorStore.distributionStarts} onTimerEnd={handleDistributionTimerEnd} />
      </div>
      <div className="rules-logic_left-container">
        <div className="key-key">NFT Left:</div>
        <div className="key-value">
          {nftStore.maxSupply && nftStore.totalSupply !== null
            ? `${nftStore.maxSupply - nftStore.totalSupply}/${nftStore.maxSupply}`
            : `Loading...`}
        </div>
      </div>
      <button
        className="pretty-button"
        onClick={handleClaim}
        disabled={!distributorStore.isStakeAllow || disabled || isLoading || Boolean(distributorStore.userClaim)}
        type="button"
      >
        {isLoading ? 'Loading...' : 'Claim'}
      </button>
    </div>
  );
});
