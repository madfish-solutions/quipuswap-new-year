import { FC } from 'react';

import { AccountModal } from '../modals/AccountModal';
import { WalletModal } from '../modals/WalletModal';
import { ConnectModalsStateProvider } from '../utils/use-connect-modals-state';

export const WalletContainer: FC = ({ children }) => {
  return (
    <ConnectModalsStateProvider>
      {children}
      <WalletModal />
      <AccountModal />
    </ConnectModalsStateProvider>
  );
};
