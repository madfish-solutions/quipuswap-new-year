import { FC } from 'react';

import './App.css';
import '@quipuswap/ui-kit/dist/ui-kit.cjs.development.css';
import { Background } from './components/background';
import { Footer } from './components/footer';
import { Header } from './components/header';
import { Intro } from './components/intro';
import { Main } from './components/main';
import { SliderNFT } from './components/slider-nft';
import { WalletContainer } from './connect-wallet/components/wallet-provider';
import { DAppProvider } from './connect-wallet/utils/dapp';
import { useContracts } from './hooks/useContracts';

export const App: FC = () => {
  const contracts = useContracts();
  // eslint-disable-next-line no-console
  console.log('contracts', contracts);

  return (
    <DAppProvider>
      <WalletContainer>
        <Header />

        <Background>
          <Intro />
          <SliderNFT />
          <Main />
          <Footer />
        </Background>
      </WalletContainer>
    </DAppProvider>
  );
};
