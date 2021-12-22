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

export class DistributorContract extends AbstractContract<DistributorContractStorage> {
  async getAddressBalance(address: string): Promise<BigNumber | null> {
    if (!this.storage) {
      throw new Error('DistributorContract storage is undefined');
    }

    const balance = await this.storage.partakers.get(address);

    return balance ? (balance as BigNumber) : null;
  }

  // { source, amount }: { source: string; amount: BigNumber }
  async stake() {
    const tokenContract = await this.ttk.wallet.at(this.address);

    return tokenContract.methods.stake();
  }
}
