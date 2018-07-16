import { Orderbook } from '../../exchanges/exchange-types';

/**
 * Update origin orderbook with diff orderbook
 * @param orderbook
 * @param update
 */
export function updateOrderbook(orderbook: Orderbook, update: Orderbook): Orderbook {
  if (!orderbook) {
    return update;
  }

  if (!update) {
    return orderbook;
  }

  return {
    bids: mergeBids(orderbook.bids || [], update.bids || []),
    asks: mergeAsks(orderbook.asks || [], update.asks || []),
    lastUpdateId: update.lastUpdateId,
  };
}

/**
 * merge bids, assume that all bids are in desc order
 * @param bids
 * @param newBids
 */
export function mergeBids(bids: [string, string][], newBids: [string, string][]): [string, string][] {
  return mergeOrder(bids, newBids, (bidPrice, newBidPrice) => {
    return bidPrice > newBidPrice ? 1 : bidPrice === newBidPrice ? 0 : -1;
  });
}

/**
 * merge asks, assume that all asks are in asc order
 * @param asks
 * @param newAsks
 */
export function mergeAsks(asks: [string, string][], newAsks: [string, string][]): [string, string][] {
  return mergeOrder(asks, newAsks, (askPrice, newAskPrice) => {
    return askPrice < newAskPrice ? 1 : askPrice === newAskPrice ? 0 : -1;
  });
}

/**
 *
 * @param orders
 * @param newOrders
 * @param comparePrice
 */
function mergeOrder(
  orders: [string, string][],
  newOrders: [string, string][],
  comparePrice: (price: number, newPrice: number) => 1 | 0 | -1,
): [string, string][] {
  return mergeArray<[string, string]>(orders, newOrders, (order, newOrder) => {
    if (!order) {
      return [newOrder, 0, 1];
    }

    if (!newOrder) {
      return [order, 1, 0];
    }

    const originPrice = +order[0];
    const newPrice = +newOrder[0];
    const compareResult = comparePrice(originPrice, newPrice);
    if (compareResult === 1) {
      return [order, 1, 0];
    }

    return compareResult === 0 ? [newOrder, 1, 1] : [newOrder, 0, 1];
  });
}

/**
 *
 * @param originArr
 * @param updateArr
 * @param compareStep
 */
function mergeArray<T>(originArr: T[], updateArr: T[], compareStep: (origin: T, update: T) => [T, number, number]): T[] {
  if (!originArr || !originArr.length) {
    return updateArr;
  }

  if (!updateArr || !updateArr.length) {
    return originArr;
  }

  const rs = [];
  let originIndex = 0;
  let updateIndex = 0;

  while (originIndex < originArr.length || updateIndex < updateArr.length) {
    const nextMove = compareStep(originArr[originIndex], updateArr[updateIndex]);
    if (nextMove[0] && +nextMove[0][1] > 0) {
      rs.push(nextMove[0]);
    }
    originIndex += nextMove[1];
    updateIndex += nextMove[2];
  }

  return rs;
}
