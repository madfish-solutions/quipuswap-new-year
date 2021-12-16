import React from 'react';
import { Container } from './container';
import { Logo } from '../icons/logo';

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
