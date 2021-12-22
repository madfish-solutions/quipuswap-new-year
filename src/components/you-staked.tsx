import { FC } from 'react';

import { Box } from './box';

interface Props {
  stakeAmount: number;
}

export const YouStacked: FC<Props> = ({ stakeAmount }) => {
  return (
    <Box>
      <div className="you-staked_wrapper">
        <div className="you-staked">
          <div>
            <div>You Staked:</div>
            <div>{stakeAmount ? `${stakeAmount / 1000000} QUIPU` : 'Loading...'}</div>
          </div>
          <div>
            <div>Lock countdown:</div>
            <div>--.--.--</div>
          </div>
          <button className="pretty-button">Unstake</button>
        </div>
      </div>
    </Box>
  );
};
