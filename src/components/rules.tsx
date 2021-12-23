import React, { FC, useCallback, useEffect, useState } from 'react';

import { Duration } from 'luxon';

import { Box } from './box';

interface Props {
  distributionStarts: Date | null;
  nftTotalSupply: number | null;
  nftMaxSupply: number | null;
  isLoading: boolean;
  isUserClaim: boolean;
  isStakeAllow: boolean;
  onClaim: () => void;
}

export const Rules: FC<Props> = ({
  distributionStarts,
  nftTotalSupply,
  nftMaxSupply,
  isLoading,
  isUserClaim,
  isStakeAllow,
  onClaim
}) => {
  const [distributionLabel, setDistributionLabel] = useState<string | null>(null);
  const [distributionStartsIn, setDistributionStartsIn] = useState<string | null>(null);
  const [disabled, setDisabled] = useState(true);

  const updateTimer = useCallback(() => {
    if (!distributionStarts) {
      setDistributionLabel(null);
      setDistributionStartsIn(null);
      setDisabled(true);
    } else if (distributionStarts < new Date()) {
      setDistributionLabel(null);
      setDistributionStartsIn(null);
      setDisabled(false);
    } else {
      // 23h 59m 59s
      const duration = Duration.fromMillis(new Date().getTime() - distributionStarts.getTime());
      setDistributionLabel('Starts in:');
      setDistributionStartsIn(duration.toFormat('dd hh:mm:ss'));
      setDisabled(true);
    }
  }, [distributionStarts]);

  useEffect(() => {
    if (!distributionStarts) {
      updateTimer();
    } else {
      setInterval(updateTimer, 500);
    }
  }, [distributionStarts, updateTimer]);

  return (
    <Box>
      <div className="rules-wrapper">
        <div className="rules-text">
          <h4 className="rules-title">Rules</h4>
          <div className="rules-point">
            1. QuipuSwap is a great entry point to research the Tezos ecosystem, swap any FA1.2-FA2 tokens.
          </div>
          <div className="rules-point">
            2. QuipuSwap is a great entry point to research the Tezos ecosystem, swap any FA1.2-FA2 tokens.
          </div>
          <div className="rules-point">
            3. QuipuSwap is a great entry point to research the Tezos ecosystem, swap any FA1.2-FA2 tokens.
          </div>
        </div>
        <div className="rules-logic">
          <div>
            <div>Distribution {distributionLabel}</div>
            <div>{distributionStartsIn}</div>
          </div>
          <div>
            <div>NFT Left:</div>
            <div>
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
      </div>
    </Box>
  );
};
