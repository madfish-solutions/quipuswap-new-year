import { AuthStore } from './auth.store';
import { MainStore } from './main.store';

export class RootStore {
  authStore: AuthStore;
  mainStore: MainStore;

  constructor() {
    this.authStore = new AuthStore();
    this.mainStore = new MainStore(this);
  }
}
