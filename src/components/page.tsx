import { FC } from 'react';

import { WalletContainer } from '../connect-wallet/components/wallet-provider';
import { useStores } from '../stores/use-stores.hook';
import { ToastProvider } from '../toasts/toast-provider';
import { Background } from './background';
import { ErrorPopup } from './error-popup';
import { Footer } from './footer';
import { Header } from './header';
import { Intro } from './intro';
import { Main } from './main';
import { SliderNFT } from './nft/slider-nft';

export const Page: FC = () => {
  const { qsTokenStore, nftStore, distributorStore } = useStores();

  const error = distributorStore.error || qsTokenStore.error || nftStore.error;

  return (
    <WalletContainer>
      <ToastProvider />
      <Header userBalance={qsTokenStore.userBalance} />
      <Background>
        <Intro />
        {nftStore.tokens && nftStore.tokens.length && <SliderNFT nftTokens={nftStore.tokens} />}
        <Main />
        <Footer />
      </Background>
      <ErrorPopup error={error} />
    </WalletContainer>
  );
};
