import React, { FC, useState } from 'react';

import { observer } from 'mobx-react';

import { TimeCountdown } from '../components/time-countdown';
import { WonNft } from '../components/won-nft';
import { useToast } from '../modules/toasts/use-toast-notification';
import { useStores } from '../stores/use-stores.hook';

const getRarity = (rewardIndex: 0 | 1 | 2) => {
  switch (rewardIndex) {
    case 2:
      return 'an epic';
    case 1:
      return 'a rare';
    default:
      return 'a';
  }
};

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
      const initialReward = await nftStore.getUserRewards();
      await qsTokenStore.stakeForNft();
      await distributorStore.reload(distributorStore.contractAddress!);
      const rewardIndex = await distributorStore.waitForStake(initialReward);
      const url = nftStore.tokens?.[rewardIndex].thumbnailUri || '';
      const rarity = getRarity(rewardIndex);
      successToast(<WonNft src={url} rarity={rarity} />);
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
