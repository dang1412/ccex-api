export interface BitbankRawOrderbook {
  asks: [string, string][];
  bids: [string, string][];
  timestamp: number;
}
