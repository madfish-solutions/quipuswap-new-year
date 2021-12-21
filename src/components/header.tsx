import React from 'react';

import { ConnectWalletButton } from '../connect-wallet/components/connect-button';
import { Logo } from '../icons/logo';
import { Container } from './container';

export const Header = () => {
  return (
    <div className="header-wrapper">
      <Container>
        <div className="header">
          <Logo />
          <div className="header-buttons">
            <button>Balance</button>
            <ConnectWalletButton />
          </div>
        </div>
      </Container>
    </div>
  );
};
