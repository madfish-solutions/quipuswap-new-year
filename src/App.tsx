import React, {useEffect} from 'react';
import logo from './logo.svg';
import './App.css';

import { TezosToolkit } from '@taquito/taquito';
import {ConnectWalletButton} from "./connect-wallet/components/ConnectWalletButton";

export const getBalance = async () => {
  const Tezos = new TezosToolkit('https://mainnet.smartpy.io/');

  return Tezos.tz.getBalance('tz1L22mEL1gd7uPPkWgTYtFwhnMAyzAqedkB');
};

function App() {
  useEffect(() => {
    getBalance()
      .then((data) => console.log(data))
      .catch((err) => console.error(err));
  }, []);
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <ConnectWalletButton />
      </header>
    </div>
  );
}

export default App;
