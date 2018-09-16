import { BinanceAccountInformation } from './types';

export function checkBinanceAccountInformation(binanceAccountInformation: BinanceAccountInformation): void {
  expect(binanceAccountInformation);
  expect(binanceAccountInformation.balances).not.toBeNull();
  expect(binanceAccountInformation.buyerCommission).not.toBeNull();
  expect(binanceAccountInformation.canDeposit).not.toBeNull();
  expect(binanceAccountInformation.canTrade).not.toBeNull();
  expect(binanceAccountInformation.canWithdraw).not.toBeNull();
}
