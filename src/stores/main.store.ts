import { makeAutoObservable } from 'mobx';

import { RootStore } from './root.store';

export class MainStore {
  secondsPassed = 0;

  constructor(protected root: RootStore) {
    makeAutoObservable(this);
  }

  increaseTimer() {
    this.secondsPassed += 1;
  }
}
