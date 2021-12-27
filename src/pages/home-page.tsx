import { FC, useEffect } from 'react';

import { observer } from 'mobx-react';

import { Background } from '../components/background';
import { Footer } from '../components/footer';
import { Header } from '../components/header';
import { Intro } from '../components/intro';
import { Main } from '../components/main';
import { SliderNFT } from '../components/nft/slider-nft';
import { WalletWrapper } from '../components/wallet-wrapper';
import { useAccountPkh, useTezos } from '../modules/dapp/hooks/use-dapp';
import { ToastProvider } from '../modules/toasts/toast-provider';
import { useToast } from '../modules/toasts/use-toast-notification';
import { RootStore } from '../stores/root.store';
import { useStores } from '../stores/use-stores.hook';

const TIMEOUT = 15000;

interface Props {
  rootStore: RootStore;
}

export const HomePage: FC<Props> = observer(({ rootStore }) => {
  const tezos = useTezos();
  const accountPkh = useAccountPkh();
  const { errorToast } = useToast();

  const reload = async () => {
    try {
      await rootStore.reload(tezos, accountPkh);
    } catch (error) {
      errorToast(error as Error);
    }
  };

  useEffect(() => {
    void reload();
    const interval = setInterval(() => {
      void reload();
    }, TIMEOUT);

    return () => {
      clearInterval(interval);
    };
    // eslint-disable-next-line
  }, [rootStore, tezos, accountPkh]);

  const { qsTokenStore, nftStore } = useStores();

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
    </WalletWrapper>
  );
});
