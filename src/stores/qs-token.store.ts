import BigNumber from 'bignumber.js';

import { QsTokenContract, QsTokenContractStorage } from '../api/qs-token-contract';
import { confirmOperation } from '../modules/dapp/helpers/confirm-operation';
import { Nullable } from '../utils/fp';
import { Contract } from './contract.decorator';
import { RootStore } from './root.store';

export class QsTokenStore extends Contract<RootStore, QsTokenContractStorage, QsTokenContract>(QsTokenContract) {
  userAddress: Nullable<string> = null;
  userBalance: Nullable<BigNumber> = null;

  async reload(contractAddress: string) {
    if (this.root.tezos && contractAddress) {
      await this.load(contractAddress);
    } else {
      this.clear();
    }
  }

  private async load(contractAddress: string) {
    await super.load_(contractAddress);

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
    await confirmOperation(this.root.tezos!, operation.opHash);
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
}
