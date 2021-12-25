import { FC, useEffect, useState } from 'react';

import './App.css';
import '@quipuswap/ui-kit/dist/ui-kit.cjs.development.css';
import { observer } from 'mobx-react';

import { Page } from './components/page';
import { useAccountPkh, useTezos } from './connect-wallet/utils/dapp';
import { RootStoreProvider } from './stores/root-store.context';
import { RootStore } from './stores/root.store';

export const App: FC = observer(() => {
  const tezos = useTezos();
  const accountPkh = useAccountPkh();

  const [rootStore] = useState(new RootStore(tezos, accountPkh));

  useEffect(() => {
    void rootStore.reload(tezos, accountPkh);
  }, [accountPkh, rootStore, tezos]);

  return (
    <RootStoreProvider store={rootStore}>
      <Page />
    </RootStoreProvider>
  );
});
