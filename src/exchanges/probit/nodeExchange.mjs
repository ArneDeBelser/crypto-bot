// This is the node exchange variant
import ccxt from 'ccxt';
import { config } from './config/bot.mjs';

const probit = new ccxt['probit'](config);

export default probit;
