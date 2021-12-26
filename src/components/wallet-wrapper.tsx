import { FC } from 'react';

import { ConnectModalsStateProvider } from '../modules/dapp/hooks/use-connect-modals-state';
import { AccountModal } from '../modules/dapp/modals/AccountModal';
import { WalletModal } from '../modules/dapp/modals/WalletModal';

export const WalletWrapper: FC = ({ children }) => {
  return (
    <ConnectModalsStateProvider>
      {children}
      <WalletModal />
      <AccountModal />
    </ConnectModalsStateProvider>
  );
};
