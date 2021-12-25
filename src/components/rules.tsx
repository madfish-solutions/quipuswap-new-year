import React, { FC } from 'react';

import { Box } from './box';
import { Distribution } from './distribution';
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
