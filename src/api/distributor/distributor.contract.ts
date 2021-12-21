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

export class DistributorContract extends AbstractContract<DistributorContractStorage> {}
