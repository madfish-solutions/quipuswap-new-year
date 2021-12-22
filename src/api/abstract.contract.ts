import { ContractAbstraction, ContractMethod, MichelsonMap, TezosToolkit, Wallet } from '@taquito/taquito';
import { bytes2Char } from '@taquito/utils';
import BigNumber from 'bignumber.js';

export class AbstractContract<T> {
  protected balance: BigNumber | null = null;
  // @ts-ignore
  protected contract: ContractAbstraction | null = null;
  public storage: T | null = null;

  constructor(protected ttk: TezosToolkit, public address: string) {}

  async getContract() {
    this.contract = await this.ttk.contract.at(this.address);

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
    this.balance = await this.ttk.tz.getBalance(this.address);

    return this.balance;
  }

  async batchOperations(operations: Array<ContractMethod<Wallet>>) {
    return operations.reduce((batch, operation) => batch.withContractCall(operation), this.ttk.wallet.batch());
  }

  static getMichelsonMapString<Key>(michelsonMap: MichelsonMap<Key, string> | undefined, key: Key): string | null {
    if (!michelsonMap) {
      return null;
    }
    const hash = michelsonMap.get(key);

    return hash ? bytes2Char(hash) : null;
  }
}
