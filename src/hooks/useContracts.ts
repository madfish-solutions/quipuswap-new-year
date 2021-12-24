import { useCallback, useEffect, useState } from 'react';

import BigNumber from 'bignumber.js';

import { Claim, DistributorContract, DistributorContractStorage } from '../api/distributor-contract';
import { NftContract, NftContractStorage } from '../api/nft-contract/nft.contract';
import { QsTokenContract } from '../api/qs-token-contract';
import { useAccountPkh, useTezos } from '../connect-wallet/utils/dapp';
import { NftToken } from '../interfaces/NftToken';

const DISTRIBUTOR_CONTRACT = 'KT1FJ3ZXD9vRzncKJNyBw6PFG8gzQcHYqycw';
// eslint-disable-next-line no-console
console.log('DISTRIBUTOR_CONTRACT', DISTRIBUTOR_CONTRACT);

// eslint-disable-next-line sonarjs/cognitive-complexity
export const useContracts = () => {
  const tezos = useTezos();
  const accountPkh = useAccountPkh();

  const [distributorContract, setDistributorContract] = useState<DistributorContract | null>(
    tezos ? new DistributorContract(tezos, DISTRIBUTOR_CONTRACT) : null
  );

  useEffect(() => {
    setDistributorContract(tezos ? new DistributorContract(tezos, DISTRIBUTOR_CONTRACT) : null);
  }, [tezos]);

  const [distributorStorage, setDistributorStorage] = useState<DistributorContractStorage | null>(null);
  const [nftStorage, setNftStorage] = useState<NftContractStorage | null>(null);
  const [userBalance, setUserBalance] = useState<BigNumber | null>(null);
  const [userClaim, setUserClaim] = useState<Claim | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const [nftTokens, setNftTokens] = useState<NftToken[] | null>(null);

  const loadContracts = useCallback(async () => {
    if (!tezos || !distributorContract) {
      return;
    }

    setIsLoading(true);

    try {
      // Distributor Contract
      const _distributorStorage = await distributorContract?.getStorage();
      if (!_distributorStorage) {
        setError(new Error('o_O DistributorContract Storage is undefined'));

        return;
      }

      // eslint-disable-next-line no-console
      console.log('QS_TOKEN_CONTRACT', _distributorStorage.quipu_token.address);
      // eslint-disable-next-line no-console
      console.log('NFT_CONTRACT', _distributorStorage.nft_contract);

      // NFT Tokens Contract
      const nftContract = new NftContract(tezos, _distributorStorage.nft_contract);
      const _nftStorage = await nftContract.getStorage();

      setDistributorStorage(_distributorStorage);
      setNftStorage(_nftStorage);

      // NFT Tokens
      const tokens = _nftStorage?.token_count
        ? await nftContract.getTokensMetadata(_nftStorage.token_count.toNumber())
        : [];
      setNftTokens(tokens);
    } catch (error) {
      setError(error as Error);
    }

    setIsLoading(false);
  }, [distributorContract, tezos]);

  useEffect(() => {
    void loadContracts();
  }, [loadContracts]);

  useEffect(() => {
    if (!accountPkh || !distributorContract || !distributorStorage) {
      return;
    }
    distributorContract.getAddressClaim(accountPkh).then(setUserClaim);
  }, [accountPkh, distributorContract, distributorStorage]);

  useEffect(() => {
    if (!accountPkh || !distributorStorage || !tezos) {
      return;
    }
    const qsTokenContract = new QsTokenContract(tezos, distributorStorage.quipu_token.address);
    qsTokenContract.getStorage().then(async () => qsTokenContract.getAddressBalance(accountPkh).then(setUserBalance));
  }, [accountPkh, distributorStorage, tezos]);

  const handleClaim = useCallback(async () => {
    if (!distributorContract || !distributorStorage || !accountPkh || !tezos) {
      setError(new Error('O_O Data are unready for claiming'));

      return;
    }

    setIsLoading(true);

    try {
      const qsTokenContract = new QsTokenContract(tezos, distributorStorage.quipu_token.address);
      // allow
      const allowOperation = await qsTokenContract.allowSpendYourTokens({
        spender: DISTRIBUTOR_CONTRACT,
        owner: accountPkh
      });
      // disallow
      const disallowOperation = await qsTokenContract.disallowSpendYourTokens({
        spender: DISTRIBUTOR_CONTRACT,
        owner: accountPkh
      });

      // stake
      const stakeOperation = await distributorContract.stake();

      const batch = await qsTokenContract.batchOperations([allowOperation, stakeOperation, disallowOperation]);
      await batch.send();
    } catch (error) {
      setError(error as Error);
    }

    setIsLoading(false);
  }, [accountPkh, distributorContract, distributorStorage, tezos]);

  // stakedTo
  const stakeSeconds = distributorStorage?.stake_period.toNumber() || 0;
  const stakedTo =
    stakeSeconds && userClaim && !userClaim.claimed
      ? new Date(new Date(userClaim.stake_beginning).getTime() + stakeSeconds * 100)
      : null;

  // isStakeAllow
  const isStakeAllow = !!userBalance && !!distributorStorage && userBalance.gte(distributorStorage.stake_amount);

  // Unstake
  const handleUnstake = useCallback(async () => {
    if (!distributorContract || !distributorStorage || !accountPkh || !tezos) {
      setError(new Error('O_O Data are unready for claiming'));

      return;
    }

    setIsLoading(true);

    try {
      const stakeOperation = await distributorContract.withdraw();
      await stakeOperation.send();
    } catch (error) {
      setError(error as Error);
    }

    setIsLoading(false);
  }, [accountPkh, distributorContract, distributorStorage, tezos]);

  return {
    distributionStart: distributorStorage?.distribution_start ? new Date(distributorStorage.distribution_start) : null,
    stakedTo,
    stakeAmount: distributorStorage?.stake_amount || null,
    totalSupply: nftStorage?.total_supply.toNumber() || 0,
    maxSupply: nftStorage?.max_supply.toNumber() || 0,
    userBalance,
    nftTokens,
    userClaim,
    isLoading,
    isStakeAllow,
    error,
    onClaim: handleClaim,
    onUnstake: handleUnstake
  };
};
