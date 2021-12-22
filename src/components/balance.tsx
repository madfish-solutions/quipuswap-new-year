import { FC } from 'react';

import BigNumber from 'bignumber.js';

interface BalanceProps {
  quipuBalance: BigNumber.Value;
}

export const Balance: FC<BalanceProps> = ({ quipuBalance }) => {
  return (
    <div className="balance">
      <div className="balance_quipu">QUIPU Balance:</div>
      <div className="balance_numbers">{quipuBalance.toString()}</div>
      <a className="balance_buy-more" href="" target="_blank">
        Buy more
      </a>
    </div>
  );
};
