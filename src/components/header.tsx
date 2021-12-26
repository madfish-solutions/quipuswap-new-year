import { FC } from 'react';

import BigNumber from 'bignumber.js';

import { ConnectWalletButton } from '../modules/connect-wallet/containers/connect-button';
import { showBalance } from '../utils/balances';
import { Balance } from './balance';
import { Container } from './container';
import { Logo } from './icons/logo';

interface Props {
  userBalance: BigNumber | null;
}

export const Header: FC<Props> = ({ userBalance }) => {
  return (
    <div className="header-wrapper">
      <Container>
        <div className="header">
          <Logo />
          <div className="header-buttons">
            <Balance quipuBalance={userBalance === null ? '...' : showBalance(userBalance)} />
            <ConnectWalletButton className="pretty-button" />
          </div>
        </div>
      </Container>
    </div>
  );
};
