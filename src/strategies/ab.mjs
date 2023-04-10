import { logName, fetchOrders } from "../helpers/botHelpers.mjs";

export default function abStrategy(pairConfig) {
  console.log(`${logName(pairConfig)} Running ab.mjs strategy`);

  fetchOrders(pairConfig)
}