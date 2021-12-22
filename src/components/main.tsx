import { FC } from 'react';

import { Rules } from './rules';
import { YouStacked } from './you-staked';

interface Props {
  distributionStarts: Date | null;
  nftLeftSupply: number | null;
  nftMaxSupply: number | null;
}

export const Main: FC<Props> = props => {
  return (
    <main>
      <Rules {...props} />
      <YouStacked />
    </main>
  );
};
