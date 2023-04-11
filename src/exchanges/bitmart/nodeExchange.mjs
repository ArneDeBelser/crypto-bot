// This is the node exchange variant
import ccxt from 'ccxt';
import { config } from './config/bot.mjs';

const bitmart = new ccxt['bitmart'](config);

export default bitmart;
