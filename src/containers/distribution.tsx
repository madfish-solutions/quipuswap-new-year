import React, { FC, useState } from 'react';

import { observer } from 'mobx-react';

import { TimeCountdown } from '../components/time-countdown';
import { useToast } from '../modules/toasts/use-toast-notification';
import { useStores } from '../stores/use-stores.hook';

export const Distribution: FC = observer(() => {
  const { distributorStore, nftStore, qsTokenStore } = useStores();
  const { successToast } = useToast();

  const [distributionLabel, setDistributionLabel] = useState<string | null>(
    distributorStore.distributionStarts ? null : 'Started'
  );

  const handleDistributionTimerEnd = () => {
    setDistributionLabel('Started');
    distributorStore.clearDistributionStarts();
    successToast('Distribution Started!');
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
        disabled={!distributorStore.isStakeAllow || isLoading || !!distributorStore.userClaim}
        type="button"
      >
        {isLoading ? 'Loading...' : 'Claim'}
      </button>
    </div>
  );
});
