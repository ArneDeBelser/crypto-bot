import ccxt from 'ccxt';
import { config } from './configBot.mjs';

const bitmart = new ccxt['bitmart'](config);

export default bitmart;
