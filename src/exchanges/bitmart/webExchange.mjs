// This is the web exchange variant
import ccxt from 'ccxt';
import { configApp } from './config/web.mjs';

const bitmart = new ccxt['bitmart'](configApp);

export default bitmart;
