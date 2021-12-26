import { FC } from 'react';

import { YouStacked } from '../containers/you-staked';
import { Rules } from './rules';

export const Main: FC = () => {
  return (
    <main>
      <Rules />
      <YouStacked />
    </main>
  );
};
