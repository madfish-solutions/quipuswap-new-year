import { FC } from 'react';

import { ConnectWalletButton } from '../connect-wallet/components/connect-button';
import { Logo } from '../icons/logo';
import { Balance } from './balance';
import { Container } from './container';

interface Props {
  userBalance: number | undefined;
}

export const Header: FC<Props> = ({ userBalance }) => {
  return (
    <div className="header-wrapper">
      <Container>
        <div className="header">
          <Logo />
          <div className="header-buttons">
            <Balance quipuBalance={userBalance ? userBalance : '0.0'} />
            <ConnectWalletButton className="pretty-button" />
          </div>
        </div>
      </Container>
    </div>
  );
};
