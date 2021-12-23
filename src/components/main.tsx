import { FC } from 'react';

import BigNumber from 'bignumber.js';

import { Claim } from '../api/distributor-contract';
import { Rules } from './rules';
import { YouStacked } from './you-staked';

interface Props {
  distributionStarts: Date | null;
  nftTotalSupply: number | null;
  nftMaxSupply: number | null;
  isLoading: boolean;
  stakeAmount: BigNumber | null;
  userClaim: Claim | null;
  stakedTo: Date | null;
  isStakeAllow: boolean;
  onClaim: () => void;
  onUnstake: () => void;
}

export const Main: FC<Props> = ({
  distributionStarts,
  nftTotalSupply,
  nftMaxSupply,
  stakeAmount,
  isLoading,
  userClaim,
  stakedTo,
  isStakeAllow,
  onClaim,
  onUnstake
}) => {
  return (
    <main>
      <Rules
        distributionStarts={distributionStarts}
        nftTotalSupply={nftTotalSupply}
        nftMaxSupply={nftMaxSupply}
        isLoading={isLoading}
        isUserClaim={Boolean(userClaim)}
        isStakeAllow={isStakeAllow}
        onClaim={onClaim}
      />
      <YouStacked stakeAmount={stakeAmount} stakedTo={stakedTo} onUnstake={onUnstake} />
    </main>
  );
};
