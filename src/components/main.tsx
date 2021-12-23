import { FC } from 'react';

import { Rules } from './rules';
import { YouStacked } from './you-staked';

interface Props {
  distributionStarts: Date | null;
  nftTotalSupply: number | null;
  nftMaxSupply: number | null;

  isLoading: boolean;
  onClaim: () => void;

  stakeAmount: number;
}

export const Main: FC<Props> = ({
  distributionStarts,
  nftTotalSupply,
  nftMaxSupply,
  stakeAmount,
  isLoading,
  onClaim
}) => {
  return (
    <main>
      <Rules
        distributionStarts={distributionStarts}
        nftTotalSupply={nftTotalSupply}
        nftMaxSupply={nftMaxSupply}
        isLoading={isLoading}
        onClaim={onClaim}
      />
      <YouStacked stakeAmount={stakeAmount} />
    </main>
  );
};
