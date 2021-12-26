import { StrictMode } from 'react';

import { render } from 'react-dom';

import './index.css';
import { App } from './App';
import { ErrorBoundary } from './components/error-boundary';

render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
  document.getElementById('root')
);
