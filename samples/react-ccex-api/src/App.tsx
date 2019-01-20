import * as React from 'react';
import './App.css';

import { Ticker } from 'ccex-api';
import { CoinbaseApi } from 'ccex-api/exchanges/coinbase';
import { TickerCompWithStyles } from './components';
const corsProxy = 'https://api.exchangecompare.com/';

interface IAppState {
  ticker: Ticker
}

class App extends React.Component<{}, IAppState> {
  private exchangeApi: CoinbaseApi;

  constructor(props: any) {
    super(props);
    this.exchangeApi = new CoinbaseApi({ corsProxy });
    this.exchangeApi.ticker$('btc_usd').subscribe(ticker => {
      this.setState({ ticker });
    });
  }

  public render() {
    const tickerComponent = this.state
      ? <TickerCompWithStyles tickerData={this.state.ticker}/>
      : '';

    return (
      <div className="App">
        {/* <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.tsx</code> and save to reload.
        </p> */}
        
        {tickerComponent}
      </div>
    );
  }
}

export default App;
