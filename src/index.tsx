import { StrictMode } from 'react';

import { configure } from 'mobx';
import { render } from 'react-dom';

import './index.css';
import { App } from './App';
import { ErrorBoundary } from './components/error-boundary';
import { DAppProvider } from './modules/connect-wallet/hooks/dapp';

configure({
  enforceActions: 'never'
});

render(
  <StrictMode>
    <ErrorBoundary>
      <DAppProvider>
        <App />
      </DAppProvider>
    </ErrorBoundary>
  </StrictMode>,
  document.getElementById('root')
);
