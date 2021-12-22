import React, { FC, useCallback, useEffect, useState } from 'react';

import { Duration } from 'luxon';

import { Box } from './box';

interface Props {
  distributionStarts: Date | null;
  nftLeftSupply: number | null;
  nftMaxSupply: number | null;
}

export const Rules: FC<Props> = ({ distributionStarts, nftLeftSupply, nftMaxSupply }) => {
  const [distributionLabel, setDistributionLabel] = useState('');
  const [distributionStartsIn, setDistributionStartsIn] = useState('Loading...');

  const updateTimer = useCallback(() => {
    if (!distributionStarts) {
      setDistributionLabel('');
      setDistributionStartsIn('Loading...');
    } else if (distributionStarts < new Date()) {
      setDistributionLabel('');
      setDistributionStartsIn('Finished');
    } else {
      // 23h 59m 59s
      const duration = Duration.fromMillis(distributionStarts.getTime() - new Date().getTime());
      setDistributionLabel('Starts in:');
      setDistributionStartsIn(duration.toFormat('dd hh:mm:ss'));
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
            <div>{nftMaxSupply ? `${nftLeftSupply}/${nftMaxSupply}` : `Loading...`}</div>
          </div>
          <button>Claim</button>
        </div>
      </div>
    </Box>
  );
};
