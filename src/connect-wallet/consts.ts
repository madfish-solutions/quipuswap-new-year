import { QSNetwork } from './interfaces/QSNetwork';

export const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000/';
export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || 'QuipuSwapNewYear2022';

export const SAVED_TERMS_KEY = 'savedTerms';
export const SAVED_ANALYTICS_KEY = 'savedAnalytics';
export const LAST_USED_CONNECTION_KEY = 'lastUsedConnection';

export const METADATA_API_MAINNET =
  process.env.NEXT_PUBLIC_METADATA_API_MAINNET || 'https://metadata.templewallet.com/metadata';
export const METADATA_API_TESTNET =
  process.env.NEXT_PUBLIC_METADATA_API_TESTNET || 'http://165.232.69.152:3002/metadata';

export const MAINNET_NETWORK: QSNetwork = {
  id: 'mainnet',
  connectType: 'default',
  name: 'Tezos Mainnet',
  type: 'main',
  rpcBaseURL: 'https://mainnet.smartpy.io/',
  metadata: METADATA_API_MAINNET,
  description: 'Tezos mainnet',
  disabled: false
};

export const HANGZHOUNET_NETWORK: QSNetwork = {
  // TODO: Add this net to the type
  id: 'hangzhounet' as never,
  connectType: 'default',
  name: 'Hangzhounet Testnet',
  type: 'test',
  rpcBaseURL: 'https://hangzhounet.api.tez.ie',
  metadata: METADATA_API_TESTNET,
  description: 'Hangzhounet testnet',
  disabled: false
};
export const ALL_NETWORKS = [MAINNET_NETWORK, HANGZHOUNET_NETWORK];
export const DEFAULT_NETWORK = MAINNET_NETWORK;
export const LAST_USED_ACCOUNT_KEY = 'lastUsedAccount';
export const NETWORK_ID_KEY = 'networkId';
