import { BigMapAbstraction, MichelsonMap } from '@taquito/taquito';
import BigNumber from 'bignumber.js';

import { AbstractContract } from '../abstract.contract';

export interface QsTokenContractStorage {
  account_info: BigMapAbstraction;
  admin: string;
  bob: string;
  bobs_accumulator: BigNumber;
  default_expiry: BigNumber;
  last_token_id: BigNumber;
  metadata: BigMapAbstraction;
  minters: [string, string];
  minters_info: never[];
  permit_counter: BigNumber;
  permits: BigMapAbstraction;
  token_info: BigMapAbstraction;
  token_metadata: BigMapAbstraction;
  tokens_ids: BigNumber[];
  total_mint_percent: BigNumber;
}

export class QsTokenContract extends AbstractContract<QsTokenContractStorage> {
  async allowSpendYourTokens({ spender, owner }: { spender: string; owner: string }) {
    const tokenContract = await this.ttk.wallet.at(this.address);

    return tokenContract.methods.update_operators([
      {
        add_operator: {
          owner, // usually - user wallet
          operator: spender, // usually - contract Distributor
          token_id: 0 // Hardcode
        }
      }
    ]);
  }

  async disallowSpendYourTokens({ spender, owner }: { spender: string; owner: string }) {
    const tokenContract = await this.ttk.wallet.at(this.address);

    return tokenContract.methods.update_operators([
      {
        remove_operator: {
          owner, // usually - user wallet
          operator: spender, // usually - contract Distributor
          token_id: 0 // Hardcode
        }
      }
    ]);
  }

  async getAddressBalance(address: string): Promise<BigNumber | null> {
    if (!this.storage) {
      throw new Error('QS storage is undefined');
    }

    const accountInfo: { balances: MichelsonMap<BigNumber, BigNumber> } | undefined =
      await this.storage.account_info.get(address);

    const KEY = 0;
    const balance = accountInfo?.balances.get(new BigNumber(KEY));

    return balance ? balance : null;
  }
}
