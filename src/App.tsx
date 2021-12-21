import { FC, useEffect } from 'react';

import './App.css';
import '@quipuswap/ui-kit/dist/ui-kit.cjs.development.css';

import { DistributorContract } from './api/distributor';
import { NftContract } from './api/nft.contract/nft-contract';
import { QsTokenContract } from './api/qs-token/qs-token.contract';
import { Background } from './components/background';
import { Footer } from './components/footer';
import { Header } from './components/header';
import { Intro } from './components/intro';
import { Main } from './components/main';
import { SliderNFT } from './components/slider-nft';
import { WalletContainer } from './connect-wallet/components/wallet-provider';
import { DAppProvider } from './connect-wallet/utils/dapp';

const RPC = 'https://hangzhounet.api.tez.ie';
const DISTRIBUTOR_CONTRACT = 'KT1FJ3ZXD9vRzncKJNyBw6PFG8gzQcHYqycw';

const distributorContract = new DistributorContract(RPC, DISTRIBUTOR_CONTRACT);

const loadDistributorContract = async () => {
  const distributorStorage = await distributorContract.getStorage();

  if (!distributorStorage) {
    throw new Error('DistributorContract Storage is undefined');
  }

  const nftContract = new NftContract(RPC, distributorStorage.nft_contract);
  const qsTokenContract = new QsTokenContract(RPC, distributorStorage.quipu_token.address);

  const [nftStorage, qsStorage] = await Promise.all([nftContract.getStorage(), qsTokenContract.getStorage()]);

  // eslint-disable-next-line no-console
  console.log({ distributorStorage, nftStorage, qsStorage });
};

export const App: FC = () => {
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.log('loading...');
    void loadDistributorContract();
  }, []);

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
