import { FC } from 'react';

import './App.css';
import '@quipuswap/ui-kit/dist/ui-kit.cjs.development.css';
import { ToastProvider } from 'toasts/toast-provider';

import { Background } from './components/background';
import { ErrorPopup } from './components/error-popup';
import { Footer } from './components/footer';
import { Header } from './components/header';
import { Intro } from './components/intro';
import { Main } from './components/main';
import { SliderNFT } from './components/nft/slider-nft';
import { WalletContainer } from './connect-wallet/components/wallet-provider';
import { useContracts } from './hooks/useContracts';

export const App: FC = () => {
  const {
    distributionStarts,
    stakedTo,
    stakeAmount,
    totalSupply,
    maxSupply,
    userBalance,
    nftTokens,
    userClaim,
    isLoading,
    isStakeAllow,
    error,
    onClaim,
    onUnstake,
    onErrorClose
  } = useContracts();

  return (
    <WalletContainer>
      <ToastProvider />
      <Header userBalance={userBalance} />
      <Background>
        <Intro />
        {nftTokens && nftTokens.length && <SliderNFT nftTokens={nftTokens} />}
        <Main
          isStakeAllow={isStakeAllow}
          distributionStarts={distributionStarts}
          nftTotalSupply={totalSupply}
          nftMaxSupply={maxSupply}
          stakeAmount={stakeAmount}
          isLoading={isLoading}
          userClaim={userClaim}
          stakedTo={stakedTo}
          onClaim={onClaim}
          onUnstake={onUnstake}
        />
        <Footer />
      </Background>
      <ErrorPopup error={error} onClick={onErrorClose} />
    </WalletContainer>
  );
};
