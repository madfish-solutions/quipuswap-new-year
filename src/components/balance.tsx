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
      <a
        className="balance_buy-more"
        href="https://quipuswap.com/swap?from=tez&to=KT193D4vozYnhGJQVtw7CoxxqphqUEEwK6Vb_0"
        target="_blank"
        rel="noreferrer"
      >
        Buy more
      </a>
    </div>
  );
};
