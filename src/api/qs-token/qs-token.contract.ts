import { BigMapAbstraction } from '@taquito/taquito';
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

export class QsTokenContract extends AbstractContract<QsTokenContractStorage> {}
