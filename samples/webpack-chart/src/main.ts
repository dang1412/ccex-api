import { widget } from '../lib/charting_library/charting_library.min';
import { Datafeed } from './datafeed';

function initChart(): void {
  const tvWidget = ((window as any).tvWidget = new widget({
    // debug: true, // uncomment this line to see Library errors and warnings in the console
    fullscreen: true,
    symbol: 'btc_jpy',
    interval: '60',
    container_id: 'tv_chart_container',
    // BEWARE: no trailing slash is expected in feed URL
    datafeed: new Datafeed(),
    library_path: 'charting_library/',
    locale: 'ja',
    // Regression Trend-related functionality is not implemented yet, so it's hidden for a while
    // drawings_access: { type: 'black', tools: [{ name: 'Regression Trend' }] },
    disabled_features: ['use_localstorage_for_settings'],
    enabled_features: ['study_templates'],
    charts_storage_url: 'http://saveload.tradingview.com',
    charts_storage_api_version: '1.1',
    client_id: 'tradingview.com',
    user_id: 'public_user_id',
  }));
}

initChart();
