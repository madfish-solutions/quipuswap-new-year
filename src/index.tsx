import { StrictMode } from 'react';

import { render } from 'react-dom';

import './index.css';
import { App } from './App';
import { DAppProvider } from './connect-wallet/utils/dapp';

render(
  <StrictMode>
    <DAppProvider>
      <App />
    </DAppProvider>
  </StrictMode>,
  document.getElementById('root')
);
