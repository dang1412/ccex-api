import * as config from './webpack.config';

const prodConfig = { ...config, mode: 'production' };

// tslint:disable-next-line:no-default-export
export default prodConfig;
