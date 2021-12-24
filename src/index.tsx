import { StrictMode } from 'react';

import { render } from 'react-dom';

import './index.css';
import { App } from './App';
import { ErrorBoundary } from './components/error-boundary';
import { DAppProvider } from './connect-wallet/utils/dapp';

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
