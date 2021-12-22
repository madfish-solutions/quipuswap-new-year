import { ConnectWalletButton } from '../connect-wallet/components/connect-button';
import { Logo } from '../icons/logo';
import { Balance } from './balance';
import { Container } from './container';

export const Header = () => {
  return (
    <div className="header-wrapper">
      <Container>
        <div className="header">
          <Logo />
          <div className="header-buttons">
            <Balance quipuBalance={'252.0543'} />
            <ConnectWalletButton className="pretty-button" />
          </div>
        </div>
      </Container>
    </div>
  );
};
