import { makeAutoObservable } from 'mobx';

import { NftContract, NftContractStorage } from '../api/nft-contract';
import { NftToken } from '../interfaces/NftToken';
import { log } from '../modules/logs';
import { Nullable } from '../utils/fp';
import { RootStore } from './root.store';

export class NftStore {
  error: Nullable<Error> = null;
  isLoading = false;

  contractAddress: Nullable<string> = null;

  contract: Nullable<NftContract> = null;
  storage: Nullable<NftContractStorage> = null;

  tokens: Nullable<NftToken[]> = null;

  constructor(protected root: RootStore) {
    makeAutoObservable(this);
  }

  async reload(contractAddress: string) {
    if (contractAddress === this.contractAddress) {
      return;
    }
    this.contractAddress = contractAddress;
    if (this.root.tezos && contractAddress) {
      await this.load();
    } else {
      this.clear();
    }
  }

  private async load() {
    try {
      await this.loadContract();
      await this.loadStorage();
      await this.loadTokens();
    } catch (error) {
      this.error = error as Error;
      this.clear();
    }
  }

  clear() {
    this.contract = null;
    this.storage = null;
    this.tokens = null;
  }

  get totalSupply() {
    return this.storage?.total_supply.toNumber() || 0;
  }

  get maxSupply() {
    return this.storage?.max_supply.toNumber() || 0;
  }

  // TODO
  async getUserReward() {
    const reward = await this.contract!.userReward(this.root.accountPkh!);
    log('getUserReward', reward);
  }

  private async loadTokens() {
    this.tokens = this.storage?.token_count
      ? await this.contract!.getTokensMetadata(this.storage.token_count.toNumber())
      : null;
  }

  private async loadContract() {
    this.contract = new NftContract(this.root.tezos!, this.contractAddress!);
    await this.contract.getContract();

    return this.contract;
  }

  private async loadStorage() {
    this.storage = await this.contract!.getStorage();

    return this.storage;
  }
}
