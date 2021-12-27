import { isEqual } from 'lodash';
import { makeAutoObservable } from 'mobx';

import { Rewards } from 'interfaces/rewards';

import { Claim, DistributorContract, DistributorContractStorage } from '../api/distributor-contract';
import { Nullable } from '../utils/fp';
import { RootStore } from './root.store';

export class DistributorStore {
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

  clearDistributionStarts() {
    this.distributionStarts = null;
  }

  clearUserStakedTo() {
    this.userStakedTo = null;
  }

  async stake() {
    return await this.contract!.stake();
  }

  async withdraw() {
    const withdraw = await this.contract!.withdraw();
    const operation = await withdraw.send();
    await operation.confirmation();
  }

  async waitForStake(initialReward: Rewards): Promise<null | 0 | 1 | 2> {
    await this.reload(this.contractAddress!);
    const reward = await this.root.nftStore.getUserRewards();

    if (!this.userClaim) {
      return this.waitForStake(initialReward);
    }

    if (isEqual(initialReward, reward)) {
      // All tokens were claimed
      return null;
    }

    if (reward[2]) {
      // epic
      return 2;
    }

    if (reward[1]) {
      // rare
      return 1;
    }

    // normal
    return 0;
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

  get isNotEnoughQsTokens() {
    return (
      !!this.root.qsTokenStore.storage &&
      !this.userClaim &&
      ((!!this.root.qsTokenStore.userBalance &&
        !!this.storage &&
        this.root.qsTokenStore.userBalance.lt(this.storage.stake_amount)) ||
        !this.root.qsTokenStore.userBalance)
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
    this.userStakedTo = new Date(Date.now() + timeTo - nodeTime);
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
