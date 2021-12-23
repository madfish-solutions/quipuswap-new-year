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
import { useContracts } from './hooks/useContracts';

export const App: FC = () => {
  const {
    distributionStart,
    stakePeriod,
    stakeAmount,
    totalSupply,
    maxSupply,
    userBalance,
    nftTokens,
    userClaim,
    isLoading,
    onClaim
  } = useContracts();
  // eslint-disable-next-line no-console
  console.log('contracts', {
    // unused
    stakePeriod,
    nftTokens,
    // other
    distributionStart,
    stakeAmount,
    totalSupply,
    maxSupply,
    userClaim,
    userBalance,
    isLoading
  });

  return (
    <WalletContainer>
      <Header userBalance={userBalance} />
      <Background>
        <Intro />
        <SliderNFT />
        <Main
          distributionStarts={distributionStart}
          nftTotalSupply={totalSupply}
          nftMaxSupply={maxSupply}
          stakeAmount={stakeAmount}
          onClaim={onClaim}
          isLoading={isLoading}
        />
        <Footer />
      </Background>
    </WalletContainer>
  );
};
