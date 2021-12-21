import { useEffect, useState } from 'react';

import BigNumber from 'bignumber.js';

import { DistributorContract, DistributorContractStorage } from '../api/distributor';
import { NftContract, NftContractStorage } from '../api/nft.contract/nft-contract';
import { useAccountPkh } from '../connect-wallet/utils/dapp';

const RPC = 'https://hangzhounet.api.tez.ie';
const DISTRIBUTOR_CONTRACT = 'KT1FJ3ZXD9vRzncKJNyBw6PFG8gzQcHYqycw';

const distributorContract = new DistributorContract(RPC, DISTRIBUTOR_CONTRACT);

export const useContracts = () => {
  const [distributorStorage, setDistributorStorage] = useState<DistributorContractStorage | null>(null);
  const [nftStorage, setNftStorage] = useState<NftContractStorage | null>(null);
  const [userBalance, setUserBalance] = useState<BigNumber | null>(null);

  const loadContracts = async () => {
    const _distributorStorage = await distributorContract.getStorage();

    if (!_distributorStorage) {
      throw new Error('DistributorContract Storage is undefined');
    }

    const nftContract = new NftContract(RPC, _distributorStorage.nft_contract);
    const _nftStorage = await nftContract.getStorage();

    setDistributorStorage(_distributorStorage);
    setNftStorage(_nftStorage);

    // TODO
    await nftContract.getTokenMetadata();
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

  return {
    distributionStart: distributorStorage?.distribution_start,
    stakePeriod: distributorStorage?.stake_period,
    stakeAmount: distributorStorage?.stake_amount,
    totalSupply: nftStorage?.total_supply,
    maxSupply: nftStorage?.max_supply,
    userBalance
  };
};
