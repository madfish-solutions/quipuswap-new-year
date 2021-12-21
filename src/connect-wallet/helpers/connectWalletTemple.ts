import { MichelCodecPacker } from '@taquito/taquito';
import { TempleWallet } from '@temple-wallet/dapp';

import { APP_NAME, LAST_USED_CONNECTION_KEY } from '../consts';
import { ReadOnlySigner } from '../helpers/ReadOnlySigner';
import { QSNetwork } from '../interfaces/QSNetwork';

export const TEMPLE_WALLET_NOT_INSTALLED_MESSAGE = 'Temple wallet not installed';

const michelEncoder = new MichelCodecPacker();

export const connectWalletTemple = async (forcePermission: boolean, network: QSNetwork) => {
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
        ? (network.id as never)
        : {
            name: network.name,
            rpc: network.rpcBaseURL
          },
      { forcePermission: true }
    );
  }

  const tezos = wallet.toTezos();
  tezos.setPackerProvider(michelEncoder);
  const { pkh, publicKey } = wallet.permission!;
  tezos.setSignerProvider(new ReadOnlySigner(pkh, publicKey));
  localStorage.setItem(LAST_USED_CONNECTION_KEY, 'temple');

  return { pkh, toolkit: tezos, wallet };
};
