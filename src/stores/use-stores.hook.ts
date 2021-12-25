import { useContext } from 'react';

import { RootStoreContext } from './root-store.context';
import { RootStore } from './root.store';

export const useStores = (): RootStore => useContext(RootStoreContext);
