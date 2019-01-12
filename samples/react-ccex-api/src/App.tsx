import * as React from 'react';
import './App.css';

import { BitfinexApi } from 'ccex-api/exchanges/bitfinex';
import logo from './logo.svg';

class App extends React.Component {
  private bitfinexApi: BitfinexApi;

  constructor(props: any) {
    super(props);
    this.bitfinexApi = new BitfinexApi();
    this.bitfinexApi.ticker$('btc_usd').subscribe(ticker => console.log(ticker));
  }
  public render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.tsx</code> and save to reload.
        </p>
      </div>
    );
  }
}

export default App;
