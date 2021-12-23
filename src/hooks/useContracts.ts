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
        throw new Error('o_O DistributorContract Storage is undefined');
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
      // eslint-disable-next-line no-console
      console.error('O_o', error);
    }

    setIsLoading(false);
  }, [distributorContract, tezos]);

  useEffect(() => {
    void loadContracts();
  }, [loadContracts]);

  useEffect(() => {
    if (!accountPkh || !distributorStorage) {
      return;
    }
    distributorContract?.getAddressClaim(accountPkh).then(setUserClaim);
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
      throw new Error('O_O Data are unready for claiming');
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
      const res = await batch.send();
      // eslint-disable-next-line no-console
      console.log('res O_O', res);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    }

    setIsLoading(false);
  }, [accountPkh, distributorContract, distributorStorage, tezos]);

  return {
    distributionStart: distributorStorage?.distribution_start ? new Date(distributorStorage.distribution_start) : null,
    stakePeriod: distributorStorage?.stake_period.toNumber() || 0,
    stakeAmount: distributorStorage?.stake_amount.toNumber() || 0,
    totalSupply: nftStorage?.total_supply.toNumber() || 0,
    maxSupply: nftStorage?.max_supply.toNumber() || 0,
    userBalance,
    nftTokens,
    userClaim,
    onClaim: handleClaim,
    isLoading
  };
};
