import ccxt from 'ccxt';
import { configApp } from './configApp.mjs';

const bitmart = new ccxt['bitmart'](configApp);

export default bitmart;
