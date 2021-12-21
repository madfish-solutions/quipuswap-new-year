import { useCallback, useState } from 'react';

import { TezosToolkit } from '@taquito/taquito';
import { TempleWallet } from '@temple-wallet/dapp';

import { connectWalletBeacon } from '../helpers/connectWalletBeacon';
import { connectWalletTemple } from '../helpers/connectWalletTemple';
import { getNetwork } from '../helpers/network';
import { QSNetwork } from '../interfaces/QSNetwork';

export interface DAppType {
  connectionType: 'beacon' | 'temple' | null;
  tezos: TezosToolkit | null;
  accountPkh: string | null;
  templeWallet: TempleWallet | null;
  network: QSNetwork;
}

const net = getNetwork();

export const useDApp = () => {
  const [{ accountPkh, network }, setState] = useState<DAppType>({
    connectionType: null,
    tezos: null,
    accountPkh: null,
    templeWallet: null,
    network: net
  });

  const connectWithTemple = useCallback(
    async (forcePermission: boolean) => {
      const { pkh, toolkit, wallet } = await connectWalletTemple(forcePermission, network);
      setState(prevState => ({
        ...prevState,
        connectionType: 'temple',
        tezos: toolkit,
        accountPkh: pkh,
        templeWallet: wallet,
        network
      }));
    },
    [network]
  );

  const connectWithBeacon = useCallback(
    async (forcePermission: boolean) => {
      const { pkh, toolkit } = await connectWalletBeacon(forcePermission, network);

      setState(prevState => ({
        ...prevState,
        connectionType: 'beacon',
        tezos: toolkit,
        accountPkh: pkh,
        templeWallet: null,
        network
      }));
    },
    [network]
  );

  return {
    accountPkh,
    connectWithTemple,
    connectWithBeacon
  };
};
