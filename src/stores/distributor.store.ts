import { makeAutoObservable } from 'mobx';

import { Claim, DistributorContract, DistributorContractStorage } from '../api/distributor-contract';
import { logError } from '../modules/logs';
import { Nullable } from '../utils/fp';
import { RootStore } from './root.store';

export class DistributorStore {
  error: Nullable<Error> = null;
  isLoading = false;

  contractAddress: Nullable<string> = null;

  contract: Nullable<DistributorContract> = null;
  storage: Nullable<DistributorContractStorage> = null;

  distributionStarts: Nullable<Date> = null;

  userAddress: Nullable<string> = null;
  userClaim: Nullable<Claim> = null;
  userStakedTo: Nullable<Date> = null;

  constructor(protected root: RootStore) {
    makeAutoObservable(this);
  }

  async reload(contractAddress: string) {
    this.isLoading = true;
    if (this.root.tezos && contractAddress) {
      await this.load(contractAddress);
    } else {
      this.clear();
    }
    this.isLoading = false;
  }

  private async load(contractAddress: string) {
    try {
      this.contractAddress = contractAddress;
      await this.loadContract();
      await this.loadStorage();
      await this.loadDistributionStarts();

      await this.root.nftStore.reload(this.storage!.nft_contract);
      await this.root.qsTokenStore.reload(this.storage!.quipu_token.address);

      if (this.root.accountPkh) {
        await this.loadUserClaim();
        await this.loadUserStakedTo();
        await this.root.qsTokenStore.reload(this.storage!.quipu_token.address);
      } else {
        this.clearUser();
        this.root.qsTokenStore.clearUser();
      }
    } catch (error) {
      logError(error as Error);
      this.error = error as Error;
      this.clear();
    }
  }

  clear() {
    this.contract = null;
    this.storage = null;
    this.clearUser();

    this.root.nftStore.clear();
    this.root.qsTokenStore.clear();
  }

  clearUser() {
    this.userClaim = null;
    this.userStakedTo = null;
    this.root.qsTokenStore.clearUser();
  }

  clearError() {
    this.error = null;
  }

  clearDistributionStarts() {
    this.distributionStarts = null;
  }

  async stake() {
    return await this.contract!.stake();
  }

  async withdraw() {
    this.isLoading = true;
    try {
      const batch = await this.contract!.batchOperations([await this.contract!.withdraw()]);
      await batch.send();
    } catch (error) {
      logError(error as Error);
      this.error = error as Error;
    }
    this.isLoading = false;
  }

  get isStakeAllow() {
    return (
      (!this.userClaim || !this.userClaim.stake_beginning) &&
      !!this.root.qsTokenStore.userBalance &&
      !!this.storage &&
      this.root.qsTokenStore.userBalance.gte(this.storage.stake_amount) &&
      !this.distributionStarts
    );
  }

  get stakeAmount() {
    return this.storage?.stake_amount || null;
  }

  private async loadDistributionStarts() {
    if (!this.storage || !this.storage.distribution_start) {
      this.distributionStarts = null;

      return;
    }
    const nodeTime = await this.root.getNodeCurrentTime();
    const timeTo = new Date(this.storage.distribution_start).getTime();
    const diff = timeTo - nodeTime;
    this.distributionStarts = diff > 0 ? new Date(Date.now() + diff) : null;
  }

  private async loadUserStakedTo() {
    const stakeSeconds = this.storage!.stake_period.toNumber();
    if (!stakeSeconds || !this.userClaim || this.userClaim.claimed) {
      this.userStakedTo = null;

      return;
    }
    const nodeTime = await this.root.getNodeCurrentTime();
    const timeTo = new Date(this.userClaim.stake_beginning).getTime() + stakeSeconds * 1000;
    const diff = timeTo - nodeTime;
    this.userStakedTo = timeTo < nodeTime ? new Date(Date.now() + diff) : null;
  }

  private async loadUserClaim() {
    this.userClaim = await this.contract!.getAddressClaim(this.root.accountPkh!);
  }

  private async loadContract() {
    this.contract = new DistributorContract(this.root.tezos!, this.contractAddress!);
    await this.contract.getContract();

    return this.contract;
  }

  private async loadStorage() {
    this.storage = await this.contract!.getStorage();

    return this.storage;
  }
}
