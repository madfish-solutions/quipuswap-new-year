import BigNumber from 'bignumber.js';

const DEFAULT_BALANCE = 0;
const DECIMALS = 1000000;

export const showBalance = (balance: BigNumber | null, decimals = DECIMALS) => {
  if (!balance) {
    return DEFAULT_BALANCE;
  }
  const num = balance.toNumber();

  return (num / decimals).toLocaleString();
};
