import { BigMapAbstraction, MichelsonMap } from '@taquito/taquito';
import BigNumber from 'bignumber.js';

import { NftToken } from '../../interfaces/NftToken';
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
  async getTokenMetadata(id: number): Promise<NftToken> {
    if (!this.storage) {
      throw new Error('NftContract storage is undefined');
    }

    const metadata: { token_id: BigNumber; token_info: MichelsonMap<string, string> } | undefined =
      await this.storage.token_metadata.get(id);

    const attributes = {
      rarity: 'undefined',
      quantity: 'undefined'
    };
    try {
      const attrsStr = AbstractContract.getMichelsonMapString(metadata?.token_info, 'attributes');
      const attrs: Array<{ name: string; value: string }> = JSON.parse(attrsStr || '{}');
      attributes.rarity = attrs.find(({ name }) => name === 'Rarity')?.value || 'undefined';
      attributes.quantity = attrs.find(({ name }) => name === 'Quantity')?.value || 'undefined';
    } catch (error) {
      // do nothing
    }

    return {
      name: AbstractContract.getMichelsonMapString(metadata?.token_info, 'name'),
      thumbnailUri: AbstractContract.getMichelsonMapString(metadata?.token_info, 'thumbnailUri'),
      description: AbstractContract.getMichelsonMapString(metadata?.token_info, 'description'),
      rarity: attributes.rarity,
      quantity: attributes.quantity
    };
  }

  async getTokensMetadata(amount: number) {
    const promises = new Array(amount).fill(null).map(async (_, index) => this.getTokenMetadata(index));

    return await Promise.all(promises);
  }
}
