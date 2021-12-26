import { FC, useState } from 'react';

import './App.css';
import '@quipuswap/ui-kit/dist/ui-kit.cjs.development.css';
import { observer } from 'mobx-react';

import { DAppProvider } from './modules/connect-wallet/hooks/dapp';
import { HomePage } from './pages/home-page';
import { RootStoreProvider } from './stores/root-store.context';
import { RootStore } from './stores/root.store';

export const App: FC = observer(() => {
  const [rootStore] = useState(new RootStore());

  return (
    <DAppProvider>
      <RootStoreProvider store={rootStore}>
        <HomePage rootStore={rootStore} />
      </RootStoreProvider>
    </DAppProvider>
  );
});
