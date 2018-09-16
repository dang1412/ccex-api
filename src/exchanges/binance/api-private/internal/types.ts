export interface AssetItem {
  asset: string;
  free: string;
  lock: string;
}

export interface BinanceAccountInformation {
  makerCommission: number;
  takerCommission: number;
  buyerCommission: number;
  sellerCommission: number;
  canTrade: boolean;
  canWithdraw: boolean;
  canDeposit: boolean;
  updateTime: number;
  balances: AssetItem[];
}

// {
//   'makerCommission': 15,
//   'takerCommission': 15,
//   'buyerCommission': 0,
//   'sellerCommission': 0,
//   'canTrade': true,
//   'canWithdraw': true,
//   'canDeposit': true,
//   'updateTime': 123456789,
//   'balances': [
//     {
//       'asset': 'BTC',
//       'free': '4723846.89208129',
//       'locked': '0.00000000'
//     },
//     {
//       'asset': 'LTC',
//       'free': '4763368.68006011',
//       'locked': '0.00000000'
//     }
//   ]
// }
