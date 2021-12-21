import { BigMapAbstraction } from '@taquito/taquito';
import BigNumber from 'bignumber.js';

import { AbstractContract } from '../abstract.contract';

export interface NftContractStorage {
  allowances: BigMapAbstraction;
  distributor: string;
  ledger: BigMapAbstraction;
  max_supply: BigNumber;
  metadata: BigMapAbstraction;
  token_count: BigNumber;
  token_metadata: BigMapAbstraction;
  tokens_supply: BigMapAbstraction;
  total_supply: BigNumber;
}

export class NftContract extends AbstractContract<NftContractStorage> {
  async getTokenMetadata() {
    if (!this.storage) {
      throw new Error('NftContract storage is undefined');
    }
    const metadata = await this.storage.token_metadata.get(0);
    console.log('metadata', metadata);
  }
}
