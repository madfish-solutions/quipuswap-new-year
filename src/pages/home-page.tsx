import { FC } from 'react';

import { observer } from 'mobx-react';

import { Background } from '../components/background';
import { ErrorPopup } from '../components/error-popup';
import { Footer } from '../components/footer';
import { Header } from '../components/header';
import { Intro } from '../components/intro';
import { Main } from '../components/main';
import { SliderNFT } from '../components/nft/slider-nft';
import { WalletWrapper } from '../components/wallet-wrapper';
import { ToastProvider } from '../modules/toasts/toast-provider';
import { useStores } from '../stores/use-stores.hook';

export const HomePage: FC = observer(() => {
  const { qsTokenStore, nftStore, distributorStore } = useStores();

  const error = distributorStore.error || qsTokenStore.error || nftStore.error;

  return (
    <WalletWrapper>
      <ToastProvider />
      <Header userBalance={qsTokenStore.userBalance} />
      <Background>
        <Intro />
        {nftStore.tokens && nftStore.tokens.length && <SliderNFT nftTokens={nftStore.tokens} />}
        <Main />
        <Footer />
      </Background>
      <ErrorPopup error={error} />
    </WalletWrapper>
  );
});
