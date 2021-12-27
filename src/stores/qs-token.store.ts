import BigNumber from 'bignumber.js';
import { makeAutoObservable } from 'mobx';

import { QsTokenContract, QsTokenContractStorage } from '../api/qs-token-contract';
import { Nullable } from '../utils/fp';
import { RootStore } from './root.store';

export class QsTokenStore {
  contractAddress: Nullable<string> = null;

  contract: Nullable<QsTokenContract> = null;
  storage: Nullable<QsTokenContractStorage> = null;

  userAddress: Nullable<string> = null;
  userBalance: Nullable<BigNumber> = null;

  constructor(protected root: RootStore) {
    makeAutoObservable(this);
  }

  async reload(contractAddress: string) {
    if (this.root.tezos && contractAddress) {
      await this.load(contractAddress);
    } else {
      this.clear();
    }
  }

  private async load(contractAddress: string) {
    this.contractAddress = contractAddress;
    await this.loadContract();
    await this.loadStorage();

    if (this.root.accountPkh) {
      await this.loadUserBalance();
    }
  }

  clear() {
    this.contract = null;
    this.storage = null;
    this.clearUser();
  }

  clearUser() {
    this.userBalance = null;
  }

  async stakeForNft() {
    const batch = await this.contract!.batchOperations([
      await this.allowSpendYourTokens(),
      await this.root.distributorStore.stake(),
      await this.disallowSpendYourTokens()
    ]);
    const operation = await batch.send();
    await operation.confirmation();
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
    await this.contract.getContract();

    return this.contract;
  }

  private async loadStorage() {
    this.storage = await this.contract!.getStorage();

    return this.storage;
  }
}
