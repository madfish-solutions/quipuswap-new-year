import React, { FC, useEffect, useState } from 'react';

import { observer } from 'mobx-react';

import { TimeCountdown } from '../components/time-countdown';
import { WonNft } from '../components/won-nft';
import { logError } from '../modules/logs';
import { useToast } from '../modules/toasts/use-toast-notification';
import { useStores } from '../stores/use-stores.hook';
import { Nullable } from '../utils/fp';

const getLabel = (start?: Nullable<Date>): Nullable<string> => {
  if (!start) {
    return 'Loading...';
  }

  return start < new Date() ? 'Started' : null;
};

export const Distribution: FC = observer(() => {
  const { distributorStore, nftStore, qsTokenStore } = useStores();
  const { successToast, errorToast } = useToast();
  const [distributionLabel, setDistributionLabel] = useState<string | null>(
    getLabel(distributorStore.distributionStarts)
  );
  const [isLoading, setIsLoading] = useState(false);

  // TODO: Hack. Try to avoid this behaviour
  useEffect(() => {
    setDistributionLabel(getLabel(distributorStore.distributionStarts));
  }, [distributorStore.distributionStarts]);

  const handleDistributionTimerEnd = () => {
    setDistributionLabel('Started');
    distributorStore.clearDistributionStarts();
    successToast('Distribution Started!');
  };

  const handleClaim = async () => {
    setIsLoading(true);
    try {
      const initialReward = await nftStore.getUserRewards();
      await qsTokenStore.stakeForNft();
      await distributorStore.reload(distributorStore.contractAddress!);
      const rewardIndex = await distributorStore.waitForStake(initialReward);
      const url = rewardIndex !== null ? nftStore.tokens?.[rewardIndex].thumbnailUri : null;
      successToast(<WonNft src={url || null} rarity={rewardIndex} />);
    } catch (error) {
      logError(error);
      errorToast();
    }
    setIsLoading(false);
  };

  const showTimer = distributorStore.distributionStarts && distributorStore.distributionStarts > new Date()

  return (
    <div className="rules-logic">
      <div className="rules-logic_distribution-container">
        <div className="key-key">
          { showTimer ? "Distribution begins in" : "Distribution"} </div>
        {showTimer ? (
          <TimeCountdown timeTo={distributorStore.distributionStarts} onTimerEnd={handleDistributionTimerEnd} />
        ) : (
          <p className="key-value">{distributionLabel}</p>
        )}
      </div>
      <div className="rules-logic_left-container">
        <div className="key-key">NFT Left:</div>
        <div className="key-value">
          {nftStore.maxSupply && nftStore.totalSupply !== null
            ? `${nftStore.maxSupply - nftStore.totalSupply}/${nftStore.maxSupply}`
            : `Loading...`}
        </div>
      </div>
      <div className="claim-claim">
        <button
          className="pretty-button"
          onClick={handleClaim}
          disabled={!distributorStore.isStakeAllow || !!distributorStore.userClaim || isLoading}
          type="button"
        >
          {isLoading ? 'Loading...' : 'Claim'}
        </button>
        {distributorStore.isNotEnoughQsTokens && <p className="not-enough">Insufficient balance</p>}
      </div>
    </div>
  );
});
