import { FC } from 'react';

import { ConnectModalsStateProvider } from '../modules/connect-wallet/hooks/use-connect-modals-state';
import { AccountModal } from '../modules/connect-wallet/modals/AccountModal';
import { WalletModal } from '../modules/connect-wallet/modals/WalletModal';

export const WalletWrapper: FC = ({ children }) => {
  return (
    <ConnectModalsStateProvider>
      {children}
      <WalletModal />
      <AccountModal />
    </ConnectModalsStateProvider>
  );
};
