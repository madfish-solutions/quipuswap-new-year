import React, { FC } from 'react';

import { Distribution } from '../containers/distribution';
import { Box } from './box';
import { RulesText } from './rules-text';

export const Rules: FC = () => {
  return (
    <Box>
      <div className="rules-wrapper">
        <RulesText />
        <Distribution />
      </div>
    </Box>
  );
};
