import { FC } from 'react';

import './App.css';
import '@quipuswap/ui-kit/dist/ui-kit.cjs.development.css';
import { Background } from './components/background';
import { ErrorPopup } from './components/error-popup';
import { Footer } from './components/footer';
import { Header } from './components/header';
import { Intro } from './components/intro';
import { Main } from './components/main';
import { SliderNFT } from './components/slider-nft';
import { WalletContainer } from './connect-wallet/components/wallet-provider';
import { useContracts } from './hooks/useContracts';

export const App: FC = () => {
  const {
    distributionStart,
    stakedTo,
    stakeAmount,
    totalSupply,
    maxSupply,
    userBalance,
    // nftTokens,
    userClaim,
    isLoading,
    isStakeAllow,
    error,
    onClaim,
    onUnstake
  } = useContracts();

  return (
    <WalletContainer>
      <Header userBalance={userBalance} />
      <Background>
        <Intro />
        <SliderNFT />
        <Main
          isStakeAllow={isStakeAllow}
          distributionStarts={distributionStart}
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
      {/* <ErrorPopup error={error} /> */}
    </WalletContainer>
  );
};
