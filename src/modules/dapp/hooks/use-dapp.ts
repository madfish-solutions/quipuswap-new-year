import { useCallback, useEffect, useState } from 'react';

import { NetworkType } from '@airgap/beacon-sdk';
import { BeaconWallet } from '@taquito/beacon-wallet';
import { MichelCodecPacker, TezosToolkit } from '@taquito/taquito';
import { TempleWallet } from '@temple-wallet/dapp';
import constate from 'constate';
import useSWR from 'swr';

import { APP_NAME, BASE_URL, LAST_USED_CONNECTION_KEY, LAST_USED_ACCOUNT_KEY } from '../config/config';
import { QSNetwork } from '../types/types';
import { isClient } from '../utils/is-client';
import { getNetwork, setNetwork, toBeaconNetworkType } from '../utils/network';
import { ReadOnlySigner } from '../utils/readonly-signer';
import { FastRpcClient } from '../utils/taquito-fast-rpc';

const michelEncoder = new MichelCodecPacker();

export const TEMPLE_WALLET_NOT_INSTALLED_MESSAGE = 'Temple wallet not installed';

const net = getNetwork();
const beaconWallet = !isClient
  ? undefined
  : new BeaconWallet({
      name: APP_NAME,
      iconUrl: `${BASE_URL}/favicon.ico`,
      preferredNetwork: (() => {
        const net = getNetwork();
        if (!(net.connectType === 'custom' && net.type === 'test')) {
          return toBeaconNetworkType(net.id);
        }

        return toBeaconNetworkType('mainnet');
      })()
    });

const connectWalletTemple = async (forcePermission: boolean, network: QSNetwork) => {
  const available = await TempleWallet.isAvailable();
  if (!available) {
    throw new Error(TEMPLE_WALLET_NOT_INSTALLED_MESSAGE);
  }

  let perm;
  if (!forcePermission) {
    perm = await TempleWallet.getCurrentPermission();
  }

  const wallet = new TempleWallet(APP_NAME, perm);

  if (!wallet.connected) {
    await wallet.connect(
      network.connectType === 'default'
        ? network.id
        : {
            name: network.name,
            rpc: network.rpcBaseURL
          },
      { forcePermission: true }
    );
  }

  const rpcClient = new FastRpcClient(network.rpcBaseURL);
  const tezos = new TezosToolkit(rpcClient);
  tezos.setWalletProvider(wallet);
  tezos.setPackerProvider(michelEncoder);
  tezos.setRpcProvider(rpcClient);
  const { pkh, publicKey } = wallet.permission!;
  tezos.setSignerProvider(new ReadOnlySigner(pkh, publicKey));
  localStorage.setItem(LAST_USED_CONNECTION_KEY, 'temple');

  return { pkh, toolkit: tezos, wallet };
};

const connectWalletBeacon = async (forcePermission: boolean, network: QSNetwork) => {
  if (!beaconWallet) {
    throw new Error('Cannot use beacon out of window');
  }

  const activeAccount = await beaconWallet.client.getActiveAccount();
  if (forcePermission || !activeAccount) {
    if (activeAccount) {
      await beaconWallet.clearActiveAccount();
    }
    await beaconWallet.requestPermissions({
      network:
        network.connectType === 'custom' && network.type === 'test'
          ? {
              type: NetworkType.CUSTOM,
              name: network.name,
              rpcUrl: network.rpcBaseURL
            }
          : { type: toBeaconNetworkType(network.id) }
    });
  }

  const rpcClient = new FastRpcClient(network.rpcBaseURL);
  const tezos = new TezosToolkit(rpcClient);
  tezos.setPackerProvider(michelEncoder);
  tezos.setWalletProvider(beaconWallet);
  const activeAcc = await beaconWallet.client.getActiveAccount();
  if (!activeAcc) {
    throw new Error('Not connected');
  }

  tezos.setSignerProvider(new ReadOnlySigner(activeAcc.address, activeAcc.publicKey));
  localStorage.setItem(LAST_USED_CONNECTION_KEY, 'beacon');
  localStorage.setItem(LAST_USED_ACCOUNT_KEY, activeAcc.accountIdentifier);

  return { pkh: activeAcc.address, toolkit: tezos };
};

interface DApp {
  connectionType: 'beacon' | 'temple' | null;
  tezos: TezosToolkit | null;
  accountPkh: string | null;
  templeWallet: TempleWallet | null;
  network: QSNetwork;
}

const fallbackRpcClient = new FastRpcClient(net.rpcBaseURL);
const fallbackToolkit = new TezosToolkit(fallbackRpcClient);
fallbackToolkit.setPackerProvider(michelEncoder);

