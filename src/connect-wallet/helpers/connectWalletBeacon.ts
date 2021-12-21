import { NetworkType } from '@airgap/beacon-sdk';
import { BeaconWallet } from '@taquito/beacon-wallet';
import { MichelCodecPacker, TezosToolkit } from '@taquito/taquito';

import { APP_NAME, BASE_URL, LAST_USED_ACCOUNT_KEY, LAST_USED_CONNECTION_KEY } from '../consts';
import { QSNetwork } from '../interfaces/QSNetwork';
import { toBeaconNetworkType } from './network';
import { ReadOnlySigner } from './ReadOnlySigner';

const michelEncoder = new MichelCodecPacker();

const beaconWallet =
  typeof window === 'undefined'
    ? undefined
    : new BeaconWallet({
        name: APP_NAME,
        iconUrl: `${BASE_URL}/favicon.ico`
      });

export const connectWalletBeacon = async (forcePermission: boolean, network: QSNetwork) => {
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

  const tezos = new TezosToolkit(network.rpcBaseURL);
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
