import React from 'react';

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
            <button>Connect Wallet</button>
          </div>
        </div>
      </Container>
    </div>
  );
};
