import { FC } from 'react';

import { Rules } from './rules';
import { YouStacked } from './you-staked';

export const Main: FC = () => {
  return (
    <main>
      <Rules />
      <YouStacked />
    </main>
  );
};
