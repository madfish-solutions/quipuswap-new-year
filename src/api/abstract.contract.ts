import { ContractAbstraction, MichelsonMap, TezosToolkit } from '@taquito/taquito';
import { bytes2Char } from '@taquito/utils';
import BigNumber from 'bignumber.js';

export class AbstractContract<T> {
  protected tezosToolkit: TezosToolkit;
  protected balance: BigNumber | null = null;
  // @ts-ignore
  protected contract: ContractAbstraction | null = null;
  public storage: T | null = null;

  constructor(rpc: string, public address: string) {
    this.tezosToolkit = new TezosToolkit(rpc);
  }

  async getContract() {
    this.contract = await this.tezosToolkit.contract.at(this.address);

    return this.contract;
  }

  async getStorage() {
    if (!this.contract) {
      await this.getContract();
    }
    this.storage = await this.contract.storage();

    return this.storage;
  }

  async getBalance() {
    if (!this.contract) {
      await this.getContract();
    }
    this.balance = await this.tezosToolkit.tz.getBalance(this.address);

    return this.balance;
  }

  static getMichelsonMapString<Key>(michelsonMap: MichelsonMap<Key, string> | undefined, key: Key): string | null {
    if (!michelsonMap) {
      return null;
    }
    const hash = michelsonMap.get(key);

    return hash ? bytes2Char(hash) : null;
  }
}
