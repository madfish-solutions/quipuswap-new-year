import { useCallback, useEffect, useState } from 'react';

import BigNumber from 'bignumber.js';

import { DistributorContract, DistributorContractStorage } from '../api/distributor-contract';
import { NftContract, NftContractStorage } from '../api/nft-contract/nft.contract';
import { QsTokenContract } from '../api/qs-token-contract';
import { useAccountPkh, useTezos } from '../connect-wallet/utils/dapp';
import { NftToken } from '../interfaces/NftToken';

const DISTRIBUTOR_CONTRACT = 'KT1FJ3ZXD9vRzncKJNyBw6PFG8gzQcHYqycw';

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

  const [nftTokens, setNftTokens] = useState<NftToken[] | null>(null);

  const loadContracts = useCallback(async () => {
    if (!tezos) {
      throw new Error('Tezos is unready for loading contract');
    }

    // Distributor Contract
    const _distributorStorage = await distributorContract?.getStorage();
    if (!_distributorStorage) {
      throw new Error('DistributorContract Storage is undefined');
    }

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
  }, [distributorContract, tezos]);

  useEffect(() => {
    void loadContracts();
  }, [loadContracts]);

  useEffect(() => {
    if (!accountPkh || !distributorStorage) {
      return;
    }
    distributorContract?.getAddressBalance(accountPkh).then(setUserBalance);
  }, [accountPkh, distributorContract, distributorStorage]);

  // TODO: REMOVE AFTER UPDATES CONTRACT
  if (distributorStorage) {
    distributorStorage.distribution_start = '2022-01-01T00:00:00';
  }

  const handleClaim = async () => {
    // eslint-disable-next-line no-console
    console.log('claim!!');

    if (!distributorStorage || !accountPkh || !tezos) {
      throw new Error('Data are unready for claiming');
    }

    try {
      const qsTokenContract = new QsTokenContract(tezos, distributorStorage.quipu_token.address);
      const allowOperation = await qsTokenContract.allowSpendYourTokens({
        spender: DISTRIBUTOR_CONTRACT,
        owner: accountPkh
      });
      const disallowOperation = await qsTokenContract.disallowSpendYourTokens({
        spender: DISTRIBUTOR_CONTRACT,
        owner: accountPkh
      });
      const batch = await qsTokenContract.batchOperations([allowOperation, disallowOperation]);
      const res = await batch.send();
      // eslint-disable-next-line no-console
      console.log('res', res);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    }
  };

  return {
    distributionStart: distributorStorage?.distribution_start ? new Date(distributorStorage.distribution_start) : null,
    stakePeriod: distributorStorage?.stake_period.toNumber() || 0,
    stakeAmount: distributorStorage?.stake_amount.toNumber() || 0,
    totalSupply: nftStorage?.total_supply.toNumber() || 0,
    maxSupply: nftStorage?.max_supply.toNumber() || 0,
    userBalance: userBalance?.toNumber() || 0,
    nftTokens,
    onClaim: handleClaim
  };
};
