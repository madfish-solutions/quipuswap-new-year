import BigNumber from 'bignumber.js';
import { makeAutoObservable } from 'mobx';

import { QsTokenContract, QsTokenContractStorage } from '../api/qs-token-contract';
import { Nullable } from '../modules/connect-wallet/utils/fp';
import { RootStore } from './root.store';

export class QsTokenStore {
  error: Nullable<Error> = null;
  isLoading = false;

  contractAddress: Nullable<string> = null;

  contract: Nullable<QsTokenContract> = null;
  storage: Nullable<QsTokenContractStorage> = null;

  userBalance: Nullable<BigNumber> = null;

  constructor(protected root: RootStore) {
    makeAutoObservable(this);
  }

  async reload(contractAddress: string) {
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
      if (this.root.accountPkh) {
        await this.loadUserBalance();
      }
    } catch (error) {
      this.error = error as Error;
      this.clear();
    }
  }

  clear() {
    this.contract = null;
    this.storage = null;
    this.userBalance = null;
  }

  async stakeForNft() {
    try {
      const batch = await this.contract!.batchOperations([
        await this.allowSpendYourTokens(),
        await this.root.distributorStore.stake(),
        await this.disallowSpendYourTokens()
      ]);
      await batch.send();
    } catch (error) {
      this.error = error as Error;
    }
  }

  private async allowSpendYourTokens() {
    return await this.contract!.allowSpendYourTokens({
      spender: this.root.distributorStore.contractAddress!,
      owner: this.root.accountPkh!
    });
  }

  private async disallowSpendYourTokens() {
    return await this.contract!.disallowSpendYourTokens({
      spender: this.root.distributorStore.contractAddress!,
      owner: this.root.accountPkh!
    });
  }

  private async loadUserBalance() {
    this.userBalance = await this.contract!.getAddressBalance(this.root.accountPkh!);
  }

  private async loadContract() {
    this.contract = new QsTokenContract(this.root.tezos!, this.contractAddress!);

    return this.contract;
  }

  private async loadStorage() {
    this.storage = await this.contract!.getStorage();

    return this.storage;
  }
}
