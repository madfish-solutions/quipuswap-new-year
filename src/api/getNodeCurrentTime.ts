import { TezosToolkit } from '@taquito/taquito';

import { getNetwork } from '../connect-wallet/utils/network';

const net = getNetwork();

export const getNodeCurrentTime = async (tezos?: TezosToolkit) =>
  Date.parse((await (tezos || new TezosToolkit(net.rpcBaseURL)).rpc.getBlockHeader()).timestamp);
