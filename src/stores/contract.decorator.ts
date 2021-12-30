import { TezosToolkit } from '@taquito/taquito';
import { AbstractContract } from 'api/abstract.contract';
import { makeAutoObservable } from 'mobx';
import { Nullable } from 'utils/fp';

type Constructor<T> = new (...args: any[]) => T;

export function Contract<
  RootStore extends { tezos: Nullable<TezosToolkit> },
  ContractStorage,
  Contract extends AbstractContract<ContractStorage>
>(contract: Constructor<Contract>) {
  return class {
    contractAddress: Nullable<string> = null;
    contract: Nullable<Contract> = null;
    storage: Nullable<ContractStorage> = null;

    constructor(protected root: RootStore) {
      makeAutoObservable(this);
    }

    protected async load_(contractAddress: string) {
      this.contractAddress = contractAddress;
      await this.loadContract();
      await this.loadStorage();
    }

    private async loadContract() {
      this.contract = new contract(this.root.tezos!, this.contractAddress!);
      await this.contract!.getContract();

      return this.contract;
    }

    private async loadStorage() {
      this.storage = await this.contract!.getStorage();

      return this.storage;
    }
  };
}
