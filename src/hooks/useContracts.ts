import { useEffect, useState } from 'react';

import { DistributorContract, DistributorContractStorage } from '../api/distributor';
import { NftContract, NftContractStorage } from '../api/nft.contract/nft-contract';
import { QsTokenContract, QsTokenContractStorage } from '../api/qs-token/qs-token.contract';

const RPC = 'https://hangzhounet.api.tez.ie';
const DISTRIBUTOR_CONTRACT = 'KT1FJ3ZXD9vRzncKJNyBw6PFG8gzQcHYqycw';

export const useContracts = () => {
  const [distributorContract] = useState(new DistributorContract(RPC, DISTRIBUTOR_CONTRACT));
  const [nftContract, setNftContract] = useState<NftContract | null>(null);
  const [qsTokenContract, setQsTokenContract] = useState<QsTokenContract | null>();

  const [distributorStorage, setDistributorStorage] = useState<DistributorContractStorage | null>(null);
  const [nftStorage, setNftStorage] = useState<NftContractStorage | null>(null);
  const [qsStorage, setQsStorage] = useState<QsTokenContractStorage | null>();

  const loadContracts = async () => {
    const _distributorStorage = await distributorContract.getStorage();

    if (!_distributorStorage) {
      throw new Error('DistributorContract Storage is undefined');
    }
    setDistributorStorage(_distributorStorage);

    const _nftContract = new NftContract(RPC, _distributorStorage.nft_contract);
    setNftContract(_nftContract);
    const _qsTokenContract = new QsTokenContract(RPC, _distributorStorage.quipu_token.address);
    setQsTokenContract(_qsTokenContract);

    const [_nftStorage, _qsStorage] = await Promise.all([_nftContract.getStorage(), _qsTokenContract.getStorage()]);
    setNftStorage(_nftStorage);
    setQsStorage(_qsStorage);

    // eslint-disable-next-line no-console
    console.log({ distributorStorage, nftStorage, qsStorage });
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
