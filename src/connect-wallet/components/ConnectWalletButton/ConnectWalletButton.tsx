import React from 'react';

import { ConnectModalsStateProvider, useConnectModalsState } from '../../hooks/useConnectModalsState';
import { useDApp } from '../../hooks/useDApp';
import { WalletModal } from '../WalletModal';
import {shortize} from "../../helpers/shortize";

interface ConnectWalletButtonProps {
  className?: string;
}

export const ConnectWalletButton: React.FC<ConnectWalletButtonProps> = ({ className }) => {
  const { accountPkh } = useDApp();
  const { openConnectWalletModal } = useConnectModalsState();
  const { openAccountInfoModal } = useConnectModalsState();

  return (
    <div>
      <ConnectModalsStateProvider>
        {accountPkh ? (
          <button className={className} onClick={openAccountInfoModal} title={accountPkh}>
            {shortize(accountPkh, 7)}
          </button>
        ) : (
          <button className={className} onClick={openConnectWalletModal}>
            Connect wallet
          </button>
        )}
        <WalletModal />
      </ConnectModalsStateProvider>
    </div>
  );
};
