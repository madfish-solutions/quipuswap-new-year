import { FC, useState } from 'react';

import './App.css';
import { configure } from 'mobx';
import '@quipuswap/ui-kit/dist/ui-kit.cjs.development.css';
import { observer } from 'mobx-react';

import { DAppProvider } from './modules/dapp/hooks/use-dapp';
import { HomePage } from './pages/home-page';
import { RootStoreProvider } from './stores/root-store.context';
import { RootStore } from './stores/root.store';

configure({
  enforceActions: 'never'
});

export const App: FC = observer(() => {
  const [rootStore] = useState(new RootStore());

  return (
    <RootStoreProvider store={rootStore}>
      <DAppProvider>
        <HomePage rootStore={rootStore} />
      </DAppProvider>
    </RootStoreProvider>
  );
});
