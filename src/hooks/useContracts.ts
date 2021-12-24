import { useCallback, useEffect, useState } from 'react';

import BigNumber from 'bignumber.js';

import { Claim, DistributorContract, DistributorContractStorage } from '../api/distributor-contract';
import { getNodeCurrentTime } from '../api/getNodeCurrentTime';
import { NftContract, NftContractStorage } from '../api/nft-contract/nft.contract';
import { QsTokenContract } from '../api/qs-token-contract';
import { useAccountPkh, useTezos } from '../connect-wallet/utils/dapp';
import { NftToken } from '../interfaces/NftToken';
import { useUpdateToast } from 'toasts/use-update-toast';

const DISTRIBUTOR_CONTRACT = 'KT1Cehf6JwQJYYEPscSkrcR91DxqSfnq1ze9';

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
  const [isStakeAllow, setIsStakeAllow] = useState(false);
  const [stakedTo, setStakedTo] = useState<Date | null>(null);
  const [distributionStarts, setDistributionStarts] = useState<Date | null>(null);
  const [nftTokens, setNftTokens] = useState<NftToken[] | null>(null);
  const updateToast = useUpdateToast() 

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

    const loadBalance = async () => {
      if (!accountPkh) {
        setUserBalance(null);

        return;
      }
      try {
        const qsTokenContract = new QsTokenContract(tezos, distributorStorage.quipu_token.address);
        await qsTokenContract.getStorage();
        setUserBalance(await qsTokenContract.getAddressBalance(accountPkh));
      } catch (err) {
        setError(err as Error);
        setUserBalance(null);
      }
    };

    void loadBalance();
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

  const getStakeTo = useCallback(async () => {
    const stakeSeconds = distributorStorage?.stake_period.toNumber() || 0;
    if (!stakeSeconds || !userClaim || userClaim.claimed || !tezos) {
      setStakedTo(null);

      return;
    }
    const nodeTime = await getNodeCurrentTime(tezos);
    const timeTo = new Date(userClaim.stake_beginning).getTime() + stakeSeconds * 1000;
    const diff = timeTo - nodeTime;
    const _stakedTo = diff > 0 ? new Date(Date.now() + diff) : null;
    setStakedTo(_stakedTo);
  }, [distributorStorage?.stake_period, userClaim, tezos]);

  useEffect(() => void getStakeTo(), [getStakeTo]);

  // isStakeAllow
  const getIsStakeAllow = useCallback(
    () =>
      (!userClaim || !userClaim.stake_beginning) &&
      !!userBalance &&
      !!distributorStorage &&
      userBalance.gte(distributorStorage.stake_amount),
    [distributorStorage, userBalance, userClaim]
  );

  useEffect(() => {
    setIsStakeAllow(getIsStakeAllow());
  }, [getIsStakeAllow]);

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

  const handleErrorClose = () => setError(null);

  const getDistributionStarts = useCallback(async () => {
    if (!tezos || !distributorStorage || !distributorStorage?.distribution_start) {
      setDistributionStarts(null);

      return;
    }
    const nodeTime = await getNodeCurrentTime(tezos);
    const timeTo = new Date(distributorStorage.distribution_start).getTime();
    const diff = timeTo - nodeTime;
    const _distributionStarts = diff > 0 ? new Date(Date.now() + diff) : null;

    setDistributionStarts(_distributionStarts);
  }, [distributorStorage, tezos]);

  useEffect(() => {
    void getDistributionStarts();
  }, [getDistributionStarts]);

  const stakeAmount = distributorStorage?.stake_amount || null;
  const totalSupply = nftStorage?.total_supply.toNumber() || 0;
  const maxSupply = nftStorage?.max_supply.toNumber() || 0;

  return {
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
    onClaim: handleClaim,
    onUnstake: handleUnstake,
    onErrorClose: handleErrorClose
  };
};
