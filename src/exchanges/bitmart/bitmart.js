import ccxt from 'ccxt';
import config from './config';

const bitmart = new ccxt['bitmart'](config);

export default bitmart;
