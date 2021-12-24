import React, { FC, createContext, ReactNode, ReactElement } from 'react';

import { RootStore } from './root.store';

export const RootStoreContext = createContext<RootStore>({} as RootStore);

export interface Props {
  store: RootStore;
  children: ReactNode;
}

export const RootStoreProvider: FC<Props> = ({ children, store }): ReactElement => {
  return <RootStoreContext.Provider value={store}>{children}</RootStoreContext.Provider>;
};
