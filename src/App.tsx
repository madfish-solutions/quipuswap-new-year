import { FC } from 'react';

import './App.css';

import { WalletContainer } from 'connect-wallet/components/wallet-provider';
import { Background } from './components/background';
import { Footer } from './components/footer';
import { Header } from './components/header';
import { Intro } from './components/intro';
import { Main } from './components/main';
import { SliderNFT } from './components/slider-nft';

export const App: FC = () => {
  return (
    <WalletContainer>
      <Header />

      <Background>
        <Intro />
        <SliderNFT />
        <Main />
        <Footer />
      </Background>
    </WalletContainer>
  );
};
