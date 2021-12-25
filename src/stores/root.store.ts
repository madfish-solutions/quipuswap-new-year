import { TezosToolkit } from '@taquito/taquito';

import { Nullable } from '../connect-wallet/utils/fp';
import { DistributorStore } from './distributor.store';
import { NftStore } from './nft.store';
import { QsTokenStore } from './qs-token.store';

const DISTRIBUTOR_CONTRACT = 'KT1Cehf6JwQJYYEPscSkrcR91DxqSfnq1ze9';

export class RootStore {
  distributorStore: DistributorStore;
  nftStore: NftStore;
  qsTokenStore: QsTokenStore;

  constructor(public tezos: Nullable<TezosToolkit>, public accountPkh: Nullable<string>) {
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

  onErrorClose() {
    this.distributorStore.error = null;
    this.nftStore.error = null;
    this.qsTokenStore.error = null;
  }
}
