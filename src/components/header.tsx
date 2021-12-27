import { FC } from 'react';

import BigNumber from 'bignumber.js';

import { ConnectWalletButton } from '../modules/dapp/containers/connect-button';
import { showBalance } from '../utils/balances';
import { Balance } from './balance';
import { Container } from './container';
import { Logo } from './icons/logo';
import { useAccountPkh } from 'modules/dapp/hooks/use-dapp';

interface Props {
  userBalance: BigNumber | null;
}

export const Header: FC<Props> = ({ userBalance }) => {
  const accountPkh = useAccountPkh();
  const getBalance = () => {
    if(accountPkh) {
      return userBalance === null ? '0.0' : showBalance(userBalance)
    }
    return '...'
  } 

  return (
    <div className="header-wrapper">
      <Container>
        <div className="header">
          <Logo />
          <div className="header-buttons">
            <Balance quipuBalance={getBalance()} />
            <ConnectWalletButton className="pretty-button" />
          </div>
        </div>
      </Container>
    </div>
  );
};
