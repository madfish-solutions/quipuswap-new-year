import { FC, useEffect, useState } from 'react';

import './App.css';
import '@quipuswap/ui-kit/dist/ui-kit.cjs.development.css';
import { observer } from 'mobx-react';

import { useAccountPkh, useTezos } from './modules/connect-wallet/hooks/dapp';
import { HomePage } from './pages/home-page';
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
      <HomePage />
    </RootStoreProvider>
  );
});
