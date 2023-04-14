// This is the web exchange variant
import ccxt from 'ccxt';
import { configApp } from './config/web.mjs';

const probit = new ccxt['probit'](configApp);
console.log(probit.signIn());
probit.signIn();

export default probit;
