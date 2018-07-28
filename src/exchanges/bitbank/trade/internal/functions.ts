import { Trade } from '../../../exchange-types';
import { BitbankRawTrade } from './types';

export function adaptBitbankTrade(bitbankTrade: BitbankRawTrade): Trade {
  return {
    id: bitbankTrade.transaction_id,
    side: bitbankTrade.side,
    price: +bitbankTrade.price,
    amount: +bitbankTrade.amount,
    timestamp: bitbankTrade.executed_at,
  };
}
