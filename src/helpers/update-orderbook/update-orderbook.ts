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
  return mergeArray(bids, newBids, false);
}

/**
 * merge asks, assume that all asks are in asc order
 * @param asks
 * @param newAsks
 */
export function mergeAsks(asks: [string, string][], newAsks: [string, string][]): [string, string][] {
  return mergeArray(asks, newAsks, true);
}

/**
 * Merge array, assume that both array are in right order
 *
 * @param originArr
 * @param updateArr
 * @param increaseOrder
 */
function mergeArray(originArr: [string, string][], updateArr: [string, string][], increaseOrder: boolean): [string, string][] {
  if (!originArr || !originArr.length) {
    return updateArr;
  }

  if (!updateArr || !updateArr.length) {
    return originArr;
  }

  const rs: [string, string][] = [];
  let originIndex = 0;
  let updateIndex = 0;
  while (originIndex < originArr.length || updateIndex < updateArr.length) {
    const origin = originArr[originIndex];
    const update = updateArr[updateIndex];

    // abnormal case
    if (!origin && !update) {
      break;
    }

    // origin ended, pick update
    if (!origin && update) {
      if (+update[1] > 0) {
        rs.push(update);
      }
      updateIndex ++;
      continue;
    }

    // update ended, pick origin
    if (!update && origin) {
      if (+origin[1] > 0) {
        rs.push(origin);
      }
      originIndex ++;
      continue;
    }

    const originPrice = +origin[0];
    const originAmount = +origin[1];

    const updatePrice = +update[0];
    const updateAmount = +update[1];

    // equal price, pick update and drop origin
    if (originPrice === updatePrice) {
      if (updateAmount > 0) {
        rs.push(update);
      }
      originIndex ++;
      updateIndex ++;
      continue;
    }

    if (originPrice < updatePrice === increaseOrder) {
      // pick origin
      if (originAmount > 0) {
        rs.push(origin);
      }
      originIndex ++;
    } else {
      // pick update if update amount > 0
      if (updateAmount > 0) {
        rs.push(update);
      }
      updateIndex++;
    }
  }

  return rs;
}