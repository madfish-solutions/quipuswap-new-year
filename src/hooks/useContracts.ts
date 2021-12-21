import { useEffect, useState } from 'react';

import { DistributorContract, DistributorContractStorage } from '../api/distributor';
import { NftContract, NftContractStorage } from '../api/nft.contract/nft-contract';

const RPC = 'https://hangzhounet.api.tez.ie';
const DISTRIBUTOR_CONTRACT = 'KT1FJ3ZXD9vRzncKJNyBw6PFG8gzQcHYqycw';

export const useContracts = () => {
  const [distributorContract] = useState(new DistributorContract(RPC, DISTRIBUTOR_CONTRACT));

  const [distributorStorage, setDistributorStorage] = useState<DistributorContractStorage | null>(null);
  const [nftStorage, setNftStorage] = useState<NftContractStorage | null>(null);

  const loadContracts = async () => {
    const distributorStorage = await distributorContract.getStorage();

    if (!distributorStorage) {
      throw new Error('DistributorContract Storage is undefined');
    }

    const nftContract = new NftContract(RPC, distributorStorage.nft_contract);
    const _nftStorage = await nftContract.getStorage();

    setDistributorStorage(distributorStorage);
    setNftStorage(_nftStorage);
  };

  useEffect(() => {
    void loadContracts();
    // eslint-disable-next-line
  }, []);

  return {
    distributionStart: distributorStorage?.distribution_start,
    stakePeriod: distributorStorage?.stake_period,
    stakeAmount: distributorStorage?.stake_amount,
    totalSupply: nftStorage?.total_supply,
    maxSupply: nftStorage?.max_supply
  };
};
