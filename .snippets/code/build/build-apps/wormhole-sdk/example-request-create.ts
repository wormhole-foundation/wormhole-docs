const tr = await routes.RouteTransferRequest.create(wh, {
  from: sender.address,
  to: receiver.address,
  source: sendToken,
  destination: destinationToken,
});

// Resolve the transfer request to a set of routes that can perform it
const foundRoutes = await resolver.findRoutes(tr);
console.log(
  'For the transfer parameters, we found these routes: ',
  foundRoutes
);