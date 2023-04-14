// This is the node exchange variant
import ccxt from 'ccxt';
import { config } from './config/bot.mjs';

const probit = new ccxt['probit'](config);
console.log(probit.signIn());
probit.signIn();

export default probit;
