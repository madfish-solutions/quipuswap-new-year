import { StrictMode } from 'react';

import { configure } from 'mobx';
import { render } from 'react-dom';

import './index.css';
import { App } from './App';
import { ErrorBoundary } from './components/error-boundary';

configure({
  enforceActions: 'never'
});

render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
  document.getElementById('root')
);
