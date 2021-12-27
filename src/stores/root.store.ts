import { TezosToolkit } from '@taquito/taquito';

import { Nullable } from '../utils/fp';
import { DistributorStore } from './distributor.store';
import { NftStore } from './nft.store';
import { QsTokenStore } from './qs-token.store';

const DISTRIBUTOR_CONTRACT = 'KT1Gi2VCQ2Q7HfvdbNyTx7Ukg2Ms9hZ63DwH';

export class RootStore {
  tezos: Nullable<TezosToolkit> = null;
  accountPkh: Nullable<string> = null;

  distributorStore: DistributorStore;
  nftStore: NftStore;
  qsTokenStore: QsTokenStore;

  constructor() {
    this.distributorStore = new DistributorStore(this);
    this.nftStore = new NftStore(this);
    this.qsTokenStore = new QsTokenStore(this);
  }

  async reload(tezos: Nullable<TezosToolkit>, accountPkh: Nullable<string>) {
    this.tezos = tezos;
    this.accountPkh = accountPkh;
    await this.distributorStore.reload(DISTRIBUTOR_CONTRACT);
  }

  async getNodeCurrentTime() {
    return Date.parse((await this.tezos!.rpc.getBlockHeader()).timestamp);
  }
}
