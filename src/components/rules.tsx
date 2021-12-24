import React, { FC } from 'react';

import { Box } from './box';
import { Distribution } from './distribution';
import { RulesText } from './rules-text';

interface Props {
  distributionStarts: Date | null;
  nftTotalSupply: number | null;
  nftMaxSupply: number | null;
  isLoading: boolean;
  isUserClaim: boolean;
  isStakeAllow: boolean;
  onClaim: () => void;
}

export const Rules: FC<Props> = props => {
  return (
    <Box>
      <div className="rules-wrapper">
        <RulesText />
        <Distribution {...props} />
      </div>
    </Box>
  );
};
