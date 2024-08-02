// create new resolver, passing the set of routes to consider
const resolver = wh.resolver([
  routes.TokenBridgeRoute, // manual token bridge
  routes.AutomaticTokenBridgeRoute, // automatic token bridge
  routes.CCTPRoute, // manual CCTP
  routes.AutomaticCCTPRoute, // automatic CCTP
  routes.AutomaticPorticoRoute, // Native eth transfers
]);