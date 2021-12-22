import { useEffect, useState } from 'react';

import BigNumber from 'bignumber.js';

import { DistributorContract, DistributorContractStorage } from '../api/distributor-contract';
import { NftContract, NftContractStorage } from '../api/nft-contract/nft.contract';
import { useAccountPkh } from '../connect-wallet/utils/dapp';
import { NftToken } from '../interfaces/NftToken';

const RPC = 'https://hangzhounet.api.tez.ie';
const DISTRIBUTOR_CONTRACT = 'KT1FJ3ZXD9vRzncKJNyBw6PFG8gzQcHYqycw';

const distributorContract = new DistributorContract(RPC, DISTRIBUTOR_CONTRACT);

export const useContracts = () => {
  const [distributorStorage, setDistributorStorage] = useState<DistributorContractStorage | null>(null);
  const [nftStorage, setNftStorage] = useState<NftContractStorage | null>(null);
  const [userBalance, setUserBalance] = useState<BigNumber | null>(null);

  const [nftTokens, setNftTokens] = useState<NftToken[] | null>(null);

  const loadContracts = async () => {
    const _distributorStorage = await distributorContract.getStorage();

    if (!_distributorStorage) {
      throw new Error('DistributorContract Storage is undefined');
    }

    const nftContract = new NftContract(RPC, _distributorStorage.nft_contract);
    const _nftStorage = await nftContract.getStorage();

    setDistributorStorage(_distributorStorage);
    setNftStorage(_nftStorage);

    const tokens = _nftStorage?.token_count
      ? await nftContract.getTokensMetadata(_nftStorage.token_count.toNumber())
      : [];
    setNftTokens(tokens);
  };

  useEffect(() => {
    void loadContracts();
    // eslint-disable-next-line
  }, []);

  const accountPkh = useAccountPkh();
  useEffect(() => {
    if (!accountPkh || !distributorStorage) {
      return;
    }
    distributorContract.getAddressBalance(accountPkh).then(setUserBalance);
  }, [accountPkh, distributorStorage]);

  // TODO: REMOVE AFTER UPDATES CONTRACT
  if (distributorStorage) {
    distributorStorage.distribution_start = '2022-01-01T00:00:00';
  }

  return {
    distributionStart: distributorStorage?.distribution_start ? new Date(distributorStorage.distribution_start) : null,
    stakePeriod: distributorStorage?.stake_period.toNumber() || 0,
    stakeAmount: distributorStorage?.stake_amount.toNumber() || 0,
    totalSupply: nftStorage?.total_supply.toNumber() || 0,
    leftSupply: 0, // TODO
    maxSupply: nftStorage?.max_supply.toNumber() || 0,
    userBalance: userBalance?.toNumber() || 0,
    nftTokens
  };
};
