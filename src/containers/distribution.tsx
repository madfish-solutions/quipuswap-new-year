import React, { FC, useState } from 'react';

import { observer } from 'mobx-react';

import { TimeCountdown } from '../components/time-countdown';
import { useToast } from '../modules/toasts/use-toast-notification';
import { useStores } from '../stores/use-stores.hook';

export const Distribution: FC = observer(() => {
  const { distributorStore, nftStore, qsTokenStore } = useStores();
  const { successToast, errorToast } = useToast();
  const [distributionLabel, setDistributionLabel] = useState<string | null>(
    distributorStore.distributionStarts ? null : 'Started'
  );
  const [isLoading, setIsLoading] = useState(false);

  const handleDistributionTimerEnd = () => {
    setDistributionLabel('Started');
    distributorStore.clearDistributionStarts();
    successToast('Distribution Started!');
  };

  const handleClaim = async () => {
    setIsLoading(true);
    try {
      await qsTokenStore.stakeForNft();
      await distributorStore.reload(distributorStore.contractAddress!);
      await distributorStore.waitForStake();
      successToast('Congratulations! You have a NFT! Check you wallet in a minute.');
    } catch (error) {
      errorToast(error as Error);
    }
    setIsLoading(false);
  };

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
        disabled={!distributorStore.isStakeAllow || !!distributorStore.userClaim || isLoading}
        type="button"
      >
        {isLoading ? 'Loading...' : 'Claim'}
      </button>
    </div>
  );
});