const useDApp = () => {
  const [{ connectionType, tezos, accountPkh, templeWallet, network }, setState] = useState<DApp>({
    connectionType: null,
    tezos: null,
    accountPkh: null,
    templeWallet: null,
    network: net
  });

  const setFallbackState = useCallback(
    () =>
      setState(prevState => ({
        ...prevState,
        connectionType: null,
        tezos: prevState.tezos ?? fallbackToolkit
      })),
    []
  );

  const getTempleInitialAvailable = useCallback(async () => TempleWallet.isAvailable(), []);
  const { data: templeInitialAvailable } = useSWR(['temple-initial-available'], getTempleInitialAvailable, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false
  });

  const ready = Boolean(tezos) || templeInitialAvailable === false;

  // eslint-disable-next-line sonarjs/cognitive-complexity
  useEffect(() => {
    TempleWallet.onAvailabilityChange(async available => {
      const lastUsedConnection = localStorage.getItem(LAST_USED_CONNECTION_KEY);
      if (available) {
        try {
          let perm;
          try {
            perm = await TempleWallet.getCurrentPermission();
          } catch (error) {
            // eslint-disable-next-line
            console.log(error);
          }

          const wlt = new TempleWallet(APP_NAME, lastUsedConnection === 'temple' ? perm : null);

          if (lastUsedConnection === 'temple') {
            const rpcClient = new FastRpcClient(network.rpcBaseURL);
            const newToolkit = wlt.connected ? new TezosToolkit(rpcClient) : fallbackToolkit;
            newToolkit.setWalletProvider(wlt);
            const newAccountPkh = wlt.connected ? await wlt.getPKH() : null;

            setState(prevState => ({
              ...prevState,
              templeWallet: wlt,
              tezos: newToolkit,
              accountPkh: newAccountPkh,
              connectionType: wlt.connected ? 'temple' : null
            }));
          } else {
            setState(prevState => ({
              ...prevState,
              tezos: prevState.tezos ?? fallbackToolkit,
              templeWallet: wlt
            }));
          }

          return;
        } catch (e) {
          // eslint-disable-next-line
          console.error(e);
        }
      }

      if (lastUsedConnection !== 'beacon') {
        setFallbackState();
      }
    });

    const lastUsedAccount = localStorage.getItem(LAST_USED_ACCOUNT_KEY);
    if (localStorage.getItem(LAST_USED_CONNECTION_KEY) === 'beacon' && lastUsedAccount) {
      if (!beaconWallet) {
        return;
      }
      beaconWallet.client
        .getAccount(lastUsedAccount)
        .then(value => {
          if (!value) {
            localStorage.removeItem(LAST_USED_ACCOUNT_KEY);
            localStorage.removeItem(LAST_USED_CONNECTION_KEY);
            setFallbackState();

            return;
          }

          const rpcClient = new FastRpcClient(net.rpcBaseURL);
          const toolkit = new TezosToolkit(rpcClient);
          toolkit.setPackerProvider(michelEncoder);
          toolkit.setWalletProvider(beaconWallet);

          setState(prevState => ({
            ...prevState,
            templeWallet: null,
            accountPkh: value.address,
            connectionType: 'beacon',
            tezos: toolkit,
            network: net
          }));
        })
        .catch(e => {
          // eslint-disable-next-line
          console.error(e);
          setFallbackState();
        });
    }
  }, [setFallbackState, network.rpcBaseURL]);

  useEffect(() => {
    if (templeInitialAvailable === false && localStorage.getItem(LAST_USED_CONNECTION_KEY) === 'temple') {
      setFallbackState();
    }
  }, [setFallbackState, templeInitialAvailable]);

  useEffect(() => {
    if (!tezos || tezos.rpc.getRpcUrl() !== network.rpcBaseURL) {
      const wlt = new TempleWallet(APP_NAME, null);
      const fallbackRpcClient = new FastRpcClient(network.rpcBaseURL);
      const fallbackTzTk = new TezosToolkit(fallbackRpcClient);
      fallbackTzTk.setPackerProvider(michelEncoder);
      const pkh = null;
      setState(prevState => ({
        ...prevState,
        network,
        templeWallet: wlt,
        tezos: fallbackTzTk,
        accountPkh: pkh,
        connectionType: null
      }));
    }
    // eslint-disable-next-line
  }, [network]);

  useEffect(() => {
    if (templeWallet && templeWallet.connected) {
      TempleWallet.onPermissionChange(perm => {
        if (!perm) {
          const fallbackRpcClient = new FastRpcClient(net.rpcBaseURL);
          setState(prevState => ({
            ...prevState,
            templeWallet: new TempleWallet(APP_NAME),
            tezos: new TezosToolkit(fallbackRpcClient),
            accountPkh: null,
            connectionType: null,
            network: net
          }));
        }
      });
    }
  }, [templeWallet]);

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

  const disconnect = useCallback(async () => {
    setState(prevState => ({
      ...prevState,
      tezos: fallbackToolkit,
      accountPkh: null,
      connectionType: null
    }));
    localStorage.removeItem(LAST_USED_CONNECTION_KEY);
  }, []);

  const changeNetwork = useCallback((networkNew: QSNetwork) => {
    setState(prevState => ({
      ...prevState,
      network: networkNew
    }));
    setNetwork(networkNew);
  }, []);

  return {
    connectionType,
    tezos,
    accountPkh,
    templeWallet,
    ready,
    network,
    connectWithBeacon,
    connectWithTemple,
    disconnect,
    changeNetwork
  };
};

export const [
  DAppProvider,
  useConnectionType,
  useTezos,
  useAccountPkh,
  useTempleWallet,
  useReady,
  useNetwork,
  useConnectWithBeacon,
  useConnectWithTemple,
  useDisconnect,
  useChangeNetwork
] = constate(
  useDApp,
  v => v.connectionType,
  v => v.tezos,
  v => v.accountPkh,
  v => v.templeWallet,
  v => v.ready,
  v => v.network,
  v => v.connectWithBeacon,
  v => v.connectWithTemple,
  v => v.disconnect,
  v => v.changeNetwork
);
