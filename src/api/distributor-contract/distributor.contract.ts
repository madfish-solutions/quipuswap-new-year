import { BigMapAbstraction } from '@taquito/taquito';
import BigNumber from 'bignumber.js';

import { AbstractContract } from '../abstract.contract';

export interface DistributorContractStorage {
  distribution_start: string;
  nft_contract: string;
  owner: string;
  partakers: BigMapAbstraction;
  quipu_token: {
    address: string;
    id: BigNumber;
  };
  stake_amount: BigNumber;
  stake_period: BigNumber;
}

export interface Claim {
  claimed: boolean;
  stake_beginning: string;
}

export class DistributorContract extends AbstractContract<DistributorContractStorage> {
  async getAddressClaim(address: string): Promise<Claim | null> {
    if (!this.storage) {
      await this.getStorage();
    }

    const balance = await this.storage?.partakers.get(address);

    return balance ? (balance as Claim) : null;
  }

  async stake() {
    const tokenContract = await this.ttk.wallet.at(this.address);

    return tokenContract.methods.stake();
  }

  async withdraw() {
    const tokenContract = await this.ttk.wallet.at(this.address);

    return tokenContract.methods.withdraw();
  }
}
